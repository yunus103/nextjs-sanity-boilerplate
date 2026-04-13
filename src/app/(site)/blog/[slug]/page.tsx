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
  
  const baseSeo = await buildMetadata({
    title: post.title,
    description: post.excerpt,
    canonicalPath: `/blog/${slug}`,
    pageSeo: post.seo,
  });

  if (post.seoTags?.length) {
    baseSeo.keywords = post.seoTags;
  }

  return baseSeo;
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

      <article className="container mx-auto px-4 py-16 max-w-3xl break-words overflow-x-hidden">
        <FadeIn direction="up">
          <Button variant="ghost" className="mb-8 -ml-2" asChild>
            <Link href="/blog">← Blog'a Dön</Link>
          </Button>

          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Link
                href={`/blog?category=${encodeURIComponent(post.category.title)}`}
                className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {post.category.title}
              </Link>
            )}
            {post.publishedAt && (
              <time className="text-sm text-muted-foreground block">
                {formatDate(post.publishedAt)}
              </time>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-6 pt-2">{post.title}</h1>
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

        {post.seoTags?.length > 0 && (
          <FadeIn delay={0.3}>
            <div className="mt-16 pt-8 border-t">
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Etiketler:</h3>
              <div className="flex flex-wrap gap-2">
                {post.seoTags.map((tag: string) => (
                  <span key={tag} className="text-sm bg-secondary px-3 py-1 rounded-md text-secondary-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </article>
    </>
  );
}
