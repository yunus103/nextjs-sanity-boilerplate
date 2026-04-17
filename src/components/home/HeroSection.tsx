import { FadeIn } from "@/components/ui/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroSectionProps {
  data: {
    heroImage?: any;
    heroTitle?: string;
    heroSubtitle?: string;
    heroCtaLabel?: string;
    heroCtaLink?: any;
  };
}

export function resolveLink(linkData: any) {
  if (!linkData) return "/";
  if (linkData.linkType === "manual") return linkData.manual || "/";
  
  const ref = linkData.internal;
  if (!ref || !ref._type) return "/";
  
  switch (ref._type) {
    case "service": return `/hizmetler/${ref.slug}`;
    case "project": return `/projeler/${ref.slug}`;
    case "blogPost": return `/${ref.slug}`;
    case "legalPage": return `/yasal/${ref.slug}`;
    case "aboutPage": return `/hakkimizda`;
    case "contactPage": return `/iletisim`;
    default: return "/";
  }
}

export function HeroSection({ data }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center">
      {data?.heroImage && (
        <div className="absolute inset-0 z-0">
          <SanityImage
            image={data.heroImage}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-24">
        <FadeIn direction="up" duration={0.7}>
          {data?.heroTitle && (
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl">
              {data.heroTitle}
            </h1>
          )}
          {data?.heroSubtitle && (
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
              {data.heroSubtitle}
            </p>
          )}
          {data?.heroCtaLabel && data?.heroCtaLink && (
            <Button size="lg" render={<Link href={resolveLink(data.heroCtaLink)} />}>
              {data.heroCtaLabel}
            </Button>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
