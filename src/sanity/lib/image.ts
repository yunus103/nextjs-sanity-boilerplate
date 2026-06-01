import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";
import { SanityImage } from "@/types";

const builder = createImageUrlBuilder(client);

export function urlForImage(source?: SanityImage) {
  if (!source?.asset) return null;
  return builder.image(source);
}

export function getImageLqip(image?: SanityImage): string | undefined {
  return image?.asset?.metadata?.lqip;
}
