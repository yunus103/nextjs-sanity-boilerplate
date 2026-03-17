import { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
import { blogPostBySlugQuery, blogListQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { JsonLd, articleJsonLd } from "@/components/seo/JsonLd";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await client.fetch(blogListQuery, {}, { next: { tags: ["blog"] } });
  return (posts || []).map((post: any) => ({ slug: post.slug?.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getClient().fetch(blogPostBySlugQuery, { slug }, { next: { tags: ["blog"] } });
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    canonicalPath: `/blog/${slug}`,
    pageSeo: post.seo,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const isDraft = (await draftMode()).isEnabled;
  const post = await getClient(isDraft).fetch(
    blogPostBySlugQuery,
    { slug },
    { next: { tags: ["blog"] } }
  );

  if (!post) notFound();

  return (
    <>
      <JsonLd data={articleJsonLd(post)} />

      <article className="container mx-auto px-4 py-16 max-w-3xl">
        <FadeIn direction="up">
          <Button variant="ghost" className="mb-8 -ml-2" render={<Link href="/blog" />}>
            ← Blog'a Dön
          </Button>

          {post.publishedAt && (
            <time className="text-sm text-muted-foreground block mb-4">
              {formatDate(post.publishedAt)}
            </time>
          )}

          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{post.excerpt}</p>
          )}
        </FadeIn>

        {post.mainImage && (
          <FadeIn delay={0.15}>
            <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-12">
              <SanityImage
                image={post.mainImage}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.25}>
          <RichText value={post.body} />
        </FadeIn>
      </article>
    </>
  );
}
