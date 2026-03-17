import { createClient } from "next-sanity";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
};

export const client = createClient({ ...config, useCdn: false });

export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts",
});

export function getClient(preview = false) {
  return preview ? previewClient : client;
}
