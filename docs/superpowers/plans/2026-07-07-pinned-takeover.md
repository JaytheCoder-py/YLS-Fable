# Pinned Announcement-Cards Takeover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the announcement cards' height-reservation takeover with a pinned scrub, restoring the original tight rest layout while keeping the full-viewport growth.

**Architecture:** The section returns to normal flow (no `min-height: 100svh`, no flex centering — the 211px hero→cards gap collapses back to ~64px). GSAP ScrollTrigger gains `pin: true` with `start: 'top top'`, `end: '+=200'`: the page scrolls normally until the cards reach the viewport top, holds for ~200px of scroll while `--expand` scrubs 0→1 (width `1272px→full-bleed`, height `640px→100svh`), then releases. A pin spacer prevents reflow below; `z-index: 1` on the section keeps the growing cards painted over the next section. Mirrored in the zero-build preview.

**Tech Stack:** React 18, Vite 6, GSAP ScrollTrigger (npm in `src/`, CDN in `preview.html`), Tailwind v4 component-layer CSS. No tests/linter — verification is visual in a browser.

**Spec:** `docs/superpowers/specs/2026-07-07-announcement-cards-pinned-takeover-design.md`

## Global Constraints

- Two parallel implementations must stay in sync: `src/` (React) and `preview.html`+`preview.css` (zero-build). Every visual change lands in both.
- ScrollTrigger config verbatim: `start: 'top top'`, `end: '+=200'`, `pin: true`, `anticipatePin: 1`; `--expand` driven ONLY from `self.progress` in `onUpdate`/`onRefresh` (never a free-running tween).
- `.feature-section` gains exactly `position: relative; z-index: 1` and loses exactly `min-height: 100vh`, `min-height: 100svh`, `display: flex`, `flex-direction: column`, `justify-content: center`. Nothing else in the rule changes.
- `.feature-pair` and `.vcard` rules (including the ≤767px block) are NOT touched.
- Reduced-motion CSS: remove only the `.feature-section { min-height: 0; display: block; }` line; keep `.feature-pair { height: auto; }`, `.vcard { min-height: 640px; }` and the 767px `min-height: 340px` override.
- If any "old" text below does not match the file exactly, STOP and report BLOCKED with what you found — do not improvise.
- Dev server: `npm run dev` — port 5173 is often taken by the user's own server; Vite bumps automatically (e.g. 5175). Always use the port Vite prints.
- Commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Pinned takeover in the React app

**Files:**
- Modify: `src/index.css` (`.feature-section` rule + its comment, ~lines 114-131; reduced-motion block at end of file, ~lines 307-319)
- Modify: `src/components/AnnouncementCards.jsx` (comment block ~lines 16-26; ScrollTrigger config ~lines 39-46)

**Interfaces:**
- Consumes: existing `--expand` interpolation CSS (`.feature-pair` max-width/height calcs) — unchanged.
- Produces: the exact ScrollTrigger config and CSS deltas that Task 2 mirrors into the preview files, and the behavior Task 3 documents.

- [ ] **Step 1: Update the `.feature-section` rule and comment in `src/index.css`**

Replace this block (inside `@layer components`):

```css
  /* Announcement card pair — a viewport takeover. As --expand is scrubbed
     0 -> 1 by GSAP ScrollTrigger the pair goes from an inset 1272px row
     (24px radius, 640px tall) to a full-bleed, full-viewport band (square
     corners, 100svh tall); the 16px gap between the cards is constant,
     leaving a seam even at full takeover. The section reserves the full
     takeover height up front (cards vertically centered inside), so the
     height animation never reflows the layout below mid-scrub. width:100%
     caps max-width at the section width, so the pair reaches the true
     viewport edges without causing horizontal scroll. */
  .feature-section {
    --expand: 0;
    margin-top: 24px;
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-inline: calc(24px * (1 - var(--expand)));
  }
```

with:

```css
  /* Announcement card pair — a pinned viewport takeover. The section rests
     in normal flow (cards 640px tall, 24px radius, inset 1272px); GSAP pins
     it when its top reaches the viewport top and ~200px of held scroll scrub
     --expand 0 -> 1, growing the pair to a full-bleed 100svh band (square
     corners, constant 16px seam). The pin spacer keeps the layout below from
     reflowing during the hold; z-index lets the cards paint over the next
     section if it peeks at the fold. width:100% caps max-width at the
     section width, so the pair reaches the true viewport edges without
     causing horizontal scroll. */
  .feature-section {
    --expand: 0;
    margin-top: 24px;
    position: relative;
    z-index: 1;
    padding-inline: calc(24px * (1 - var(--expand)));
  }
```

- [ ] **Step 2: Simplify the reduced-motion block at the end of `src/index.css`**

Replace:

```css
/* Reduced motion: skip the viewport takeover entirely — drop the reserved
   room and restore the static card heights. JS leaves --expand at 0, so this
   matches the original inset layout. Placed after the responsive block so it
   wins the cascade at every width. */
@media (prefers-reduced-motion: reduce) {
  .feature-section { min-height: 0; display: block; }
  .feature-pair { height: auto; }
  .vcard { min-height: 640px; }
}
```

with:

```css
/* Reduced motion: skip the takeover entirely — JS creates no ScrollTrigger
   (no pin), --expand stays 0, and these rules restore the static card
   heights. Placed after the responsive block so it wins the cascade at
   every width. */
@media (prefers-reduced-motion: reduce) {
  .feature-pair { height: auto; }
  .vcard { min-height: 640px; }
}
```

(The following `@media (prefers-reduced-motion: reduce) and (max-width: 767px)` block stays as-is.)

- [ ] **Step 3: Update the comment block in `src/components/AnnouncementCards.jsx`**

Replace these comment lines (part of the block comment above the component):

```
// Scroll behaviour: the pair starts as an inset 1272px row (24px corners) and,
// as it rises toward the top of the viewport, expands into a full-viewport
// takeover — full-bleed width AND 100svh height, square corners — completing
// exactly when the section top reaches the viewport top, i.e. before the next
// section can enter; the gap between the cards stays constant. The section
// reserves the takeover height in CSS, so nothing below reflows mid-scrub.
// We drive a single --expand variable (0 -> 1) straight from ScrollTrigger's
// progress; the CSS interpolates the pair's width + height and each card's
// radius against it. Using self.progress (rather than a free-running tween)
// means the value is always tied to the real scroll position, so it can never
// get "stuck" expanded.
```

with:

```
// Scroll behaviour: the pair rests as an inset 1272px x 640px row (24px
// corners) in normal flow. When the section top reaches the viewport top,
// ScrollTrigger pins it and ~200px of held scroll scrub the takeover:
// full-bleed width AND 100svh height, square corners, constant 16px seam.
// GSAP's pin spacer keeps the layout below from reflowing during the hold,
// and the section's z-index lets the growing cards paint over the next
// section if it peeks at the fold. We drive a single --expand variable
// (0 -> 1) straight from ScrollTrigger's progress; the CSS interpolates the
// pair's width + height and each card's radius against it. Using
// self.progress (rather than a free-running tween) means the value is always
// tied to the real scroll position, so it can never get "stuck" expanded.
```

- [ ] **Step 4: Update the ScrollTrigger config in `src/components/AnnouncementCards.jsx`**

Replace:

```js
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 20%',   // ~two wheel notches (~200px) later than the old 40%
      end: 'top top',     // full takeover exactly as the section tops out
      onUpdate: (self) => setExpand(self.progress),
      onRefresh: (self) => setExpand(self.progress),
    });
```

with:

```js
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',   // pin when the cards reach the viewport top
      end: '+=200',       // ~two wheel notches of held scroll drive the takeover
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => setExpand(self.progress),
      onRefresh: (self) => setExpand(self.progress),
    });
```

- [ ] **Step 5: Verify in the dev server**

Run `npm run dev`, open the printed URL (NOT necessarily :5173) at a ~1440×900 viewport. Check:
1. Rest layout: cards sit ~64px below the hero text (measure: `.feature-pair` top minus `.hero__grid` bottom ≈ 64px, not ~211px); no large empty band between cards and "Latest releases".
2. Scroll down slowly: the page scrolls normally until the cards reach the viewport top, then HOLDS (pinned) while ~200px of wheel input grows the cards to exactly full viewport (square corners, 16px seam intact), then releases and Latest releases scrolls in.
3. Scroll back up mid-hold: the growth reverses smoothly; nothing sticks.
4. During the hold, content below does not shift (pin spacer); if Latest releases peeks at the fold it slides UNDER the growing cards (z-index guard).
5. No horizontal scrollbar at any point; at progress 1 the pair is 100vw × viewport height.
6. Emulate `prefers-reduced-motion: reduce` (DevTools or preview_resize colorScheme tooling doesn't cover this — use DevTools Rendering emulation or CSS override check): cards static inset 640px, no pin, no spacer.
7. At ~375px width: stacked cards, same pin behavior, takeover fills the viewport.

Expected: all seven hold.

- [ ] **Step 6: Commit**

```bash
git add src/index.css src/components/AnnouncementCards.jsx
git commit -m "Pin the announcement-cards takeover; restore tight rest layout

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Mirror the pinned takeover into the zero-build preview

**Files:**
- Modify: `preview.css` (`.feature-section` block + banner comment, ~lines 161-176; reduced-motion block at end of file, ~lines 532-541)
- Modify: `preview.html` (inline script comment + ScrollTrigger config, ~lines 249-272)

**Interfaces:**
- Consumes: the config/CSS deltas from Task 1 (already committed) — the preview must match them exactly, translated to preview.css's multi-line formatting and the inline script's `var`/`function` style.
- Produces: nothing further.

- [ ] **Step 1: Update the `.feature-section` block in `preview.css`**

Replace:

```css
/* ---------- Announcement card pair (viewport takeover via --expand) ----------
   The section reserves the full takeover height up front (cards centered
   inside), so the height animation never reflows the layout below. */
.feature-section {
  --expand: 0;
  margin-top: 24px;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-inline: calc(24px * (1 - var(--expand)));
}
```

with:

```css
/* ---------- Announcement card pair (pinned takeover via --expand) ----------
   The section rests in normal flow; GSAP pins it at the viewport top and
   ~200px of held scroll drive the takeover. The pin spacer prevents reflow
   below; z-index keeps the growing cards above the next section. */
.feature-section {
  --expand: 0;
  margin-top: 24px;
  position: relative;
  z-index: 1;
  padding-inline: calc(24px * (1 - var(--expand)));
}
```

- [ ] **Step 2: Simplify the reduced-motion block at the end of `preview.css`**

Replace:

```css
/* Reduced motion: skip the viewport takeover entirely — drop the reserved
   room and restore the static card heights. JS leaves --expand at 0, so this
   matches the original inset layout. Placed after the responsive block so it
   wins the cascade at every width. */
@media (prefers-reduced-motion: reduce) {
  .feature-section { min-height: 0; display: block; }
  .feature-pair { height: auto; }
  .vcard { min-height: 640px; }
}
```

with:

```css
/* Reduced motion: skip the takeover entirely — JS creates no ScrollTrigger
   (no pin), --expand stays 0, and these rules restore the static card
   heights. Placed after the responsive block so it wins the cascade at
   every width. */
@media (prefers-reduced-motion: reduce) {
  .feature-pair { height: auto; }
  .vcard { min-height: 640px; }
}
```

(The following `@media (prefers-reduced-motion: reduce) and (max-width: 767px)` block stays as-is.)

- [ ] **Step 3: Update the inline script in `preview.html`**

Replace the script comment:

```
    // Scroll-driven viewport takeover of the announcement card pair (mirrors
    // the React AnnouncementCards). --expand (0 -> 1) is driven straight from
    // ScrollTrigger's progress; the CSS interpolates the pair's width + height
    // (full-bleed, 100svh at progress 1) and corner radius against it, with
    // the takeover height reserved in layout so nothing below reflows. Reading
    // self.progress (rather than running a tween) keeps the value tied to the
    // real scroll position, so it can never get stuck fully expanded.
```

with:

```
    // Pinned viewport takeover of the announcement card pair (mirrors the
    // React AnnouncementCards). The section rests in normal flow; ScrollTrigger
    // pins it at the viewport top and ~200px of held scroll drive --expand
    // (0 -> 1); the CSS interpolates the pair's width + height (full-bleed,
    // 100svh at progress 1) and corner radius against it. The pin spacer
    // prevents reflow below. Reading self.progress (rather than running a
    // tween) keeps the value tied to the real scroll position, so it can
    // never get stuck fully expanded.
```

and replace the config:

```js
      var st = ScrollTrigger.create({
        trigger: section,
        start: 'top 20%',   // ~two wheel notches (~200px) later than the old 40%
        end: 'top top',     // full takeover exactly as the section tops out
        onUpdate: function (self) { setExpand(self.progress); },
        onRefresh: function (self) { setExpand(self.progress); },
      });
```

with:

```js
      var st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',   // pin when the cards reach the viewport top
        end: '+=200',       // ~two wheel notches of held scroll drive the takeover
        pin: true,
        anticipatePin: 1,
        onUpdate: function (self) { setExpand(self.progress); },
        onRefresh: function (self) { setExpand(self.progress); },
      });
```

- [ ] **Step 4: Verify the static preview**

Open `preview.html` from disk (file:// or a static server — Playwright's browser can't open file:// directly; `npx serve .` or similar works). Run the same seven checks as Task 1 Step 5 (rest gap ~64px; pin-hold-release; reversible; no reflow below; no horizontal overflow; reduced-motion static; 375px stack). Then compare against the React dev server (`npm run dev`, use the port Vite prints): pin engage point, hold length, and final takeover must match.

- [ ] **Step 5: Commit**

```bash
git add preview.css preview.html
git commit -m "Mirror pinned takeover into zero-build preview

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Update CLAUDE.md and README for pin semantics

**Files:**
- Modify: `CLAUDE.md:36` (the **Scroll animation** paragraph)
- Modify: `README.md` ("## Scroll animation (GSAP)" section, ~lines 45-65)

**Interfaces:**
- Consumes: behavior/config from Tasks 1-2 (`start: 'top top'`, `end: '+=200'`, `pin: true`, `anticipatePin: 1`).
- Produces: nothing further.

- [ ] **Step 1: Replace the CLAUDE.md scroll-animation paragraph**

Replace the entire paragraph beginning `**Scroll animation** (`src/components/AnnouncementCards.jsx`):` (one long line) with:

```markdown
**Scroll animation** (`src/components/AnnouncementCards.jsx`): GSAP ScrollTrigger pins the section when its top reaches the viewport top (`start: 'top top'`, `end: '+=200'`, `pin: true`, `anticipatePin: 1`) and scrubs a single `--expand` CSS variable 0→1 over ~200px of held scroll; CSS in `index.css` interpolates the pair's `max-width` and `height` and each card's `border-radius` against it (inset 1272px × 640px row → full-bleed 100svh viewport takeover, with the gap between the two cards constant throughout). The section rests in normal flow (no reserved height); GSAP's pin spacer prevents reflow below during the hold, and the section's `z-index: 1` keeps the growing cards above the next section if it peeks at the fold. Key invariants: the value is driven from `self.progress` so it can never stick expanded; `prefers-reduced-motion` skips the ScrollTrigger entirely (no pin/spacer, static inset layout) and freezes the cards' CSS placeholder-media drift; ScrollTrigger refreshes after fonts/load since font swaps shift trigger and pin positions. Tune the feel via `start`/`end` in the ScrollTrigger config. Each card's "video" is CSS-only (`.vcard__media` gradients + grain); drop a `<video autoplay muted loop playsinline>` inside `.vcard__media` to use real footage.
```

- [ ] **Step 2: Replace the README "Scroll animation (GSAP)" section body**

Replace everything between the `## Scroll animation (GSAP)` heading and the next `##` heading with:

```markdown
The announcement section extends anthropic.com's scroll behaviour into a pinned viewport
takeover: the card pair rests as an inset 1272px × 640px row (24px corners) in normal flow;
when its top reaches the viewport top, **ScrollTrigger pins the section and ~200px of held
scroll expand it to a full-bleed, full-height band (100svh, square corners)**, with a constant
16px gap between the two cards that stays visible as a seam even at full takeover.
`src/components/AnnouncementCards.jsx` uses **GSAP ScrollTrigger** (`start: 'top top'`,
`end: '+=200'`, `pin: true`, `anticipatePin: 1`) to scrub a single `--expand` variable from
0 → 1 (driven from `self.progress`, so it can never stick expanded); the CSS in
`src/index.css` interpolates the pair's `max-width` (`calc(1272px + 1728px * var(--expand))`)
and `height` (`calc(640px * (1 - var(--expand)) + 100svh * var(--expand))`) and each card's
`border-radius` (`calc(24px * (1 - var(--expand)))`) against it. GSAP's pin spacer keeps the
layout below from moving during the hold, and the section's `z-index: 1` keeps the growing
cards above the next section. It respects `prefers-reduced-motion` (no pin, static inset
layout). The standalone `preview.html` does the same via the GSAP CDN.

Tune the feel via the ScrollTrigger `start` / `end` / `pin` values in `AnnouncementCards.jsx`.
```

- [ ] **Step 3: Confirm scope and commit**

Run `git diff --stat` — exactly CLAUDE.md and README.md, then:

```bash
git add CLAUDE.md README.md
git commit -m "Document pinned takeover in CLAUDE.md and README

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
