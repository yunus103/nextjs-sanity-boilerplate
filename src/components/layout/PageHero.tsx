import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SanityImage as SanityImageType } from "@/types";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: SanityImageType;
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  className = "",
}: PageHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-muted py-20 md:py-28 ${className}`}>
      {/* Background Image / Fallback Gradient */}
      {backgroundImage?.asset ? (
        <div className="absolute inset-0 z-0">
          <SanityImage
            image={backgroundImage}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-primary/10 via-primary/5 to-background" />
      )}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl">
          <FadeIn direction="up" duration={0.6}>
            {/* Breadcrumbs */}
            <Breadcrumbs className={`mb-6 ${backgroundImage?.asset ? "text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" : ""}`} />

            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 ${backgroundImage?.asset ? "text-white" : "text-foreground"}`}>
              {title}
            </h1>
            
            {subtitle && (
              <p className={`text-lg md:text-xl font-normal leading-relaxed ${backgroundImage?.asset ? "text-white/80" : "text-muted-foreground"}`}>
                {subtitle}
              </p>
            )}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
