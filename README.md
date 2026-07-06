# Anthropic homepage — replica

A faithful, responsive replica of the [anthropic.com](https://www.anthropic.com) homepage,
built with **React + Vite + Tailwind v4**. Design tokens (colour, type, spacing) were measured
directly from the live site and reconciled with the provided `DESIGN.md` / `theme.css`.

## Two ways to view it

| | File | Setup | Use for |
|---|---|---|---|
| **Zero-setup preview** | `preview.html` | none — double-click to open | quick look, sharing, screenshotting |
| **Dev project** | `index.html` + `src/` | `npm install` | editing, componentised build |

`preview.html` + `preview.css` are a self-contained static copy (identical output). The
`src/` React app is the real, maintainable build.

## Run the dev project

```bash
# If a partial node_modules exists from an earlier run, delete it first:
#   Windows:  rmdir /s /q node_modules   (or delete the folder in Explorer)
npm install
npm run dev          # → http://localhost:5173
npm run build        # production build into dist/
```

## Structure

```
index.html                 # Vite entry (loads Google Fonts + /src/main.jsx)
src/
  main.jsx                 # React root
  App.jsx                  # page composition
  index.css                # Tailwind v4 @theme tokens + component layer
  data.js                  # all copy/links (nav, releases, footer, …)
  components/
    Nav.jsx  Hero.jsx  FeatureCard.jsx
    LatestReleases.jsx  Statement.jsx  Footer.jsx
    Icons.jsx              # shared inline SVGs
preview.html / preview.css # standalone no-build copy
capture.mjs                # Playwright responsive screenshot + overflow diff
DESIGN.md tokens.json theme.css variables.css   # provided style guides
```

## Scroll animation (GSAP)

The announcement card replicates anthropic.com's scroll behaviour: as it rises toward the top of
the viewport it **expands from the inset 1272px card (24px corners) to a full-bleed band (square
corners)**. `src/components/FeatureCard.jsx` uses **GSAP ScrollTrigger** to scrub a single
`--expand` variable from 0 → 1; the CSS in `src/index.css` interpolates the card's `max-width` and
`border-radius` against it (`width:100%` caps the width at the viewport edge, so it never causes
horizontal scroll). It respects `prefers-reduced-motion` (card stays inset). The standalone
`preview.html` does the same via the GSAP CDN.

Tune the feel via the ScrollTrigger `start` / `end` / `scrub` values in `FeatureCard.jsx`.

## Reference-vs-build visual diff

`capture.mjs` screenshots any URL across ten widths (375 → 1920) and flags any width where
content overflows horizontally (the classic "didn't stack" bug).

```bash
npx playwright install chromium   # one-time
npm run capture:ref               # → reference/<width>.png  (live anthropic.com)
npm run dev                       # in another terminal
npm run capture:build             # → build/<width>.png      (your localhost:5173)
# compare reference/<width>.png against build/<width>.png
```

## Fidelity notes

Measured live tokens used throughout: canvas `#faf9f5`, ink `#141413`, kraft feature card
`#f5e3c7`, warm-stone release cards, 1272 px content container, 16 px / 32 px cards, hero
`Sans 64/700`, serif feature headline `Serif 72/400`.

Two deliberate substitutions, both because the originals aren't publicly redistributable:

- **Fonts** — the proprietary *Anthropic Serif / Sans* are replaced by the documented
  substitutes **Source Serif 4** (headlines/editorial) and **Inter** (UI), loaded from Google
  Fonts. To drop in the real fonts, add the `.woff2` files and update `--font-serif` /
  `--font-sans` in `src/index.css`.
- **Feature-card video** — the live kraft card plays a Sanity-hosted video. It's reproduced as
  the kraft tone `#f5e3c7` with a subtle CSS grain overlay.

Content mirrors the live homepage as of July 2026 (Fable 5 / Sonnet 5 / Claude Science). Edit
`src/data.js` to change any copy or links.
