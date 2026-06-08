import { getSiteUrl } from "@/lib/utils";
import { SiteSettings, BlogPost, SocialLink, Service, Project } from "@/types";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(settings?: SiteSettings) {
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
    sameAs: settings?.socialLinks?.map((s: SocialLink) => s.url).filter(Boolean) || [],
  };
}

export function websiteJsonLd(settings?: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.siteName || "Site Adı",
    url: getSiteUrl(),
    ...(settings?.siteTagline && { alternateName: settings.siteTagline }),
  };
}

export function articleJsonLd(post?: BlogPost, settings?: SiteSettings) {
  const url = `${getSiteUrl()}/${post?.slug?.current}`;
  const publisherName = settings?.siteName || "Site Adı";

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post?.title,
    datePublished: post?.publishedAt,
    dateModified: post?._updatedAt || post?.publishedAt,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(post?.mainImage?.asset?.url && { image: [post.mainImage.asset.url] }),
    author: {
      "@type": "Organization",
      name: publisherName,
    },
    publisher: {
      "@type": "Organization",
      name: publisherName,
      ...(settings?.logo?.asset?.url && {
        logo: {
          "@type": "ImageObject",
          url: settings.logo.asset.url,
        },
      }),
    },
    description: post?.excerpt,
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbListJsonLd(items: { label: string; href: string }[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${siteUrl}${item.href}`,
    })),
  };
}

export function serviceJsonLd(service?: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service?.title,
    url: `${getSiteUrl()}/hizmetler/${service?.slug?.current}`,
    ...(service?.mainImage?.asset?.url && { image: service.mainImage.asset.url }),
  };
}

export function projectJsonLd(project?: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project?.title,
    url: `${getSiteUrl()}/projeler/${project?.slug?.current}`,
    ...(project?.mainImage?.asset?.url && { image: project.mainImage.asset.url }),
  };
}
