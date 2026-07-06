# CTA Section — Design

**Date:** 2026-07-07
**Branch:** `feature/cta-section`
**Status:** Approved

## Goal

Add a call-to-action band at the bottom of the page (between Statement and Footer),
modeled on a reference screenshot — dark full-bleed band, left-aligned heading,
one supporting line, primary + secondary button pair — translated into this
project's design language and tokens.

## Decisions made during brainstorming

| Question | Decision |
|---|---|
| Visual treatment | Dark band in the footer's `--color-footer` (#141210), flush above the footer so the page ends in one continuous dark run |
| Copy | Claude platform pitch (fictional, matching the replica's July-2026 content) |
| Component boundary | Separate `CtaSection` component, not folded into `Footer` |
| Motion | None — the band is static |

## Component structure

New `src/components/CtaSection.jsx`, rendered last inside `<main>` in `App.jsx`
(Hero → AnnouncementCards → LatestReleases → Statement → **CtaSection**), Footer after.

```
<section class="cta">                    ← full-bleed dark band
  <div class="container-page">
    <h2 class="cta__title">…</h2>
    <p class="cta__sub">…</p>
    <div class="cta__actions">
      <a class="cta__btn cta__btn--primary" …>…</a>
      <a class="cta__btn cta__btn--secondary" …>…</a>
```

## Content (src/data.js)

New `ctaSection` object; the component stays presentational per project convention.

```js
export const ctaSection = {
  title: 'Ready to build with Claude?',
  body: 'Start with the Claude Developer Platform, or talk to our team about Claude for Enterprise.',
  primary: { label: 'Try Claude for free', href: '#' },
  secondary: { label: 'Talk to sales', href: '#' },
};
```

## Visual design (src/index.css, `@layer components`)

- `.cta`: `background: var(--color-footer)`; `margin-top: 96px` (taking over the
  page-end spacing currently on `.footer`); padding `96px 0 104px`.
- `.cta__title`: Inter (`--font-sans`), 44px, weight 700, `letter-spacing: -0.022em`
  (the hero title's voice one step down), `line-height: 1.15`, color `#f4f2ec`
  (the footer wordmark's off-white), margin `0 0 20px`.
- `.cta__sub`: 18px, `line-height: 1.55`, `color: var(--color-footer-link)` (#d7d4cd),
  `max-width: 52ch`, margin `0 0 36px`.
- `.cta__actions`: `display: flex; flex-wrap: wrap; gap: 12px`.
- `.cta__btn`: same geometry as the existing `.btn` — `display: inline-flex;
  align-items: center; font-size: 15px; font-weight: 500; border-radius: 8px;
  padding: 11px 20px; transition: background .2s ease`.
- `.cta__btn--primary`: `background: var(--color-canvas); color: var(--color-ink)`;
  hover `background: #fff`.
- `.cta__btn--secondary`: `background: rgba(255,255,255,.12); color: #f4f2ec`;
  hover `background: rgba(255,255,255,.18)`. (Translucent fill — matches the
  reference's gray secondary without a new color token.)

### Seam with the footer

- `.footer`'s `margin-top: 96px` becomes `margin-top: 0` — the CTA band and the
  footer form one continuous dark region.
- `.footer` gains `border-top: 1px solid rgba(255,255,255,.08)` — the same
  hairline the footer already uses internally — separating the CTA content from
  the wordmark row.

## Responsive

At the existing ≤767px breakpoint: `.cta` padding drops to `64px 0`,
`.cta__title` to 32px. Buttons wrap naturally via `flex-wrap` (no special rules).
No change at the 1024px breakpoint (the band shrinks with the container).

## Motion / accessibility

- No animation; nothing to guard for `prefers-reduced-motion`.
- Buttons are plain anchors (`href: '#'` like the rest of the replica);
  contrast: #f4f2ec and #d7d4cd on #141210 both clear WCAG AA.

## Mirroring (project invariant)

The identical section must be reproduced in the zero-build copy:

- `preview.html`: add the same section markup between the statement section and the footer.
- `preview.css`: add the same `.cta*` rules and the `.footer` margin/border changes.

## Docs

Update CLAUDE.md's page-composition line: … → Statement → CtaSection → Footer.

## Out of scope

- Real destinations for the buttons (all links in the replica are `#`).
- Any change to Nav, Hero, AnnouncementCards, LatestReleases, Statement, or the
  footer's internal content.

## Verification

No tests or linter are configured. Verify in a browser (dev server + preview.html):

1. Band is full-bleed dark, flush with the footer — no canvas gap; hairline visible.
2. Desktop (~1440px): title/body/buttons left-aligned inside the 1272px container.
3. Mobile width (~375px): 32px title, reduced padding, buttons wrap cleanly.
4. `preview.html` opened from disk matches the React app visually.
