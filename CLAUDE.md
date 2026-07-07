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

**Page composition** is flat: `App.jsx` renders Nav → Hero → AnnouncementCards → LatestReleases → Statement → CtaSection → Footer. Shared inline SVGs are in `src/components/Icons.jsx`. The CTA band and the footer share the same dark surface and sit flush: the page-end margin lives on `.cta` (not `.footer`), and `.footer`'s hairline top border is the seam between them.

**Scroll animation** (`src/components/AnnouncementCards.jsx`): GSAP ScrollTrigger scrubs a single `--expand` CSS variable from 0→1 as the card pair scrolls up; CSS in `index.css` interpolates the pair's `max-width` and each card's `border-radius` against it (inset 1272px row → full-bleed band, with the gap between the two cards constant throughout). Key invariants: the value is driven from `self.progress` so it can never stick expanded; `prefers-reduced-motion` leaves the pair inset and freezes the cards' CSS placeholder-media drift; ScrollTrigger refreshes after fonts/load since font swaps shift trigger positions. Tune the feel via `start`/`end` in the ScrollTrigger config. Each card's "video" is CSS-only (`.vcard__media` gradients + grain); drop a `<video autoplay muted loop playsinline>` inside `.vcard__media` to use real footage.

**Hero word reveal** (`src/components/WordReveal.jsx`): splits the headline into per-word spans at render time (recursing into inline anchors), each with a random 100–500ms `transition-delay`; an IntersectionObserver (threshold 0.2) adds `.is-revealed` and CSS transitions (800ms expo-out, 24px rise, defined in `index.css`) do the animation. The intact sentence is kept in a `.u-sr-only` copy; the split copy is `aria-hidden`. `preview.html` embeds a vanilla-JS port of the same effect.

**Fonts are deliberate substitutes**: Source Serif 4 (headlines) and Inter (UI) from Google Fonts (loaded in `index.html`), standing in for the proprietary Anthropic Serif/Sans. The announcement cards' CSS-animated kraft gradients + grain overlay stand in for non-redistributable video footage.
