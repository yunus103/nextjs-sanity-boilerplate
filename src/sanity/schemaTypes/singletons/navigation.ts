import { defineField, defineType } from "sanity";

const navItemFields = [
  defineField({ name: "label", title: "Etiket", type: "string", validation: (Rule) => Rule.required() }),
  defineField({
    name: "href",
    title: "Link / Path",
    type: "string",
    description: "İç sayfa için: /hakkimizda, /blog gibi. Dış link için: https://google.com",
    validation: (Rule) => Rule.required(),
  }),
  defineField({ name: "openInNewTab", title: "Yeni Sekmede Aç", type: "boolean", initialValue: false }),
  defineField({
    name: "subLinks",
    title: "Alt Linkler",
    type: "array",
    of: [{
      type: "object",
      fields: [
        defineField({ name: "label", title: "Etiket", type: "string", validation: (Rule) => Rule.required() }),
        defineField({ name: "href", title: "Link / Path", type: "string", description: "Örn: /blog/ilk-yazi" }),
        defineField({ name: "openInNewTab", title: "Yeni Sekmede Aç", type: "boolean", initialValue: false }),
      ],
    }],
  }),
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
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Menü Linkleri",
      type: "array",
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "href" } } }],
    }),
  ],
});
