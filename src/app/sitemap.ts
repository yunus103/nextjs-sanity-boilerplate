import { MetadataRoute } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { allSlugsForSitemapQuery } from "@/sanity/lib/queries";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 86400; // Cache sitemap for 24 hours on CDN Edge

type SitemapItem = {
  slug: string;
  _updatedAt?: string;
};

type SitemapPage = {
  _updatedAt?: string;
  noIndex?: boolean;
};

type SitemapData = {
  pages?: Record<"home" | "about" | "contact" | "blog" | "services" | "projects", SitemapPage | null>;
  blogPosts?: SitemapItem[];
  services?: SitemapItem[];
  projects?: SitemapItem[];
};

function lastModified(updatedAt?: string) {
  return updatedAt ? new Date(updatedAt) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const data = await cachedFetch<SitemapData>(
    allSlugsForSitemapQuery,
    {},
    { next: { tags: ["sitemap"] } }
  );
  const pages = data?.pages;

  const staticRouteEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: lastModified(pages?.home?._updatedAt), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/hakkimizda`, lastModified: lastModified(pages?.about?._updatedAt), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/iletisim`, lastModified: lastModified(pages?.contact?._updatedAt), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: lastModified(pages?.blog?._updatedAt), changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hizmetler`, lastModified: lastModified(pages?.services?._updatedAt), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/projeler`, lastModified: lastModified(pages?.projects?._updatedAt), changeFrequency: "monthly", priority: 0.8 },
  ];

  const staticRoutes = staticRouteEntries.filter((route) => {
    const path = route.url.replace(base, "") || "/";
    if (path === "/") return !pages?.home?.noIndex;
    if (path === "/hakkimizda") return !pages?.about?.noIndex;
    if (path === "/iletisim") return !pages?.contact?.noIndex;
    if (path === "/blog") return !pages?.blog?.noIndex;
    if (path === "/hizmetler") return !pages?.services?.noIndex;
    if (path === "/projeler") return !pages?.projects?.noIndex;
    return true;
  });

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...(data?.blogPosts?.map((p) => ({
      url: `${base}/${p.slug}`,
      lastModified: lastModified(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || []),

    ...(data?.services?.map((p) => ({
      url: `${base}/hizmetler/${p.slug}`,
      lastModified: lastModified(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })) || []),
    ...(data?.projects?.map((p) => ({
      url: `${base}/projeler/${p.slug}`,
      lastModified: lastModified(p._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })) || []),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
