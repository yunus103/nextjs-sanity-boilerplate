import Image from "next/image";
import { urlForImage, getImageLqip } from "@/sanity/lib/image";

type SanityImageProps = {
  image: {
    asset: any;
    alt: string;
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
  fit?: "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
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
}: SanityImageProps) {
  if (!image?.asset) return null;

  // 1. Sanity URL Builder hazırlığı
  let builder = urlForImage(image)?.auto("format");

  // Eğer fill değilse, CDN tarafında görseli tam istediğimiz boyuta çekiyoruz
  if (!fill && builder) {
    builder = builder.width(width).height(height).fit(fit);
  }

  const imageUrl = builder?.url();
  const blurDataURL = getImageLqip(image);

  // 2. Hotspot (Odak Noktası) hesaplama
  // Sanity hotspot değerleri 0-1 arasındadır, bu yüzden yüzdesiyle çarpıyoruz.
  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : "center";

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={image.alt || ""}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      style={{ 
        objectPosition,
        objectFit: fill ? "cover" : undefined 
      }}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
    />
  );
}
