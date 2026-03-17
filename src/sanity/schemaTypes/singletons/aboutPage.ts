import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Hakkımızda",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Sayfa Başlığı", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "pageSubtitle", title: "Alt Başlık", type: "text", rows: 2 }),
    defineField({ name: "body", title: "İçerik", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "mainImage",
      title: "Ana Görsel",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
