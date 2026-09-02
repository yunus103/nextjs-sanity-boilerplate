import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { contactPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { ContactPage as ContactPageType } from "@/types";
import { RiPhoneLine, RiMailLine, RiMapPinLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";

export async function generateMetadata(): Promise<Metadata> {
  const data = await cachedFetch<ContactPageType>(contactPageQuery, {}, { next: { tags: ["contact"] } });
  return buildMetadata({
    title: data?.heroTitle || data?.pageTitle || "İletişim",
    canonicalPath: "/iletisim",
    pageSeo: data?.seo,
  });
}

export default async function ContactPage() {
  const data = await cachedFetch<ContactPageType>(contactPageQuery, {}, { next: { tags: ["contact"] } });
  const contact = data?.contactInfo;
  const hasContactInfo = Boolean(
    contact?.phone || contact?.email || contact?.address || contact?.whatsappNumber
  );

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {/* Page Hero */}
      <PageHero
        title={data?.heroTitle || data?.pageTitle || "İletişim"}
        subtitle={data?.heroSubtitle || data?.pageSubtitle}
        backgroundImage={data?.heroImage}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* İletişim Bilgileri (Site Ayarlarında tanımlıysa gösterilir) */}
          {hasContactInfo && (
            <FadeIn>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {contact?.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <span className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                      <RiPhoneLine className="size-6" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Telefon
                    </span>
                    <span className="text-sm font-medium text-foreground">{contact.phone}</span>
                  </a>
                )}

                {contact?.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <span className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                      <RiMailLine className="size-6" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      E-posta
                    </span>
                    <span className="text-sm font-medium text-foreground">{contact.email}</span>
                  </a>
                )}

                {contact?.whatsappNumber && (
                  <a
                    href={`https://wa.me/${contact.whatsappNumber.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <span className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                      <FaWhatsapp className="size-6" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      WhatsApp
                    </span>
                    <span className="text-sm font-medium text-foreground">{contact.whatsappNumber}</span>
                  </a>
                )}

                {contact?.address && (
                  <div className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card">
                    <span className="p-3 rounded-full bg-primary/10 text-primary mb-3">
                      <RiMapPinLine className="size-6" />
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Adres
                    </span>
                    <span className="text-sm font-medium text-foreground">{contact.address}</span>
                  </div>
                )}
              </div>
            </FadeIn>
          )}

          {/* İletişim Formu (Sanity'de showForm aktifse gösterilir) */}
          {data?.showForm && (
            <div className="max-w-2xl mx-auto">
              <FadeIn delay={0.15}>
                <ContactForm
                  formTitle={data?.formTitle}
                  successMessage={data?.successMessage}
                />
              </FadeIn>
            </div>
          )}

          {/* Harita İframe (Site Ayarlarında tanımlıysa) */}
          {contact?.mapIframe && (
            <FadeIn delay={0.2}>
              <div
                className="w-full rounded-2xl overflow-hidden border border-border shadow-sm [&_iframe]:w-full [&_iframe]:h-[380px] [&_iframe]:border-0"
                dangerouslySetInnerHTML={{ __html: contact.mapIframe }}
              />
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
