"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});

type FormData = z.infer<typeof schema>;
type Status = "idle" | "loading" | "success" | "error";
type FieldErrors = Partial<Record<keyof FormData, string[]>>;

type ContactFormProps = {
  formTitle?: string;
  successMessage?: string;
};

export function ContactForm({
  formTitle = "Bize Ulaşın",
  successMessage = "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
}: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Alan hatasını temizle
    if (fieldErrors[name as keyof FormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setFieldErrors({});

    // Client-side validasyon
    const result = schema.safeParse(formData);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors as FieldErrors);
      setStatus("idle");
      return;
    }

    // Honeypot alanını al
    const form = e.currentTarget;
    const honeypot = (form.elements.namedItem("website") as HTMLInputElement)?.value || "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, honeypot }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        if (data.error && typeof data.error === "object") {
          setFieldErrors(data.error);
        }
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <div className="text-4xl mb-4">✅</div>
        <p className="text-lg font-medium">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {formTitle && <h2 className="text-2xl font-bold">{formTitle}</h2>}

      {/* Honeypot — spam botları için gizli alan */}
      <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden" aria-hidden="true">
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Ad Soyad *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Adınız Soyadınız"
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && (
            <p className="text-sm text-destructive">{fieldErrors.name[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ornek@mail.com"
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && (
            <p className="text-sm text-destructive">{fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+90 555 000 00 00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Konu</Label>
          <Input
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Mesajınızın konusu"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mesaj *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Mesajınızı buraya yazın..."
          rows={6}
          aria-invalid={!!fieldErrors.message}
        />
        {fieldErrors.message && (
          <p className="text-sm text-destructive">{fieldErrors.message[0]}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-destructive">
          Bir hata oluştu. Lütfen tekrar deneyin.
        </p>
      )}

      <Button type="submit" disabled={status === "loading"} className="w-full sm:w-auto">
        {status === "loading" ? "Gönderiliyor..." : "Gönder"}
      </Button>
    </form>
  );
}
