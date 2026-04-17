"use client";

import Image from "next/image";
import { urlForImage, getImageLqip } from "@/sanity/lib/image";

type SanityImageProps = {
  image: {
    asset: any;
    alt?: string;
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  /**
   * Sanity CDN fit modu. `fill` prop'u true iken yalnızca crop/max önerilir.
   * @default "crop"
   */
  fit?: "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  /**
   * CSS object-fit değeri. `fill` modunda varsayılan "cover"dır.
   * Lightbox gibi durumlarda "contain" olarak override edilebilir.
   */
  objectFit?: React.CSSProperties["objectFit"];
  /**
   * Sanity CDN'e gönderilecek görsel kalitesi (1–100).
   * Vercel Image Optimizer kullanılmadığı için bu değer doğrudan CDN'e iletilir.
   * @default 75
   */
  quality?: number;
};

export function SanityImage({
  image,
  width = 800,
  height = 600,
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  priority = false,
  fit = "crop",
  objectFit,
  quality = 75,
}: SanityImageProps) {
  if (!image?.asset) return null;

  /**
   * Sanity CDN Loader — Next.js'in her responsive breakpoint için çağırdığı fonksiyon.
   *
   * Bu sayede:
   *  - Vercel Image Optimization kotası tüketilmez.
   *  - Sanity'nin kendi CDN'i (cdn.sanity.io) görseli sunar → dünya geneli edge cache.
   *  - `auto("format")` → WebP/AVIF formatını tarayıcıya göre otomatik seçer.
   *  - `builder.image(image)` → hotspot ve crop alanlarını URL parametrelerine
   *    otomatik dönüştürür; kırpma işlemi Sanity CDN tarafında yapılır.
   */
  const sanityLoader = ({
    width: loaderWidth,
    quality: loaderQuality,
  }: {
    width: number;
    quality?: number;
  }) => {
    // builder.image(image) → hotspot & crop otomatik dahil edilir
    let builder = urlForImage(image)!
      .auto("format")
      .width(loaderWidth)
      .quality(loaderQuality ?? quality ?? 75);

    if (!fill && height) {
      // Verilen width/height oranını koruyarak CDN tarafında kırp
      const aspectRatio = height / width;
      builder = builder
        .height(Math.round(loaderWidth * aspectRatio))
        .fit(fit);
    }

    return builder.url();
  };

  const blurDataURL = getImageLqip(image);

  /**
   * Hotspot → CSS object-position.
   * Sanity hotspot değerleri [0-1] aralığındadır.
   * CDN zaten hotspot'a göre kırpıyor olsa da, `fill` modunda
   * CSS tarafı da ayrıca ihtiyaç duyabilir (tarayıcı layout).
   */
  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : "center";

  const resolvedObjectFit = objectFit ?? (fill ? "cover" : undefined);

  return (
    <Image
      loader={sanityLoader}
      /**
       * `loader` kullanıldığında `src` yalnızca Next.js'in iç cache key'i için
       * kullanılır — gerçek URL loader'dan gelir.
       */
      src={image.asset._ref ?? image.asset._id ?? "sanity-image"}
      alt={image.alt ?? ""}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      style={{
        objectFit: resolvedObjectFit,
        objectPosition,
      }}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
    />
  );
}
