import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string, locale = "tr-TR"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric", month: "long", day: "numeric",
  });
}

export function getSiteUrl(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  url = url.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  return url.replace(/\/$/, "");
}
