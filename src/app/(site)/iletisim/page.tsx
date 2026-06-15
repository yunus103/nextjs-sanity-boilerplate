import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { contactPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { ContactPage as ContactPageType } from "@/types";

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

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {/* Page Hero */}
      <PageHero
        title={data?.heroTitle || data?.pageTitle || "İletişim"}
        subtitle={data?.heroSubtitle || data?.pageSubtitle}
        backgroundImage={data?.heroImage}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <FadeIn delay={0.15}>
            <ContactForm
              formTitle={data?.formTitle}
              successMessage={data?.successMessage}
            />
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
