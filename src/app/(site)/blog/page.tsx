import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { blogListQuery, blogCategoriesQuery, blogPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { BlogFilter } from "@/components/blog/BlogFilter";
import { PageHero } from "@/components/layout/PageHero";
import { BlogPage as BlogPageType } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await client.fetch<BlogPageType>(blogPageQuery, {}, { next: { tags: ["blogPage"] } });
  return buildMetadata({
    title: pageData?.heroTitle || pageData?.pageTitle || "Blog",
    canonicalPath: "/blog",
    pageSeo: pageData?.seo,
  });
}

export default async function BlogListPage() {
  const [posts, categories, pageData] = await Promise.all([
    client.fetch(blogListQuery, {}, { next: { tags: ["blog"] } }),
    client.fetch(blogCategoriesQuery, {}, { next: { tags: ["blog"] } }),
    client.fetch<BlogPageType>(blogPageQuery, {}, { next: { tags: ["blogPage"] } })
  ]);

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {/* Page Hero */}
      <PageHero
        title={pageData?.heroTitle || pageData?.pageTitle || "Blog"}
        subtitle={pageData?.heroSubtitle || pageData?.pageSubtitle || "Yazılar, güncellemeler ve haberler."}
        backgroundImage={pageData?.heroImage}
      />

      <div className="container mx-auto px-4">
        <BlogFilter posts={posts} categories={categories} />
      </div>
    </div>
  );
}
