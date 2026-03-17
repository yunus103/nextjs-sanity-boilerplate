import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
import { projectBySlugQuery, projectListQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await client.fetch(projectListQuery, {}, { next: { tags: ["projects"] } });
  return (projects || []).map((p: any) => ({ slug: p.slug?.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getClient().fetch(projectBySlugQuery, { slug }, { next: { tags: ["projects"] } });
  if (!project) return {};
  return buildMetadata({
    title: project.title,
    canonicalPath: `/projeler/${slug}`,
    pageSeo: project.seo,
  });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const isDraft = (await draftMode()).isEnabled;
  const project = await getClient(isDraft).fetch(
    projectBySlugQuery,
    { slug },
    { next: { tags: ["projects"] } }
  );

  if (!project) notFound();

  return (
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
  );
}
