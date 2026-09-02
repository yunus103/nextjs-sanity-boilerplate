import { getLayoutData } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await getLayoutData();
  const contact = data?.settings?.contactInfo;

  return (
    <>
      <Header
        siteName={data?.settings?.siteName}
        logo={data?.settings?.logo}
        links={data?.navigation?.headerLinks}
        contactInfo={
          contact
            ? {
                phone: contact.phone,
                email: contact.email,
                whatsappNumber: contact.whatsappNumber,
              }
            : undefined
        }
        socialLinks={data?.settings?.socialLinks}
      />
      <main>{children}</main>
      <Footer settings={data?.settings} navigation={data?.navigation} />
      {contact?.whatsappNumber && (
        <WhatsAppButton number={contact.whatsappNumber} />
      )}
    </>
  );
}
