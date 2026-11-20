# Vowlder website

Portfolio + catalogue for Vowlder wedding invitations. Astro 7 static output, React 19 islands, Tailwind 4, `motion`.

## Scope — read first

- **Work in this repo only.** `/home/gladbert/gladbert/Wedding-inv` is a separate project. It is read-only here: source of the brand logo and of the real wedding photos (`scripts/prepare-photos.mjs`). Never edit or commit there.
- Everything that ships lives in this repo. Nothing is deployed yet, so "validate before push" means validate locally, then commit.

## Stack and commands

- Package manager: **bun**. `bun install`.
- `bun run dev` — dev server (port 4399 is what the audit script assumes).
- `bun run build` — static build to `dist/`.
- `bun run check` — `astro check` (TypeScript 6; TS 7 is not supported by `astro check` yet).
- `node scripts/audit-pages.mjs [baseUrl]` — layout audit (see below).
- `node scripts/prepare-photos.mjs` — re-encode source photos to `/public/photos` (only when adding real photos).

## Validate locally before you commit or push

Never commit a feature you have not seen work in a browser. No sloppy pushes.

Run all four, in order, and stop on the first failure:

1. `bunx astro check` — zero errors.
2. `bun run build` — builds every route, including `/og/*.png`.
3. `bun run dev` in another shell, then `node scripts/audit-pages.mjs http://localhost:4399` — fails on text overlap, horizontal overflow, clipped text, contrast under WCAG AA, or a font that did not load, at 390x844 and 1280x900, scrolling every preview.
4. Open the page yourself (`agent-browser open`, `agent-browser set viewport 390 844`, `agent-browser screenshot`) and look at it. The audit proves nothing overlaps; it cannot prove the design is good.

Then run the **code-review skill** on the diff (`~/.pi/agent/skills/code-review/SKILL.md`) and fix what it flags before committing.

## No AI slop

This is a design portfolio. Generic "AI product" styling is a defect, not a style choice.

Banned, unless the user explicitly asks:

- **Wording**: "elevate your special day", "seamless", "unlock", "unleash", "effortless", "craft unforgettable moments", "your dream wedding starts here", exclamation-mark hype, emoji in copy, three-item adjective triads.
- **Logo marks**: star / sparkle / four-point sparkle glyphs, lightning bolts, generic orbit dots. Use `public/brand/` only — never draw a new mark.
- **Status indicators**: the glowing red/green "online / offline" dot, pulsing availability badges, "Live" pills. Users are already looking at the page.
- **Decorative gradients and glows**: purple-to-blue gradient hero, radial glow behind headings, glassmorphism cards, neon borders.
- **Filler sections**: fake testimonials, invented client counts, "trusted by" logo walls, stock-photo placeholders, invented statistics.
- **Layout noise**: everything centred, every block a rounded card, emoji bullets, three-column icon grids.

Do instead: real content from `src/data/`, editorial typography, hairline rules, generous whitespace, one accent colour per palette, Indonesian copy written like a person.

### Copy is written by a person, not generated

- Indonesian, conversational, concrete. Short sentences. No translationese ("hal yang paling penting adalah...").
- Wishes must sound like six different people: vary register (family, coworker banter, close friend), vary length, and never repeat the same opening formula twice. Read them out loud — if two start the same way, rewrite one.
- Never put a placeholder name inside a sentence template (`bila {guest} berkenan hadir` breaks for "Tamu Undangan"). Use the neutral invitation phrasing instead; the name is already shown on the cover and hero.
- No emoji anywhere in copy. Avoid the em dash as a stylistic tic — it appears in page titles and numbered section labels, nowhere else.
- UI strings should read like a host talking: "Mohon kabari kami sebelum 19 Desember 2026", not "Konfirmasi kehadiran wajib diselesaikan".

### Content source and privacy

- `wedding.ts` currently carries the **real** Gladbert & Monica wedding: names, parents, Instagram handles, venue, dates, and photos pulled from `Wedding-inv` into `/public/photos`. `public/brand/` carries the real logo. That is deliberate — it is the flagship portfolio piece.
- To de-identify the demo, edit `wedding.ts` and swap `/public/photos` only. No component reads those values directly.

## Architecture invariants

Two data files, one rule: **content and design never mix.**

- `src/data/wedding.ts` — the wedding itself (couple, dates, venue, story, gallery, video, wishes). It is identical in **every** template. Adding or editing a fact happens here, once. Never invent a wedding fact in a component or in `themes.ts`.
- `src/data/themes.ts` — design only: slug, name, category, tier, price, blurb, `palette`, type, `variant`, card `photo`, optional `music`, plus `includedFeatures` (shared by all templates).
- `src/components/previews/tokens.ts` — the eight layout variants (`faithful`, `classic`, `editorial`, `split`, `poster`, `spotlight`, `compact`, `medallion`) as class-token sets. **`Invitation.tsx` is the only renderer**; `sections.tsx` holds the section bodies. A new template = a `themes.ts` entry, nothing else. Only add a variant when the *layout* genuinely differs — a colour change is a palette, not a variant.
- The guest-name tester lives in the page chrome (`src/components/GuestTester.astro`), **not** inside the phone shell: an input fixed inside a 100svh scroller gets buried by the mobile keyboard. It writes `?to=` and dispatches `vowlder:guest`, which `hooks.ts` listens to. Keep it that way.
- Every template must stay at feature parity, in this order: hero slideshow and countdown → opening (salam, greeting, couple quote) → couple + parents + Instagram → schedule with **both** ceremonies and one location block (maps/Waze/calendar/transit/parking/notes) → turut mengundang → story → gallery with lightbox and film → hadiah → RSVP, wishes → footer. That order is the Indonesian market convention (checked against Akanikah, Wevitation, Menica, Sebarundangan). A template that drops a section is a regression, not a variation.
- Countdown always targets the **next** ceremony that has not passed (`useNextEventIso`). Never render four zeros, and never hardcode the event index.
- Every viewer route needs a way back to the catalogue: the in-frame "← Katalog" chip, the page header, and the sidebar link. If you add a route, wire all three.
- Catalogue cards carry a `mood` tag (`Elegan`, `Romantis`, …) next to the category, the way template galleries label a theme. Keep both, they answer different questions.
- Palette contrast is not negotiable: ink, soft text, and accent must clear WCAG AA (4.5:1) on both `bg` and `paper`, and `on` must clear 4.5:1 on `accent`. `scripts/audit-pages.mjs` enforces it — check new palettes there before shipping.
- **OG tags are static, per theme.** `src/pages/preview/[slug].astro` renders `og:*` at build time and `src/pages/og/[slug].png.ts` renders the card. WhatsApp must get a thumbnail without running JS — never move this to client code.
- **Audio never autoplays.** `<audio preload="none">` plus `play()` inside the "Buka Undangan" click (`useInvitationAudio`). iOS and Android both block anything else. No `music` field means no control is shown — do not ship a fake music button.
- **`?to=` guest name**: read on mount, write back with `history.replaceState` (`useGuestName`). Default is `Tamu Undangan`.
- **Mobile first.** Base styles target a 390px phone; add `sm:` / `lg:` only to widen. Preview screens are app-like: fixed `100svh` shell with an internal scroll container, so floating bars and the cover gate stay put.
- **Assets**: photos go to `/public/photos` as WebP, max 1080px, quality ~78, under ~150 KB each. Preview payload stays under ~1.5 MB total. Move to R2 before the repo passes ~150 MB.
- Fonts are self-hosted via `@fontsource-variable` (`Inter Variable` for UI, `Cormorant Garamond Variable` for display). No external font/CDN requests.

## Conventions

- UI copy is Indonesian; code, comments, and identifiers are English.
- Keep templates data-driven. A new skin is a `themes.ts` entry; the renderer stays shared. Bespoke code is only justified when the layout, not the colour, changes — then add a variant to `tokens.ts`.
- Match the existing Tailwind idiom (arbitrary values for palette colours inline, utility classes elsewhere). Do not introduce a CSS-in-JS layer or a component library.
