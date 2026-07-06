# Hero word reveal — design

**Date:** 2026-07-07
**Status:** Approved

## Goal

Replicate anthropic.com's staggered hero-headline reveal ("AI research and products that
put safety at the frontier") in both implementations of this replica: the React app
(`src/`) and the standalone static copy (`preview.html`).

## Measured behavior (extracted from the live site, 2026-07-07)

The live effect is a small vanilla inline script, not GSAP. Verified constants:

| Property | Value |
|---|---|
| Split granularity | per word (`\S+`); whitespace kept in separate spans |
| Initial state | `opacity: 0; transform: translateY(24px)` per word |
| Transition | `opacity, transform` — 800 ms, `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) |
| Delay | random per word, uniform 100–500 ms → words reveal in **random order**, not left-to-right |
| Trigger | IntersectionObserver, threshold 0.2, reveal inside `requestAnimationFrame` |
| Links | preserved by recursive node walking; word spans get `text-decoration: inherit` |
| Accessibility | original sentence kept in a `.u-sr-only` clone; `prefers-reduced-motion: reduce` disables the animation entirely |
| Spaces | `.animate-space` spans: `opacity 0 → 1` with no transition |

Only the H1 animates in the live hero; the subtitle does not.

## Design

### React app

**New component `src/components/WordReveal.jsx`** — renders `<span className="word-reveal">` containing:

1. A `.u-sr-only` span holding the original children (screen readers read the intact sentence).
2. An `aria-hidden="true"` span holding the split copy. Children are walked recursively:
   - string children split on whitespace into `<span class="animate-word">` (each with a
     random inline `transition-delay` of 100–500 ms, generated once per mount) and
     `<span class="animate-space">` spans;
   - element children (the two inline anchors) are cloned with their children recursed,
     preserving href and underline.

**Trigger** — `useEffect` attaches an IntersectionObserver (threshold 0.2) to the wrapper;
on intersect it adds an `is-revealed` class inside `requestAnimationFrame` and disconnects.
All animation is CSS-driven; no per-word JS style writes.

**CSS (`src/index.css`, components layer)** — using the measured constants:

- `.animate-word { display: inline-block; opacity: 0; transform: translateY(24px); transition: opacity .8s cubic-bezier(0.16,1,0.3,1), transform .8s cubic-bezier(0.16,1,0.3,1); will-change: opacity, transform; text-decoration: inherit; }`
- `.animate-space { opacity: 0; }`
- `.is-revealed` state → words `opacity: 1; transform: none`, spaces `opacity: 1`
- `@media (prefers-reduced-motion: reduce)` → transitions off, everything visible immediately

**`src/components/Hero.jsx`** — wrap the existing headline content in `<WordReveal>`;
h1 markup otherwise unchanged.

### Static preview

**`preview.html`** — embed a near-verbatim copy of the live site's vanilla inline script,
scoped to `h1`, with the same CONFIG constants, including its FOUC guard (a style injected
only when JS runs, so no-JS opens still show the text).

## Deliberate deviation

The live site does **not** aria-hide the animated copy, so screen readers read the headline
twice there. We add `aria-hidden="true"` to the visual copy — identical visuals, correct
semantics. This follows the repo's convention of documenting deliberate substitutions.

## Verification

1. `npm run dev` → headline words rise in a randomly-ordered stagger on load.
2. Inline links still underlined and clickable.
3. No horizontal overflow at mobile widths (words are inline-block but wrap normally).
4. DevTools reduced-motion emulation → static, fully visible headline.
5. Open `preview.html` from disk → same behavior; also loads fine with JS disabled.
