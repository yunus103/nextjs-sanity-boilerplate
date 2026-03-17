import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Başlık", type: "text", rows: 3 }),
    defineField({
      name: "heroImage",
      title: "Hero Görseli",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
    }),
    defineField({ name: "heroCtaLabel", title: "Hero Buton Metni", type: "string" }),
    defineField({ name: "heroCtaSlug", title: "Hero Buton Linki (Slug)", type: "string", description: "Örn: iletisim, hizmetler" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
