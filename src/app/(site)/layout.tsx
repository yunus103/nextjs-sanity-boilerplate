import { client } from "@/sanity/lib/client";
import { layoutQuery } from "@/sanity/lib/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd, organizationJsonLd } from "@/components/seo/JsonLd";
import { draftMode } from "next/headers";
import Link from "next/link";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } });
  const isDraft = (await draftMode()).isEnabled;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isDraft && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-yellow-900 text-center text-sm py-2 font-medium">
          Önizleme modu aktif.{" "}
          <Link href="/api/draft/disable" className="underline font-bold">
            Çıkmak için tıkla
          </Link>
        </div>
      )}
      <JsonLd data={organizationJsonLd(data?.settings)} />
      <Header settings={data?.settings} navigation={data?.navigation} />
      <main>{children}</main>
      <Footer settings={data?.settings} navigation={data?.navigation} />
      {data?.settings?.contactInfo?.whatsappNumber && (
        <WhatsAppButton number={data.settings.contactInfo.whatsappNumber} />
      )}
    </ThemeProvider>
  );
}
