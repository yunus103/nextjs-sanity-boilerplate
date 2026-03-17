import { defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Proje",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "mainImage",
      title: "Ana Görsel",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
      validation: (Rule) => Rule.required(),
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
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
