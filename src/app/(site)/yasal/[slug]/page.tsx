import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { legalPageBySlugQuery, allSlugsForSitemapQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { FadeIn } from "@/components/ui/FadeIn";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const data = await client.fetch(allSlugsForSitemapQuery, {}, { next: { tags: ["legal"] } });
  return (data?.legalPages || []).map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await client.fetch(legalPageBySlugQuery, { slug }, { next: { tags: ["legal"] } });
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    canonicalPath: `/yasal/${slug}`,
    pageSeo: page.seo,
  });
}

export default async function LegalPage({ params }: Props) {
  const { slug } = await params;
  const page = await client.fetch(legalPageBySlugQuery, { slug }, { next: { tags: ["legal"] } });

  if (!page) notFound();

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <FadeIn direction="up">
        <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
        {page._updatedAt && (
          <p className="text-sm text-muted-foreground mb-8">
            Son güncelleme: {formatDate(page._updatedAt)}
          </p>
        )}
      </FadeIn>
      <FadeIn delay={0.15}>
        <RichText value={page.body} />
      </FadeIn>
    </div>
  );
}
