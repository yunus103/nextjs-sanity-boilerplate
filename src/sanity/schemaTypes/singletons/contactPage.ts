import { defineField, defineType } from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "İletişim Sayfası",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Sayfa Başlığı", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "pageSubtitle", title: "Giriş Metni", type: "text", rows: 3 }),
    defineField({ name: "formTitle", title: "Form Başlığı", type: "string", initialValue: "Bize Ulaşın" }),
    defineField({
      name: "successMessage",
      title: "Form Başarı Mesajı",
      type: "text",
      rows: 2,
      initialValue: "Mesajınız alındı. En kısa sürede size dönüş yapacağız.",
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
