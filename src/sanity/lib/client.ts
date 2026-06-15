import { createClient } from "next-sanity";
import { cache } from "react";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
};

export const client = createClient({ ...config, useCdn: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cachedFetch = cache(
  <T>(query: string, params: Record<string, any> = {}, options: any = {}): Promise<T> => {
    return client.fetch<T>(query, params, options);
  }
);

