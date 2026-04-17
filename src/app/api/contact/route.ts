import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

// ---------------------------------------------------------------------------
// Rate Limiting — In-Memory (5 istek / 10 dakika / IP)
// Vercel serverless: instance başına çalışır, ölçek büyüdükçe Upstash Redis
// kullanılabilir. Mevcut trafik için (1-2K kullanıcı/ay) bu yeterli.
// ---------------------------------------------------------------------------
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 dakika

const ipStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipStore.get(ip);

  if (!entry || now > entry.resetAt) {
    // İlk istek veya pencere sıfırlandı
    ipStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true; // Limit aşıldı
  }

  entry.count += 1;
  return false;
}

// Bellek sızıntısını önlemek için periyodik temizlik
// (Instance warm olduğu sürece çalışır, serverless'ta zararsız)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipStore.entries()) {
    if (now > entry.resetAt) ipStore.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS);

// ---------------------------------------------------------------------------
// XSS Koruması — HTML Escape
// Mail şablonuna enjekte edilen içeriği güvenli hale getirir.
// ---------------------------------------------------------------------------
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ---------------------------------------------------------------------------
// Zod Şeması
// ---------------------------------------------------------------------------
const schema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
  honeypot: z.string().max(0), // Bot tuzağı — dolu gelirse spam
});

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  // 1. Content-Type kontrolü
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Geçersiz içerik tipi" }, { status: 415 });
  }

  // 2. Body boyut limiti (~50KB)
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > 50_000) {
    return NextResponse.json({ error: "İstek çok büyük" }, { status: 413 });
  }

  // 3. IP bazlı rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Çok fazla istek gönderildi. Lütfen birkaç dakika bekleyin." },
      { status: 429 }
    );
  }

  // 4. Zod validasyonu (honeypot dahil)
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, phone, subject, message } = result.data;

  // 5. XSS koruması — mail şablonuna giren tüm değerleri escape et
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : null;
  const safeSubject = subject ? escapeHtml(subject) : null;
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

  // 6. Mail gönderimi
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    // Siteye bildirim maili
    await transporter.sendMail({
      from: `"Site İletişim Formu" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_FORM_TO,
      subject: `Yeni Mesaj: ${safeSubject || safeName}`,
      html: `
        <h2>Yeni Form Mesajı</h2>
        <p><strong>İsim:</strong> ${safeName}</p>
        <p><strong>E-posta:</strong> ${safeEmail}</p>
        ${safePhone ? `<p><strong>Telefon:</strong> ${safePhone}</p>` : ""}
        ${safeSubject ? `<p><strong>Konu:</strong> ${safeSubject}</p>` : ""}
        <p><strong>Mesaj:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    // Kullanıcıya otomatik yanıt maili
    await transporter.sendMail({
      from: `<${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mesajınız alındı",
      html: `<p>Sayın ${safeName},</p><p>Mesajınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SMTP Mail Error:", error);
    return NextResponse.json({ error: "Mail gönderilemedi" }, { status: 500 });
  }
}
