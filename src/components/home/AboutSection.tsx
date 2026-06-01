/* eslint-disable @typescript-eslint/no-explicit-any */
import { FadeIn } from "@/components/ui/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SanityImage as SanityImageType } from "@/types";

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  text?: any[];
  image?: SanityImageType;
  ctaLabel?: string;
  ctaLink?: string;
}

export function AboutSection({
  title,
  subtitle,
  text,
  image,
  ctaLabel,
  ctaLink,
}: AboutSectionProps) {
  // Graceful fallback values
  const displayTitle = title || "Hakkımızda";
  const displayCtaLabel = ctaLabel || "Devamını Oku";
  const displayCtaLink = ctaLink || "/hakkimizda";

  return (
    <section className="py-20 md:py-28 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Sol Kolon: Metinler */}
          <div className="lg:col-span-7 space-y-6">
            <FadeIn direction="up">
              <span className="text-sm font-semibold tracking-wider text-primary uppercase">
                {displayTitle}
              </span>
              {subtitle && (
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mt-2 text-foreground">
                  {subtitle}
                </h2>
              )}
            </FadeIn>

            {text && text.length > 0 && (
              <FadeIn delay={0.15}>
                <RichText value={text} className="text-muted-foreground" />
              </FadeIn>
            )}

            <FadeIn delay={0.25} className="pt-4">
              <Button size="lg" render={<Link href={displayCtaLink} />}>
                {displayCtaLabel}
              </Button>
            </FadeIn>
          </div>

          {/* Sağ Kolon: Görsel */}
          {image && (
            <div className="lg:col-span-5 relative">
              <FadeIn direction="left" delay={0.3} className="relative">
                {/* Decorative Elements for premium look */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-primary/20 to-transparent blur-2xl z-0" />
                <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-10 border bg-card">
                  <SanityImage
                    image={image}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </FadeIn>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
