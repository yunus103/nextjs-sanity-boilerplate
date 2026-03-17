import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { defaultSeoQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

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
  const defaultSlogan = defaults?.title || defaults?.siteName || ""; // Default SEO Meta Title alanı
  const isHomePage = params.canonicalPath === "/";

  let title = "";
  if (isHomePage) {
    // Ana Sayfa Önceliği: 
    // 1. Ana Sayfa Dokümanı Sayfa SEO Başlığı
    // 2. Fonksiyona gönderilen özel başlık (params.title)
    // 3. Site Ayarları -> Varsayılan SEO -> Meta Başlık (Slogan)
    const slogan = params.pageSeo?.metaTitle || params.title || defaultSlogan;
    title = slogan && slogan !== siteName ? `${siteName} | ${slogan}` : siteName;
  } else {
    // Diğer Sayfalar Önceliği: 
    // 1. Sayfanın kendi SEO Başlığı
    // 2. Fonksiyona gönderilen başlık (Hakkımızda vs.)
    const pageTitle = params.pageSeo?.metaTitle || params.title || "";
    title = pageTitle ? `${pageTitle} | ${siteName}` : siteName;
  }

  const description = params.pageSeo?.metaDescription || params.description || defaults?.description;
  const ogImageSource = params.pageSeo?.ogImage || params.ogImage || defaults?.ogImage;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const canonicalUrl =
    params.pageSeo?.canonicalUrl ||
    (params.canonicalPath ? `${siteUrl}${params.canonicalPath}` : undefined);
  const noIndex = params.pageSeo?.noIndex || params.noIndex || false;

  const ogImageUrl = ogImageSource
    ? urlForImage(ogImageSource)?.width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
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
  };
}
