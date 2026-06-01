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
| `blogPage` | `blogPage` | `/blog` (Hero, SEO, CTA) |
| `servicesPage` | `servicesPage` | `/hizmetler` (Hero, SEO, CTA) |
| `projectsPage` | `projectsPage` | `/projeler` (Hero, SEO, CTA) |
| `blog` | `blogPost` | `/[slug]` (Blog detay) ve `/blog` (Liste fallback'i) |
| `services` | `service` | `/hizmetler/[slug]` ve `/hizmetler` (Liste fallback'i) |
| `projects` | `project` | `/projeler/[slug]` ve `/projeler` (Liste fallback'i) |

Webhook'ta `_type` alanı gönderilir, `tagMap` üzerinden ilgili tag bulunur ve `revalidateTag()` çalıştırılır.

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

`prose prose-lg` sınıfları otomatik uygulanır. İnline görseller `alignment` ve `size` alanlarına göre yerleşir.

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

### `LightboxGallery` (Dinamik Yükleme / Performance Best Practice)

Ağır etkileşimli modallerin (örn. Lightbox) ilk sayfa yükleme boyutunu (bundle size) şişirmemesi için **her zaman dinamik import (`next/dynamic`)** yöntemiyle çağrılması önerilir:

```tsx
import dynamic from "next/dynamic";

// Lightbox bileşenini yalnızca istemci tarafında ve gerektiğinde (Lazy load) yükler
const LightboxGallery = dynamic(
  () => import("@/components/ui/Lightbox").then((mod) => mod.LightboxGallery),
  { ssr: false }
);

export default function GalleryPage({ images }) {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Fotoğraf Galerisi</h1>
      <LightboxGallery images={images} />
    </div>
  );
}
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

### `JsonLd` & Yapılandırılmış Veriler (Structured Data)

Boilerplate üzerinde yer alan tüm şemalar dinamik olarak üretilir. `src/components/seo/JsonLd.tsx` altında toplanmış olan fonksiyonlar ile yapılandırılmış veriler enjekte edilebilir:

```typescript
import { 
  JsonLd, 
  organizationJsonLd, 
  websiteJsonLd, 
  articleJsonLd, 
  faqPageJsonLd, 
  breadcrumbListJsonLd,
  serviceJsonLd,
  projectJsonLd
} from "@/components/seo/JsonLd";

// 1. Organizasyon ve Site Tanımlama (Root Layout'ta Otomatik)
<JsonLd data={organizationJsonLd(settings)} />
<JsonLd data={websiteJsonLd(settings)} />

// 2. Blog Detay Sayfasında (Otomatik)
<JsonLd data={articleJsonLd(post)} />

// 3. Ekmek Kırıntıları Şeması (Breadcrumbs bileşeninde Otomatik)
<JsonLd data={breadcrumbListJsonLd(breadcrumbs)} />

// 4. Sıkça Sorulan Sorular Şeması (FAQ bileşeninde Otomatik)
<JsonLd data={faqPageJsonLd(faqItems)} />

// 5. Hizmetler & Projeler Detay Sayfasında (Otomatik)
<JsonLd data={serviceJsonLd(service)} />
<JsonLd data={projectJsonLd(project)} />
```

### SEO Uyumlu FAQ Accordion
Arama motorlarının Sıkça Sorulan Sorular cevaplarını okuyabilmesi için, answers block'ları DOM'dan kaldırılmamalıdır. Bileşen içerisinde `framer-motion` height animasyonları conditionally render (`activeIndex === index && ...`) yerine CSS height state geçişi ile yönetilir. Bu sayede tüm soru-cevap çiftleri server-side pre-rendered olarak kaynak HTML koduna basılır ve Google indeksine tam dahil edilir.


---

## 6. Ortam Değişkenleri Referansı

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | Sanity proje ID |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | Genellikle `production` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical URL base, sitemap, OG |
| `SANITY_WEBHOOK_SECRET` | ✅ | ISR revalidation güvenliği |
| `SMTP_HOST` | ✅ | Mail sunucusu (örn: `smtp.gmail.com`) |
| `SMTP_PORT` | ✅ | Mail port (Gmail: `587`) |
| `SMTP_USER` | ✅ | SMTP kullanıcı e-postası |
| `SMTP_PASS` | ✅ | SMTP şifre/uygulama şifresi |
| `CONTACT_FORM_TO` | ✅ | Form bildirimlerinin gideceği e-posta |

---

## 7. Tip Güvenliği & Ortak Modeller (TypeScript)

Projedeki tüm Sanity veri modelleri ve bileşen parametreleri, tip güvenliği (type safety) ve IDE otomatik tamamlama (autocomplete) desteği sunmak amacıyla `src/types/index.ts` altında toplanmıştır.

### Önemli Modeller:
*   `SanityImage`: Sanity görsel alanları için (alt, asset, hotspot, crop)
*   `BlogPost`: Blog gönderileri için
*   `BlogCategory`: Blog kategorileri için
*   `SiteSettings`: Global site ayarları için
*   `Navigation` / `NavItem`: Menü ve navigasyon yapıları için

### Kod İçinde Kullanımı:
```typescript
import { BlogPost, SiteSettings } from "@/types";

export function CustomComponent({ post, settings }: { post: BlogPost; settings: SiteSettings }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{settings.siteName}</p>
    </div>
  );
}
```
