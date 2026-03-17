import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  if (!source?.asset) return null;
  return builder.image(source);
}

export function getImageLqip(image: any): string | undefined {
  return image?.asset?.metadata?.lqip;
}
