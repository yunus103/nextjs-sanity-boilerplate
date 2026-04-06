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
| next-themes | latest | Dark/Light mod |
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
   - Secret: Sanity Dashboard'daki Secret alanına `.env.local`'daki `SANITY_WEBHOOK_SECRET` değerini girin. (Header olarak değil, direkt dashboard'daki Secret kutusuna)
3. `.env.local` içinde `SANITY_WEBHOOK_SECRET` değerini güncelleyin. Uygulama `@sanity/webhook` paketi ile imzayı otomatik doğrular.

### 4. Draft Mode Kurulumu

`SANITY_PREVIEW_SECRET` değerini rastgele bir şifre ile güncelle:

```bash
# Güvenli bir şifre üretmek için (opsiyonel)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Draft mode'u aktifleştirmek için: `/api/draft/enable?secret=SECRET&redirect=/`

### 5. Gmail SMTP Kurulumu (İletişim Formu)

1. Google Hesabı → **Güvenlik** → **2 Adımlı Doğrulama** → etkinleştir
2. **Uygulama Şifreleri** → Uygulama: Mail → Şifreyi kopyala
3. `.env.local` içinde `SMTP_USER` ve `SMTP_PASS` değerlerini güncelle

---

## Yeni Projede Yapılacaklar Checklist

- [ ] `package.json` içinde `"name"` alanını güncelle
- [ ] `.env.local` içindeki tüm `your-*` placeholder değerlerini gerçek değerlerle değiştir
- [ ] `src/app/layout.tsx` içindeki `"Site Adı"` metnini güncelle
- [ ] `src/app/globals.css` içindeki `:root` ve `.dark` bloklarından marka renklerini güncelle
- [ ] Sanity Studio'yu aç (`/studio`), **Site Ayarları** (Logo, Favicon) ve **Navigasyon** dokümanlarını doldur
- [ ] Vercel'e deploy et, tüm `.env.local` env değişkenlerini Vercel paneline ekle
- [ ] Sanity Dashboard → Webhooks: `https://siteadi.com/api/revalidate` ekle

---

## Proje Yapısı

```
src/
├── app/
│   ├── (site)/           # Kullanıcıya görünen tüm sayfalar
│   │   ├── page.tsx      # Ana sayfa
│   │   ├── blog/         # Blog listesi + detay
│   │   ├── hizmetler/    # Hizmet detay sayfaları
│   │   ├── projeler/     # Proje detay sayfaları
│   │   ├── iletisim/     # İletişim sayfası
│   │   └── yasal/        # Yasal sayfalar
│   ├── api/              # API route'ları
│   │   ├── revalidate/   # ISR webhook
│   │   ├── draft/        # Draft mode enable/disable
│   │   └── contact/      # İletişim formu
│   ├── studio/           # Sanity Studio (embedded)
│   ├── layout.tsx        # Root layout
│   ├── not-found.tsx     # 404 sayfası
│   ├── sitemap.ts        # Dinamik sitemap
│   └── robots.ts         # robots.txt
├── components/
│   ├── forms/            # ContactForm
│   ├── layout/           # Header, Footer, ThemeProvider, vb.
│   ├── seo/              # JsonLd
│   └── ui/               # SanityImage, RichText, FadeIn, AnimateGroup + shadcn
├── lib/
│   ├── env.ts            # Type-safe env validasyonu
│   ├── seo.ts            # buildMetadata()
│   └── utils.ts          # cn(), formatDate()
└── sanity/
    ├── lib/              # client.ts, image.ts, queries.ts
    ├── plugins/          # singletonPlugin
    ├── schemaTypes/      # Tüm Sanity şemaları
    └── structure.ts      # Studio sol panel yapısı
```
