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
};

export function SanityImage({
  image,
  width = 800,
  height = 600,
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  priority = false,
}: SanityImageProps) {
  if (!image?.asset) return null;

  const imageUrl = urlForImage(image)?.auto("format").fit("crop").url();
  const blurDataURL = getImageLqip(image);
  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : "center";

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={image.alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      style={{ objectPosition }}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
    />
  );
}
