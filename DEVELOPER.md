# Developer Kılavuzu

Bu belge, boilerplate üzerinde geliştirme yapacak developerlar için teknik referanstır.

---

## 1. Yeni Koleksiyon Ekleme

Örnek: **Referanslar** (`testimonial`) koleksiyonu eklemek

### Adım 1 — Şema Oluştur

```typescript
// src/sanity/schemaTypes/documents/testimonial.ts
import { defineField, defineType } from "sanity";

export const testimonialType = defineType({
  name: "testimonial",
  title: "Referans",
  type: "document",
  fields: [
    defineField({ name: "name", title: "İsim", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "company", title: "Şirket", type: "string" }),
    defineField({ name: "quote", title: "Alıntı", type: "text", rows: 4 }),
    defineField({ name: "avatar", title: "Fotoğraf", type: "image", options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt Metni" })] }),
  ],
});
```

### Adım 2 — `index.ts`'e Ekle

```typescript
// src/sanity/schemaTypes/index.ts
import { testimonialType } from "./documents/testimonial";
export const schemaTypes = [..., testimonialType];
```

### Adım 3 — `structure.ts`'e Ekle

```typescript
S.documentTypeListItem("testimonial").title("⭐ Referanslar"),
```

### Adım 4 — `queries.ts`'e Ekle

```typescript
export const testimonialsQuery = groq`*[_type == "testimonial"] {
  name, company, quote,
  avatar { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop }
}`;
```

### Adım 5 — Sayfada Kullan

```typescript
const testimonials = await client.fetch(testimonialsQuery, {}, { next: { tags: ["testimonials"] } });
```

### Adım 6 — Revalidation Tag'i Ekle

```typescript
// src/app/api/revalidate/route.ts
const tagMap = {
  ...
  testimonial: ["testimonials"],
};
```

---

## 2. Yeni Singleton Sayfa Ekleme

Örnek: **Hizmetler Ana Sayfası** (`servicesPage`) singleton eklemek

1. **Şema:** `src/sanity/schemaTypes/singletons/servicesPage.ts` oluştur
2. **index.ts:** `schemaTypes` dizisine ekle
3. **structure.ts:** "Sabit Sayfalar" grubuna ekle:
   ```typescript
   S.listItem().title("🛠 Hizmetler Sayfası").id("servicesPage").schemaType("servicesPage")
     .child(S.document().schemaType("servicesPage").documentId("servicesPage")),
   ```
4. **singletonPlugin:** `SINGLETONS` dizisine `"servicesPage"` ekle (`sanity.config.ts`)
5. **Sorgu:** `queries.ts`'e ekle — `next: { tags: ["services"] }` ile
6. **Route:** `src/app/(site)/hizmetler/page.tsx` oluştur
7. **Revalidation:** `tagMap`'e `servicesPage: ["services"]` ekle

> **Önemli:** Singleton `documentId` değeri şema `name`'i ile **birebir aynı** olmalı.

---

## 3. Revalidation Tag Referansı

| Cache Tag | Kapsayan Şema | Etkilenen Sayfalar |
|-----------|---------------|--------------------|
| `layout` | `siteSettings`, `navigation` | Tüm sayfalar (header, footer, favicon, siteName) |
| `faq` | `faq` | FAQ kullanılan sayfalar |
| `home` | `homePage` | `/` (Home Hero, SEO) |
| `about` | `aboutPage` | `/hakkimizda` |
| `contact` | `contactPage` | `/iletisim` |
| `blog` | `blogPost` | `/blog`, `/blog/[slug]` |
| `services` | `service` | `/hizmetler/[slug]` |
| `projects` | `project` | `/projeler/[slug]` |
| `legal` | `legalPage` | `/yasal/[slug]` |

Webhook'ta `_type` alanı gönderilir, `tagMap` üzerinden ilgili tag bulunur ve `revalidateTag()` çalıştırılır.

---

## 4. Draft Mode Kullanımı

### Aktifleştirme

Tarayıcıda şu URL'yi aç:

```
http://localhost:3000/api/draft/enable?secret=SANITY_PREVIEW_SECRET&redirect=/
```

- `.env.local`'daki `SANITY_PREVIEW_SECRET` değerini `secret` parametresine yaz
- `redirect` parametresi değiştirilerek direkt bir sayfaya yönlendirilebilir (örn: `/blog/ilk-yazi`)
- Aktif olduğunda sarı bir banner görünür

### Devre Dışı Bırakma

```
http://localhost:3000/api/draft/disable
```

### Kod İçinde Kullanım

```typescript
import { draftMode } from "next/headers";
import { getClient } from "@/sanity/lib/client";

const isDraft = (await draftMode()).isEnabled;
const data = await getClient(isDraft).fetch(query, params, { next: { tags: [...] } });
```

`getClient(true)` → `previewClient` (token'lı, `perspective: "previewDrafts"`)
`getClient(false)` → `client` (CDN'li, production)

---

## 5. Component Kullanım Örnekleri

### `SanityImage`

```tsx
import { SanityImage } from "@/components/ui/SanityImage";

// Normal boyutlu
<SanityImage image={data.mainImage} width={800} height={600} className="rounded-lg" />

// Fill modu (parent'ın relative olması gerekir)
<div className="relative h-64">
  <SanityImage image={data.heroImage} fill sizes="100vw" className="object-cover" priority />
</div>
```

### `Breadcrumbs`

```tsx
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

// Otomatik path-based
<Breadcrumbs />

// Özel liste ile
<Breadcrumbs items={[{ label: "Hizmetler", href: "/hizmetler" }, { label: "Web Tasarım", href: "/hizmetler/web-tasarim", active: true }]} />
```

### `Skeleton`

```tsx
import { Skeleton } from "@/components/ui/skeleton";

<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

### `FAQ`

```tsx
import { FAQ } from "@/components/ui/FAQ";

<FAQ items={faqData} />
```

### `RichText`
... (existing content)

```tsx
import { RichText } from "@/components/ui/RichText";

<RichText value={post.body} className="mt-8" />
```

`prose prose-lg dark:prose-invert` sınıfları otomatik uygulanır. İnline görseller `alignment` ve `size` alanlarına göre yerleşir.

### `FadeIn`

```tsx
import { FadeIn } from "@/components/ui/FadeIn";

// Yukarıdan aşağı, 0.3s gecikme
<FadeIn direction="up" delay={0.3} duration={0.6}>
  <h1>Başlık</h1>
</FadeIn>

// Yön yok, sadece opacity
<FadeIn direction="none">
  <p>İçerik</p>
</FadeIn>
```

### `AnimateGroup` + `fadeUpItem`

```tsx
import { AnimateGroup, fadeUpItem } from "@/components/ui/AnimateGroup";
import { motion } from "framer-motion";

<AnimateGroup className="grid grid-cols-3 gap-6" stagger={0.1} delay={0.2}>
  {items.map((item) => (
    <motion.div key={item._id} variants={fadeUpItem}>
      <CardComponent item={item} />
    </motion.div>
  ))}
</AnimateGroup>
```

### `buildMetadata`

```typescript
// Basit kullanım
export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({ title: "Sayfa Adı", canonicalPath: "/sayfa" });
}

// Sanity SEO alanı ile
export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(query, {}, { next: { tags: ["tag"] } });
  return buildMetadata({
    title: data?.title,
    canonicalPath: "/sayfa",
    pageSeo: data?.seo, // Sanity'deki seo objesi — öncelikli
  });
}
```

### `JsonLd`

```typescript
import { JsonLd, organizationJsonLd, articleJsonLd } from "@/components/seo/JsonLd";

// Layout'ta (organizasyon)
<JsonLd data={organizationJsonLd(settings)} />

// Blog detay sayfasında
<JsonLd data={articleJsonLd(post)} />

// Özel schema
<JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", ... }} />
```

---

## 6. Ortam Değişkenleri Referansı

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Sanity proje ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Genellikle `production` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical URL base, sitemap, OG |
| `SANITY_API_READ_TOKEN` | ✅ | Draft mode ve preview için |
| `SANITY_WEBHOOK_SECRET` | ✅ | ISR revalidation güvenliği |
| `SANITY_PREVIEW_SECRET` | ✅ | Draft mode URL güvenliği |
| `SMTP_HOST` | ✅ | Mail sunucusu (örn: `smtp.gmail.com`) |
| `SMTP_PORT` | ✅ | Mail port (Gmail: `587`) |
| `SMTP_USER` | ✅ | SMTP kullanıcı e-postası |
| `SMTP_PASS` | ✅ | SMTP şifre/uygulama şifresi |
| `CONTACT_FORM_TO` | ✅ | Form bildirimlerinin gideceği e-posta |
