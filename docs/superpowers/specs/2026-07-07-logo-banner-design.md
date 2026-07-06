# Logo Banner ("Trusted By" Marquee) — Design

**Date:** 2026-07-07
**Branch:** `feature/logo-banner`
**Status:** Approved by user (conversation, 2026-07-07)

## Purpose

Add a closing social-proof band to the homepage replica: an autoscrolling
marquee of company logos sitting between the Statement section and the
Footer. Understated, consistent with the site's muted aesthetic.

## Decisions (user-confirmed)

| Decision | Choice |
|---|---|
| Placement | Between `Statement` and `Footer` (last thing before the footer) |
| Companies | Samsung, DJI, BYD, Xiaomi, AIMA, Hyundai (in this order) |
| Logo treatment | Real SVG marks, inlined, monochrome via `currentColor` |
| Heading | Small all-caps eyebrow label: "Trusted by teams worldwide" |
| Scroll mechanism | Pure CSS marquee (no JS) |

## Architecture

Two parallel implementations, kept in sync per project convention:

1. **React app** — new `src/components/LogoBanner.jsx`, rendered in
   `App.jsx` between `<Statement />` and `<Footer />` (inside `<main>`).
2. **Static copy** — identical markup pasted into `preview.html` between
   the statement section and footer; styles mirrored into `preview.css`.
   No JS port needed (the marquee is CSS-only).

### Files touched

| File | Change |
|---|---|
| `src/data.js` | New `logoBanner` export: `{ eyebrow, logos: [{ name, id }] }` |
| `src/components/LogoMarks.jsx` | **New.** One inline-SVG component per company mark, `currentColor`, normalized to ~28px visual height, width auto. Exports a lookup used by `LogoBanner`. |
| `src/components/LogoBanner.jsx` | **New.** Presentational; reads `logoBanner` from `data.js`. |
| `src/App.jsx` | Render `<LogoBanner />` between Statement and Footer. |
| `src/index.css` | `.logos__*` component classes + `logos-scroll` keyframes in `@layer components`. |
| `preview.html` | Mirrored static markup (SVGs inlined). |
| `preview.css` | Mirrored styles. |

`Icons.jsx` stays reserved for shared UI glyphs; brand marks get their own
module.

## Markup structure

```
section.logos            (aria-label from eyebrow copy)
  div.logos__inner       (page container)
    p.logos__eyebrow     ("TRUSTED BY TEAMS WORLDWIDE", existing eyebrow style)
  div.logos__marquee     (viewport; overflow hidden; edge fade mask)
    ul.logos__track      (the six logos rendered TWICE, back to back)
      li.logos__item × 6   (first copy; sr-only company name + aria-hidden svg)
      li.logos__item × 6   (second copy; aria-hidden entirely)
```

## Marquee mechanics (pure CSS)

- Track renders the logo list twice; keyframes animate
  `transform: translateX(0 → -50%)`, `linear`, `infinite`, ~30s. Because
  the two halves are identical, the wrap point is invisible (seamless loop).
- Track width must be content-driven (`width: max-content`) so `-50%` is
  exactly one copy's width.
- `:hover` on the marquee sets `animation-play-state: paused`.
- Edge fade: `mask-image: linear-gradient(to right, transparent, black 10%,
  black 90%, transparent)` on the viewport so marks enter/exit softly.

## Styling

- All rules live in `src/index.css` `@layer components` under BEM-ish
  `.logos__*` names, mirrored verbatim into `preview.css`. No inline
  utility classes in JSX.
- Logos: `color: var(--color-ink)` at ~50% opacity; full opacity on
  per-logo hover. Canvas background. Consistent gap (~64px) between marks.
- Eyebrow reuses the site's existing all-caps micro-label treatment.

## Accessibility & motion

- Section `aria-label="Trusted by teams worldwide"`.
- Each first-copy item contains the company name in a `.u-sr-only` span;
  the SVG itself is `aria-hidden`.
- The duplicate half of the track is `aria-hidden="true"` so AT hears each
  company once.
- `prefers-reduced-motion: reduce` → `animation: none`; the strip is a
  static row (overflow hidden, first copy visible). Same convention as the
  existing scroll-animation invariants.

## Logo sourcing

Fetch real marks via the logo-search tool (Samsung, DJI, BYD, Xiaomi,
AIMA, Hyundai); normalize each to single-color `currentColor` paths.
**Fallback:** any mark that can't be sourced as clean SVG (AIMA is the
likely case) is typeset as an Inter wordmark styled to match the strip, so
the row still reads uniformly.

## Verification

No tests or linter are configured. Verify by:

1. `npm run dev` → confirm seamless loop (no visible jump at the wrap
   point), hover pauses, edge fades render.
2. DevTools reduced-motion emulation → strip is static.
3. Open `preview.html` by double-click → identical appearance/behavior.
