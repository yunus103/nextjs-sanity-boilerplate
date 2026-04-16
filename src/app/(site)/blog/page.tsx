import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { blogListQuery, blogCategoriesQuery, blogPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";
import { BlogFilter } from "@/components/blog/BlogFilter";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await client.fetch(blogPageQuery, {}, { next: { tags: ["blogPage"] } });
  return buildMetadata({
    title: pageData?.pageTitle || "Blog",
    canonicalPath: "/blog",
    pageSeo: pageData?.seo,
  });
}

export default async function BlogListPage() {

  const [posts, categories, pageData] = await Promise.all([
    client.fetch(blogListQuery, {}, { next: { tags: ["blog"] } }),
    client.fetch(blogCategoriesQuery, {}, { next: { tags: ["blog"] } }),
    client.fetch(blogPageQuery, {}, { next: { tags: ["blogPage"] } })
  ]);

  return (
    <div className="container mx-auto px-4 py-16">
      <FadeIn direction="up">
        <h1 className="text-4xl font-bold mb-4">{pageData?.pageTitle || "Blog"}</h1>
        <p className="text-muted-foreground mb-8">{pageData?.pageSubtitle || "Yazılar, güncellemeler ve haberler."}</p>
      </FadeIn>

      <BlogFilter posts={posts} categories={categories} />
    </div>
  );
}
