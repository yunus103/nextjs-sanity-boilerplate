import { defineField, defineType } from "sanity";

export const blogPostType = defineType({
  name: "blogPost",
  title: "Blog Yazısı",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "publishedAt", title: "Yayın Tarihi", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({
      name: "mainImage",
      title: "Kapak Görseli",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Özet",
      type: "text",
      rows: 3,
      description: "Liste sayfalarında gösterilir. Maksimum 200 karakter.",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "body",
      title: "İçerik",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "alignment",
              title: "Hizalama",
              type: "string",
              options: { list: [{ title: "Sol", value: "left" }, { title: "Orta", value: "center" }, { title: "Sağ", value: "right" }, { title: "Tam Genişlik", value: "full" }] },
              initialValue: "center",
            }),
            defineField({
              name: "size",
              title: "Boyut",
              type: "string",
              options: { list: [{ title: "Küçük (%50)", value: "half" }, { title: "Normal (%75)", value: "large" }, { title: "Tam Genişlik", value: "full" }] },
              initialValue: "full",
            }),
          ],
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Yayın Tarihi (Yeni→Eski)", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
});
