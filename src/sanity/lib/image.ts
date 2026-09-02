import { createImageUrlBuilder } from "@sanity/image-url";
import { config } from "./config";
import { SanityImage } from "@/types";

// Built from plain project coordinates, not the Sanity client — see config.ts.
const builder = createImageUrlBuilder(config);

export function urlForImage(source?: SanityImage) {
  if (!source?.asset) return null;
  return builder.image(source);
}

export function getImageLqip(image?: SanityImage): string | undefined {
  return image?.asset?.metadata?.lqip;
}
