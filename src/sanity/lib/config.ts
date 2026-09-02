/**
 * Sanity project coordinates.
 *
 * Kept in its own module — free of any `@sanity/client` import — so that
 * client components can build image URLs without pulling the Sanity HTTP
 * client into the browser bundle.
 */
export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
};
