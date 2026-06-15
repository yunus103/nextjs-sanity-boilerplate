import { Metadata } from "next";
import { cache } from "react";
import { client } from "@/sanity/lib/client";
import { layoutQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";
import { getSiteUrl } from "./utils";
import { SanityImage, SiteSettings, Navigation } from "@/types";

type PageSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImage;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type BuildMetadataParams = {
  title?: string;
  description?: string;
  ogImage?: SanityImage;
  canonicalPath?: string;
  noIndex?: boolean;
  pageSeo?: PageSeo;
};

type PortableTextChild = {
  text?: string;
};

type PortableTextBlock = {
  _type?: string;
  children?: PortableTextChild[];
};

export function portableTextToPlainText(value?: PortableTextBlock[], maxLength = 160): string | undefined {
  if (!value?.length) return undefined;

  const text = value
    .filter((block) => block?._type === "block")
    .flatMap((block) => block.children?.map((child) => child.text).filter(Boolean) || [])
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return undefined;
  return text.length > maxLength ? `${text.slice(0, maxLength - 3).trimEnd()}...` : text;
}

export interface LayoutData {
  settings: SiteSettings;
  navigation: Navigation;
}

export const getLayoutData = cache(
  (): Promise<LayoutData> =>
    client.fetch<LayoutData>(layoutQuery, {}, { next: { tags: ["layout"] } })
);

export async function buildMetadata(params: BuildMetadataParams = {}): Promise<Metadata> {
  const { settings } = await getLayoutData();

  const siteName = settings?.siteName || "Site Adı";
  const siteTagline = settings?.siteTagline || "";
  const defaultMetaTitle = settings?.defaultSeo?.metaTitle || "";
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

  const description = params.pageSeo?.metaDescription || params.description || settings?.defaultSeo?.metaDescription;
  const ogImageSource = params.pageSeo?.ogImage || params.ogImage || settings?.defaultOgImage;
  const siteUrl = getSiteUrl();
  const canonicalUrl =
    params.pageSeo?.canonicalUrl ||
    (params.canonicalPath ? `${siteUrl}${params.canonicalPath}` : undefined);
  const noIndex = params.pageSeo?.noIndex || params.noIndex || false;

  const faviconUrl = settings?.favicon?.asset?.url || "/favicon.ico";
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
      google: settings?.googleSearchConsoleId || undefined,
    },
  };
}

