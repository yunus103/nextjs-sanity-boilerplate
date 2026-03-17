import { defineField, defineType } from "sanity";

export const seoType = defineType({
  name: "seo",
  title: "SEO Ayarları",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Başlık",
      type: "string",
      description: "Boş bırakılırsa sayfa başlığı kullanılır. Maksimum 60 karakter.",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Açıklama",
      type: "text",
      rows: 3,
      description: "Boş bırakılırsa varsayılan site açıklaması kullanılır. Maksimum 160 karakter.",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "ogImage",
      title: "Sosyal Medya Görseli (OG Image)",
      type: "image",
      description: "Boş bırakılırsa varsayılan site OG görseli kullanılır. Önerilen: 1200x630px",
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL",
      type: "url",
      description: "Yalnızca özel bir canonical URL gerekiyorsa doldur. Aksi halde otomatik belirlenir.",
    }),
    defineField({
      name: "noIndex",
      title: "Arama Motorlarından Gizle",
      type: "boolean",
      description: "Açılırsa bu sayfa Google tarafından indexlenmez.",
      initialValue: false,
    }),
  ],
});
