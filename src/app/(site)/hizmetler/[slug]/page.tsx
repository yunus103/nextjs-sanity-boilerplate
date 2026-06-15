import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cachedFetch } from "@/sanity/lib/client";
import { serviceBySlugQuery, serviceSlugsQuery } from "@/sanity/lib/queries";
import { buildMetadata, portableTextToPlainText } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Service } from "@/types";
import { JsonLd, serviceJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await cachedFetch<Array<{ slug: string }>>(serviceSlugsQuery, {}, { next: { tags: ["services"] } });
  return (services || []).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await cachedFetch<Service | null>(serviceBySlugQuery, { slug }, { next: { tags: [`service:${slug}`] } });
  if (!service) return {};
  return buildMetadata({
    title: service.title,
    description: portableTextToPlainText(service.body),
    canonicalPath: `/hizmetler/${slug}`,
    pageSeo: service.seo,
  });
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await cachedFetch<Service | null>(
    serviceBySlugQuery,
    { slug },
    { next: { tags: [`service:${slug}`] } }
  );

  if (!service) notFound();

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
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
    </>
  );
}
