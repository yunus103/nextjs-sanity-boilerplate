import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
import { serviceBySlugQuery, serviceListQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await client.fetch(serviceListQuery, {}, { next: { tags: ["services"] } });
  return (services || []).map((s: any) => ({ slug: s.slug?.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getClient().fetch(serviceBySlugQuery, { slug }, { next: { tags: ["services"] } });
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    canonicalPath: `/hizmetler/${slug}`,
    pageSeo: service.seo,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const isDraft = (await draftMode()).isEnabled;
  const service = await getClient(isDraft).fetch(
    serviceBySlugQuery,
    { slug },
    { next: { tags: ["services"] } }
  );

  if (!service) notFound();

  return (
    <article className="container mx-auto px-4 py-16 max-w-3xl break-words overflow-x-hidden">
      <FadeIn direction="up">
        <Button variant="ghost" className="mb-8 -ml-2" render={<Link href="/hizmetler" />}>
          ← Hizmetlere Dön
        </Button>
        <h1 className="text-4xl font-bold mb-8">{service.title}</h1>
      </FadeIn>

      {service.mainImage && (
        <FadeIn delay={0.15}>
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-12">
            <SanityImage
              image={service.mainImage}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.25}>
        <RichText value={service.body} />
      </FadeIn>
    </article>
  );
}
