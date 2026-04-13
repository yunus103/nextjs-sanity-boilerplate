import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { blogListQuery, blogCategoriesQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { AnimateGroup } from "@/components/ui/AnimateGroup";
import { fadeUpItem } from "@/components/ui/AnimateGroup";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Blog",
    canonicalPath: "/blog",
  });
}

export default async function BlogListPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const currentCategory = searchParams?.category as string | undefined;

  const [posts, categories] = await Promise.all([
    client.fetch(blogListQuery, {}, { next: { tags: ["blog"] } }),
    client.fetch(blogCategoriesQuery, {}, { next: { tags: ["blogCategory"] } })
  ]);

  const filteredPosts = currentCategory
    ? posts.filter((post: any) => post.category?.title === currentCategory)
    : posts;

  return (
    <div className="container mx-auto px-4 py-16">
      <FadeIn direction="up">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-muted-foreground mb-8">Yazılar, güncellemeler ve haberler.</p>
        
        {categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            <Button
              variant={!currentCategory ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href="/blog">Tümü</Link>
            </Button>
            {categories.map((cat: any) => (
              <Button
                key={cat._id}
                variant={currentCategory === cat.title ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link href={`/blog?category=${encodeURIComponent(cat.title)}`}>{cat.title}</Link>
              </Button>
            ))}
          </div>
        )}
      </FadeIn>

      {filteredPosts?.length > 0 ? (
        <AnimateGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post: any) => (
            <Link key={post.slug?.current} href={`/blog/${post.slug?.current}`} className="group block">
              <article className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300">
                {post.mainImage && (
                  <div className="relative h-48 overflow-hidden">
                    <SanityImage
                      image={post.mainImage}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {post.category.title}
                      </span>
                    )}
                    {post.publishedAt && (
                      <time className="text-xs text-muted-foreground block">
                        {formatDate(post.publishedAt)}
                      </time>
                    )}
                  </div>
                  <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </AnimateGroup>
      ) : (
        <FadeIn>
          <p className="text-muted-foreground text-center py-16">Bu kategoride henüz blog yazısı yok.</p>
        </FadeIn>
      )}
    </div>
  );
}
