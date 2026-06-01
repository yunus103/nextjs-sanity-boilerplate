import { Metadata } from "next";
import { draftMode } from "next/headers";
import { getClient, client } from "@/sanity/lib/client";
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
  const data = await getClient().fetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home"] } });
  return buildMetadata({
    canonicalPath: "/",
    pageSeo: data?.seo,
  });
}

export default async function HomePage() {
  const isDraft = (await draftMode()).isEnabled;
  
  // Fetch home page data and fallbacks in parallel
  const [data, fallbackServices, fallbackProjects, fallbackPosts] = await Promise.all([
    getClient(isDraft).fetch<HomePageType>(homePageQuery, {}, { next: { tags: ["home"] } }),
    client.fetch<Service[]>(serviceListQuery, {}, { next: { tags: ["services"] } }),
    client.fetch<Project[]>(projectListQuery, {}, { next: { tags: ["projects"] } }),
    client.fetch<BlogPost[]>(blogListQuery, {}, { next: { tags: ["blog"] } }),
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
