# Announcement Cards — Viewport Takeover — Design

**Date:** 2026-07-07
**Branch:** `feature/announcement-cards`
**Status:** Approved (requirements given directly; decisions below recorded for review)

## Goal

Extend the announcement card pair's expand-on-scroll so that, in addition to going
full-bleed in width, the pair grows to fill the full viewport **height** (100vh)
before the next section (Latest releases) can enter — a full-screen takeover moment.
Also start the effect about two scroll-wheel notches (~200px) later than today.

## Decisions

| Question | Decision |
|---|---|
| Pin the section during expansion? | **No pin.** The section reserves `100svh` in layout and the cards grow inside it; expansion completes exactly when the section top reaches the viewport top, so the takeover finishes before the next section appears. Avoids pin spacers and keeps the progress-driven "can never stick" invariant. |
| Where does the extra height come from? | `.feature-section` becomes a `min-height: 100svh` flex column with the pair **top-aligned** (amended 2026-07-07: originally centered, but centering put ~146px of slack between the hero text and the cards; top-aligning keeps the hero→cards gap at the original ~64px and moves all slack below the cards, where the growth consumes it). Height is reserved up front → zero reflow below while the cards grow (no ScrollTrigger position drift). |
| Height interpolation | `.feature-pair` gets `height: calc(640px * (1 - var(--expand)) + 100svh * var(--expand))`; `.vcard` drops its fixed `min-height` and stretches to the pair. |
| "Two scrollwheels later" | Wheel notch ≈ 100px in Chrome/Windows → ~200px ≈ 20% of a ~1000px viewport. `start: 'top 40%'` → `'top 20%'`. |
| End position | `end: 'top top'` (was `'top 8%'`): full width **and** full height land exactly at viewport alignment. |
| Viewport unit | `100svh` with `100vh` fallback line (older browsers), so mobile URL-bar resizes don't cause jumps. |
| Reduced motion | Extend the existing reduced-motion block: drop the `100svh` reservation and restore the static card heights → layout identical to before this change. |
| Mobile (≤767px) | Stacked pair lerps from its natural 692px (2×340 + 12 gap) to `100svh`; cards get `flex: 1; min-height: 0` and split the height evenly. |

## Scroll behavior

Same GSAP ScrollTrigger mechanics (progress-driven `--expand`, refresh on
`fonts.ready`/`load`, reduced-motion bail-out). Only the window changes:

- `start: 'top 10%'` (amended 2026-07-07 from `'top 20%'`) — expansion begins around the
  fourth wheel notch of page scroll. Because the section top is unchanged in the document
  (the reservation grows downward), this is a true 0.1×viewport delay in scroll distance.
- `end: 'top top'` — at progress 1 the pair is 100vw × 100svh and covers the viewport;
  the next section sits exactly at the fold and scrolls in only after the takeover.
- Scrub distance = 10% of the viewport (~90-100px): a deliberately punchy takeover.

## CSS changes (both `src/index.css` and `preview.css`)

```css
.feature-section {
  min-height: 100vh;  /* fallback */
  min-height: 100svh;
  display: flex; flex-direction: column; justify-content: center;
  /* --expand, margin-top, padding-inline unchanged */
}
.feature-pair {
  height: calc(640px * (1 - var(--expand)) + 100vh * var(--expand));   /* fallback */
  height: calc(640px * (1 - var(--expand)) + 100svh * var(--expand));
  will-change: max-width, height;
  /* max-width / gap unchanged — the 16px seam persists at full takeover */
}
.vcard { /* min-height: 640px removed — stretches to the pair's height */ }

@media (prefers-reduced-motion: reduce) {
  .feature-section { min-height: 0; display: block; }
  .feature-pair { height: auto; }
  .vcard { min-height: 640px; }
}

@media (max-width: 767px) {
  .feature-pair { height: calc(692px * (1 - var(--expand)) + 100svh * var(--expand)); }
  .vcard { flex: 1; min-height: 0; }  /* was min-height: 340px */
  /* reduced-motion override restores min-height: 340px */
}
```

## Mirroring (project invariant)

Identical changes in the zero-build copy: `preview.css` rules and the inline
ScrollTrigger config in `preview.html` (`start`/`end` strings + comments).

## Docs

Update the CLAUDE.md scroll-animation paragraph (max-width → max-width + height /
takeover; new start/end) and the README's announcement-cards description if it
mentions the trigger window.

## Out of scope

- Pinning / held takeover (can be layered on later with `pin: true` if wanted).
- Any change to card content, media placeholders, or other sections.

## Verification

No tests configured; verify in a browser (dev server and `preview.html`):

1. Full takeover: at the moment the section top hits the viewport top, the pair is
   exactly viewport-sized (100vw × 100svh), corners square, 16px seam intact.
2. Timing: expansion starts ~200px later in scroll distance than `master`.
3. Scrubbing up/down mid-range interpolates smoothly; never sticks expanded.
4. Nothing below the cards shifts while they grow (reserved-height check).
5. Reduced motion: static inset layout identical to `master`.
6. Mobile ~375px: stacked cards split the takeover height evenly.
