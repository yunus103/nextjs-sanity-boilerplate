---
trigger: always_on
---

# Next.js + Sanity Boilerplate — Agent Rules

This repository is the boilerplate foundation. When maintaining the boilerplate, optimize for reuse and correct defaults. When working on a client project cloned from it, adapt and style freely for the client while preserving these core architecture rules.

## Stack & Routes
- Next.js 16 (App Router) · React 19 · Sanity v5 (Studio at `/studio`) · Tailwind CSS v4 · shadcn/ui on `@base-ui/react` · framer-motion · nodemailer.
- Code/comments/commits: English. UI strings/Sanity titles: Turkish.
- Routes: `/` · `/hakkimizda` · `/iletisim` · `/blog` · `/blog/[slug]` · `/hizmetler` · `/hizmetler/[slug]` · `/projeler` · `/projeler/[slug]` · `/studio`.
- Canonical URLs match these paths. Blog detail is always `/blog/[slug]`.

## Boundaries (Never)
1. **No `any`.** Use `PortableTextBlock[]` from `@portabletext/react`. No file-level `eslint-disable`.
2. **No raw `<img>` or bare `next/image` for Sanity.** Always `<SanityImage>`.
3. **Never remove `SanityImage`'s custom `loader`.** It queries Sanity CDN directly to bypass Vercel Image Optimization limits.
4. **Never unmount FAQ answers from DOM.** Animate height only (SEO/crawler indexability).
5. **Never delete unused `src/components/ui/` components.** They are intentional stock for future client projects (`Lightbox`, `Spinner`, `sheet`, etc.).
6. **No hardcoded content.** Text, links, CTA labels, and metadata must come from Sanity.
7. **Never import `PortableText` directly.** Always use `<RichText>`.
8. **No new dependencies or git commit/push** without explicit user approval.

## Core Conventions (Always)
- **Metadata:** Use `buildMetadata()` from `src/lib/seo.ts` in every `generateMetadata`. Pass `canonicalPath` and `pageSeo`.
- **Data Fetching:** Use `cachedFetch` from `src/sanity/lib/client.ts`. Pass cache tags at the page call site, not in `queries.ts`.
- **GROQ Images:** Always project images using the shared `${imageFields}` fragment in `queries.ts`.
- **Types:** Centralize in `src/types/index.ts`. Keep synchronized with Sanity schemas.
- **Slugs:** Always use `turkishSlugify` (`src/sanity/lib/slugify.ts`) for Sanity slug fields.
- **Section Headers:** Use `<SectionHeading title={...} subtitle={...} />`. `title` renders semantic `<h2>`. Keep `eyebrow` disabled by default unless requested.
- **Adding Content Types:** When adding any new schema type:
  1. Register in `src/sanity/schemaTypes/index.ts`.
  2. Add to `src/sanity/structure.ts` (otherwise invisible in Sanity Studio).
  3. Singletons only: register in `SINGLETONS` (`sanity.config.ts`).
  4. Map `_type` in `src/app/api/revalidate/route.ts` (`singletonTags` or `collectionConfig`).
  5. **Webhook & README:** Add `_type` to the Sanity Webhook filter list in `README.md` (and Sanity Dashboard). If omitted, Sanity never notifies Next.js, and ISR cache never updates.

## Content & Schema Contract
- Sanity is mandatory. Every new schema field must provide a sensible `initialValue` so a fresh clone renders non-empty.
- **Single Source of Truth for Defaults:** Keep default values in schema `initialValue` only. Do not duplicate them as component fallbacks (`val || "..."`).
- Image `alt` is optional in Sanity. `SanityImage` resolves `image.alt || alt || ""`.
- Every page document type must include an `seo` field (`objects/seo.ts`).

## Styling Architecture
- `src/app/globals.css`: Imports only.
- `src/styles/theme.css`: `@theme inline` and `:root` design tokens (brand colors, radius).
- `src/styles/base.css`: `@layer base` resets.
- `src/styles/utilities.css`: Custom animations and keyframes (`spinner-reveal`).
- Utility-first Tailwind only. No dark mode by default (not implemented in the boilerplate; implement per project only if explicitly requested).
