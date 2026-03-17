import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const schema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
  honeypot: z.string().max(0),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, phone, subject, message } = result.data;

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
      subject: `Yeni Mesaj: ${subject || name}`,
      html: `
        <h2>Yeni Form Mesajı</h2>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
        ${subject ? `<p><strong>Konu:</strong> ${subject}</p>` : ""}
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    // Kullanıcıya otomatik yanıt maili
    await transporter.sendMail({
      from: `<${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mesajınız alındı",
      html: `<p>Sayın ${name},</p><p>Mesajınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Mail gönderilemedi" }, { status: 500 });
  }
}
