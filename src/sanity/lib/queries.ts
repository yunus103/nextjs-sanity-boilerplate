import { groq } from "next-sanity";

// ─── Layout ────────────────────────────────────────────────────────────────────
// Her sayfada bir kez çekilir — header, footer, global ayarlar
export const layoutQuery = groq`{
  "settings": *[_type == "siteSettings"][0] {
    siteName, siteTagline,
    logo { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    logoHeight,
    favicon { asset->{ _id, url } },
    contactInfo { phone, email, address, whatsappNumber, mapIframe },
    socialLinks[] { platform, url },
    gaId, gtmId, googleSearchConsoleId,
    defaultSeo { metaTitle, metaDescription },
    defaultOgImage { asset->{ _id, url, metadata { lqip, dimensions } } }
  },
  "navigation": *[_type == "navigation"][0] {
    headerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } },
    footerLinks[] { label, href, openInNewTab, subLinks[] { label, href, openInNewTab } }
  }
}`;

// ─── Sayfalar ──────────────────────────────────────────────────────────────────

export const homePageQuery = groq`*[_type == "homePage"][0] {
  heroTitle, heroSubtitle, heroCtaLabel,
  heroCtaLink {
    linkType,
    manual,
    internal->{ _type, "slug": slug.current }
  },
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  aboutTitle, aboutSubtitle, aboutText,
  aboutImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  aboutCtaLabel, aboutCtaLink,
  servicesTitle, servicesSubtitle,
  featuredServices[]-> {
    title, slug,
    mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt }
  },
  projectsTitle, projectsSubtitle,
  featuredProjects[]-> {
    title, slug,
    mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt }
  },
  blogTitle, blogSubtitle,
  featuredPosts[]-> {
    title, slug, excerpt, publishedAt,
    category->{ title, slug },
    mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt }
  },
  seo
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  heroTitle, heroSubtitle,
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  pageTitle, pageSubtitle, body,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  seo
}`;

export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  heroTitle, heroSubtitle,
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  pageTitle, pageSubtitle, formTitle, successMessage, seo
}`;

export const blogPageQuery = groq`*[_type == "blogPage"][0] {
  heroTitle, heroSubtitle,
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  pageTitle, pageSubtitle, ctaLabel, ctaLink, seo
}`;

export const servicesPageQuery = groq`*[_type == "servicesPage"][0] {
  heroTitle, heroSubtitle,
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  pageTitle, pageSubtitle, ctaLabel, ctaLink, seo
}`;

export const projectsPageQuery = groq`*[_type == "projectsPage"][0] {
  heroTitle, heroSubtitle,
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  pageTitle, pageSubtitle, ctaLabel, ctaLink, seo
}`;

// ─── Blog ──────────────────────────────────────────────────────────────────────

export const blogListQuery = groq`*[_type == "blogPost"] | order(publishedAt desc) {
  title, slug, excerpt, publishedAt, category->{title, slug},
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  _id, _updatedAt, title, slug, publishedAt, excerpt, category->{_id, title, slug}, seoTags,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  body[] {
    ...,
    _type == "image" => {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt, alignment, size, hotspot, crop
    }
  },
  seo
}`;

export const blogCategoriesQuery = groq`*[_type == "blogCategory"] | order(title asc) {
  _id, title, slug
}`;

export const blogListByCategorySlugQuery = groq`*[_type == "blogPost" && category->slug.current == $slug] | order(publishedAt desc) {
  title, slug, excerpt, publishedAt, category->{title, slug},
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const blogRelatedPostsQuery = groq`*[_type == "blogPost" && category._ref == $categoryId && _id != $currentPostId] | order(publishedAt desc)[0...3] {
  title, slug, excerpt, publishedAt, category->{title, slug},
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

// ─── Hizmetler ─────────────────────────────────────────────────────────────────

export const serviceListQuery = groq`*[_type == "service"] | order(_createdAt asc) {
  title, slug,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug][0] {
  title, slug,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  body[] {
    ...,
    _type == "image" => { asset->{ _id, url, metadata { lqip, dimensions } }, alt, alignment, size, hotspot, crop }
  },
  seo
}`;

// ─── Projeler ──────────────────────────────────────────────────────────────────

export const projectListQuery = groq`*[_type == "project"] | order(_createdAt asc) {
  title, slug,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  title, slug,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  body[] {
    ...,
    _type == "image" => { asset->{ _id, url, metadata { lqip, dimensions } }, alt, alignment, size, hotspot, crop }
  },
  seo
}`;

// ─── Sitemap ───────────────────────────────────────────────────────────────────

export const allSlugsForSitemapQuery = groq`{
  "pages": {
    "home": *[_type == "homePage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "about": *[_type == "aboutPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "contact": *[_type == "contactPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "blog": *[_type == "blogPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "services": *[_type == "servicesPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "projects": *[_type == "projectsPage"][0] { _updatedAt, "noIndex": seo.noIndex }
  },
  "blogPosts": *[_type == "blogPost" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "services": *[_type == "service" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "projects": *[_type == "project" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt }
}`;

// ─── Varsayılan SEO ────────────────────────────────────────────────────────────

export const defaultSeoQuery = groq`*[_type == "siteSettings"][0] {
  "title": defaultSeo.metaTitle,
  "description": defaultSeo.metaDescription,
  "ogImage": defaultOgImage,
  siteName,
  siteTagline,
  favicon { asset->{ _id, url } },
  googleSearchConsoleId
}`;

export const blogSlugsQuery = groq`*[_type == "blogPost" && defined(slug.current)] { "slug": slug.current }`;
export const projectSlugsQuery = groq`*[_type == "project" && defined(slug.current)] { "slug": slug.current }`;
export const serviceSlugsQuery = groq`*[_type == "service" && defined(slug.current)] { "slug": slug.current }`;

