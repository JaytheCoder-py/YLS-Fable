# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A responsive replica of the anthropic.com homepage (as of July 2026), built with React 18 + Vite 6 + Tailwind v4 + GSAP. No tests and no linter are configured.

## Commands

```bash
npm install
npm run dev        # dev server on http://localhost:5173 (port fixed in vite.config.js)
npm run build      # production build into dist/
npm run preview    # serve the production build
```

Note: `npm run capture:ref` / `capture:build` reference `capture.mjs`, which is **not present** in the repo (along with `DESIGN.md`, `theme.css`, `tokens.json`, `variables.css`, which the README mentions). Those scripts will fail until the file is restored.

## Architecture

**Two parallel implementations that must stay in sync.** The same page exists twice:

1. `src/` — the real, componentised React app (the maintainable build).
2. `preview.html` + `preview.css` — a self-contained, zero-build static copy (opens by double-click; loads GSAP from CDN).

Any visual or content change made to one should be mirrored in the other.

**Styling lives in CSS, not in JSX utility classes.** `src/index.css` holds:
- Design tokens in a Tailwind v4 `@theme` block (no `tailwind.config.js`) — colors like `--color-canvas` (#faf9f5), `--color-ink` (#141413), `--color-kraft` (#f5e3c7), and `--container-page: 1272px`. Tokens were measured from the live site; change them here, not inline.
- A handwritten `@layer components` section with BEM-ish class names (`.nav__link`, `.vcard__eyebrow`, …). Components reference these classes rather than composing Tailwind utilities.

**All copy/links live in `src/data.js`** (nav links, releases, featured links, footer). Components are presentational; edit content there, not in JSX.

**Page composition** is flat: `App.jsx` renders Nav → Hero → AnnouncementCards → LatestReleases → Statement → LogoBanner → CtaSection → Footer. Shared inline SVGs are in `src/components/Icons.jsx`. The CTA band and the footer share the same dark surface and sit flush: the page-end margin lives on `.cta` (not `.footer`), and `.footer`'s hairline top border is the seam between them.

**Scroll animation** (`src/components/AnnouncementCards.jsx`): GSAP ScrollTrigger scrubs a single `--expand` CSS variable from 0→1 as the card pair scrolls up; CSS in `index.css` interpolates the pair's `max-width` **and `height`** and each card's `border-radius` against it (inset 1272px × 640px row → full-bleed 100svh viewport takeover, with the gap between the two cards constant throughout). The section reserves the full takeover height in layout (`min-height: 100svh`, cards top-aligned — the reserved slack sits below the cards, keeping the hero→cards gap tight, and is consumed as they grow), so the height animation never reflows content below; the trigger runs `'top 10%'` → `'top top'`, completing the takeover exactly as the section reaches the viewport top — before the next section can enter. Key invariants: the value is driven from `self.progress` so it can never stick expanded; `prefers-reduced-motion` drops the height reservation and leaves the pair inset (static layout) and freezes the cards' CSS placeholder-media drift; ScrollTrigger refreshes after fonts/load since font swaps shift trigger positions. Tune the feel via `start`/`end` in the ScrollTrigger config. Each card's "video" is CSS-only (`.vcard__media` gradients + grain); drop a `<video autoplay muted loop playsinline>` inside `.vcard__media` to use real footage.

**Hero word reveal** (`src/components/WordReveal.jsx`): splits the headline into per-word spans at render time (recursing into inline anchors), each with a random 100–500ms `transition-delay`; an IntersectionObserver (threshold 0.2) adds `.is-revealed` and CSS transitions (800ms expo-out, 24px rise, defined in `index.css`) do the animation. The intact sentence is kept in a `.u-sr-only` copy; the split copy is `aria-hidden`. `preview.html` embeds a vanilla-JS port of the same effect.

**Logo banner** (`src/components/LogoBanner.jsx`): a pure-CSS "trusted by" marquee between Statement and the CTA band (it stays on the light canvas, ahead of the dark CTA+footer block). The `width: max-content` track holds two identical `.logos__set` halves, each repeating the six brand marks (`src/components/LogoMarks.jsx`, content in `data.js` `logoBanner`) `SET_REPEATS` (6) times; `logos-scroll` slides it `translateX(-50%)` (72s linear infinite ≈ 61px/s) for a seamless loop. Two invariants: each half must outspan the viewport (one 6-logo run is only ~735px — unrepeated, the strip empties from the right mid-cycle), and each `.logos__set` carries the inter-set gap as `padding-right`, so keep the gap off `.logos__track` or the wrap point jumps. In `preview.html` the repetition is stamped by a small script at the bottom of the file (the two halves are authored with one 6-logo run each). Hover pauses via `animation-play-state`; `prefers-reduced-motion` leaves a static row. The whole marquee is `aria-hidden` (it's decorative under repetition); a `.u-sr-only` list before it names the companies once for AT. AIMA is a typeset wordmark (no clean vector mark exists); the other marks' viewBoxes are cropped to content bounds so per-mark CSS heights set visual weight.

**Research page** (`research.html` → `src/research.jsx` → `src/ResearchApp.jsx`): a second Vite MPA entry replicating anthropic.com/research — Nav → ResearchHero → ResearchTeams → FeaturedResearch → Publications → JoinCta → Footer, styled from the same tokens/component layer in `src/index.css` (rules under `/* ==== Research page ==== */`), all copy in `data.js` `researchPage` (50 publications, the 2026 rows of the live 149-item archive). `vite.config.js` lists both HTML entries in `build.rollupOptions.input`; the dev URL is `/research.html`. Publications is the page's only stateful component: live search filters title+category across the full carried archive regardless of the See-more state; "See more" reveals all rows once and unmounts, handing focus to the first revealed row. The featured artwork is a CSS-only stand-in (kraft gradients + grain + a masked repeating-word SVG layer) per the repo's no-redistributable-media convention. This page has no static preview twin (deliberate; user decision 2026-07-07). The homepage nav's Research link (`/research.html`) is deliberately not mirrored in `preview.html` (its nav still points at `#`) — a static double-click file can't usefully link into a Vite entry.

**Fonts are deliberate substitutes**: Source Serif 4 (headlines) and Inter (UI) from Google Fonts (loaded in `index.html`), standing in for the proprietary Anthropic Serif/Sans. The announcement cards' CSS-animated kraft gradients + grain overlay stand in for non-redistributable video footage.
