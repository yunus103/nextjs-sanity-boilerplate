import { FadeIn } from "@/components/ui/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { AnimateGroup } from "@/components/ui/AnimateGroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Service } from "@/types";

interface ServicesSectionProps {
  title?: string;
  subtitle?: string;
  services?: Service[];
}

export function ServicesSection({
  title,
  subtitle,
  services = [],
}: ServicesSectionProps) {
  const displayTitle = title || "Hizmetlerimiz";
  const displaySubtitle = subtitle || "Size en uygun profesyonel çözümlerimiz.";

  return (
    <section className="py-20 md:py-28 bg-muted/40">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <FadeIn direction="up">
            <span className="text-sm font-semibold tracking-wider text-primary uppercase">
              {displayTitle}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 text-foreground">
              {displaySubtitle}
            </h2>
          </FadeIn>
        </div>

        {/* Content */}
        {services && services.length > 0 ? (
          <div className="space-y-12">
            <AnimateGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 3).map((service: Service) => (
                <Link key={service.slug?.current} href={`/hizmetler/${service.slug?.current}`} className="group block">
                  <article className="border rounded-xl overflow-hidden bg-card hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                    {service.mainImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <SanityImage
                          image={service.mainImage}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {service.title}
                        </h3>
                      </div>
                      <div className="mt-6">
                        <span className="text-primary font-semibold text-xs tracking-wider uppercase group-hover:underline underline-offset-4 flex items-center">
                          Detayları Gör
                          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </AnimateGroup>
            
            <FadeIn delay={0.2} className="text-center pt-4">
              <Button variant="outline" size="lg" render={<Link href="/hizmetler" />}>
                Tüm Hizmetleri Gör
              </Button>
            </FadeIn>
          </div>
        ) : (
          <FadeIn>
            <p className="text-muted-foreground text-center py-12">Henüz öne çıkarılmış bir hizmet bulunmuyor.</p>
          </FadeIn>
        )}

      </div>
    </section>
  );
}
