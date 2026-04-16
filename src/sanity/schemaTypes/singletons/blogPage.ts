import { defineField, defineType } from "sanity";

export const blogPageType = defineType({
  name: "blogPage",
  title: "Blog Sayfası",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Sayfa Başlığı", type: "string" }),
    defineField({ name: "pageSubtitle", title: "Alt Başlık / Kısa Yazı", type: "text", rows: 3 }),
    defineField({ name: "ctaLabel", title: "CTA Buton Metni", type: "string", description: "Boş bırakılırsa CTA butonu gizlenir" }),
    defineField({ name: "ctaLink", title: "CTA Buton Linki", type: "string" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
