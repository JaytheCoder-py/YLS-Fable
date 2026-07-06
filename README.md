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
    Nav.jsx  Hero.jsx  AnnouncementCards.jsx  WordReveal.jsx
    LatestReleases.jsx  Statement.jsx  Footer.jsx
    Icons.jsx              # shared inline SVGs
preview.html / preview.css # standalone no-build copy
capture.mjs                # Playwright responsive screenshot + overflow diff
DESIGN.md tokens.json theme.css variables.css   # provided style guides
```

## Scroll animation (GSAP)

The announcement section replicates anthropic.com's scroll behaviour: as the side-by-side card
pair rises toward the top of the viewport it **expands from the inset 1272px pair (24px card
corners) to a full-bleed band (square corners)**, with a constant 16px gap between the two cards
that stays visible as a seam even at full bleed. `src/components/AnnouncementCards.jsx` uses
**GSAP ScrollTrigger** to scrub a single `--expand` variable from 0 → 1 (driven from
`self.progress`, so it can never stick expanded); the CSS in `src/index.css` interpolates the
pair's `max-width` (`calc(1272px + 1728px * var(--expand))`) and each card's `border-radius`
(`calc(24px * (1 - var(--expand)))`) against it. It respects `prefers-reduced-motion` (pair stays
inset). The standalone `preview.html` does the same via the GSAP CDN.

Tune the feel via the ScrollTrigger `start` / `end` values (`'top 40%'` / `'top 8%'`) in
`AnnouncementCards.jsx`.

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

Measured live tokens used throughout: canvas `#faf9f5`, ink `#141413`, kraft announcement cards
`#f5e3c7` / `#e3bd93`, warm-stone release cards, 1272 px content container, 16 px / 32 px cards, hero
`Sans 64/700`, serif card eyebrow `Serif 28/400` (22px mobile).

Three deliberate deviations. The fonts and announcement-card video are substituted because the originals aren't publicly redistributable; the headline-reveal accessibility change is an intentional improvement:

- **Fonts** — the proprietary *Anthropic Serif / Sans* are replaced by the documented
  substitutes **Source Serif 4** (headlines/editorial) and **Inter** (UI), loaded from Google
  Fonts. To drop in the real fonts, add the `.woff2` files and update `--font-serif` /
  `--font-sans` in `src/index.css`.
- **Announcement-card video** — the live kraft cards each play a Sanity-hosted video. They're
  reproduced as slow-drifting kraft-palette gradients (warm kraft on the first card, deeper clay
  on the second) under a subtle CSS grain overlay.
- **Headline reveal accessibility** — the live site exposes the split headline to screen
  readers twice (its sr-only clone plus the un-hidden animated copy). The React app instead
  marks the animated copy `aria-hidden` with unfocusable link clones; `preview.html` keeps
  the live behavior 1:1.

Content mirrors the live homepage as of July 2026 (Fable 5 / Sonnet 5 / Claude Science). Edit
`src/data.js` to change any copy or links.
