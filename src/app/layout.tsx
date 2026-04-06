import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { buildMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
