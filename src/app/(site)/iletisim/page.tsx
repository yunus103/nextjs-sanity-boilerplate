import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { contactPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "@/components/forms/ContactForm";

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(contactPageQuery, {}, { next: { tags: ["contact"] } });
  return buildMetadata({
    title: data?.pageTitle || "İletişim",
    canonicalPath: "/iletisim",
    pageSeo: data?.seo,
  });
}

export default async function ContactPage() {
  const data = await client.fetch(contactPageQuery, {}, { next: { tags: ["contact"] } });

  return (
    <div className="container mx-auto px-4 py-16">
      <FadeIn direction="up">
        <h1 className="text-4xl font-bold mb-4">
          {data?.pageTitle || "İletişim"}
        </h1>
        {data?.pageSubtitle && (
          <p className="text-muted-foreground max-w-2xl mb-12">{data.pageSubtitle}</p>
        )}
      </FadeIn>

      <FadeIn delay={0.15}>
        <div className="max-w-2xl">
          <ContactForm
            formTitle={data?.formTitle}
            successMessage={data?.successMessage}
          />
        </div>
      </FadeIn>
    </div>
  );
}
