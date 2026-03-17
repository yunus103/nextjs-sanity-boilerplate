# Next.js + Sanity Kurumsal Site Boilerplate — Eksiksiz Kurulum Talimatı

Sen bir senior full-stack geliştiricisin. Aşağıdaki spesifikasyona göre, sıfırdan çalışan bir Next.js + Sanity kurumsal site boilerplate'i inşa edeceksin. Her adımı sırayla uygula. Hiçbir dosyayı atlamadan oluştur.

---

## Tech Stack

- **Next.js** (latest stable, App Router, TypeScript)
- **Tailwind CSS** (latest stable) + **shadcn/ui**
- **Sanity** (latest stable v3)
- **Framer Motion**
- **react-icons**
- **next-themes**
- **Nodemailer**
- **Zod**
- **@t3-oss/env-nextjs**
- **Node.js v20 LTS**

---

## ADIM 1 — Proje İskeleti ve Paket Kurulumu

### 1.1 Next.js Projesi

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-git
```

### 1.2 Gerekli Paketleri Yükle

```bash
npm install next-sanity @sanity/image-url @portabletext/react framer-motion react-icons next-themes nodemailer zod @t3-oss/env-nextjs @tailwindcss/typography
npm install -D @types/nodemailer
```

### 1.3 shadcn/ui Kurulumu

```bash
npx shadcn@latest init
```

Sorularda şunları seç: TypeScript: Yes, style: Default, base color: Neutral, CSS variables: Yes.

Ardından gerekli bileşenleri ekle:

```bash
npx shadcn@latest add button input textarea label sheet navigation-menu
```

### 1.4 Sanity Kurulumu

```bash
npm create sanity@latest -- --project-id PLACEHOLDER --dataset production --template clean
```

Bu komut `sanity.config.ts` ve temel Sanity dosyalarını oluşturur.

---

## ADIM 2 — Ortam Değişkenleri

### 2.1 `.env.local` Dosyası

`.env.local` dosyasını aşağıdaki içerikle oluştur. Bu dosyayı `.gitignore`'dan **çıkar** (ignore etme) — hassas veri içermiyor, sadece placeholder'lar var.

```env
# ─── Sanity ───────────────────────────────────────────────────────────────────
# Sanity projesini https://sanity.io/manage adresinden oluşturunca alırsın
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production

# Sanity > API > Tokens > Add API Token (Editor yetkisi) ile oluştur
# Draft Mode ve revalidation için gerekli
SANITY_API_READ_TOKEN=your-sanity-read-token-here

# Sanity webhook'u /api/revalidate'e bağlarken belirlediğin rastgele bir şifre
# Örn: openssl rand -hex 32 ile üret
SANITY_WEBHOOK_SECRET=your-webhook-secret-here

# ─── Site ─────────────────────────────────────────────────────────────────────
# Local geliştirmede http://localhost:3000 — production'da https://siteadi.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# ─── Draft Mode ───────────────────────────────────────────────────────────────
# Draft mode URL'ini korumak için rastgele bir şifre
# Örn: openssl rand -hex 32 ile üret
SANITY_PREVIEW_SECRET=your-preview-secret-here

# ─── İletişim Formu (SMTP) ────────────────────────────────────────────────────
# Gmail için: Google Hesabı > Güvenlik > 2FA > Uygulama Şifreleri
# host: smtp.gmail.com | port: 587 | secure: false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password-here

# Form doldurulunca bildirimin gideceği e-posta adresi
CONTACT_FORM_TO=info@yoursite.com
```

### 2.2 `.gitignore` Güncelle

`.gitignore` içinde `.env.local` satırı varsa sil veya başına `!` ekleyerek ignore'dan çıkar:

```
# .env.local kasıtlı olarak takip edilmektedir (sadece placeholder içerir)
!.env.local
```

### 2.3 `src/lib/env.ts`

```typescript
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SANITY_API_READ_TOKEN: z.string().min(1),
    SANITY_WEBHOOK_SECRET: z.string().min(1),
    SANITY_PREVIEW_SECRET: z.string().min(1),
    SMTP_HOST: z.string().min(1),
    SMTP_PORT: z.string().min(1),
    SMTP_USER: z.string().email(),
    SMTP_PASS: z.string().min(1),
    CONTACT_FORM_TO: z.string().email(),
  },
  client: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_SANITY_DATASET: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
  },
  runtimeEnv: {
    SANITY_API_READ_TOKEN: process.env.SANITY_API_READ_TOKEN,
    SANITY_WEBHOOK_SECRET: process.env.SANITY_WEBHOOK_SECRET,
    SANITY_PREVIEW_SECRET: process.env.SANITY_PREVIEW_SECRET,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    CONTACT_FORM_TO: process.env.CONTACT_FORM_TO,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
});
```

---

## ADIM 3 — Sanity Şema Mimarisi

### 3.1 `src/sanity/schemaTypes/objects/seo.ts`

```typescript
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
```

### 3.2 `src/sanity/schemaTypes/objects/socialLink.ts`

```typescript
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
```

### 3.3 `src/sanity/schemaTypes/singletons/siteSettings.ts`

```typescript
import { defineField, defineType } from "sanity";

export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Ayarları",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Site Adı", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "siteTagline", title: "Slogan", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({
      name: "logoDark",
      title: "Logo (Karanlık Mod)",
      type: "image",
      options: { hotspot: true },
      description: "Karanlık modda gösterilecek logo. Boş bırakılırsa standart logo kullanılır.",
    }),
    defineField({ name: "favicon", title: "Favicon", type: "image", description: "512x512px kare görsel önerilir." }),
    defineField({ name: "defaultOgImage", title: "Varsayılan OG Görseli", type: "image", description: "Sosyal medya paylaşımları için. 1200x630px." }),
    defineField({
      name: "defaultSeo",
      title: "Varsayılan SEO",
      type: "object",
      fields: [
        defineField({ name: "metaTitle", title: "Meta Başlık", type: "string", validation: (Rule) => Rule.max(60) }),
        defineField({ name: "metaDescription", title: "Meta Açıklama", type: "text", rows: 3, validation: (Rule) => Rule.max(160) }),
      ],
    }),
    defineField({
      name: "contactInfo",
      title: "İletişim Bilgileri",
      type: "object",
      fields: [
        defineField({ name: "phone", title: "Telefon", type: "string" }),
        defineField({ name: "email", title: "E-posta", type: "string" }),
        defineField({ name: "address", title: "Adres", type: "text", rows: 3 }),
        defineField({
          name: "whatsappNumber",
          title: "WhatsApp Numarası",
          type: "string",
          description: "Başında + ile ülke kodu dahil. Örn: +905001234567",
        }),
        defineField({
          name: "mapIframe",
          title: "Harita iFrame Kodu",
          type: "text",
          rows: 4,
          description: "Google Maps > Paylaş > Haritayı göm > HTML kodunu buraya yapıştır.",
        }),
      ],
    }),
    defineField({ name: "socialLinks", title: "Sosyal Medya Hesapları", type: "array", of: [{ type: "socialLink" }] }),
    defineField({ name: "gaId", title: "Google Analytics ID", type: "string", description: "Örn: G-XXXXXXXXXX" }),
    defineField({ name: "gtmId", title: "Google Tag Manager ID", type: "string", description: "Örn: GTM-XXXXXXX" }),
  ],
  preview: { select: { title: "siteName" } },
});
```

### 3.4 `src/sanity/schemaTypes/singletons/navigation.ts`

```typescript
import { defineField, defineType } from "sanity";

const navItemFields = [
  defineField({ name: "label", title: "Etiket", type: "string", validation: (Rule) => Rule.required() }),
  defineField({
    name: "linkType",
    title: "Link Türü",
    type: "string",
    options: { list: [{ title: "İç Link (Sayfa)", value: "internal" }, { title: "Dış Link", value: "external" }] },
    initialValue: "internal",
  }),
  defineField({
    name: "internalSlug",
    title: "İç Sayfa Slug'ı",
    type: "string",
    description: "Örn: hakkimizda, blog, hizmetler",
    hidden: ({ parent }: any) => parent?.linkType !== "internal",
  }),
  defineField({
    name: "externalUrl",
    title: "Dış Link URL",
    type: "url",
    hidden: ({ parent }: any) => parent?.linkType !== "external",
  }),
  defineField({ name: "openInNewTab", title: "Yeni Sekmede Aç", type: "boolean", initialValue: false }),
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
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "internalSlug" } } }],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Menü Linkleri",
      type: "array",
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label", subtitle: "internalSlug" } } }],
    }),
  ],
});
```

### 3.5 Singleton Sayfalar

**`src/sanity/schemaTypes/singletons/homePage.ts`**

```typescript
import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  fields: [
    defineField({ name: "heroTitle", title: "Hero Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroSubtitle", title: "Hero Alt Başlık", type: "text", rows: 3 }),
    defineField({
      name: "heroImage",
      title: "Hero Görseli",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
    }),
    defineField({ name: "heroCtaLabel", title: "Hero Buton Metni", type: "string" }),
    defineField({ name: "heroCtaSlug", title: "Hero Buton Linki (Slug)", type: "string", description: "Örn: iletisim, hizmetler" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
```

**`src/sanity/schemaTypes/singletons/aboutPage.ts`**

```typescript
import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Hakkımızda",
  type: "document",
  fields: [
    defineField({ name: "pageTitle", title: "Sayfa Başlığı", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "pageSubtitle", title: "Alt Başlık", type: "text", rows: 2 }),
    defineField({ name: "body", title: "İçerik", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "mainImage",
      title: "Ana Görsel",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
```

**`src/sanity/schemaTypes/singletons/contactPage.ts`**

```typescript
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
```

### 3.6 Dinamik Koleksiyonlar

**`src/sanity/schemaTypes/documents/blogPost.ts`**

```typescript
import { defineField, defineType } from "sanity";

export const blogPostType = defineType({
  name: "blogPost",
  title: "Blog Yazısı",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "publishedAt", title: "Yayın Tarihi", type: "datetime", initialValue: () => new Date().toISOString() }),
    defineField({
      name: "mainImage",
      title: "Kapak Görseli",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Özet",
      type: "text",
      rows: 3,
      description: "Liste sayfalarında gösterilir. Maksimum 200 karakter.",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "body",
      title: "İçerik",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Metni", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "alignment",
              title: "Hizalama",
              type: "string",
              options: { list: [{ title: "Sol", value: "left" }, { title: "Orta", value: "center" }, { title: "Sağ", value: "right" }, { title: "Tam Genişlik", value: "full" }] },
              initialValue: "center",
            }),
            defineField({
              name: "size",
              title: "Boyut",
              type: "string",
              options: { list: [{ title: "Küçük (%50)", value: "half" }, { title: "Normal (%75)", value: "large" }, { title: "Tam Genişlik", value: "full" }] },
              initialValue: "full",
            }),
          ],
        },
      ],
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [{ title: "Yayın Tarihi (Yeni→Eski)", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
});
```

**`src/sanity/schemaTypes/documents/service.ts`** — `blogPost` ile aynı iskelet: `title`, `slug`, `mainImage` (alt zorunlu, hotspot), `body` (block + image), `seo`. `publishedAt` ve `excerpt` yok.

**`src/sanity/schemaTypes/documents/project.ts`** — `service` ile aynı yapı.

**`src/sanity/schemaTypes/documents/legalPage.ts`**

```typescript
import { defineField, defineType } from "sanity";

export const legalPageType = defineType({
  name: "legalPage",
  title: "Yasal Sayfa",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Başlık", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "İçerik", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
});
```

### 3.7 `src/sanity/schemaTypes/index.ts`

```typescript
import { seoType } from "./objects/seo";
import { socialLinkType } from "./objects/socialLink";
import { siteSettingsType } from "./singletons/siteSettings";
import { navigationType } from "./singletons/navigation";
import { homePageType } from "./singletons/homePage";
import { aboutPageType } from "./singletons/aboutPage";
import { contactPageType } from "./singletons/contactPage";
import { blogPostType } from "./documents/blogPost";
import { serviceType } from "./documents/service";
import { projectType } from "./documents/project";
import { legalPageType } from "./documents/legalPage";

export const schemaTypes = [
  seoType, socialLinkType,
  siteSettingsType, navigationType,
  homePageType, aboutPageType, contactPageType,
  blogPostType, serviceType, projectType, legalPageType,
];
```

---

## ADIM 4 — Sanity Desk Structure ve Plugin'ler

### 4.1 `src/sanity/plugins/singletonPlugin.ts`

```typescript
export const singletonPlugin = (types: string[]) => ({
  name: "singletonPlugin",
  document: {
    newDocumentOptions: (prev: any, { creationContext }: any) => {
      if (creationContext.type === "global") {
        return prev.filter((templateItem: any) => !types.includes(templateItem.templateId));
      }
      return prev;
    },
    actions: (prev: any, { schemaType }: any) => {
      if (types.includes(schemaType)) {
        return prev.filter(({ action }: any) => action !== "duplicate" && action !== "delete");
      }
      return prev;
    },
  },
});
```

### 4.2 `src/sanity/structure.ts`

```typescript
import { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("İçerik")
    .items([
      S.listItem()
        .title("⚙️ Global Ayarlar")
        .child(
          S.list().title("Global Ayarlar").items([
            S.listItem().title("Site Ayarları").id("siteSettings").schemaType("siteSettings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem().title("Navigasyon").id("navigation").schemaType("navigation")
              .child(S.document().schemaType("navigation").documentId("navigation")),
          ])
        ),
      S.divider(),
      S.listItem()
        .title("📄 Sabit Sayfalar")
        .child(
          S.list().title("Sabit Sayfalar").items([
            S.listItem().title("🏠 Ana Sayfa").id("homePage").schemaType("homePage")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.listItem().title("ℹ️ Hakkımızda").id("aboutPage").schemaType("aboutPage")
              .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
            S.listItem().title("📬 İletişim").id("contactPage").schemaType("contactPage")
              .child(S.document().schemaType("contactPage").documentId("contactPage")),
          ])
        ),
      S.divider(),
      S.documentTypeListItem("blogPost").title("📝 Blog Yazıları"),
      S.documentTypeListItem("service").title("🛠 Hizmetler"),
      S.documentTypeListItem("project").title("💼 Projeler"),
      S.documentTypeListItem("legalPage").title("⚖️ Yasal Sayfalar"),
    ]);
```

### 4.3 `sanity.config.ts`

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { singletonPlugin } from "./src/sanity/plugins/singletonPlugin";

const SINGLETONS = ["siteSettings", "navigation", "homePage", "aboutPage", "contactPage"];

export default defineConfig({
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  title: "Site Yönetim Paneli",
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
    singletonPlugin(SINGLETONS),
  ],
});
```

---

## ADIM 5 — Sanity Client ve Query Katmanı

### 5.1 `src/sanity/lib/client.ts`

```typescript
import { createClient } from "next-sanity";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
};

export const client = createClient({ ...config, useCdn: true });

export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
  perspective: "previewDrafts",
});

export function getClient(preview = false) {
  return preview ? previewClient : client;
}
```

### 5.2 `src/sanity/lib/image.ts`

```typescript
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";

const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  if (!source?.asset) return null;
  return builder.image(source);
}

export function getImageLqip(image: any): string | undefined {
  return image?.asset?.metadata?.lqip;
}
```

### 5.3 `src/sanity/lib/queries.ts`

```typescript
import { groq } from "next-sanity";

// Layout — Her sayfada bir kez çekilir
export const layoutQuery = groq`{
  "settings": *[_type == "siteSettings"][0] {
    siteName, siteTagline,
    logo { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    logoDark { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    contactInfo { phone, email, address, whatsappNumber, mapIframe },
    socialLinks[] { platform, url },
    gaId, gtmId
  },
  "navigation": *[_type == "navigation"][0] {
    headerLinks[] { label, linkType, internalSlug, externalUrl, openInNewTab },
    footerLinks[] { label, linkType, internalSlug, externalUrl, openInNewTab }
  }
}`;

export const homePageQuery = groq`*[_type == "homePage"][0] {
  heroTitle, heroSubtitle, heroCtaLabel, heroCtaSlug,
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  seo
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  pageTitle, pageSubtitle, body,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  seo
}`;

export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  pageTitle, pageSubtitle, formTitle, successMessage, seo
}`;

export const blogListQuery = groq`*[_type == "blogPost"] | order(publishedAt desc) {
  title, slug, excerpt, publishedAt,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  title, slug, publishedAt, excerpt,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  body[] {
    ...,
    _type == "image" => {
      asset->{ _id, url, metadata { lqip, dimensions } },
      alt, alignment, size, hotspot, crop
    }
  },
  seo
}`;

export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug][0] {
  title, slug,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  body[] {
    ...,
    _type == "image" => { asset->{ _id, url, metadata { lqip, dimensions } }, alt, alignment, size, hotspot, crop }
  },
  seo
}`;

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  title, slug,
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  body[] {
    ...,
    _type == "image" => { asset->{ _id, url, metadata { lqip, dimensions } }, alt, alignment, size, hotspot, crop }
  },
  seo
}`;

export const legalPageBySlugQuery = groq`*[_type == "legalPage" && slug.current == $slug][0] {
  title, slug, body, _updatedAt, seo
}`;

export const allSlugsForSitemapQuery = groq`{
  "blogPosts": *[_type == "blogPost" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "services": *[_type == "service" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "projects": *[_type == "project" && defined(slug.current)] { "slug": slug.current, _updatedAt },
  "legalPages": *[_type == "legalPage" && defined(slug.current)] { "slug": slug.current, _updatedAt }
}`;

export const defaultSeoQuery = groq`*[_type == "siteSettings"][0] {
  "title": defaultSeo.metaTitle,
  "description": defaultSeo.metaDescription,
  "ogImage": defaultOgImage,
  siteName
}`;
```

---

## ADIM 6 — SEO Altyapısı

### 6.1 `src/lib/seo.ts`

```typescript
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { defaultSeoQuery } from "@/sanity/lib/queries";
import { urlForImage } from "@/sanity/lib/image";

type PageSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: any;
  canonicalUrl?: string;
  noIndex?: boolean;
};

type BuildMetadataParams = {
  title?: string;
  description?: string;
  ogImage?: any;
  canonicalPath?: string;
  noIndex?: boolean;
  pageSeo?: PageSeo;
};

export async function buildMetadata(params: BuildMetadataParams = {}): Promise<Metadata> {
  const defaults = await client.fetch(defaultSeoQuery, {}, { next: { tags: ["layout"] } });

  const title = params.pageSeo?.metaTitle || params.title || defaults?.title || defaults?.siteName;
  const description = params.pageSeo?.metaDescription || params.description || defaults?.description;
  const ogImageSource = params.pageSeo?.ogImage || params.ogImage || defaults?.ogImage;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const canonicalUrl = params.pageSeo?.canonicalUrl ||
    (params.canonicalPath ? `${siteUrl}${params.canonicalPath}` : undefined);
  const noIndex = params.pageSeo?.noIndex || params.noIndex || false;

  const ogImageUrl = ogImageSource
    ? urlForImage(ogImageSource)?.width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    robots: noIndex ? "noindex, nofollow" : "index, follow",
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
    openGraph: {
      title: title || "",
      description: description || "",
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title || "",
      description: description || "",
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  };
}
```

### 6.2 `src/components/seo/JsonLd.tsx`

```typescript
export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(settings: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.siteName,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    ...(settings?.contactInfo?.phone && { telephone: settings.contactInfo.phone }),
    ...(settings?.contactInfo?.email && { email: settings.contactInfo.email }),
    ...(settings?.contactInfo?.address && {
      address: { "@type": "PostalAddress", streetAddress: settings.contactInfo.address },
    }),
    sameAs: settings?.socialLinks?.map((s: any) => s.url).filter(Boolean) || [],
  };
}

export function articleJsonLd(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post?.title,
    datePublished: post?.publishedAt,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post?.slug?.current}`,
  };
}
```

---

## ADIM 7 — Core UI Componentleri

### 7.1 `src/components/ui/SanityImage.tsx`

```typescript
import Image from "next/image";
import { urlForImage, getImageLqip } from "@/sanity/lib/image";

type SanityImageProps = {
  image: {
    asset: any;
    alt: string;
    hotspot?: { x: number; y: number };
    crop?: { top: number; bottom: number; left: number; right: number };
  };
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export function SanityImage({
  image,
  width = 800,
  height = 600,
  fill = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className,
  priority = false,
}: SanityImageProps) {
  if (!image?.asset) return null;

  const imageUrl = urlForImage(image)?.auto("format").fit("crop").url();
  const blurDataURL = getImageLqip(image);
  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : "center";

  if (!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={image.alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      style={{ objectPosition }}
      placeholder={blurDataURL ? "blur" : "empty"}
      blurDataURL={blurDataURL}
    />
  );
}
```

### 7.2 `src/components/ui/RichText.tsx`

```typescript
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage, getImageLqip } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const imageUrl = urlForImage(value)?.auto("format").url();
      const blurDataURL = getImageLqip(value);

      const sizeClass =
        value.size === "half" ? "max-w-md" :
        value.size === "large" ? "max-w-2xl" : "w-full";
      const alignClass =
        value.alignment === "left" ? "mr-auto" :
        value.alignment === "right" ? "ml-auto" : "mx-auto";

      return (
        <figure className={`my-8 ${sizeClass} ${alignClass}`}>
          <Image
            src={imageUrl || ""}
            alt={value.alt || ""}
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg"
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const isInternal = value?.href?.startsWith("/");
      return isInternal ? (
        <Link href={value.href} className="underline underline-offset-4 hover:text-primary">
          {children}
        </Link>
      ) : (
        <a href={value.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value, className = "" }: { value: any[]; className?: string }) {
  if (!value) return null;
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
```

### 7.3 `src/components/ui/FadeIn.tsx`

```typescript
"use client";

import { motion, Variants } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  className?: string;
};

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 20,
  className,
}: FadeInProps) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  const variants: Variants = {
    hidden: { opacity: 0, ...directionMap[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration, delay, ease: "easeOut" }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### 7.4 `src/components/ui/AnimateGroup.tsx`

```typescript
"use client";

import { motion } from "framer-motion";

type AnimateGroupProps = {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
};

export function AnimateGroup({ children, stagger = 0.1, delay = 0, className }: AnimateGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

// AnimateGroup içindeki her child bunu kullanır
export const fadeUpItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};
```

---

## ADIM 8 — Global Layout

### 8.1 `src/app/layout.tsx` (Root)

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | Site Adı", default: "Site Adı" },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 8.2 `src/app/(site)/layout.tsx`

```typescript
import { client } from "@/sanity/lib/client";
import { layoutQuery } from "@/sanity/lib/queries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd, organizationJsonLd } from "@/components/seo/JsonLd";
import { draftMode } from "next/headers";
import Link from "next/link";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const data = await client.fetch(layoutQuery, {}, { next: { tags: ["layout"] } });
  const isDraft = draftMode().isEnabled;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {isDraft && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-400 text-yellow-900 text-center text-sm py-2 font-medium">
          Önizleme modu aktif.{" "}
          <Link href="/api/draft/disable" className="underline font-bold">
            Çıkmak için tıkla
          </Link>
        </div>
      )}
      <JsonLd data={organizationJsonLd(data?.settings)} />
      <Header settings={data?.settings} navigation={data?.navigation} />
      <main>{children}</main>
      <Footer settings={data?.settings} navigation={data?.navigation} />
      {data?.settings?.contactInfo?.whatsappNumber && (
        <WhatsAppButton number={data.settings.contactInfo.whatsappNumber} />
      )}
    </ThemeProvider>
  );
}
```

### 8.3 `src/components/layout/ThemeProvider.tsx`

```typescript
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### 8.4 `src/components/layout/Header.tsx`

```typescript
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";

type NavItem = {
  label: string;
  linkType: "internal" | "external";
  internalSlug?: string;
  externalUrl?: string;
  openInNewTab?: boolean;
};

function resolveHref(item: NavItem): string {
  if (item.linkType === "external") return item.externalUrl || "#";
  return item.internalSlug === "home" || !item.internalSlug ? "/" : `/${item.internalSlug}`;
}

export function Header({ settings, navigation }: { settings: any; navigation: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links: NavItem[] = navigation?.headerLinks || [];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          {settings?.logo ? (
            <>
              <SanityImage image={settings.logo} width={120} height={40} className="h-10 w-auto object-contain dark:hidden" />
              {settings?.logoDark
                ? <SanityImage image={settings.logoDark} width={120} height={40} className="h-10 w-auto object-contain hidden dark:block" />
                : <SanityImage image={settings.logo} width={120} height={40} className="h-10 w-auto object-contain hidden dark:block" />
              }
            </>
          ) : (
            <span className="font-bold text-lg">{settings?.siteName}</span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((item, i) => (
            <Link key={i} href={resolveHref(item)} target={item.openInNewTab ? "_blank" : undefined} rel={item.openInNewTab ? "noopener noreferrer" : undefined} className="text-sm font-medium transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <RiCloseLine size={20} /> : <RiMenu3Line size={20} />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t md:hidden">
            <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
              {links.map((item, i) => (
                <Link key={i} href={resolveHref(item)} onClick={() => setMenuOpen(false)} className="text-sm font-medium transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

### 8.5 `src/components/layout/ThemeToggle.tsx`

```typescript
"use client";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { RiSunLine, RiMoonLine } from "react-icons/ri";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      <RiSunLine className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <RiMoonLine className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Tema değiştir</span>
    </Button>
  );
}
```

### 8.6 `src/components/layout/Footer.tsx`

`siteSettings.socialLinks`'teki her platform için `react-icons/fa` ve `react-icons/fa6`'dan ilgili ikonu render et. URL boş olan platformları gösterme. `siteSettings.contactInfo` verilerini (telefon, mail, adres) ve `navigation.footerLinks`'i göster.

Platform → ikon eşleştirmesi:
- instagram → `FaInstagram`
- facebook → `FaFacebook`
- twitter → `FaXTwitter` (react-icons/fa6)
- linkedin → `FaLinkedin`
- youtube → `FaYoutube`
- tiktok → `FaTiktok`
- pinterest → `FaPinterest`
- whatsapp → `FaWhatsapp`

### 8.7 `src/components/layout/WhatsAppButton.tsx`

```typescript
"use client";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

export function WhatsAppButton({ number }: { number: string }) {
  const cleanNumber = number.replace(/\D/g, "");
  return (
    <motion.a
      href={`https://wa.me/${cleanNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile iletişime geç"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute h-full w-full rounded-full bg-green-500 opacity-75"
        animate={{ scale: [1, 1.4, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <FaWhatsapp size={28} className="relative z-10" />
    </motion.a>
  );
}
```

---

## ADIM 9 — API Route'ları

### 9.1 `src/app/api/revalidate/route.ts`

```typescript
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");
  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { _type } = body;

    const tagMap: Record<string, string[]> = {
      siteSettings: ["layout"],
      navigation: ["layout"],
      homePage: ["home"],
      aboutPage: ["about"],
      contactPage: ["contact"],
      blogPost: ["blog"],
      service: ["services"],
      project: ["projects"],
      legalPage: ["legal"],
    };

    const tags = tagMap[_type] || ["all"];
    tags.forEach(revalidateTag);

    return NextResponse.json({ revalidated: true, tags, now: Date.now() });
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
}
```

### 9.2 `src/app/api/draft/enable/route.ts`

```typescript
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/";

  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return new Response("Invalid secret", { status: 401 });
  }

  draftMode().enable();
  redirect(redirectTo);
}
```

### 9.3 `src/app/api/draft/disable/route.ts`

```typescript
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  draftMode().disable();
  redirect("/");
}
```

### 9.4 `src/app/api/contact/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";

const schema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
  honeypot: z.string().max(0),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: result.error.flatten().fieldErrors }, { status: 400 });
  }

  const { name, email, phone, subject, message } = result.data;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    await transporter.sendMail({
      from: `"Site İletişim Formu" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_FORM_TO,
      subject: `Yeni Mesaj: ${subject || name}`,
      html: `
        <h2>Yeni Form Mesajı</h2>
        <p><strong>İsim:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
        ${subject ? `<p><strong>Konu:</strong> ${subject}</p>` : ""}
        <p><strong>Mesaj:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    await transporter.sendMail({
      from: `<${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mesajınız alındı",
      html: `<p>Sayın ${name},</p><p>Mesajınız başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.</p>`,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Mail gönderilemedi" }, { status: 500 });
  }
}
```

---

## ADIM 10 — Sayfalar

### 10.1 `src/app/(site)/page.tsx`

`homePageQuery` ile veri çek. `buildMetadata()` ile `generateMetadata` export et. `draftMode()` ile preview client seç. Hero section'ı `FadeIn` ile render et.

### 10.2 `src/app/(site)/blog/page.tsx`

`blogListQuery` ile çek. `generateMetadata` ekle. Blog kartlarını `AnimateGroup` + `fadeUpItem` ile render et.

### 10.3 `src/app/(site)/blog/[slug]/page.tsx`

`blogPostBySlugQuery` ile çek. `generateStaticParams` ekle. `generateMetadata` ile SEO. `RichText` ile body. `articleJsonLd` ile JSON-LD.

### 10.4 `src/app/(site)/iletisim/page.tsx`

`contactPageQuery` ile sayfa metinlerini çek. `ContactForm` client component'ini import et.

### 10.5 `src/components/forms/ContactForm.tsx`

`"use client"`. React hook form + Zod. `honeypot` gizli input (gözle görünmez, CSS ile gizli, name="website"). Submit state'leri: idle / loading / success / error. Başarıda `successMessage` prop'unu göster.

### 10.6 `src/app/(site)/yasal/[slug]/page.tsx`

`legalPageBySlugQuery` ile çek. `generateStaticParams` ile statik generate. `RichText` ile body. `generateMetadata` ile SEO.

### 10.7 Hizmet ve Proje sayfaları

`src/app/(site)/hizmetler/[slug]/page.tsx` ve `src/app/(site)/projeler/[slug]/page.tsx` — yukarıdaki yapıyla aynı, kendi query'lerini kullanır.

---

## ADIM 11 — Bot Dosyaları

### 11.1 `src/app/sitemap.ts`

```typescript
import { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { allSlugsForSitemapQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const data = await client.fetch(allSlugsForSitemapQuery);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/iletisim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  ];

  const dynamicRoutes = [
    ...(data?.blogPosts?.map((p: any) => ({ url: `${base}/blog/${p.slug}`, lastModified: new Date(p._updatedAt), changeFrequency: "monthly" as const, priority: 0.7 })) || []),
    ...(data?.services?.map((p: any) => ({ url: `${base}/hizmetler/${p.slug}`, lastModified: new Date(p._updatedAt), changeFrequency: "monthly" as const, priority: 0.8 })) || []),
    ...(data?.projects?.map((p: any) => ({ url: `${base}/projeler/${p.slug}`, lastModified: new Date(p._updatedAt), changeFrequency: "monthly" as const, priority: 0.7 })) || []),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
```

### 11.2 `src/app/robots.ts`

```typescript
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio/", "/api/"] },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

---

## ADIM 12 — Yardımcı Sayfalar

### 12.1 `src/app/not-found.tsx`

```typescript
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center px-4">
      <p className="text-8xl font-bold text-muted-foreground/20">404</p>
      <h1 className="text-2xl font-bold">Sayfa Bulunamadı</h1>
      <p className="text-muted-foreground max-w-md">
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <Button asChild>
        <Link href="/">Ana Sayfaya Dön</Link>
      </Button>
    </div>
  );
}
```

### 12.2 `src/app/studio/[[...tool]]/page.tsx`

```typescript
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-dynamic";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

---

## ADIM 13 — Konfigürasyon

### 13.1 `tailwind.config.ts`

`@tailwindcss/typography` plugin'ini ekle. shadcn/ui'ın oluşturduğu CSS değişkenlerini koru.

### 13.2 `src/lib/utils.ts`

shadcn/ui kurulumundan gelen `cn()` helper'ı burada olacak. Buna ek:

```typescript
export function formatDate(dateString: string, locale = "tr-TR"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric", month: "long", day: "numeric",
  });
}
```

---

## ADIM 14 — Dokümantasyon

### 14.1 `README.md`

Şu bölümleri içersin:

1. **Hızlı Başlangıç** — Klonla, `npm install`, `.env.local` doldur, `npm run dev`
2. **Zorunlu Kurulum Adımları** — Sanity project oluştur, API token al, webhook kur
3. **Yeni Projede Yapılacaklar Checklist'i**:
   - [ ] `package.json` içinde proje adını güncelle
   - [ ] `.env.local` içindeki tüm `PLACEHOLDER` değerlerini gerçek değerlerle değiştir
   - [ ] `tailwind.config.ts` içinden marka renklerini güncelle
   - [ ] `public/` klasörüne logo koy
   - [ ] `src/app/layout.tsx` içindeki font ve `"Site Adı"` metnini güncelle
   - [ ] Sanity Studio'yu aç (`/studio`), `siteSettings` ve `navigation` dokümanlarını doldur
   - [ ] Vercel'e deploy et, env değişkenlerini ekle
   - [ ] Sanity Dashboard > API > Webhooks: `https://siteadi.com/api/revalidate` adresini ekle, `x-webhook-secret` header'ını ayarla

### 14.2 `DEVELOPER.md`

Şu bölümleri içersin:

1. **Yeni Koleksiyon Ekleme** — Şema → `index.ts` → `structure.ts` → `queries.ts` → sayfa adımları
2. **Yeni Singleton Sayfa Ekleme** — Şema → `index.ts` → `structure.ts` → `singletonPlugin` listesi → route → query
3. **Revalidation Tag Referansı** — Her tag'in hangi şemayı ve sayfayı kapsadığı tablosu
4. **Draft Mode Kullanımı** — `/api/draft/enable?secret=SECRET&redirect=/` URL'ini tarayıcıda aç, sarı banner görünür, `/api/draft/disable` ile kapat
5. **Component Kullanım Örnekleri** — `SanityImage`, `RichText`, `FadeIn`, `AnimateGroup` + `fadeUpItem`

---

## ÖNEMLİ KURALLAR

1. **Tag zorunlu**: Her `fetch` çağrısında `next: { tags: [...] }` olmalı. Tag'siz fetch revalidation çalışmaz.
2. **LQIP zorunlu**: Tüm Sanity image sorgularında `asset->{ _id, url, metadata { lqip, dimensions } }` çekilmeli. Aksi halde blur placeholder çalışmaz.
3. **`console.log` yasak**: Geliştirme log'larını `if (process.env.NODE_ENV === "development")` ile koru.
4. **Singleton ID eşleşmesi**: Singleton şemaların `documentId` değeri şema `name`'i ile aynı olmalı.
5. **`.env.local` takip edilmeli**: Hassas veri içermiyor, sadece placeholder. `.gitignore`'dan çıkarılmış halde tut.
