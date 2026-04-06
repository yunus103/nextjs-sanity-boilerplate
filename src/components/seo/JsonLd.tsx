import { getSiteUrl } from "@/lib/utils";

export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(settings: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.siteName,
    url: getSiteUrl(),
    ...(settings?.contactInfo?.phone && { telephone: settings.contactInfo.phone }),
    ...(settings?.contactInfo?.email && { email: settings.contactInfo.email }),
    ...(settings?.contactInfo?.address && {
      address: { "@type": "PostalAddress", streetAddress: settings.contactInfo.address },
    }),
    sameAs: settings?.socialLinks?.map((s: any) => s.url).filter(Boolean) || [],
  };
}

export function articleJsonLd(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post?.title,
    datePublished: post?.publishedAt,
    url: `${getSiteUrl()}/blog/${post?.slug?.current}`,
  };
}
