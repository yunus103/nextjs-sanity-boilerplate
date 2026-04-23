import { defineField, defineType } from "sanity";
import React from "react";

export const customHtmlType = defineType({
  name: "customHtml",
  title: "Ham HTML Bloğu",
  type: "object",
  icon: () => React.createElement("span", { style: { fontSize: "1.1em", fontWeight: "bold" } }, "</>"),
  fields: [
    defineField({
      name: "html",
      title: "HTML Kodu",
      type: "text",
      rows: 10,
      description:
        "Buraya doğrudan HTML kodu yapıştırabilirsiniz (tablo, liste, embed vb.). Kod olduğu gibi sayfada render edilir.",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { html: "html" },
    prepare({ html }: { html?: string }) {
      const preview = html?.replace(/<[^>]+>/g, " ").trim().slice(0, 80) ?? "Boş HTML bloğu";
      return {
        title: "Ham HTML Bloğu",
        subtitle: preview,
      };
    },
  },
});
