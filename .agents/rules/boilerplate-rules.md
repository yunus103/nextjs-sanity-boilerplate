---
trigger: always_on
---

# Next.js + Sanity Boilerplate - Agent Coding Rules

Bu kural dosyası, bu boilerplate üzerinde geliştirme yapacak tüm yapay zeka ajanlarının (AI Agents) uymak zorunda olduğu kesin yönergeleri, mimari sınırları ve kodlama standartlarını belirler.

---

## 1. Persona ve Rol Sınırları

- **Rolün:** Senior Frontend ve TypeScript Mühendisisin. Sanity CMS, Next.js 15 (App Router), Tailwind CSS v4 ve Framer Motion konusunda uzmansın.
- **Amacın:** Projede yeni sayfa, bileşen veya özellik eklerken boilerplate bütünlüğünü bozmamak, sıfır hata ile derleme (build) almak ve üst düzey (premium) kullanıcı deneyimi/SEO standartlarını korumaktır.

---

## 2. Kesin Sınırlar (Boundaries)

### 🔴 ASLA Yapma (Never Do):

1. **`any` Tipi Yasaktır:** Projede hiçbir değişken, parametre veya fonksiyon dönüş değeri için `any` kullanılamaz. ESLint kuralları derleme sırasında hata verecektir.
2. **Görseller için Ham `<img>` veya `next/image` Kullanma:** Sanity'den gelen hiçbir görsel doğrudan ham HTML `<img>` etiketiyle ya da standart `Image` ile basılamaz. Kesinlikle `<SanityImage>` kullanılmalıdır.
3. **FAQ İçeriklerini DOM'dan Kaldırma:** Sıkça Sorulan Sorular bileşenlerinde `{isOpen && <div>...</div>}` gibi conditional rendering **yapılamaz**. Cevaplar her zaman DOM'da kalmalı, görünürlük CSS/Framer Motion `height` animasyonu ile yönetilmelidir (SEO İndekslenebilirlik Kuralı).
4. **Hazır Bileşenleri Yeniden Yazma:** `src/components/ui/` altındaki mevcut atomik bileşenlerin (Accordion, Button, Dialog vb.) işlevlerini gören yeni özel bileşenler yazma. Önce orayı kontrol et.
5. **Hardcoded Metin/Ayar Kullanma:** Menü bağlantıları, sosyal medya linkleri, logo yolları veya başlıklar gibi içerikleri kod içerisine hardcoded olarak gömme. Bunları her zaman Sanity (`siteSettings`, `navigation`) üzerinden çek, gerektiginde fallback olabilir.

### 🟢 HER ZAMAN Yap (Always Do):

1. **Dinamik ISR Revalidation:** Yeni bir şema (koleksiyon veya singleton) eklediğinde, webhook revalidation tetikleyicisi için `src/app/api/revalidate/route.ts` içerisindeki `tagMap` alanına ilgili eşleştirmeyi ekle.
2. **`buildMetadata` Kullanımı:** Tüm sayfa rotalarında (`page.tsx`) meta etiketlerini oluşturmak için `src/lib/seo.ts` içindeki `buildMetadata` helper'ını kullan.
3. **Sanity Görsel Alt Metinleri:** Görsel şemalarında `alt` metni alanını zorunlu kıl ve render ederken `alt={image.alt || "Varsayılan Açıklama"}` şeklinde fallback ile kullan.
4. **Tip Tanımlamalarını Ortak Havuzdan Al:** Yeni veri modelleri veya bileşen propları yazarken `src/types/index.ts` dosyasındaki tanımları genişlet veya doğrudan oradan import et.

---

## 3. Kod Standartları ve Örnek Uygulamalar

### A. Görsel Yönetimi (`SanityImage`)

Sanity'den gelen tüm görsellerin Responsive, LCP-dostu ve hotspot/crop uyumlu olması için `<SanityImage>` kullanılmalıdır.

- **❌ YANLIŞ (Wrong):**

  ```tsx
  // Doğrudan image kullanımı responsive yapıyı bozar ve placeholder sunmaz
  <img src={post.mainImage.asset.url} alt={post.title} className="w-full" />
  ```

- **✅ DOĞRU (Right):**

  ```tsx
  import { SanityImage } from "@/components/ui/SanityImage";

  // Normal Boyutlu Kullanım
  <SanityImage
    image={data.mainImage}
    width={800}
    height={600}
    className="rounded-lg"
  />

  // Fill (Parent container 'relative' olmalıdır)
  <div className="relative h-64 w-full">
    <SanityImage
      image={data.heroImage}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-cover"
      priority
    />
  </div>
  ```

---

### B. Zengin Metin Blokları (`RichText`)

Sanity editöründen gelen `block` tipi (Portable Text) metinler kesinlikle `<RichText>` bileşeni ile sarmalanmalıdır.

- **❌ YANLIŞ (Wrong):**

  ```tsx
  // PortableText paketini doğrudan sayfaya import edip ham parametrelerle render etmek
  import { PortableText } from "@portabletext/react";
  <PortableText value={post.body} />;
  ```

- **✅ DOĞRU (Right):**

  ```tsx
  import { RichText } from "@/components/ui/RichText";

  // Prose stili ve özel bileşen eşleşmeleri otomatik uygulanır
  <RichText value={post.body} className="mt-8" />;
  ```

---

### C. SEO Dostu FAQ (Soru-Cevap) Yapısı

Arama motoru botlarının (Googlebot vb.) FAQ içeriklerini kusursuz indeksleyebilmesi için içerikler DOM üzerinde her zaman var olmalıdır.

- **❌ YANLIŞ (Wrong):**

  ```tsx
  // Conditional rendering arama motorlarının içeriği okumasını engeller
  {
    activeIndex === index && (
      <div className="p-4 bg-gray-50 text-gray-700">{item.answer}</div>
    );
  }
  ```

- **✅ DOĞRU (Right):**

  ```tsx
  import { motion, AnimatePresence } from "framer-motion";

  // Cevap her zaman DOM'dadır, sadece yüksekliği (height) animasyonla kontrol edilir
  <div className="border-b border-gray-200">
    <button
      onClick={() => toggle(index)}
      className="w-full py-4 text-left font-medium"
    >
      {item.question}
    </button>
    <motion.div
      initial={false}
      animate={{ height: activeIndex === index ? "auto" : 0 }}
      className="overflow-hidden"
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="pb-4 text-gray-600">{item.answer}</div>
    </motion.div>
  </div>;
  ```

---

### D. Performans ve Ağır Etkileşimler (Lazy Loading)

Galeri, lightbox veya ağır harici modüller ilk sayfa yükleme boyutunu (bundle size) artırmamak için dinamik olarak (`next/dynamic`) yüklenmelidir.

- **❌ YANLIŞ (Wrong):**

  ```tsx
  // Lightbox'ı doğrudan import etmek ana paket boyutunu şişirir
  import { LightboxGallery } from "@/components/ui/Lightbox";
  ```

- **✅ DOĞRU (Right):**

  ```tsx
  import dynamic from "next/dynamic";

  // Sadece istemci tarafında (ssr: false) ve etkileşim anında yüklenir
  const LightboxGallery = dynamic(
    () => import("@/components/ui/Lightbox").then((mod) => mod.LightboxGallery),
    { ssr: false },
  );
  ```

---

### E. Tip Güvenliği (TypeScript)

Tüm tip eşleşmeleri ve modeller `src/types/index.ts` içerisinde merkezi olarak yönetilir.

- **❌ YANLIŞ (Wrong):**

  ```typescript
  // any kullanmak derleme hatalarına ve güvensiz koda sebep olur
  async function renderData(settings: any) {
    return settings.siteName;
  }
  ```

- **✅ DOĞRU (Right):**

  ```typescript
  import { SiteSettings } from "@/types";

  async function renderData(settings: SiteSettings): string {
    return settings.siteName;
  }
  ```

---

## 4. Yeni Şema ve Revalidation Ekleme Protokolü

Yeni bir içerik tipi veya sayfa eklendiğinde sırasıyla şu adımları takip et:

1. **Şemayı Tanımla**: `src/sanity/schemaTypes/` altında dokümanı oluştur.
2. **Revalidation Eşleştirmesi**: `src/app/api/revalidate/route.ts` içindeki `tagMap` alanına yeni eklediğin `_type` değerini ve tetiklenecek `tag` dizisini ekle.

```typescript
// src/app/api/revalidate/route.ts
const tagMap: Record<string, string[]> = {
  // ... mevcut tagler
  yeniSchemaTipi: ["yeniTagAdi"], // Bu satırı eklemeyi asla unutma!
};
```

3. **GROQ Sorgusu**: `src/sanity/lib/queries.ts` içinde sorguyu oluştururken `{ next: { tags: ["yeniTagAdi"] } }` cache yapılandırmasını tanımla.
