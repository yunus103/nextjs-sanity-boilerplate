import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { singletonPlugin } from "./src/sanity/plugins/singletonPlugin";

const SINGLETONS = ["siteSettings", "navigation", "homePage", "aboutPage", "contactPage", "blogPage", "servicesPage", "projectsPage"];

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: "Site Yönetim Paneli",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    singletonPlugin(SINGLETONS),
  ],
});
