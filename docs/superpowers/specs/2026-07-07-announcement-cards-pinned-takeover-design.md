# Announcement Cards — Pinned Takeover — Design

**Date:** 2026-07-07
**Branch:** `feature/announcement-cards`
**Status:** Approved
**Supersedes:** `2026-07-07-announcement-cards-viewport-takeover-design.md` (the
reservation/centering approach shipped in e372356)

## Problem

The reservation approach (`min-height: 100svh` + vertical centering) puts the
centering slack directly between the hero text and the cards: measured 211px at a
1440×933 viewport vs ~64px before the takeover work. The user wants the original
tight gap back, the height takeover kept, and the expansion to begin around the
fourth mouse-wheel notch.

## Approach

Replace the height reservation with a **pinned scrub** — the option the superseded
spec explicitly listed as "can be layered on later". The rest layout reverts to
exactly pre-takeover flow; when the section top reaches the viewport top
(measured scrollY 469 ≈ wheel notch 4.7), GSAP pins it and ~2 wheel notches of
held scroll drive the full takeover.

## Decisions

| Question | Decision |
|---|---|
| Rest layout | Fully reverted: no `min-height`, no flex centering on `.feature-section`. Hero→cards gap back to ~64px; no dead band below the cards. |
| Pin window | `start: 'top top'`, `end: '+=200'`, `pin: true` — pin engages ≈ notch 4.7, takeover completes in ~2 notches of held scroll ("deliberately punchy", matching the superseded spec's scrub length). |
| Pin jump | `anticipatePin: 1`. |
| Reflow below | Handled by GSAP's pin spacer (`pinSpacing` default true) — nothing below moves during the scrub. |
| Next-section overlap | `.feature-section { position: relative; z-index: 1 }` so the growing cards paint over Latest releases, which may peek ~100px at the fold early in the hold before the cards overtake it (accepted, standard takeover look). |
| Height interpolation | Unchanged from e372356: `.feature-pair` lerps `640px → 100svh` (mobile `692px → 100svh`) against `--expand`; `.vcard` stretches. |
| "Can never stick" invariant | Unchanged: `--expand` driven from `self.progress` in `onUpdate`/`onRefresh`; refresh after `fonts.ready`/`load` still runs (pin start/end recompute on refresh). |
| Reduced motion | JS bail-out unchanged (no ScrollTrigger → no pin, no spacer). CSS block simplifies: the `.feature-section` overrides are no longer needed; keep `.feature-pair { height: auto }` and `.vcard { min-height: 640px }` (340px ≤767px). |

## Code changes

### `src/index.css` (mirrored in `preview.css`)

```css
.feature-section {
  --expand: 0;
  margin-top: 24px;
  position: relative;   /* NEW: stacking context for the pinned takeover */
  z-index: 1;           /* NEW: cards paint over the next section sliding up under them */
  padding-inline: calc(24px * (1 - var(--expand)));
  /* REMOVED: min-height 100vh/100svh, display:flex, flex-direction, justify-content */
}
/* .feature-pair, .vcard, ≤767px block: unchanged from e372356 */

@media (prefers-reduced-motion: reduce) {
  /* REMOVED: .feature-section { min-height: 0; display: block; } */
  .feature-pair { height: auto; }
  .vcard { min-height: 640px; }
}
@media (prefers-reduced-motion: reduce) and (max-width: 767px) {
  .vcard { min-height: 340px; }
}
```

### `src/components/AnnouncementCards.jsx` (mirrored in `preview.html` inline script)

```js
const st = ScrollTrigger.create({
  trigger: section,
  start: 'top top',    // pin when the cards reach the viewport top (~4-5 wheel notches in)
  end: '+=200',        // ~two wheel notches of held scroll drive the takeover
  pin: true,
  anticipatePin: 1,
  onUpdate: (self) => setExpand(self.progress),
  onRefresh: (self) => setExpand(self.progress),
});
```

Comment blocks in both files are rewritten to describe pin semantics (spacer,
hold, z-index guard) instead of the height reservation.

## Docs

- CLAUDE.md scroll-animation paragraph: reservation description → pinned-scrub
  description (pin window, spacer, z-index guard, unchanged invariants).
- README "Scroll animation (GSAP)" section: same rewrite; tuning note becomes
  `start`/`end`/pin in `AnnouncementCards.jsx`.

## Out of scope

- Card content, media placeholders, CTA section, any other section.
- Changing the takeover's final size (still 100vw × 100svh) or the 16px seam.

## Verification

Browser, both implementations (dev server + `preview.html`), desktop ~1440×900 and ~375px:

1. Rest: hero→cards gap ≈ 64px; no dead band below the cards; layout identical to
   pre-takeover (`master`'s announcement section) except during the scrub.
2. Scroll: ~4-5 notches of normal scroll, then the section pins at the viewport top
   and ~2 notches complete the takeover (100vw × 100svh, square corners, 16px seam),
   then it unpins and Latest releases scrolls in.
3. Scrub is reversible mid-hold; never sticks expanded (progress-driven).
4. Content below never reflows during the hold (pin spacer).
5. Reduced motion: static inset layout, no pin/spacer, identical to pre-takeover.
6. Mobile: stacked cards split the takeover height; same pin behavior.
