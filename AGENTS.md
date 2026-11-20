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
- `bun run deploy` — builds, then `wrangler deploy` (Cloudflare Workers static assets via `wrangler.jsonc`). Set `SITE_URL` first: `SITE_URL=https://vowlder.com bun run deploy`. Without it the build falls back to `https://vowlder.com`, and every canonical/og:image URL inherits that host.

## Validate locally before you commit or push

Never commit a feature you have not seen work in a browser. No sloppy pushes.

Run all four, in order, and stop on the first failure:

1. `bunx astro check` — zero errors.
2. `bun run build` — builds every route, including `/og/*.png`.
3. `bun run dev` in another shell, then `node scripts/audit-pages.mjs http://localhost:4399` — ~90 s, phone viewport. Add `--full` for phone + small phone + landscape + desktop (~6 min). It fails on text overlap, horizontal overflow, clipped text, contrast under WCAG AA, a font that did not load, a cover CTA below the fold, a template with fewer than five reveals, or nested reveals. It prints progress, so a stuck browser looks different from a stuck script. Never `pkill -f "astro dev"` from a shell whose own command line contains that string: it kills the shell.
4. Open the page yourself (`agent-browser open`, `agent-browser set viewport 390 844`, `agent-browser screenshot`) and look at it. The audit proves nothing overlaps; it cannot prove the design is good.

Then run the **code-review skill** on the diff (`~/.pi/agent/skills/code-review/SKILL.md`) and fix what it flags before committing.

## The site is a company, not a catalogue

`index.astro` is the company page: hero, what we do (three editorial rows, not cards), catalogue, packages derived from `themes.ts` tiers, a custom-design band, four-step process, FAQ built on native `<details>`, contact block. `custom.astro` is the escape hatch for people who want their own palette: what you get, how it goes, what to send, references, prefilled WhatsApp brief. Reachable from the header, the footer, the catalogue band, and every preview sidebar. A change that turns the front page back into "grid of cards and a footer" is a regression.

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

## Design system

Reference skills, in order of how much they change my decisions here:

- `github.com/nextlevelbuilder/ui-ux-pro-max-skill` — pick a style, palette, and font pairing for the *industry* before writing components. Wedding software is not a SaaS dashboard.
- `github.com/dickwu/apple-design-skill` — motion and interaction craft: short durations, one easing curve, transform/opacity only, no easing that draws attention to itself.
- `github.com/anthropics/skills` (`frontend-design`) — commit to one aesthetic direction up front; no centred hero, no three emoji cards, no purple gradient.
- `github.com/Leonxlnx/taste-skill` — metric-driven spacing and type scales instead of adjectives.
- `github.com/vercel-labs/agent-skills` (`web-design-guidelines`) — pre-ship check: focus states, labels, autocomplete, image dimensions, `prefers-reduced-motion`, curly quotes, tabular numbers.

What those rules landed on for Vowlder:

- **Fonts**: Archivo (body), Instrument Serif (company voice, site headings only), Cormorant Garamond (invitation voice, inside previews). Three families, three jobs. Do not add a fourth; do not use Inter.
- **Palette**: `--color-cream #FBF9F5`, `--color-paper #F4F0E8`, `--color-ink #1A1917`, `--color-ink-soft #5C574F`, `--color-brass #6F5B3E`, `--color-line #E3DCD1`. One accent, four neutrals, hairline borders. No second accent, no gradients, no glow.
- **Type scale**: `display-1`, `display-2`, `lede`, `eyebrow` in `global.css`. Use those utilities; do not hand-roll a `text-4xl` heading.
- **Shape**: `rounded-pill` for actions, `rounded-card` for surfaces, square for invitation internals that the template asks for. No radius soup.
- **Density**: mobile first, 5px-free spacing, 44px minimum tap targets, `min-h-[48px]` on primary actions.
- **Rhythm**: every section starts with an `eyebrow`, then `display-2`, then one `lede` paragraph. Not more.

Persist decisions here rather than in code comments, so the next session does not re-invent them.

## Architecture invariants

Two data files, one rule: **content and design never mix.**

- `src/data/wedding.ts` — the wedding itself (couple, dates, venue, story, gallery, video, wishes). It is identical in **every** template. Adding or editing a fact happens here, once. Never invent a wedding fact in a component or in `themes.ts`.
- `src/data/themes.ts` — design only: slug, name, category, tier, price, blurb, `palette`, type, `variant`, card `photo`, optional `music`, plus `includedFeatures` (shared by all templates).
- `src/components/previews/tokens.ts` — the eight layout variants (`faithful`, `classic`, `editorial`, `split`, `poster`, `spotlight`, `compact`, `medallion`) as class-token sets. **`Invitation.tsx` is the only renderer**; `sections.tsx` holds the section bodies. A new template = a `themes.ts` entry, nothing else. Only add a variant when the *layout* genuinely differs — a colour change is a palette, not a variant.
- The guest-name tester lives in the page chrome (`src/components/GuestTester.astro`), **not** inside the phone shell: an input fixed inside a 100svh scroller gets buried by the mobile keyboard. It writes `?to=` and dispatches `vowlder:guest`, which `hooks.ts` listens to. Keep it that way.
- **The catalogue carries no religion-specific themes.** Islamic/Syariah designs were removed on request; do not add them back unless the user asks. Cultural (Javanese, Minang, Chinese-Indonesian) is fine.
- Chinese-Indonesian templates (`oriental-red-gold`, `sino-angpao`, `imlek-modern`, `teapai-emas`) may override two things only: `giftLabel: 'Angpao'` and a `glyph` (囍 / 福) rendered on the cover and footer. Nothing else changes per culture — same wedding, same sections.
- **Shape is chosen per template, not per palette.** `tokens.ts` carries `scheduleStyle` (`cards` / `timeline` / `list`), `galleryStyle` (`grid` / `rail` / `full`), `couple` (`stack` / `columns` / `monogram`), `story` (`timeline` / `centered`), `photoShape`, `nav` indicator and cover anatomy. Changing two of those is what makes a new template feel new. Two templates that differ only in colour are a defect.
- Every template must stay at feature parity, in this order: hero slideshow and countdown → opening (salam, greeting, couple quote) → couple + parents + Instagram → schedule with **both** ceremonies and one location block (maps/Waze/calendar/transit/parking/notes) → turut mengundang → story → gallery with lightbox and film → hadiah → RSVP, wishes → footer. That order is the Indonesian market convention (checked against Akanikah, Wevitation, Menica, Sebarundangan). A template that drops a section is a regression, not a variation.
- Countdown always targets the **next** ceremony that has not passed (`useNextEventIso`). Never render four zeros, and never hardcode the event index.
- Music is on by default (`/audio/ceremony.mp3`, 1.7 MB, `preload="none"`). The track came from the Wedding-inv project. Never autoplay: `useInvitationAudio` only starts inside the "Open Invitation" tap.
- Hearts (gallery photos, guest wishes) and RSVP are **local to the device**. Every one of those surfaces says so in the UI. Do not add a server call without telling the user the copy has to change.
- The venue map is a lazy `<iframe>` behind a "Show the map" button, so nothing third-party loads until asked.
- Every viewer route needs a way back to the catalogue: the in-frame "← Katalog" chip, the page header, and the sidebar link. If you add a route, wire all three.
- Catalogue cards carry a `mood` tag (`Elegan`, `Romantis`, …) next to the category, the way template galleries label a theme. Keep both, they answer different questions.
- Palette contrast is not negotiable: ink, soft text, and accent must clear WCAG AA (4.5:1) on both `bg` and `paper`, and `on` must clear 4.5:1 on `accent`. `scripts/audit-pages.mjs` enforces it — check new palettes there before shipping.
- **OG tags are static, per theme.** `src/pages/preview/[slug].astro` renders `og:*` at build time and `src/pages/og/[slug].png.ts` renders the card. WhatsApp must get a thumbnail without running JS — never move this to client code.
- **Audio never autoplays.** `<audio preload="none">` plus `play()` inside the "Buka Undangan" click (`useInvitationAudio`). iOS and Android both block anything else. No `music` field means no control is shown — do not ship a fake music button.
- **`?to=` guest name**: read on mount, write back with `history.replaceState` (`useGuestName`). Default is `Tamu Undangan`.
- **Mobile first.** Base styles target a 390px phone; add `sm:` / `lg:` only to widen. Preview screens are app-like: fixed `100svh` shell with an internal scroll container, so floating bars and the cover gate stay put.
- **Assets**: photos go to `/public/photos` as WebP, max 1080px, quality ~78, under ~150 KB each. Preview payload stays under ~1.5 MB total. Move to R2 before the repo passes ~150 MB.
- Fonts are self-hosted via `@fontsource-variable` (`Inter Variable` for UI, `Cormorant Garamond Variable` for display). No external font/CDN requests.

## Motion

`src/components/previews/motion.tsx` is the only place motion is defined.

- **Transform and opacity only.** Never animate height, width, top/left, filter, or box-shadow. `scaleX` on a hairline is fine; `width` on one is not.
- `Reveal` wraps section content; `Rule` draws a hairline; `coverExits` maps a variant to its gate exit (`fade`, `rise`, `curtain`, `zoom`). Each variant picks `reveal` + `coverExit` in `tokens.ts` — that is how templates feel different without new components.
- Every reveal carries `data-reveal`. The layout audit counts those nodes and fails a template with fewer than five, so motion cannot silently disappear from a template.
- `viewport: { root }` is mandatory: the invitation scrolls inside its own container, so a reveal without an explicit root never fires.
- `once: true` everywhere. No loops, no attention-seeking motion, no bounce, no spin, no parallax tied to scroll.
- One easing curve (`EASE`), 0.25–0.7 s, delays capped at ~0.15 s per group. `MotionConfig reducedMotion="user"` is set at the island root — respect it, never override with `transition` on a transform you want to force.
- Hero slideshow: crossfade + a slow scale drift on the image. Never animate the image's layout box.

## Conventions

- UI copy is Indonesian; code, comments, and identifiers are English.
- Keep templates data-driven. A new skin is a `themes.ts` entry; the renderer stays shared. Bespoke code is only justified when the layout, not the colour, changes — then add a variant to `tokens.ts`.
- Match the existing Tailwind idiom (arbitrary values for palette colours inline, utility classes elsewhere). Do not introduce a CSS-in-JS layer or a component library.
