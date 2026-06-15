import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cachedFetch } from "@/sanity/lib/client";
import { projectBySlugQuery, projectSlugsQuery } from "@/sanity/lib/queries";
import { buildMetadata, portableTextToPlainText } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Project } from "@/types";
import { JsonLd, projectJsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await cachedFetch<Array<{ slug: string }>>(projectSlugsQuery, {}, { next: { tags: ["projects"] } });
  return (projects || []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await cachedFetch<Project | null>(projectBySlugQuery, { slug }, { next: { tags: [`project:${slug}`] } });
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    description: portableTextToPlainText(project.body),
    canonicalPath: `/projeler/${slug}`,
    pageSeo: project.seo,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await cachedFetch<Project | null>(
    projectBySlugQuery,
    { slug },
    { next: { tags: [`project:${slug}`] } }
  );

  if (!project) notFound();

  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      <article className="container mx-auto px-4 py-16 max-w-3xl break-words overflow-x-hidden">
      <FadeIn direction="up">
        <Button variant="ghost" className="mb-8 -ml-2" render={<Link href="/projeler" />}>
          ← Projelere Dön
        </Button>
        <h1 className="text-4xl font-bold mb-8">{project.title}</h1>
      </FadeIn>

      {project.mainImage && (
        <FadeIn delay={0.15}>
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-12">
            <SanityImage
              image={project.mainImage}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>
        </FadeIn>
      )}

      <FadeIn delay={0.25}>
        <RichText value={project.body} />
      </FadeIn>
    </article>
    </>
  );
}
