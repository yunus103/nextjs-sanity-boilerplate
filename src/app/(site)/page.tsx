import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import {
  homePageQuery,
  serviceListQuery,
  projectListQuery,
  blogListQuery,
} from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { BlogSection } from "@/components/home/BlogSection";
import { HomePage as HomePageType, Service, Project, BlogPost } from "@/types";

export async function generateMetadata(): Promise<Metadata> {
  const data = await cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home"] } });
  return buildMetadata({
    canonicalPath: "/",
    pageSeo: data?.seo,
  });
}

export default async function HomePage() {
  // 1. First fetch the main homepage configuration
  const data = await cachedFetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home"] } });

  // 2. Determine if fallback queries are actually needed
  const needsFallbackServices = !data?.featuredServices || data.featuredServices.length === 0;
  const needsFallbackProjects = !data?.featuredProjects || data.featuredProjects.length === 0;
  const needsFallbackPosts = !data?.featuredPosts || data.featuredPosts.length === 0;

  // 3. Fetch fallbacks in parallel only if necessary
  const [fallbackServices, fallbackProjects, fallbackPosts] = await Promise.all([
    needsFallbackServices
      ? cachedFetch<Service[]>(serviceListQuery, {}, { next: { tags: ["services"] } })
      : Promise.resolve([]),
    needsFallbackProjects
      ? cachedFetch<Project[]>(projectListQuery, {}, { next: { tags: ["projects"] } })
      : Promise.resolve([]),
    needsFallbackPosts
      ? cachedFetch<BlogPost[]>(blogListQuery, {}, { next: { tags: ["blog"] } })
      : Promise.resolve([]),
  ]);

  // Determine which items to display (Sanity references or dynamic fallbacks)
  const servicesToDisplay = data?.featuredServices && data.featuredServices.length > 0
    ? data.featuredServices
    : fallbackServices;

  const projectsToDisplay = data?.featuredProjects && data.featuredProjects.length > 0
    ? data.featuredProjects
    : fallbackProjects;

  const postsToDisplay = data?.featuredPosts && data.featuredPosts.length > 0
    ? data.featuredPosts
    : fallbackPosts;

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection data={data} />

      {/* 2. Hakkımızda Bölümü */}
      <AboutSection
        title={data?.aboutTitle}
        subtitle={data?.aboutSubtitle}
        text={data?.aboutText}
        image={data?.aboutImage}
        ctaLabel={data?.aboutCtaLabel}
        ctaLink={data?.aboutCtaLink}
      />

      {/* 3. Öne Çıkan Hizmetler */}
      <ServicesSection
        title={data?.servicesTitle}
        subtitle={data?.servicesSubtitle}
        services={servicesToDisplay}
      />

      {/* 4. Öne Çıkan Projeler */}
      <ProjectsSection
        title={data?.projectsTitle}
        subtitle={data?.projectsSubtitle}
        projects={projectsToDisplay}
      />

      {/* 5. Son Blog Yazıları */}
      <BlogSection
        title={data?.blogTitle}
        subtitle={data?.blogSubtitle}
        posts={postsToDisplay}
      />
    </div>
  );
}
