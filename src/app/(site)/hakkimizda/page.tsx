import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(aboutPageQuery, {}, { next: { tags: ["about"] } });
  return buildMetadata({
    title: data?.pageTitle || "Hakkımızda",
    canonicalPath: "/hakkimizda",
    pageSeo: data?.seo,
  });
}

export default async function AboutPage() {
  const data = await client.fetch(aboutPageQuery, {}, { next: { tags: ["about"] } });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Sol Kolon: Metin İçeriği */}
        <div className="lg:col-span-7">
          <FadeIn direction="up">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {data?.pageTitle || "Hakkımızda"}
            </h1>
            {data?.pageSubtitle && (
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed italic border-l-4 border-primary pl-6">
                {data.pageSubtitle}
              </p>
            )}
          </FadeIn>

          <FadeIn delay={0.2}>
            <RichText value={data?.body} />
          </FadeIn>
        </div>

        {/* Sağ Kolon: Görsel */}
        <div className="lg:col-span-5 sticky top-24">
          {data?.mainImage && (
            <FadeIn direction="left" delay={0.3}>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                <SanityImage
                  image={data.mainImage}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
