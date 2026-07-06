# Announcement Card Pair Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single kraft feature card with two side-by-side announcement cards, each showing a CSS-animated placeholder "video" with a minimal bottom-left text overlay, keeping the exact expand-on-scroll behavior (pair expands to full-bleed; gap between cards stays constant).

**Architecture:** A new `AnnouncementCards.jsx` replaces `FeatureCard.jsx` in the same page slot. The `.feature-section` wrapper keeps owning the `--expand` CSS variable (scrubbed 0→1 by GSAP ScrollTrigger, unchanged mechanics); inside it a `.feature-pair` flex row holds two `.vcard` articles whose media layer is pure-CSS animated gradients + grain. The identical change is mirrored into the zero-build `preview.html`/`preview.css`.

**Tech Stack:** React 18, Vite 6, Tailwind v4 (`@theme` tokens only — component styles are handwritten CSS in `@layer components`), GSAP ScrollTrigger.

**Spec:** `docs/superpowers/specs/2026-07-07-announcement-cards-design.md`

## Global Constraints

- **No test runner or linter exists in this repo.** Verification = `npm run build` succeeds + visual check in a browser (dev server on `http://localhost:5173`, and `preview.html` opened from disk).
- **Two parallel implementations must stay in sync:** every visual/content change to `src/` must be mirrored in `preview.html` + `preview.css` (Task 2 does this — Task 1 and Task 2 must both land).
- **All copy lives in `src/data.js`** — components stay presentational; no copy strings hardcoded in JSX.
- **Styling lives in CSS classes** (BEM-ish, in `src/index.css` `@layer components`), not Tailwind utility classes in JSX.
- **Token names differ between the two CSS files:** `src/index.css` uses `--color-kraft`, `--color-ink`, `--font-serif`; `preview.css` uses `--kraft`, `--ink`, `--serif`. Copy rules accordingly, don't paste across.
- **Scroll invariants (from the spec, must survive):** `--expand` is set from `self.progress` (never a free-running tween); `prefers-reduced-motion: reduce` bails out of JS so cards stay inset; `ScrollTrigger.refresh()` runs after `document.fonts.ready` and `window` `load`.
- **No new dependencies, no binary assets.** Placeholder media is CSS only.
- Commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: React app — data, component, styles

**Files:**
- Modify: `src/data.js` (append new export after `releases`, line 35)
- Create: `src/components/AnnouncementCards.jsx`
- Delete: `src/components/FeatureCard.jsx`
- Modify: `src/App.jsx` (lines 3, 14)
- Modify: `src/index.css` (replace lines 110–138 block; edit responsive blocks at lines 200, 212–215)

**Interfaces:**
- Consumes: `ArrowRight` from `src/components/Icons.jsx` (existing, no props); existing `.btn` and `.feature-section` CSS classes.
- Produces: `announcementCards` export in `src/data.js` — array of `{ eyebrow: string, cta: string, href: string, variant: 'a' | 'b' }`; CSS classes `.feature-pair`, `.vcard`, `.vcard__media`, `.vcard__media--a`, `.vcard__media--b`, `.vcard__overlay`, `.vcard__eyebrow`, keyframes `vcard-drift` (Task 2 mirrors these names exactly).

- [ ] **Step 1: Add card content to `src/data.js`**

Insert after the `releases` array (after line 35), before `featuredLinks`:

```js
export const announcementCards = [
  { eyebrow: 'Announcing Fable 5', cta: 'Continue reading', href: '#', variant: 'a' },
  { eyebrow: 'Introducing Sonnet 5', cta: 'Model details', href: '#', variant: 'b' },
];
```

- [ ] **Step 2: Create `src/components/AnnouncementCards.jsx`**

Full file content (the `useEffect` body is byte-identical to the old `FeatureCard.jsx` — the scroll mechanics are deliberately unchanged):

```jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { announcementCards } from '../data.js';
import { ArrowRight } from './Icons.jsx';

gsap.registerPlugin(ScrollTrigger);

// Two side-by-side announcement cards. Each card's "video" is a CSS-animated
// placeholder — layered kraft-palette gradients drifting under the grain
// overlay (see .vcard__media in index.css). Swapping in real footage later is
// dropping a <video autoplay muted loop playsinline> inside .vcard__media.
//
// Scroll behaviour: the pair starts as an inset 1272px row (24px corners) and,
// as it rises toward the top of the viewport, expands to a full-bleed band
// (square corners); the gap between the cards stays constant. We drive a
// single --expand variable (0 -> 1) straight from ScrollTrigger's progress;
// the CSS interpolates the pair's width + each card's radius against it.
// Using self.progress (rather than a free-running tween) means the value is
// always tied to the real scroll position, so it can never get "stuck" expanded.
export default function AnnouncementCards() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced-motion: leave the cards inset (their CSS default).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const setExpand = (p) => section.style.setProperty('--expand', p.toFixed(4));

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',   // contained until the pair is ~40% up the viewport
      end: 'top 8%',      // full-bleed as it reaches the top
      onUpdate: (self) => setExpand(self.progress),
      onRefresh: (self) => setExpand(self.progress),
    });
    setExpand(st.progress);

    // Web fonts change layout heights, which shifts the trigger position —
    // recompute once they're ready and after full load.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      st.kill();
    };
  }, []);

  return (
    <section className="feature-section" ref={sectionRef}>
      <div className="feature-pair">
        {announcementCards.map((card) => (
          <article className="vcard" key={card.eyebrow}>
            <div className={`vcard__media vcard__media--${card.variant}`} />
            <div className="vcard__overlay">
              <p className="vcard__eyebrow">{card.eyebrow}</p>
              <a className="btn" href={card.href}>{card.cta} <ArrowRight /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Swap the component into `src/App.jsx` and delete the old one**

In `src/App.jsx`, change line 3:

```jsx
import AnnouncementCards from './components/AnnouncementCards.jsx';
```

and line 14:

```jsx
        <AnnouncementCards />
```

Then delete the old component:

```bash
git rm src/components/FeatureCard.jsx
```

- [ ] **Step 4: Replace the feature-card CSS in `src/index.css`**

Replace lines 110–138 (the comment block starting `/* Feature card — expands from inset` through the `.feature__desc { ... }` rule, keeping the `.btn` rules that follow) with:

```css
  /* Announcement card pair — the pair expands from inset (1272 / 24px radius)
     to full-bleed (100% / 0 radius) as --expand is scrubbed 0 -> 1 by GSAP
     ScrollTrigger; the 16px gap between the cards is constant, leaving a seam
     at full expansion. width:100% caps max-width at the section width, so the
     pair reaches the true viewport edges without causing horizontal scroll. */
  .feature-section {
    --expand: 0;
    margin-top: 24px;
    padding-inline: calc(24px * (1 - var(--expand)));
  }
  .feature-pair {
    width: 100%;
    max-width: calc(1272px + 1728px * var(--expand));
    margin-inline: auto;
    display: flex;
    gap: 16px;
    will-change: max-width;
  }
  .vcard {
    position: relative;
    flex: 1;
    min-height: 640px;
    border-radius: calc(24px * (1 - var(--expand)));
    background: var(--color-kraft);
    overflow: hidden;
    will-change: border-radius;
  }

  /* Placeholder "video": slow-drifting kraft-palette gradients under the
     grain overlay. The drifting layer (::before) is oversized so its pan
     never exposes an edge; motion is transform-only to stay GPU-composited.
     To swap in real footage, drop a <video autoplay muted loop playsinline>
     inside .vcard__media — the rule at the bottom makes it fill the card,
     and the grain (::after) keeps painting on top. */
  .vcard__media { position: absolute; inset: 0; overflow: hidden; }
  .vcard__media::before {
    content: ""; position: absolute; inset: -20%;
    animation: vcard-drift 22s ease-in-out infinite alternate;
    will-change: transform;
  }
  .vcard__media--a::before {
    background:
      radial-gradient(120% 90% at 20% 25%, #f9edd8 0%, transparent 60%),
      radial-gradient(100% 80% at 80% 75%, #eccfa3 0%, transparent 65%),
      radial-gradient(90% 90% at 65% 20%, #f2ddbb 0%, transparent 55%),
      var(--color-kraft);
  }
  .vcard__media--b::before {
    background:
      radial-gradient(120% 90% at 75% 20%, #e8c9a0 0%, transparent 60%),
      radial-gradient(110% 85% at 20% 80%, #d9a97c 0%, transparent 65%),
      radial-gradient(90% 90% at 40% 40%, #edd7b4 0%, transparent 55%),
      #e3bd93;
    animation-direction: alternate-reverse;
  }
  .vcard__media::after {
    content: ""; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
    opacity: .06; mix-blend-mode: multiply; pointer-events: none;
  }
  .vcard__media video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
  }

  .vcard__overlay { position: absolute; left: 32px; bottom: 32px; }
  .vcard__eyebrow { font-family: var(--font-serif); font-size: 28px; line-height: 1.15; font-weight: 400; margin: 0 0 16px; color: var(--color-ink); }
```

Then add the keyframes + reduced-motion freeze **outside** `@layer components` (after the layer's closing brace at old line 193, before the `/* Responsive */` comment):

```css
/* Placeholder-media drift (announcement cards). Freeze to a static frame
   when the user prefers reduced motion. */
@keyframes vcard-drift {
  from { transform: translate3d(-2.5%, -2%, 0) scale(1.02); }
  to   { transform: translate3d(2.5%, 2%, 0) scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .vcard__media::before { animation: none; }
}
```

- [ ] **Step 5: Update the responsive blocks in `src/index.css`**

In `@media (max-width: 1024px)` (old line 200), delete the line:

```css
  .feature__eyebrow { font-size: 60px; }
```

In `@media (max-width: 767px)` (old lines 212–215), replace:

```css
  .feature-section { padding-inline: calc(20px * (1 - var(--expand))); }
  .feature { min-height: 460px; padding: 48px 20px; border-radius: calc(20px * (1 - var(--expand))); }
  .feature__eyebrow { font-size: 44px; }
  .feature__desc { font-size: 20px; }
```

with:

```css
  .feature-section { padding-inline: calc(20px * (1 - var(--expand))); }
  .feature-pair { flex-direction: column; gap: 12px; }
  .vcard { min-height: 340px; border-radius: calc(20px * (1 - var(--expand))); }
  .vcard__overlay { left: 20px; bottom: 20px; }
  .vcard__eyebrow { font-size: 22px; }
```

- [ ] **Step 6: Verify no stale references and the build passes**

```bash
grep -rn "FeatureCard\|feature__\|\"feature\"" src/
```

Expected: no matches (`.feature-section` remains, but `\.feature\b` alone should only appear as `feature-section`/`feature-pair`).

```bash
npm run build
```

Expected: `vite build` completes with `✓ built in …` and no errors.

- [ ] **Step 7: Visual check in the dev server**

Run `npm run dev` (background), open `http://localhost:5173` in a browser, and confirm:
1. Two kraft-toned cards sit side by side below the hero, rounded, inset to 1272px, each with a slowly drifting gradient + grain and a bottom-left eyebrow + button.
2. Scrolling down expands the pair to the viewport edges with square corners while the 16px seam stays; scrolling back up fully reverses it.
3. At a ~375px-wide viewport the cards stack vertically and the overlay stays legible.
4. With reduced motion emulated (DevTools → Rendering → `prefers-reduced-motion: reduce`, then reload), the cards stay inset and the gradients don't move.

- [ ] **Step 8: Commit**

```bash
git add src/data.js src/components/AnnouncementCards.jsx src/App.jsx src/index.css
git commit -m "Replace feature card with two-up announcement card pair

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

(`git rm` in Step 3 already staged the FeatureCard.jsx deletion.)

---

### Task 2: Mirror into preview.html / preview.css

**Files:**
- Modify: `preview.html` (feature-card section, lines 51–60; inline-script comment at lines 225–229)
- Modify: `preview.css` (feature block at lines 161–208; responsive lines 409 and 430–433)

**Interfaces:**
- Consumes: class names and keyframes produced by Task 1 (`.feature-pair`, `.vcard`, `.vcard__media[--a|--b]`, `.vcard__overlay`, `.vcard__eyebrow`, `vcard-drift`) — must match exactly so the two implementations stay visually identical.
- Produces: nothing consumed later; this is the zero-build mirror. Note `preview.css` custom-property names: use `--kraft`, `--ink`, `--serif` (NOT the `--color-*`/`--font-*` names from `index.css`).

- [ ] **Step 1: Replace the feature section markup in `preview.html`**

Replace lines 51–60 (`<!-- ===== FEATURE CARD … -->` through `</section>`) with:

```html
    <!-- ===================== ANNOUNCEMENT CARDS (expand on scroll) ===================== -->
    <section class="feature-section" id="featureSection">
      <div class="feature-pair">
        <article class="vcard">
          <div class="vcard__media vcard__media--a"></div>
          <div class="vcard__overlay">
            <p class="vcard__eyebrow">Announcing Fable 5</p>
            <a class="btn" href="#">Continue reading
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </article>
        <article class="vcard">
          <div class="vcard__media vcard__media--b"></div>
          <div class="vcard__overlay">
            <p class="vcard__eyebrow">Introducing Sonnet 5</p>
            <a class="btn" href="#">Model details
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </a>
          </div>
        </article>
      </div>
    </section>
```

The inline `<script>` at the bottom needs **no code change** (it targets `#featureSection`, which is unchanged); just update its first comment line from
`// Scroll-driven expansion of the announcement card (mirrors the React`
`// FeatureCard). --expand (0 -> 1) is driven straight from ScrollTrigger's`
to
`// Scroll-driven expansion of the announcement card pair (mirrors the React`
`// AnnouncementCards). --expand (0 -> 1) is driven straight from ScrollTrigger's`

- [ ] **Step 2: Replace the feature block in `preview.css`**

Replace the block from the comment `/* ---------- Feature card (expands on scroll via --expand) ---------- */` (line 161) through the end of the `.feature__desc { … }` rule (ends just before the next `/* ---------- … ---------- */` comment) with:

```css
/* ---------- Announcement card pair (expands on scroll via --expand) ---------- */
.feature-section {
  --expand: 0;
  margin-top: 24px;
  padding-inline: calc(24px * (1 - var(--expand)));
}
.feature-pair {
  width: 100%;
  max-width: calc(1272px + 1728px * var(--expand));
  margin-inline: auto;
  display: flex;
  gap: 16px;
  will-change: max-width;
}
.vcard {
  position: relative;
  flex: 1;
  min-height: 640px;
  border-radius: calc(24px * (1 - var(--expand)));
  background: var(--kraft);
  overflow: hidden;
  will-change: border-radius;
}
/* Placeholder "video": drifting kraft gradients under the paper grain.
   Swap in real footage by dropping <video autoplay muted loop playsinline>
   inside .vcard__media. */
.vcard__media { position: absolute; inset: 0; overflow: hidden; }
.vcard__media::before {
  content: "";
  position: absolute;
  inset: -20%;
  animation: vcard-drift 22s ease-in-out infinite alternate;
  will-change: transform;
}
.vcard__media--a::before {
  background:
    radial-gradient(120% 90% at 20% 25%, #f9edd8 0%, transparent 60%),
    radial-gradient(100% 80% at 80% 75%, #eccfa3 0%, transparent 65%),
    radial-gradient(90% 90% at 65% 20%, #f2ddbb 0%, transparent 55%),
    var(--kraft);
}
.vcard__media--b::before {
  background:
    radial-gradient(120% 90% at 75% 20%, #e8c9a0 0%, transparent 60%),
    radial-gradient(110% 85% at 20% 80%, #d9a97c 0%, transparent 65%),
    radial-gradient(90% 90% at 40% 40%, #edd7b4 0%, transparent 55%),
    #e3bd93;
  animation-direction: alternate-reverse;
}
.vcard__media::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  opacity: 0.06;
  mix-blend-mode: multiply;
  pointer-events: none;
}
.vcard__media video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.vcard__overlay { position: absolute; left: 32px; bottom: 32px; }
.vcard__eyebrow {
  font-family: var(--serif);
  font-size: 28px;
  line-height: 1.15;
  font-weight: 400;
  margin: 0 0 16px;
  color: var(--ink);
}
@keyframes vcard-drift {
  from { transform: translate3d(-2.5%, -2%, 0) scale(1.02); }
  to   { transform: translate3d(2.5%, 2%, 0) scale(1.1); }
}
@media (prefers-reduced-motion: reduce) {
  .vcard__media::before { animation: none; }
}
```

- [ ] **Step 3: Update the responsive blocks in `preview.css`**

In `@media (max-width: 1024px)` (line 409), delete:

```css
  .feature__eyebrow { font-size: 60px; }
```

In `@media (max-width: 767px)` (lines 430–433), replace:

```css
  .feature-section { padding-inline: calc(20px * (1 - var(--expand))); }
  .feature { min-height: 460px; padding: 48px 20px; border-radius: calc(20px * (1 - var(--expand))); }
  .feature__eyebrow { font-size: 44px; }
  .feature__desc { font-size: 20px; }
```

with:

```css
  .feature-section { padding-inline: calc(20px * (1 - var(--expand))); }
  .feature-pair { flex-direction: column; gap: 12px; }
  .vcard { min-height: 340px; border-radius: calc(20px * (1 - var(--expand))); }
  .vcard__overlay { left: 20px; bottom: 20px; }
  .vcard__eyebrow { font-size: 22px; }
```

- [ ] **Step 4: Verify parity in the browser**

```bash
grep -n "feature__\|class=\"feature\"" preview.html preview.css
```

Expected: no matches.

Open `preview.html` directly from disk (`file://` — it is zero-build) in a browser and confirm it matches the React app from Task 1 Step 7: same two cards, same drift, same expand-on-scroll with constant seam, same mobile stacking.

- [ ] **Step 5: Commit**

```bash
git add preview.html preview.css
git commit -m "Mirror announcement card pair into zero-build preview

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Update CLAUDE.md architecture notes

**Files:**
- Modify: `CLAUDE.md` (the "Page composition" line and the "Scroll animation" paragraph in the Architecture section)

**Interfaces:**
- Consumes: final component/file names from Task 1 (`AnnouncementCards.jsx`, `announcementCards` in `data.js`).
- Produces: nothing — documentation only.

- [ ] **Step 1: Update the composition line**

Replace:

```markdown
**Page composition** is flat: `App.jsx` renders Nav → Hero → FeatureCard → LatestReleases → Statement → Footer. Shared inline SVGs are in `src/components/Icons.jsx`.
```

with:

```markdown
**Page composition** is flat: `App.jsx` renders Nav → Hero → AnnouncementCards → LatestReleases → Statement → Footer. Shared inline SVGs are in `src/components/Icons.jsx`.
```

- [ ] **Step 2: Update the scroll-animation paragraph**

Replace:

```markdown
**Scroll animation** (`src/components/FeatureCard.jsx`): GSAP ScrollTrigger scrubs a single `--expand` CSS variable from 0→1 as the card scrolls up; CSS in `index.css` interpolates the card's `max-width` and `border-radius` against it (inset 1272px card → full-bleed band). Key invariants: the value is driven from `self.progress` so it can never stick expanded; `prefers-reduced-motion` leaves the card inset; ScrollTrigger refreshes after fonts/load since font swaps shift trigger positions. Tune the feel via `start`/`end` in the ScrollTrigger config.
```

with:

```markdown
**Scroll animation** (`src/components/AnnouncementCards.jsx`): GSAP ScrollTrigger scrubs a single `--expand` CSS variable from 0→1 as the card pair scrolls up; CSS in `index.css` interpolates the pair's `max-width` and each card's `border-radius` against it (inset 1272px row → full-bleed band, with the gap between the two cards constant throughout). Key invariants: the value is driven from `self.progress` so it can never stick expanded; `prefers-reduced-motion` leaves the pair inset and freezes the cards' CSS placeholder-media drift; ScrollTrigger refreshes after fonts/load since font swaps shift trigger positions. Tune the feel via `start`/`end` in the ScrollTrigger config. Each card's "video" is CSS-only (`.vcard__media` gradients + grain); drop a `<video autoplay muted loop playsinline>` inside `.vcard__media` to use real footage.
```

- [ ] **Step 3: Update the feature-card fonts note**

In the final paragraph of CLAUDE.md, replace:

```markdown
The feature card's kraft tone + CSS grain overlay stands in for the live site's non-redistributable video.
```

with:

```markdown
The announcement cards' CSS-animated kraft gradients + grain overlay stand in for non-redistributable video footage.
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "Document announcement card pair in CLAUDE.md

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

## Final verification (after all tasks)

1. `npm run build` — succeeds.
2. Dev server and `preview.html` side by side — visually identical announcement sections.
3. Full spec checklist (spec §Verification): scrub reversibility, constant seam, reduced-motion inset + static media, ~375px stacking, parity.
