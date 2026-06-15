import { getLayoutData } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getLayoutData();

  return (
    <>
      <Header settings={data?.settings} navigation={data?.navigation} />
      <main>{children}</main>
      <Footer settings={data?.settings} navigation={data?.navigation} />
      {data?.settings?.contactInfo?.whatsappNumber && (
        <WhatsAppButton number={data.settings.contactInfo.whatsappNumber} />
      )}
    </>
  );
}
