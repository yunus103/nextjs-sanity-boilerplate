import { defineField, defineType } from "sanity";
import React from "react";
import { ColorInput } from "../../components/ColorInput";

export const blogPostType = defineType({
  name: "blogPost",
  title: "Blog Yazısı",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "publishedAt", title: "Yayın Tarihi", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "blogCategory" }],
      description: "Blog yazısının ait olduğu kategori",
    }),
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
        { 
          type: "block",
          marks: {
            annotations: [
              {
                name: "textColor",
                type: "object",
                title: "Metin Rengi",
                icon: () => React.createElement('span', { style: { fontSize: '1.2em' } }, '💧'),
                fields: [
                  {
                    name: "hex",
                    type: "string",
                    title: "Renk Seçin",
                    components: {
                      input: ColorInput,
                    },
                  },
                ],
              }
            ]
          }
        },
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
              options: { 
                list: [
                  { title: "Çok Küçük (%25)", value: "25" },
                  { title: "Küçük (%33)", value: "33" },
                  { title: "Orta (%50)", value: "50" },
                  { title: "Geniş (%75)", value: "75" },
                  { title: "Tam Genişlik (%100)", value: "100" }
                ] 
              },
              initialValue: "100",
            }),
          ],
        },
        { type: "customHtml" },
      ],
    }),
    defineField({
      name: "seoTags",
      title: "SEO Etiketleri",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description: "SEO ve sayfa altı etiketleri için etiketler ekleyin (Enter ile ayırın).",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Yayın Tarihi (Yeni→Eski)", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
});
