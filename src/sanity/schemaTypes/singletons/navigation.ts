import { defineField, defineType } from "sanity";

const navItemFields = [
  defineField({ name: "label", title: "Etiket", type: "string", validation: (Rule) => Rule.required() }),
  defineField({
    name: "linkType",
    title: "Link Türü",
    type: "string",
    options: { list: [{ title: "İç Link (Sayfa)", value: "internal" }, { title: "Dış Link", value: "external" }] },
    initialValue: "internal",
  }),
  defineField({
    name: "internalSlug",
    title: "İç Sayfa Slug'ı",
    type: "string",
    description: "Örn: hakkimizda, blog, hizmetler",
    hidden: ({ parent }: any) => parent?.linkType !== "internal",
  }),
  defineField({
    name: "externalUrl",
    title: "Dış Link URL",
    type: "url",
    hidden: ({ parent }: any) => parent?.linkType !== "external",
  }),
  defineField({ name: "openInNewTab", title: "Yeni Sekmede Aç", type: "boolean", initialValue: false }),
];

export const navigationType = defineType({
  name: "navigation",
  title: "Navigasyon",
  type: "document",
  fields: [
    defineField({
      name: "headerLinks",
      title: "Header Menü Linkleri",
      type: "array",
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "internalSlug" } } }],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Menü Linkleri",
      type: "array",
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "internalSlug" } } }],
    }),
  ],
});
