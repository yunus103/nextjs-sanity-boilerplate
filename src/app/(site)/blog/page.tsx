import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { blogListQuery, blogCategoriesQuery, blogPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { BlogFilter } from "@/components/blog/BlogFilter";
import { PageHero } from "@/components/layout/PageHero";
import { BlogPage as BlogPageType, BlogPost, BlogCategory } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await cachedFetch<BlogPageType>(blogPageQuery, {}, { next: { tags: ["blogPage"] } });
  return buildMetadata({
    title: pageData?.heroTitle || pageData?.pageTitle || "Blog",
    canonicalPath: "/blog",
    pageSeo: pageData?.seo,
  });
}

export default async function BlogListPage() {
  const [posts, categories, pageData] = await Promise.all([
    cachedFetch<BlogPost[]>(blogListQuery, {}, { next: { tags: ["blog"] } }),
    cachedFetch<BlogCategory[]>(blogCategoriesQuery, {}, { next: { tags: ["blog"] } }),
    cachedFetch<BlogPageType>(blogPageQuery, {}, { next: { tags: ["blogPage"] } })
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
