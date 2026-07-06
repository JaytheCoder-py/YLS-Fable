# Announcement Card Pair — Design

**Date:** 2026-07-07
**Branch:** `feature/announcement-card`
**Status:** Approved

## Goal

Replace the single kraft feature card ("Announcing Fable 5") with **two side-by-side
announcement cards**, each showing a looping placeholder "video" with a minimal text
overlay. The pair keeps the existing expand-on-scroll behavior: inset 1272px rounded
cards → full-bleed square-cornered band, with the gap between the cards preserved
throughout (visible seam at full expansion).

## Decisions made during brainstorming

| Question | Decision |
|---|---|
| Which section | The big kraft FeatureCard (not LatestReleases) |
| Layout | Two cards, left and right |
| Media | Generated placeholders — pure CSS animation (no JS, no binary assets) |
| Expand style | Pair expands as one unit; gap/seam between cards stays constant |
| Text | Minimal overlay per card (eyebrow + CTA), video is the star |

## Component structure

`src/components/FeatureCard.jsx` is **replaced** by `src/components/AnnouncementCards.jsx`;
`App.jsx` imports the new component in the same slot (Hero → AnnouncementCards → LatestReleases).

```
<section class="feature-section">        ← unchanged wrapper; owns --expand
  <div class="feature-pair">             ← flex row, max-width interpolates
    <article class="vcard">              ← ×2, flex:1, rounded, overflow hidden
      <div class="vcard__media vcard__media--a">   ← CSS-animated "video" layer
      <div class="vcard__overlay">                 ← bottom-left corner
        <p class="vcard__eyebrow">…</p>
        <a class="btn">… <ArrowRight/></a>
```

## Content (src/data.js)

New `announcementCards` array; components stay presentational per project convention.

```js
export const announcementCards = [
  { eyebrow: 'Announcing Fable 5',  cta: 'Continue reading', href: '#', variant: 'a' },
  { eyebrow: 'Introducing Sonnet 5', cta: 'Model details',    href: '#', variant: 'b' },
];
```

## Placeholder media (the CSS "video")

- `.vcard__media` fills the card (`position:absolute; inset:0`).
- Motion: layered radial/linear gradients on an **oversized** child/pseudo-element
  (~140% of the card), drifted with a slow (~20s) `transform` keyframe loop —
  transform-only so it stays GPU-composited.
- Palette: card A = warm kraft (`--color-kraft` #f5e3c7 base with warmer accents);
  card B = deeper clay/stone tones so left/right read differently.
- Grain: reuse the existing SVG `feTurbulence` data-URI overlay (as on `.feature::before`)
  on top of the gradients, `mix-blend-mode: multiply`, low opacity.
- `@media (prefers-reduced-motion: reduce)` → `animation: none` (static frame).
- **Swap path for real video:** a ready rule
  `.vcard__media video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }`
  so a future `<video autoplay muted loop playsinline>` dropped inside `.vcard__media`
  just works with no CSS changes.

## Text overlay

- `.vcard__overlay` pinned bottom-left of each card (absolute, e.g. 32px inset;
  20px on mobile).
- Eyebrow: serif (`--font-serif`), ~28px, ink color (contrast on kraft is fine).
- CTA: existing `.btn` component class.

## Scroll behavior (mechanics unchanged)

Same GSAP ScrollTrigger as today, moved into `AnnouncementCards.jsx`:

- Scrubs `--expand` 0→1 on `.feature-section` from `self.progress`
  (`start: 'top 40%'`, `end: 'top 8%'`) — progress-driven so it can never stick expanded.
- Reduced motion: JS bails out early; cards stay inset.
- `ScrollTrigger.refresh()` after `document.fonts.ready` and `window load`.

CSS interpolation against `--expand`:

- `.feature-section { padding-inline: calc(24px * (1 - var(--expand))) }` — unchanged.
- `.feature-pair { max-width: calc(1272px + 1728px * var(--expand)); margin-inline:auto;
  display:flex; gap:16px }` — gap is **constant** (the seam).
- `.vcard { flex:1; border-radius: calc(24px * (1 - var(--expand))); overflow:hidden;
  min-height:640px }` — cards ≈ square at rest on desktop.

## Responsive

- ≤1024px: no structural change (cards shrink with the container).
- ≤767px: `.feature-pair` stacks (`flex-direction: column`), each card min-height ~340px;
  radius/padding interpolation uses the existing 20px mobile values.

## Mirroring (project invariant)

The identical section must be reproduced in the zero-build copy:

- `preview.html`: replace the feature card markup with the pair markup; update the
  inline GSAP script the same way.
- `preview.css`: add the same `.feature-pair` / `.vcard*` rules.

## Docs

Update the CLAUDE.md architecture section: page composition (FeatureCard →
AnnouncementCards) and the scroll-animation paragraph (single card → pair; same
invariants).

## Out of scope

- Real video assets (placeholder-only; swap path documented above).
- Any change to Hero, LatestReleases, Statement, Footer, or nav.
- The missing capture.mjs / DESIGN.md tooling noted in CLAUDE.md.

## Verification

No tests or linter are configured. Verify in a browser (dev server + preview.html):

1. Scroll scrub: pair expands to full-bleed and back, never sticks.
2. Seam: gap stays constant during expansion.
3. Reduced motion (emulated): cards inset, media static.
4. Mobile width (~375px): cards stack, overlay legible.
5. `preview.html` opened from disk matches the React app visually.
