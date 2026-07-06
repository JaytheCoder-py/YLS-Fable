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
    Nav.jsx  Hero.jsx  FeatureCard.jsx  WordReveal.jsx
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

## Hero word reveal

The headline replicates anthropic.com's staggered reveal, with constants measured from the
live site's inline script (July 2026): each word starts at `opacity: 0` /
`translateY(24px)` and transitions in over **800ms** (`cubic-bezier(0.16, 1, 0.3, 1)`)
after a **random 100–500ms delay** — words surface in random order, not left-to-right.
The trigger is an IntersectionObserver (threshold 0.2); `prefers-reduced-motion` shows the
headline statically. `src/components/WordReveal.jsx` splits the words at render time
(preserving the inline links); `preview.html` embeds a near-verbatim port of the live
site's vanilla script.

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
- **Headline reveal accessibility** — the live site exposes the split headline to screen
  readers twice (its sr-only clone plus the un-hidden animated copy). The React app instead
  marks the animated copy `aria-hidden` with unfocusable link clones; `preview.html` keeps
  the live behavior 1:1.

Content mirrors the live homepage as of July 2026 (Fable 5 / Sonnet 5 / Claude Science). Edit
`src/data.js` to change any copy or links.
