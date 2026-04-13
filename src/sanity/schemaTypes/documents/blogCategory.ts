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
  ],
});
