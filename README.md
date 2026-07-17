# Next.js + Sanity Kurumsal Site Boilerplate

Modern ajanslar için hazır, production-grade Next.js 15 + Sanity v3 boilerplate.

## Tech Stack

| Teknoloji | Versiyon | Açıklama |
|-----------|----------|----------|
| Next.js | 15+ | App Router, TypeScript |
| Tailwind CSS | v4 | `@plugin` tabanlı konfigürasyon |
| shadcn/ui | v4 | `@base-ui/react` tabanlı |
| Sanity | v3 | Headless CMS |
| Framer Motion | latest | Animasyonlar |
| react-icons | latest | SVG ikon kütüphanesi |
| Nodemailer | latest | İletişim formu e-postası |
| Zod + @t3-oss/env-nextjs | latest | Type-safe env validasyonu |

---

## Hızlı Başlangıç

```bash
# 1. Repoyu klonla
git clone https://github.com/kullanici/proje-adi.git
cd proje-adi

# 2. Bağımlılıkları yükle
npm install

# 3. .env.local içindeki placeholder değerleri gerçek değerlerle doldur
# (Aşağıdaki "Zorunlu Kurulum Adımları" bölümüne bak)

# 4. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda:
- Site: `http://localhost:3000`
- Sanity Studio: `http://localhost:3000/studio`

---

## Zorunlu Kurulum Adımları

### 1. Sanity Projesi Oluştur

1. [sanity.io/manage](https://sanity.io/manage) adresine git
2. "New Project" → proje adını gir
3. Proje ID'yi kopyala → `.env.local` içinde `NEXT_PUBLIC_SANITY_PROJECT_ID` değerini güncelle

### 2. Sanity API Token Al

1. Sanity Dashboard → proje → **API** sekmesi
2. **Tokens** → **Add API Token**
3. İsim: `Read Token`, Yetki: **Editor**
4. Token'ı kopyala → `.env.local` içinde `SANITY_API_READ_TOKEN` değerini güncelle

### 3. Sanity Webhook Kur (ISR için)

1. Sanity Dashboard → proje → **API** → **Webhooks**
2. **Add Webhook**:
   - URL: `https://siteadi.com/api/revalidate`
   - HTTP Method: `POST`
   - Trigger on: **Create, Update, Delete**
   - Drafts ve versions: **Kapalı**
   - Secret: Sanity Dashboard'daki Secret alanına `.env.local`'daki `SANITY_WEBHOOK_SECRET` değerini girin. (Header olarak değil, direkt dashboard'daki Secret kutusuna)
3. **Filter** alanına aşağıdaki GROQ filtresini ekleyin:

```groq
_type in [
  "siteSettings",
  "navigation",
  "homePage",
  "aboutPage",
  "contactPage",
  "blogPage",
  "servicesPage",
  "projectsPage",
  "blogPost",
  "blogCategory",
  "service",
  "project",
  "faq"
]
```

4. **Projection** alanına aşağıdaki payload sözleşmesini ekleyin:

```groq
{
  "_id": coalesce(after()._id, before()._id),
  "_type": coalesce(after()._type, before()._type),
  "operation": delta::operation(),
  "slug": after().slug.current,
  "previousSlug": before().slug.current,
  "categoryId": after().category._ref,
  "previousCategoryId": before().category._ref,
  "slugChanged": select(
    delta::operation() == "update" => delta::changedAny(slug.current),
    false
  ),
  "noIndexChanged": select(
    delta::operation() == "update" => delta::changedAny(seo.noIndex),
    false
  ),
  "affectsList": select(
    delta::operation() != "update" => true,
    _type == "blogPost" => delta::changedAny((title, slug.current, excerpt, publishedAt, category, mainImage, seo.noIndex)),
    _type == "service" => delta::changedAny((title, slug.current, mainImage, seo.noIndex)),
    _type == "project" => delta::changedAny((title, slug.current, mainImage, seo.noIndex)),
    false
  )
}
```

Bu projection zorunludur. Delete olayında eski slug'ı, slug değişikliğinde hem eski hem yeni slug'ı endpoint'e taşır. Sitemap yalnızca create/delete, slug veya `noIndex` değişikliklerinde invalidate edilir.

5. `.env.local` içinde `SANITY_WEBHOOK_SECRET` değerini güncelleyin. Uygulama `@sanity/webhook` paketi ile imzayı otomatik doğrular.

### 4. Gmail SMTP Kurulumu (İletişim Formu)

1. Google Hesabı → **Güvenlik** → **2 Adımlı Doğrulama** → etkinleştir
2. **Uygulama Şifreleri** → Uygulama: Mail → Şifreyi kopyala
3. `.env.local` içinde `SMTP_USER` ve `SMTP_PASS` değerlerini güncelle

---

## Yeni Projede Yapılacaklar Checklist

- [ ] `package.json` içinde `"name"` alanını güncelle
- [ ] `.env.local` içindeki tüm `your-*` placeholder değerlerini gerçek değerlerle değiştir
- [ ] `src/app/layout.tsx` içindeki `"Site Adı"` metnini güncelle
- [ ] `src/app/globals.css` içindeki `:root` bloğundan marka renklerini güncelle
- [ ] Sanity Studio'yu aç (`/studio`), **Site Ayarları** (Logo, Favicon) ve **Navigasyon** dokümanlarını doldur
- [ ] Vercel'e deploy et, tüm `.env.local` env değişkenlerini Vercel paneline ekle
- [ ] Sanity Dashboard → Webhooks: `https://siteadi.com/api/revalidate` ekle

---

## Proje Yapısı

```
src/
├── app/
│   ├── (site)/           # Kullanıcıya görünen tüm sayfalar
│   │   ├── blog/[slug]/  # Dinamik blog detay sayfaları
│   │   ├── page.tsx      # Ana sayfa
│   │   ├── blog/         # Blog listesi hub sayfası
│   │   ├── hizmetler/    # Hizmet hub ve [slug] detay sayfaları
│   │   ├── projeler/     # Proje hub ve [slug] detay sayfaları
│   │   ├── iletisim/     # İletişim sayfası
│   ├── api/              # API route'ları
│   │   ├── revalidate/   # ISR webhook
│   │   └── contact/      # İletişim formu
│   ├── studio/           # Sanity Studio (embedded)
│   ├── layout.tsx        # Root layout
│   ├── not-found.tsx     # 404 sayfası
│   ├── sitemap.ts        # Dinamik sitemap
│   └── robots.ts         # robots.txt
├── components/
│   ├── forms/            # ContactForm
│   ├── layout/           # Header, Footer, vb.
│   ├── seo/              # JsonLd
│   └── ui/               # SanityImage, RichText, FAQ, Breadcrumbs, FadeIn
├── lib/
│   ├── env.ts            # Type-safe env validasyonu
│   ├── seo.ts            # buildMetadata()
│   └── utils.ts          # cn(), getSiteUrl(), formatDate()
└── sanity/
    ├── lib/              # client.ts, image.ts, queries.ts
    ├── plugins/          # singletonPlugin
    ├── schemaTypes/      # Tüm Sanity şemaları
    └── structure.ts      # Studio sol panel yapısı
```

---

## SEO & Yapılandırılmış Veri (Structured Data) Yapılandırması

Bu boilerplate, Google ve diğer arama motorları için en yüksek standartlarda SEO otomasyonuna sahiptir.

### 1. Domain ve Canonical URL Kurulumu (`NEXT_PUBLIC_SITE_URL`)
*   `.env.local` dosyasındaki `NEXT_PUBLIC_SITE_URL` değişkeni, arama motorlarının canonical (özgün) etiketlerini, sitemap girdilerini ve OpenGraph görsel yollarını oluşturmak için kullanılır.
*   **Edge-case Koruması:** `getSiteUrl()` fonksiyonu, girilen URL'nin başında `https://` protokolü olmasa bile bunu otomatik algılar, sonundaki `/` işaretlerini temizler ve güvenli şekilde derler.

### 2. Otomatik Yapılandırılmış Veriler (JSON-LD)
Aşağıdaki zengin arama sonuçları şemaları kod yazmaya gerek kalmadan tamamen otomatik olarak yönetilir:
*   **Site-wide Organization & WebSite:** Root Layout'ta `siteSettings`'ten gelen logo, iletişim ve sosyal ağ verileriyle otomatik oluşturulur.
*   **Ekmek Kırıntıları (Breadcrumbs):** İç sayfalarda `<Breadcrumbs>` bileşeni çağrıldığı anda dinamik URL hiyerarşisi üzerinden `BreadcrumbList` şemasını oluşturup sayfaya enjekte eder.
*   **Taranabilir Sıkça Sorulan Sorular (FAQ):** `<FAQ>` bileşeni kullanıldığında, arama botlarının kapalı cevapları da %100 okuyabilmesi için answers DOM'da saklanır ve `FAQPage` şeması dinamik olarak sayfaya basılır.
*   **Blog Yazıları:** `blog/[slug]/page.tsx` rotasında dinamik `Article` şeması otomatik olarak basılır.
*   **Hizmet & Projeler:** İlgili detay sayfalarında `Service` ve `CreativeWork` şemaları otomatik olarak yer alır.

