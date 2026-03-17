import { defineField, defineType } from "sanity";
import { RiQuestionAnswerLine } from "react-icons/ri";

export const faqType = defineType({
  name: "faq",
  title: "SSS (Sıkça Sorulan Sorular)",
  type: "document",
  icon: RiQuestionAnswerLine,
  fields: [
    defineField({
      name: "question",
      title: "Soru",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Cevap",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sıralama",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "question",
      subtitle: "answer",
    },
  },
});
