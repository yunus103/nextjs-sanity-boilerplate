---
description: Standard workflow for kicking off and adapting a cloned boilerplate project for a new client.
trigger: manual
---

# Client Project Onboarding Workflow

Use this workflow whenever the user indicates the start of a new client project (e.g., "Yeni müşteri projesine başlıyoruz", "Kickoff yapalım", "Yeni proje: [Müşteri Adı]").

Follow these 5 phases sequentially. Do not rush into code before completing alignment.

---

## Phase 1: Brief Ingestion & Quick Clarification

1. **Ingest User Context:**
   - Read the user's initial information dump (company name, industry, services, target audience, logo notes, etc.).
2. **Targeted Clarification (Keep it concise):**
   - Ask only the essential missing questions (maximum 2–3 questions). Avoid heavy interrogation.
   - Clarify:
     - Core value proposition & main call-to-action (CTA).
     - Page scoping: Which boilerplate routes are active vs. passive (`/hizmetler`, `/projeler`, `/blog`)?
     - Any specific forms or contact channels (WhatsApp, quote form, email).

---

## Phase 2: Design Language & Tokens Brainstorming

1. **Collaborative Discussion:**
   - Brainstorm the visual direction with the user (do not rigidly assume colors or force a single formula).
   - Discuss and agree on:
     - **Color Palette:** Primary, Secondary, Accent, Background/Surface tones.
     - **Typography:** Heading font & Body font (clean sans, warm serif, tech grotesque, etc.).
     - **Shape & Radius:** Sharp/technical (`rounded-sm`), balanced (`rounded-md` / `rounded-lg`), or soft/friendly (`rounded-2xl`).
     - **Aesthetic Vibe:** Minimalist, editorial, bold/high-contrast, corporate, or playful.
2. **Lock Decisions:**
   - Summarize the agreed tokens before writing them to `src/styles/theme.css`.

---

## Phase 3: Page & Navigation Scoping (Preservation Rule)

1. **Never Delete Boilerplate Pages:**
   - Do NOT delete unused page routes or schemas (e.g., if the client does not need `/blog` or `/projeler` today).
   - Keep the code and schemas intact for future software engineering agility.
2. **Set Inactive Pages to Passive:**
   - Configure navigation links (Header & Footer in `siteSettings`) to only expose active pages.
   - Ensure inactive routes simply do not appear in the UI navigation.

---

## Phase 4: Realistic Content Simulation via Sanity `initialValue`s

1. **No Hardcoded Content & Single Source of Truth:**
   - In accordance with boilerplate rules, all defaults belong in Sanity schema `initialValue` properties—never duplicated in JSX/component fallbacks.
2. **Client-Tailored Copy Generation:**
   - Generate realistic, professional, client-specific Turkish copy for schema `initialValue`s:
     - `siteSettings`: Company name, title, description, contact details, social links.
     - `homePage`: Hero headlines, subheadings, CTA labels, value points.
     - Active service / project / about schemas: Tailored sample items.
3. **Outcome:**
   - When the user inspects the site or opens `/studio`, the project renders fully simulated, production-like client content immediately.

---

## Phase 5: Implementation Plan & Staged Execution

1. **Propose Implementation Plan:**
   - Draft an `implementation_plan.md` outlining:
     - Design tokens (`src/styles/theme.css`).
     - Schema `initialValue` updates.
     - Navigation/header/footer adjustments.
     - Section styling tweaks to match the agreed aesthetic.
2. **Wait for Approval:**
   - Present the rationale and plan to the user. Wait for explicit approval before coding.
3. **Execute & Visual Verification:**
   - Implement agreed changes following all core boundaries (no raw `<img>`, no `any`, keep `<SanityImage>`, keep `buildMetadata`).
   - Allow the user to perform manual visual review.
