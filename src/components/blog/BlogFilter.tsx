"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimateGroup } from "@/components/ui/AnimateGroup";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { formatDate } from "@/lib/utils";

interface BlogFilterProps {
  posts: any[];
  categories: any[];
}

export function BlogFilter({ posts, categories }: BlogFilterProps) {
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  // Sayfa yüklendiğinde URL'den kategoriyi al
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryQuery = urlParams.get("category");
    if (categoryQuery) {
      setCurrentCategory(categoryQuery);
    }
  }, []);

  const setCategory = (slug: string | null) => {
    setCurrentCategory(slug);
    
    // URL'yi sayfayı yenilemeden değiştir
    const newUrl = slug ? `/blog?category=${slug}` : "/blog";
    window.history.pushState({ path: newUrl }, "", newUrl);
  };

  const filteredPosts = currentCategory
    ? posts.filter((post) => post.category?.slug?.current === currentCategory)
    : posts;

  return (
    <>
      <FadeIn direction="up">
        {categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            <Button
              variant={!currentCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(null)}
            >
              Tümü
            </Button>
            {categories.map((cat: any) => (
              <Button
                key={cat._id}
                variant={currentCategory === cat.slug?.current ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat.slug?.current)}
              >
                {cat.title}
              </Button>
            ))}
          </div>
        )}
      </FadeIn>

      {filteredPosts?.length > 0 ? (
        <AnimateGroup key={currentCategory || "all"} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post: any) => (
            <Link key={post.slug?.current} href={`/${post.slug?.current}`} className="group block">
              <article className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {post.mainImage && (
                  <div className="relative h-48 overflow-hidden">
                    <SanityImage
                      image={post.mainImage}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    {post.category && (
                      <span className="text-xs font-medium px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                        {post.category.title}
                      </span>
                    )}
                    {post.publishedAt && (
                      <time className="text-xs text-muted-foreground block">
                        {formatDate(post.publishedAt)}
                      </time>
                    )}
                  </div>
                  <h2 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                  )}
                  <div className="mt-auto">
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
      ) : (
        <FadeIn key={`empty-${currentCategory}`}>
          <p className="text-muted-foreground text-center py-16">Bu kategoride henüz blog yazısı yok.</p>
        </FadeIn>
      )}
    </>
  );
}
