import { FadeIn } from "@/components/ui/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { AnimateGroup } from "@/components/ui/AnimateGroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { BlogPost } from "@/types";

interface BlogSectionProps {
  title?: string;
  subtitle?: string;
  posts?: BlogPost[];
}

export function BlogSection({
  title,
  subtitle,
  posts = [],
}: BlogSectionProps) {
  const displayTitle = title || "Son Haberler & Blog";
  const displaySubtitle = subtitle || "Sektördeki gelişmeler ve ekibimizden güncel paylaşımlar.";

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
        {posts && posts.length > 0 ? (
          <div className="space-y-12">
            <AnimateGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post: BlogPost) => (
                <Link key={post.slug?.current} href={`/${post.slug?.current}`} className="group block">
                  <article className="border rounded-xl overflow-hidden bg-card hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:-translate-y-1">
                    {post.mainImage && (
                      <div className="relative aspect-video overflow-hidden">
                        <SanityImage
                          image={post.mainImage}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <span className="text-xs font-semibold px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full">
                              {post.category.title}
                            </span>
                          )}
                          {post.publishedAt && (
                            <time className="text-xs text-muted-foreground">
                              {formatDate(post.publishedAt)}
                            </time>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <div className="mt-6">
                        <span className="text-primary font-semibold text-xs tracking-wider uppercase group-hover:underline underline-offset-4 flex items-center">
                          Devamını Oku
                          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </AnimateGroup>
            
            <FadeIn delay={0.2} className="text-center pt-4">
              <Button variant="outline" size="lg" render={<Link href="/blog" />}>
                Tüm Yazıları Gör
              </Button>
            </FadeIn>
          </div>
        ) : (
          <FadeIn>
            <p className="text-muted-foreground text-center py-12">Henüz eklenmiş bir blog yazısı bulunmuyor.</p>
          </FadeIn>
        )}

      </div>
    </section>
  );
}
