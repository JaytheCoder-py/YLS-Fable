# Hero Word Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate anthropic.com's staggered hero-headline word reveal in both the React app and the standalone `preview.html`.

**Architecture:** A small `WordReveal` React component splits the headline into per-word spans at render time (links preserved by recursing into elements); pure CSS transitions animate them; an IntersectionObserver adds an `is-revealed` class to trigger. `preview.html` gets a near-verbatim port of the live site's vanilla inline script.

**Tech Stack:** React 18, plain CSS (Tailwind v4 `@layer components`), vanilla JS for the static preview. **No new dependencies.**

**Spec:** `docs/superpowers/specs/2026-07-07-hero-word-reveal-design.md`

## Global Constraints

- Animation constants, measured from the live site (use verbatim): initial `opacity: 0; transform: translateY(24px)`; transition `opacity, transform` over **800ms** with easing **`cubic-bezier(0.16, 1, 0.3, 1)`**; per-word random `transition-delay` uniform in **100–500ms**; IntersectionObserver **threshold 0.2**; reveal applied inside `requestAnimationFrame`.
- Only the H1 animates — not the hero subtitle.
- `prefers-reduced-motion: reduce` must show the headline fully visible with no transition.
- The React app and `preview.html` must end up visually identical (repo sync rule, see CLAUDE.md).
- This repo has **no test framework** (see CLAUDE.md); verification is scripted browser checks via the Playwright MCP tools (exact snippets given per task). Do not add a test framework.
- `src/main.jsx` wraps the app in `React.StrictMode` — effects run twice in dev; any observer must be disconnected in the effect cleanup.
- Code style: modern JSX in `src/`; the inline scripts in `preview.html` use ES5-style `var`/`function () {}` — match that.

---

### Task 1: `WordReveal` component + CSS + Hero integration (React app)

**Files:**
- Create: `src/components/WordReveal.jsx`
- Modify: `src/index.css` (insert after the `.hero__sub` rule, currently line 84, inside `@layer components`)
- Modify: `src/components/Hero.jsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `WordReveal({ children })` — default export, wraps arbitrary inline JSX (text + inline anchors). CSS classes `.u-sr-only`, `.animate-word`, `.animate-space`, `.word-reveal`, state class `.is-revealed` (Task 2's script and Task 3's docs refer to these exact names).

- [ ] **Step 1: Create `src/components/WordReveal.jsx`**

```jsx
import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef } from 'react';

// Staggered word reveal replicating the live anthropic.com hero effect
// (constants measured from the site's inline script, July 2026): each word
// starts at opacity 0 / translateY(24px) and transitions in over 800ms
// (expo-out) after a random 100-500ms delay, so words surface in random
// order rather than left-to-right. The intact sentence lives in a
// .u-sr-only copy for screen readers; the split copy is aria-hidden and
// its link clones are unfocusable, so nothing is announced or tabbed twice
// (the live site skips this and double-exposes the text).
const MIN_DELAY = 100;
const MAX_DELAY = 500;
const THRESHOLD = 0.2;

const randomDelay = () =>
  `${Math.round(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY)}ms`;

function splitNode(node, key) {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
      .split(/(\s+)/)
      .filter(Boolean)
      .map((part, i) =>
        /\s/.test(part) ? (
          <span key={`${key}-${i}`} className="animate-space">{part}</span>
        ) : (
          <span
            key={`${key}-${i}`}
            className="animate-word"
            style={{ transitionDelay: randomDelay() }}
          >
            {part}
          </span>
        )
      );
  }
  if (isValidElement(node)) {
    const unfocus = node.type === 'a' ? { tabIndex: -1 } : {};
    return cloneElement(
      node,
      { key, ...unfocus },
      Children.map(node.props.children, (child, i) => splitNode(child, `${key}-${i}`))
    );
  }
  return node;
}

export default function WordReveal({ children }) {
  const ref = useRef(null);
  const split = useMemo(
    () => Children.map(children, (child, i) => splitNode(child, `w${i}`)),
    [children]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          requestAnimationFrame(() => el.classList.add('is-revealed'));
          observer.disconnect();
        });
      },
      { threshold: THRESHOLD }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span className="word-reveal" ref={ref}>
      <span className="u-sr-only">{children}</span>
      <span aria-hidden="true">{split}</span>
    </span>
  );
}
```

- [ ] **Step 2: Add CSS to `src/index.css`**

Insert directly after the `.hero__sub` rule (line 84), still inside `@layer components`:

```css
  /* Hero word reveal — constants measured from the live site's inline
     script (July 2026): words rise 24px over 800ms expo-out, each after a
     random 100-500ms delay assigned by WordReveal.jsx; spaces pop with the
     trigger. text-decoration: inherit lets link-underlines paint on the
     inline-block word spans. */
  .u-sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
  }
  .animate-word {
    display: inline-block;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .8s cubic-bezier(.16, 1, .3, 1), transform .8s cubic-bezier(.16, 1, .3, 1);
    will-change: opacity, transform;
    text-decoration: inherit;
  }
  .animate-space { opacity: 0; }
  .is-revealed .animate-word { opacity: 1; transform: none; }
  .is-revealed .animate-space { opacity: 1; }
  @media (prefers-reduced-motion: reduce) {
    .animate-word, .animate-space { transition: none; opacity: 1; transform: none; }
  }
```

- [ ] **Step 3: Wrap the headline in `src/components/Hero.jsx`**

Replace the whole file with:

```jsx
import WordReveal from './WordReveal.jsx';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container-page hero__grid">
        <h1 className="hero__title">
          <WordReveal>
            AI <a href="#">research</a> and <a href="#">products</a> that put safety at the frontier
          </WordReveal>
        </h1>
        <p className="hero__sub">
          AI will have a vast impact on the world. Anthropic is a public benefit corporation
          dedicated to securing its benefits and mitigating its risks.
        </p>
      </div>
    </section>
  );
}
```

Keep the WordReveal children on a single line — JSX preserves the inline spaces around the anchors there; splitting onto multiple lines would drop them.

- [ ] **Step 4: Verify in the dev server**

Run: `npm run dev` (background). Then with Playwright MCP, navigate to `http://localhost:5173` and evaluate:

```js
() => {
  const h1 = document.querySelector('.hero__title');
  const words = h1.querySelectorAll('[aria-hidden="true"] .animate-word');
  const c = getComputedStyle(words[0]);
  const delays = [...words].map(w => parseFloat(w.style.transitionDelay));
  return {
    words: words.length,
    revealed: !!h1.querySelector('.word-reveal.is-revealed'),
    opacity: c.opacity,
    duration: c.transitionDuration,
    easing: c.transitionTimingFunction,
    delaysInRange: delays.every(d => d >= 100 && d <= 500),
    srAnchors: h1.querySelectorAll('.u-sr-only a').length,
    visibleAnchorTabIndex: h1.querySelector('[aria-hidden="true"] a').tabIndex,
    noOverflow: document.documentElement.scrollWidth <= window.innerWidth,
  };
}
```

Expected: `words: 10`, `revealed: true`, `opacity: "1"`, `duration: "0.8s, 0.8s"`, `easing` containing `cubic-bezier(0.16, 1, 0.3, 1)`, `delaysInRange: true`, `srAnchors: 2`, `visibleAnchorTabIndex: -1`, `noOverflow: true`.

Also resize to 375×812 (`browser_resize`) and re-check `noOverflow: true`.

Reduced-motion check via `mcp__playwright__browser_run_code_unsafe`:

```js
async (page) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  return page.evaluate(() => {
    const w = document.querySelector('.animate-word');
    const c = getComputedStyle(w);
    return { opacity: c.opacity, transform: c.transform };
  });
}
```

Expected: `opacity: "1"`, `transform: "none"` (immediately, without waiting for the transition). Reset with `emulateMedia({ reducedMotion: null })` afterwards.

- [ ] **Step 5: Commit**

```bash
git add src/components/WordReveal.jsx src/components/Hero.jsx src/index.css
git commit -m "feat: staggered hero word reveal in React app"
```

---

### Task 2: Word-reveal script in `preview.html`

**Files:**
- Modify: `preview.html` — insert a new `<script>` block after the existing feature-card script's closing `</script>` (line 252), before `</body>`.

**Interfaces:**
- Consumes: CSS class names established in Task 1 (`.animate-word`, `.animate-space`, `.u-sr-only`) — the preview injects its own copies, but the names must match for the repo sync rule.
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Insert the script**

This is a near-verbatim port of the live site's inline script (kept 1:1 including its accessibility behavior; the React app's aria-hidden improvement is app-only — see spec "Deliberate deviation"). Insert after line 252 (`</script>` of the feature-card block):

```html
  <script>
    // Staggered hero word reveal (mirrors the React WordReveal component).
    // Near-verbatim port of the live anthropic.com inline script (July 2026):
    // words rise 24px over 800ms (expo-out), each after a random 100-500ms
    // delay. document.write only runs when JS is enabled, so a no-JS open
    // still shows the headline.
    document.write('<style id="word-animation-fouc">h1:not(.no-animate){opacity:0 !important;}</style>');

    document.addEventListener('DOMContentLoaded', function () {
      var CONFIG = {
        selector: 'h1:not(.no-animate)',
        minDelay: 100,
        maxDelay: 500,
        duration: 800,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        translateY: 24,
        threshold: 0.2,
      };

      var style = document.createElement('style');
      style.textContent =
        '.animate-word{display:inline-block;opacity:0;transform:translateY(' + CONFIG.translateY + 'px);' +
        'transition:opacity ' + CONFIG.duration + 'ms ' + CONFIG.easing + ',transform ' + CONFIG.duration + 'ms ' + CONFIG.easing + ';' +
        'will-change:opacity,transform;text-decoration:inherit;}' +
        '.animate-space{display:inline;opacity:0;}' +
        '.word-animation-processed{opacity:1 !important;}' +
        '.u-sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;}' +
        '@media (prefers-reduced-motion: reduce){' +
        '.animate-word{transition:none !important;opacity:1 !important;transform:none !important;}' +
        '.animate-space{opacity:1 !important;}}';
      document.head.appendChild(style);

      document.querySelectorAll(CONFIG.selector).forEach(function (element) {
        var srOnly = document.createElement('span');
        srOnly.className = 'u-sr-only';
        srOnly.innerHTML = element.innerHTML;

        function processNode(node) {
          if (node.nodeType === Node.TEXT_NODE) {
            var text = node.textContent;
            if (!text.trim()) return document.createTextNode(text);
            var fragment = document.createDocumentFragment();
            var regex = /\S+/g;
            var lastIndex = 0;
            var match;
            while ((match = regex.exec(text)) !== null) {
              if (match.index > lastIndex) {
                var spaceSpan = document.createElement('span');
                spaceSpan.textContent = text.substring(lastIndex, match.index);
                spaceSpan.className = 'animate-space';
                fragment.appendChild(spaceSpan);
              }
              var wordSpan = document.createElement('span');
              wordSpan.textContent = match[0];
              wordSpan.className = 'animate-word';
              wordSpan.style.transitionDelay =
                (Math.random() * (CONFIG.maxDelay - CONFIG.minDelay) + CONFIG.minDelay) + 'ms';
              fragment.appendChild(wordSpan);
              lastIndex = match.index + match[0].length;
            }
            if (lastIndex < text.length) {
              var trailing = document.createElement('span');
              trailing.textContent = text.substring(lastIndex);
              trailing.className = 'animate-space';
              fragment.appendChild(trailing);
            }
            return fragment;
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            var clone = node.cloneNode(false);
            Array.prototype.forEach.call(node.childNodes, function (child) {
              clone.appendChild(processNode(child));
            });
            return clone;
          }
          return node.cloneNode(true);
        }

        var processed = document.createDocumentFragment();
        Array.prototype.slice.call(element.childNodes).forEach(function (node) {
          processed.appendChild(processNode(node));
        });

        element.innerHTML = '';
        element.appendChild(srOnly);
        element.appendChild(processed);
        element.classList.add('word-animation-processed');

        var observer = new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            requestAnimationFrame(function () {
              element.querySelectorAll('.animate-word').forEach(function (word) {
                word.style.opacity = '1';
                word.style.transform = 'translateY(0)';
              });
              element.querySelectorAll('.animate-space').forEach(function (space) {
                space.style.opacity = '1';
              });
            });
            obs.disconnect();
          });
        }, { threshold: CONFIG.threshold });
        observer.observe(element);
      });

      var foucStyle = document.getElementById('word-animation-fouc');
      if (foucStyle) foucStyle.remove();
    });
  </script>
```

- [ ] **Step 2: Verify the static preview**

With Playwright MCP, navigate to `file:///C:/Users/jason/Claude/Projects/YLS-Anthropic-style/preview.html`, wait ~1.5s for the transition to finish, and evaluate:

```js
() => {
  const h1 = document.querySelector('h1');
  const words = h1.querySelectorAll('.animate-word');
  return {
    processed: h1.classList.contains('word-animation-processed'),
    words: words.length,
    srOnly: !!h1.querySelector('.u-sr-only'),
    anchorsInSplit: h1.querySelectorAll('a').length,
    firstWordOpacity: getComputedStyle(words[0]).opacity,
    foucGone: !document.getElementById('word-animation-fouc'),
  };
}
```

Expected: `processed: true`, `words: 10`, `srOnly: true`, `anchorsInSplit: 4` (2 in the sr-only clone + 2 in the split copy — matches the live site), `firstWordOpacity: "1"`, `foucGone: true`.

- [ ] **Step 3: Commit**

```bash
git add preview.html
git commit -m "feat: hero word reveal in static preview"
```

---

### Task 3: Documentation

**Files:**
- Modify: `README.md` (add a section after "Scroll animation (GSAP)", which ends at line 55; extend "Fidelity notes"; add `WordReveal.jsx` to the structure listing at lines 37-39)
- Modify: `CLAUDE.md` (architecture section)

**Interfaces:**
- Consumes: component/class names from Tasks 1–2 (`WordReveal.jsx`, `.animate-word`).
- Produces: nothing.

- [ ] **Step 1: README — add after the "Scroll animation (GSAP)" section (line 55)**

```markdown
## Hero word reveal

The headline replicates anthropic.com's staggered reveal, with constants measured from the
live site's inline script (July 2026): each word starts at `opacity: 0` /
`translateY(24px)` and transitions in over **800ms** (`cubic-bezier(0.16, 1, 0.3, 1)`)
after a **random 100–500ms delay** — words surface in random order, not left-to-right.
The trigger is an IntersectionObserver (threshold 0.2); `prefers-reduced-motion` shows the
headline statically. `src/components/WordReveal.jsx` splits the words at render time
(preserving the inline links); `preview.html` embeds a near-verbatim port of the live
site's vanilla script.
```

In the structure listing (lines 37-39), add `WordReveal.jsx` to the components:

```
    Nav.jsx  Hero.jsx  FeatureCard.jsx  WordReveal.jsx
```

Append to the "Fidelity notes" deliberate-substitutions list:

```markdown
- **Headline reveal accessibility** — the live site exposes the split headline to screen
  readers twice (its sr-only clone plus the un-hidden animated copy). The React app instead
  marks the animated copy `aria-hidden` with unfocusable link clones; `preview.html` keeps
  the live behavior 1:1.
```

- [ ] **Step 2: CLAUDE.md — extend the architecture section**

After the "**Scroll animation**" paragraph, add:

```markdown
**Hero word reveal** (`src/components/WordReveal.jsx`): splits the headline into per-word
spans at render time (recursing into inline anchors), each with a random 100–500ms
`transition-delay`; an IntersectionObserver (threshold 0.2) adds `.is-revealed` and CSS
transitions (800ms expo-out, 24px rise, defined in `index.css`) do the animation. The
intact sentence is kept in a `.u-sr-only` copy; the split copy is `aria-hidden`.
`preview.html` embeds a vanilla-JS port of the same effect.
```

- [ ] **Step 3: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: document hero word reveal"
```

---

## Final Verification (after all tasks)

1. `npm run dev` → visually confirm: words rise in random order on load; links underlined and clickable; no layout jump when the animation ends.
2. Open `preview.html` from disk → same effect.
3. `npm run build` → completes without errors.
