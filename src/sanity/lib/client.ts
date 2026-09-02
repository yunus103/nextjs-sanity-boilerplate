import type { QueryParams, ResponseQueryOptions } from "@sanity/client";
import { createClient } from "next-sanity";
import { cache } from "react";
import { config } from "./config";

export const client = createClient({ ...config, useCdn: false });

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
