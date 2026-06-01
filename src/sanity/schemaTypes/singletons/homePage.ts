import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Bölümü" },
    { name: "about", title: "Hakkımızda Önizleme" },
    { name: "services", title: "Hizmetler Önizleme" },
    { name: "projects", title: "Projeler Önizleme" },
    { name: "blog", title: "Blog Önizleme" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    // Hero Group
    defineField({ name: "heroTitle", title: "Hero Başlık", type: "string", group: "hero", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Başlık", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "heroImage",
      title: "Hero Görseli",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
    }),
    defineField({ name: "heroCtaLabel", title: "Hero Buton Metni", type: "string", group: "hero" }),
    defineField({
      name: "heroCtaLink",
      title: "Hero Buton Linki",
      type: "object",
      group: "hero",
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

    // About Preview Group
    defineField({ name: "aboutTitle", title: "Hakkımızda Bölüm Başlığı", type: "string", group: "about", initialValue: "Hakkımızda" }),
    defineField({ name: "aboutSubtitle", title: "Hakkımızda Bölüm Alt Başlığı", type: "text", rows: 2, group: "about" }),
    defineField({ name: "aboutText", title: "Hakkımızda Kısa Yazı", type: "array", of: [{ type: "block" }], group: "about" }),
    defineField({
      name: "aboutImage",
      title: "Hakkımızda Görseli",
      type: "image",
      group: "about",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string" })],
    }),
    defineField({ name: "aboutCtaLabel", title: "Daha Fazla Buton Metni", type: "string", group: "about", initialValue: "Devamını Oku" }),
    defineField({ name: "aboutCtaLink", title: "Buton Linki", type: "string", group: "about", initialValue: "/hakkimizda" }),

    // Services Preview Group
    defineField({ name: "servicesTitle", title: "Hizmetler Bölüm Başlığı", type: "string", group: "services", initialValue: "Hizmetlerimiz" }),
    defineField({ name: "servicesSubtitle", title: "Hizmetler Bölüm Alt Başlığı", type: "text", rows: 2, group: "services" }),
    defineField({
      name: "featuredServices",
      title: "Öne Çıkan Hizmetler",
      description: "Ana sayfada gösterilecek hizmetleri seçin ve sıralayın (Sürükleyip bırakarak sıralayabilirsiniz).",
      type: "array",
      group: "services",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),

    // Projects Preview Group
    defineField({ name: "projectsTitle", title: "Projeler Bölüm Başlığı", type: "string", group: "projects", initialValue: "Projelerimiz" }),
    defineField({ name: "projectsSubtitle", title: "Projeler Bölüm Alt Başlığı", type: "text", rows: 2, group: "projects" }),
    defineField({
      name: "featuredProjects",
      title: "Öne Çıkan Projeler",
      description: "Ana sayfada gösterilecek projeleri seçin ve sıralayın.",
      type: "array",
      group: "projects",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),

    // Blog Preview Group
    defineField({ name: "blogTitle", title: "Blog Bölüm Başlığı", type: "string", group: "blog", initialValue: "Son Haberler & Blog" }),
    defineField({ name: "blogSubtitle", title: "Blog Bölüm Alt Başlığı", type: "text", rows: 2, group: "blog" }),
    defineField({
      name: "featuredPosts",
      title: "Öne Çıkan Blog Yazıları",
      description: "Ana sayfada gösterilecek blog yazılarını seçin ve sıralayın. Boş bırakılırsa en son eklenen blog yazıları otomatik gösterilir.",
      type: "array",
      group: "blog",
      of: [{ type: "reference", to: [{ type: "blogPost" }] }],
    }),

    // SEO Group
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
});
