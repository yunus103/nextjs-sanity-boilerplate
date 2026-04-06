# AGENT_INSTRUCTIONS.md

Welcome, Agent. This document is your primary guide for understanding, maintaining, and extending this Next.js + Sanity boilerplate. Follow these instructions to ensure consistency, performance, and a premium user experience.

---

## 1. Project Identity & Brand Voice
- **Purpose**: A high-end, modern, and performant corporate/portfolio website.
- **Brand Voice**: Professional yet dynamic. Every interaction should feel intentional and "premium."
- **Core Tech**: Next.js 15 (App Router), Sanity v3, Tailwind CSS, Framer Motion, shadcn/ui.

---

## 2. Architecture & File Mapping

### Frontend (`src/app/(site)`)
- **Structure**: All public-facing routes are under `(site)` to separate them from the Sanity Studio.
- **Pages**:
  - `(site)/page.tsx`: Home Page.
  - `(site)/hizmetler/[slug]/page.tsx`: Dynamic Service pages.
  - `(site)/blog/[slug]/page.tsx`: Dynamic Blog pages.
  - `(site)/projeler/[slug]/page.tsx`: Dynamic Project pages.

### Sanity Content Studio (`src/sanity`)
- **Schemas**: `src/sanity/schemaTypes/`
  - `documents/`: Reusable collections (Blog, Project, Service).
  - `singletons/`: One-off pages (Home, About, Contact, Settings).
  - `objects/`: Nested data types (SEO, Social Link).
- **Queries**: `src/sanity/lib/queries.ts`. Centralized GROQ queries.
- **Structure**: `src/sanity/structure.ts`. Defines the sidebar layout in Sanity Studio.

### UI & Components (`src/components`)
- **`ui/`**: Base atomic components (Buttons, Inputs, etc.), mostly from `shadcn/ui`.
- **`layout/`**: Persistent components like `Header.tsx` and `Footer.tsx`.
- **`seo/`**: SEO-specific components like `JsonLd.tsx`.

---

## 3. Design Standards (The "WOW" Factor)

### Aesthetics
- **Premium Look**: Avoid default browser styles. Use subtle gradients, high-quality typography (Inter/Roboto), and plenty of whitespace.
- **Colors**: Manage branding colors (primary, background, etc.) directly in `src/app/globals.css` using CSS variables inside `:root` and `.dark` blocks.
- **Logo**: Use a single `logo` field in `siteSettings`; dark mode visibility is handled via CSS filters (`grayscale invert opacity-90`) in `Header.tsx`.
- **Favicon**: Dynamic from Sanity. Managed via `generateMetadata` in `RootLayout`.
- **Micro-animations**: Use `framer-motion` for all transitions. 
  - Prefer the `FadeIn` component for section reveals.
  - Use `AnimateGroup` for staggered list animations.

### Media & Images
- **CRITICAL**: Use the `SanityImage` component for ALL images coming from Sanity.
- **Attributes**: Ensure `hotspot: true` is enabled in schemas. Always provide `width`, `height`, or `fill` with appropriate `sizes`.
- **Placeholder**: Use `lqip` (Low-Quality Image Placeholder) for smooth loading transitions.

---

## 4. Customization & Extension

### Adding a New Content Type
1. **Schema**: Create `src/sanity/schemaTypes/documents/yourType.ts`.
2. **Registry**: Export it in `src/sanity/schemaTypes/index.ts`.
3. **Sidebar**: Add it to `src/sanity/structure.ts`.
4. **Query**: Write a GROQ query in `src/sanity/lib/queries.ts`.
5. **Route**: Create the corresponding page in `src/app/(site)`.
6. **Revalidation**: Map the type to a cache tag in `src/app/api/revalidate/route.ts`.

### Adding a Singleton
- Follow the same steps as above, but ensure it is added to the `SINGLETONS` array in `sanity.config.ts` to disable deletion/duplication.

---

### SEO & Meta Management
- **`buildMetadata` Helper**: Always use `buildMetadata`. It standardizes titles: Home is `Site | Slogan`, Inner is `Page | Site`.
- **Dynamic Icons**: Favicon is served dynamically via Metadata API from Sanity settings.
- **Schema.org**: Implement JSON-LD for Organization, Articles, and Services using the `JsonLd` component.
- **Alt Tags**: Alt tags for images are MANDATORY in Sanity schemas.

---

## 6. Core Rules for the Agent

1. **NO Hardcoding**: Labels and content should come from Sanity. Theme settings should come from `siteSettings`.
2. **TypeScript First**: Ensure all new components and data fetching have proper types.
3. **Component Reusability**: Check `src/components/ui` before creating a new base component.
4. **Draft Mode**: Support preview functionality by using `getClient(isDraft)` where applicable.
5. **Clean GROQ**: Only fetch the fields you actually need to reduce payload size.

---

## 7. Useful Commands
- `npm run dev`: Start local development.
- `npx shadcn@latest add [component]`: Add new shadcn UI components.
- Sanity Studio is available at `/studio`.

---

Follow these rules to maintain the integrity of the boilerplate while delivering a world-class web experience.
