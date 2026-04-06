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
    defineField({
      name: "heroCtaLink",
      title: "Hero Buton Linki",
      type: "object",
      fields: [
        defineField({
          name: "linkType",
          title: "Link Tipi",
          type: "string",
          options: {
            list: [
              { title: "İç Sayfa (Önerilen)", value: "internal" },
              { title: "Manuel Link", value: "manual" },
            ],
            layout: "radio",
          },
          initialValue: "internal",
        }),
        defineField({
          name: "internal",
          title: "İç Sayfa Seç",
          type: "reference",
          to: [
            { type: "service" },
            { type: "project" },
            { type: "blogPost" },
            { type: "aboutPage" },
            { type: "contactPage" },
            { type: "legalPage" },
          ],
          hidden: ({ parent }) => parent?.linkType !== "internal",
        }),
        defineField({
          name: "manual",
          title: "Manuel Link",
          type: "string",
          description: "Örn: /blog, /galeri veya https://google.com (Link başındaki / işaretini unutmayın)",
          hidden: ({ parent }) => parent?.linkType !== "manual",
        }),
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
