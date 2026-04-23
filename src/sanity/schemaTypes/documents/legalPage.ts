import { defineField, defineType } from "sanity";

export const legalPageType = defineType({
  name: "legalPage",
  title: "Yasal Sayfa",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "İçerik", type: "array", of: [{ type: "block" }, { type: "customHtml" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
