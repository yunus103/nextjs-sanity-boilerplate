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
  /**
   * Blur placeholder'ı devre dışı bırakır.
   * Hero gibi priority görsellerde kullanışlıdır.
   * @default false
   */
  noBlur?: boolean;
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
  noBlur = false,
}: SanityImageProps) {
  if (!image?.asset) return null;

  /**
   * Sanity CDN Loader — Next.js'in her responsive breakpoint için çağırdığı fonksiyon.
   */
  const sanityLoader = ({
    width: loaderWidth,
    quality: loaderQuality,
  }: {
    width: number;
    quality?: number;
  }) => {
    // 1920px üst sınırını uygula
    const finalWidth = Math.min(loaderWidth, 1920);

    let builder = urlForImage(image)!
      .auto("format")
      .width(finalWidth)
      .quality(loaderQuality ?? quality ?? 75);

    if (!fill && height) {
      const aspectRatio = height / width;
      builder = builder
        .height(Math.round(finalWidth * aspectRatio))
        .fit(fit);
    } else {
      // fill modunda upscale'i önlemek için fit("max")
      builder = builder.fit("max");
    }

    return builder.url();
  };

  const blurDataURL = noBlur ? undefined : getImageLqip(image);

  /**
   * Hotspot → CSS object-position.
   */
  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : "center";

  const resolvedObjectFit = objectFit ?? (fill ? "cover" : undefined);

  return (
    <Image
      loader={sanityLoader}
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
