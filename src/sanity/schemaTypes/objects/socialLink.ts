import { defineField, defineType } from "sanity";

export const socialLinkType = defineType({
  name: "socialLink",
  title: "Sosyal Medya Linki",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Facebook", value: "facebook" },
          { title: "X (Twitter)", value: "twitter" },
          { title: "LinkedIn", value: "linkedin" },
          { title: "YouTube", value: "youtube" },
          { title: "TikTok", value: "tiktok" },
          { title: "Pinterest", value: "pinterest" },
          { title: "WhatsApp", value: "whatsapp" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
