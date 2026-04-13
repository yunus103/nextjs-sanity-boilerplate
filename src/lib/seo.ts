import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { defaultSeoQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { getSiteUrl } from "./utils";

type PageSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: any;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type BuildMetadataParams = {
  title?: string;
  description?: string;
  ogImage?: any;
  canonicalPath?: string;
  noIndex?: boolean;
  pageSeo?: PageSeo;
};

export async function buildMetadata(params: BuildMetadataParams = {}): Promise<Metadata> {
  const defaults = await client.fetch(defaultSeoQuery, {}, { next: { tags: ["layout"] } });

  const siteName = defaults?.siteName || "Site Adı";
  const siteTagline = defaults?.siteTagline || "";
  const defaultMetaTitle = defaults?.title || ""; // siteSettings -> defaultSeo -> metaTitle
  const isHomePage = params.canonicalPath === "/";

  let title = "";

  if (isHomePage) {
    // Ana Sayfa: En kaliteli yöntem
    // 1. Sayfa SEO alanına girilmiş ÖZEL BAŞLIK (Tam metni basar)
    // 2. Site Ayarları -> Varsayılan SEO Başlığı (Tam metni basar)
    // 3. Site Adı | Slogan
    // 4. Site Adı
    const customTitle = params.pageSeo?.metaTitle || defaultMetaTitle;
    
    if (customTitle) {
      title = customTitle;
    } else {
      title = siteTagline ? `${siteName} | ${siteTagline}` : siteName;
    }
  } else {
    // Diğer Sayfalar: Standard [Başlık] | [Site Adı]
    const pageTitle = params.pageSeo?.metaTitle || params.title || "";
    title = pageTitle ? `${pageTitle} | ${siteName}` : siteName;
  }

  const description = params.pageSeo?.metaDescription || params.description || defaults?.description;
  const ogImageSource = params.pageSeo?.ogImage || params.ogImage || defaults?.ogImage;
  const siteUrl = getSiteUrl();
  const canonicalUrl =
    params.pageSeo?.canonicalUrl ||
    (params.canonicalPath ? `${siteUrl}${params.canonicalPath}` : undefined);
  const noIndex = params.pageSeo?.noIndex || params.noIndex || false;

  const faviconUrl = defaults?.favicon?.asset?.url || "/favicon.ico";
  const ogImageUrl = ogImageSource
    ? urlForImage(ogImageSource)?.width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
    openGraph: {
      title: title || "",
      description: description || "",
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || "",
      description: description || "",
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    verification: {
      google: defaults?.googleSearchConsoleId || undefined,
    },
  };
}
