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
import { blogRelatedPostsQuery } from "@/sanity/lib/queries";

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

  let relatedPosts = [];
  if (post.category?._id) {
    relatedPosts = await getClient(isDraft).fetch(
      blogRelatedPostsQuery,
      { categoryId: post.category._id, currentPostId: post._id },
      { next: { tags: ["blog"] } }
    );
  }

  return (
    <>
      <JsonLd data={articleJsonLd(post)} />

      <article className="container mx-auto px-4 py-16 max-w-3xl break-words overflow-x-hidden">
        <FadeIn direction="up">
          <Button variant="ghost" className="mb-8 -ml-2" render={<Link href="/blog" />}>
            ← Blog'a Dön
          </Button>

          <div className="flex items-center gap-3 mb-4">
            {post.category && (
              <Link
                href={post.category.slug?.current ? `/blog?category=${post.category.slug.current}` : "/blog"}
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

        {relatedPosts?.length > 0 && (
          <FadeIn delay={0.4}>
            <div className="mt-20 pt-10 border-t border-border">
              <h2 className="text-2xl font-bold mb-8 font-bankgothic">İlgili Yazılar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {relatedPosts.map((rPost: any) => (
                  <Link key={rPost.slug.current} href={`/${rPost.slug.current}`} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
                    <article className="overflow-hidden h-full flex flex-col">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-muted">
                        <SanityImage
                          image={rPost.mainImage}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex-grow flex flex-col">
                        {rPost.publishedAt && (
                          <time className="text-xs text-muted-foreground mb-2 tracking-widest uppercase">
                            {formatDate(rPost.publishedAt)}
                          </time>
                        )}
                        <h3 className="text-lg font-bold mb-2 font-bankgothic group-hover:text-primary transition-colors line-clamp-2">
                          {rPost.title}
                        </h3>
                        <div className="mt-auto pt-2">
                          <span className="text-primary font-semibold text-xs tracking-wider uppercase group-hover:underline underline-offset-4 flex items-center">
                            Devamını Oku
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>
        )}
      </article>
    </>
  );
}
