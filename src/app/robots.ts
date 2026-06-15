import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 86400; // Cache robots.txt for 24 hours on CDN Edge

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio/", "/api/"] },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
