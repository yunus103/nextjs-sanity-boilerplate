import { FadeIn } from "@/components/ui/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { AnimateGroup } from "@/components/ui/AnimateGroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Project } from "@/types";

interface ProjectsSectionProps {
  title?: string;
  subtitle?: string;
  projects?: Project[];
}

export function ProjectsSection({
  title,
  subtitle,
  projects = [],
}: ProjectsSectionProps) {
  const displayTitle = title || "Öne Çıkan Projelerimiz";
  const displaySubtitle = subtitle || "Başarıyla tamamladığımız güncel projeler.";

  return (
    <section className="py-20 md:py-28 bg-background">
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
        {projects && projects.length > 0 ? (
          <div className="space-y-12">
            <AnimateGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.slice(0, 3).map((project: Project) => (
                <Link key={project.slug?.current} href={`/projeler/${project.slug?.current}`} className="group block relative overflow-hidden rounded-xl border aspect-[4/3]">
                  {project.mainImage ? (
                    <div className="absolute inset-0">
                      <SanityImage
                        image={project.mainImage}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Black overlay that fades/darkens on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:via-black/50 group-hover:from-black/90 transition-all duration-300" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background flex items-center justify-center p-6 text-center">
                      <h3 className="font-bold text-xl text-foreground line-clamp-2">{project.title}</h3>
                    </div>
                  )}

                  {/* Dynamic absolute text over the image */}
                  <div className="absolute bottom-0 inset-x-0 p-6 z-10 flex flex-col justify-end h-full">
                    <h3 className="font-bold text-lg md:text-xl text-white line-clamp-2 group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    <div className="mt-2 overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-500 ease-in-out">
                      <span className="text-white/80 font-medium text-xs tracking-wider uppercase flex items-center">
                        Projeyi İncele <span className="ml-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </AnimateGroup>
            
            <FadeIn delay={0.2} className="text-center pt-4">
              <Button variant="outline" size="lg" render={<Link href="/projeler" />}>
                Tüm Projeleri Gör
              </Button>
            </FadeIn>
          </div>
        ) : (
          <FadeIn>
            <p className="text-muted-foreground text-center py-12">Henüz öne çıkarılmış bir proje bulunmuyor.</p>
          </FadeIn>
        )}

      </div>
    </section>
  );
}
