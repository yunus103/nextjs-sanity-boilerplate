import { Metadata } from "next";
import { cache } from "react";
import { client, cachedFetch } from "@/sanity/lib/client";
import { servicesPageQuery, serviceListQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimateGroup } from "@/components/ui/AnimateGroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ServicesPage as ServicesPageType, Service } from "@/types";

const getServicesPageData = cache(
  (): Promise<ServicesPageType> =>
    client.fetch<ServicesPageType>(servicesPageQuery, {}, { next: { tags: ["servicesPage"] } })
);

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getServicesPageData();
  return buildMetadata({
    title: pageData?.heroTitle || pageData?.pageTitle || "Hizmetlerimiz",
    canonicalPath: "/hizmetler",
    pageSeo: pageData?.seo,
  });
}

export default async function ServicesHubPage() {
  const [services, pageData] = await Promise.all([
    cachedFetch<Service[]>(serviceListQuery, {}, { next: { tags: ["services"] } }),
    getServicesPageData(),
  ]);

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {/* Page Hero */}
      <PageHero
        title={pageData?.heroTitle || pageData?.pageTitle || "Hizmetlerimiz"}
        subtitle={pageData?.heroSubtitle || pageData?.pageSubtitle || "Size özel sunduğumuz profesyonel çözümler."}
        backgroundImage={pageData?.heroImage}
      />

      <div className="container mx-auto px-4">
        {services && services.length > 0 ? (
          <AnimateGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: Service) => (
              <Link key={service.slug?.current} href={`/hizmetler/${service.slug?.current}`} className="group block">
                <article className="border rounded-xl overflow-hidden bg-card hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                  {service.mainImage && (
                    <div className="relative aspect-video overflow-hidden">
                      <SanityImage
                        image={service.mainImage}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h2 className="font-bold text-xl mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {service.title}
                      </h2>
                    </div>
                    <div className="mt-6">
                      <span className="text-primary font-semibold text-sm tracking-wider uppercase group-hover:underline underline-offset-4 flex items-center">
                        Detayları İncele
                        <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </AnimateGroup>
        ) : (
          <FadeIn>
            <p className="text-muted-foreground text-center py-16">Henüz eklenmiş bir hizmet bulunmuyor.</p>
          </FadeIn>
        )}

        {/* CTA Section */}
        {pageData?.ctaLabel && pageData?.ctaLink && (
          <FadeIn className="mt-16 md:mt-24 p-8 md:p-12 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border text-center max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Daha Fazla Bilgi mi İstiyorsunuz?</h3>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Size en uygun çözümü bulmak ve profesyonel destek almak için bizimle hemen iletişime geçin.
            </p>
            <Button size="lg" render={<Link href={pageData.ctaLink} />}>
              {pageData.ctaLabel}
            </Button>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
