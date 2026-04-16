import { defineField, defineType } from "sanity";

export const blogCategoryType = defineType({
  name: "blogCategory",
  title: "Blog Kategorisi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Kategori Adı",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Sitede görünecek kategori adını girin.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
      description: "URL'de görünecek kategori ismi (otomatik oluşturabilirsiniz).",
    }),
  ],
});
