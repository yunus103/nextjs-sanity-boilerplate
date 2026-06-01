import { client } from "@/sanity/lib/client";
import { layoutQuery } from "@/sanity/lib/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { JsonLd, organizationJsonLd } from "@/components/seo/JsonLd";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } });

  return (
    <>
      <JsonLd data={organizationJsonLd(data?.settings)} />
      <Header settings={data?.settings} navigation={data?.navigation} />
      <main>{children}</main>
      <Footer settings={data?.settings} navigation={data?.navigation} />
      {data?.settings?.contactInfo?.whatsappNumber && (
        <WhatsAppButton number={data.settings.contactInfo.whatsappNumber} />
      )}
    </>
  );
}
