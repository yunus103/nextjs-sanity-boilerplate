import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { buildMetadata } from "@/lib/seo";

import { client } from "@/sanity/lib/client";
import { layoutQuery } from "@/sanity/lib/queries";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata();
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } });

  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        {settings?.gtmId && <GoogleTagManager gtmId={settings.gtmId} />}
        {settings?.gaId && <GoogleAnalytics gaId={settings.gaId} />}
        {children}
      </body>
    </html>
  );
}
