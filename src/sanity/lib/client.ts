import type { QueryParams, ResponseQueryOptions } from "@sanity/client";
import { createClient } from "next-sanity";
import { cache } from "react";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
};

export const client = createClient({ ...config, useCdn: true });

const cachedClientFetch = cache(
  <T>(query: string, paramsJson: string, optionsJson: string): Promise<T> => {
    const params = JSON.parse(paramsJson) as QueryParams;
    const options = JSON.parse(optionsJson) as ResponseQueryOptions;
    return client.fetch<T>(query, params, options);
  }
);

export function cachedFetch<T>(
  query: string,
  params: QueryParams = {},
  options: ResponseQueryOptions = {}
): Promise<T> {
  return cachedClientFetch<T>(
    query,
    JSON.stringify(params),
    JSON.stringify(options)
  );
}
