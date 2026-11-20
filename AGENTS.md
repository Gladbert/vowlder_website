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

## Architecture invariants

- `src/data/themes.ts` is the single source of truth: slug, price, palette, copy, events, features. Cards, previews, WhatsApp messages, and OG images all read from it. Never hardcode a theme fact in a component.
- `src/data/guest-invitation.ts` holds the real Gladbert & Monica data used by the flagship theme (`renderer: 'guest'`).
- **OG tags are static, per theme.** `src/pages/preview/[slug].astro` renders `og:*` at build time and `src/pages/og/[slug].png.ts` renders the card. WhatsApp must get a thumbnail without running JS — never move this to client code.
- **Audio never autoplays.** `<audio preload="none">` plus `play()` inside the "Buka Undangan" click (`useInvitationAudio`). iOS and Android both block anything else. No `music` field means no control is shown — do not ship a fake music button.
- **`?to=` guest name**: read on mount, write back with `history.replaceState` (`useGuestName`). Default is `Tamu Undangan`.
- **Mobile first.** Base styles target a 390px phone; add `sm:` / `lg:` only to widen. Preview screens are app-like: fixed `100svh` shell with an internal scroll container, so floating bars and the cover gate stay put.
- **Assets**: photos go to `/public/photos` as WebP, max 1080px, quality ~78, under ~150 KB each. Preview payload stays under ~1.5 MB total. Move to R2 before the repo passes ~150 MB.
- Fonts are self-hosted via `@fontsource-variable` (`Inter Variable` for UI, `Cormorant Garamond Variable` for display). No external font/CDN requests.

## Conventions

- UI copy is Indonesian; code, comments, and identifiers are English.
- Keep theme skins data-driven (`ThemeWrapper.tsx`). A new typographic theme is a `themes.ts` entry, not a new component. Only build a bespoke renderer when the layout genuinely differs — that is what `renderer: 'guest'` is for.
- Match the existing Tailwind idiom (arbitrary values for palette colours inline, utility classes elsewhere). Do not introduce a CSS-in-JS layer or a component library.
