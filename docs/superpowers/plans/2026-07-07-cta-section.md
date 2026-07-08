# Bottom CTA Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dark full-bleed call-to-action band between the Statement section and the Footer.

**Architecture:** A new presentational `CtaSection` component (copy in `src/data.js`, BEM-ish classes in `src/index.css` `@layer components`) renders last inside `<main>`. The band uses the footer's `--color-footer` (#141210) and sits flush above the footer: the 96px page-end margin moves from `.footer` to `.cta`, and `.footer` gains a `rgba(255,255,255,.08)` hairline top border as the seam.

**Tech Stack:** React 18, Vite 6, Tailwind v4 (`@theme` tokens + handwritten component layer). No tests or linter configured — verification is visual, in the dev server.

**Spec:** `docs/superpowers/specs/2026-07-07-cta-section-design.md`

## Global Constraints

- Copy lives in `src/data.js`, never hardcoded in JSX (project convention).
- Styling lives in CSS component classes, not JSX utility classes.
- Colors/sizes come from the spec verbatim: band `var(--color-footer)`, title 44px/700 `-0.022em` `#f4f2ec`, body 18px `var(--color-footer-link)` max-width 52ch, buttons 15px/500 radius 8px padding 11px 20px, secondary fill `rgba(255,255,255,.12)` → hover `.18`, band padding `96px 0 104px` (`64px 0` and title 32px at ≤767px).
- All links are `href="#"` (replica convention).
- Commit messages end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: CTA section in the React app

**Files:**
- Create: `src/components/CtaSection.jsx`
- Modify: `src/data.js` (add `ctaSection` export after `featuredLinks`, ~line 48)
- Modify: `src/App.jsx` (import + render after `<Statement />`)
- Modify: `src/index.css` (new `.cta*` rules after the Statement block ~line 215; `.footer` rule ~line 218; ≤767px block ~line 275)

**Interfaces:**
- Consumes: existing tokens `--color-footer`, `--color-canvas`, `--color-ink`, `--color-footer-link`; existing `.container-page` class.
- Produces: `ctaSection` data shape `{ title, body, primary: {label, href}, secondary: {label, href} }` and class names `.cta`, `.cta__title`, `.cta__sub`, `.cta__actions`, `.cta__btn`, `.cta__btn--primary`, `.cta__btn--secondary`.

- [ ] **Step 1: Add the copy to `src/data.js`**

Insert after the `featuredLinks` array (page order — the CTA renders between the link list and the footer):

```js
export const ctaSection = {
  title: 'Ready to build with Claude?',
  body: 'Start with the Claude Developer Platform, or talk to our team about Claude for Enterprise.',
  primary: { label: 'Try Claude for free', href: '#' },
  secondary: { label: 'Talk to sales', href: '#' },
};
```

- [ ] **Step 2: Create `src/components/CtaSection.jsx`**

```jsx
import { ctaSection } from '../data.js';

export default function CtaSection() {
  return (
    <section className="cta">
      <div className="container-page">
        <h2 className="cta__title">{ctaSection.title}</h2>
        <p className="cta__sub">{ctaSection.body}</p>
        <div className="cta__actions">
          <a className="cta__btn cta__btn--primary" href={ctaSection.primary.href}>
            {ctaSection.primary.label}
          </a>
          <a className="cta__btn cta__btn--secondary" href={ctaSection.secondary.href}>
            {ctaSection.secondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Render it in `src/App.jsx`**

Add the import and render the component after `<Statement />`, inside `<main>`:

```jsx
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import AnnouncementCards from './components/AnnouncementCards.jsx';
import LatestReleases from './components/LatestReleases.jsx';
import Statement from './components/Statement.jsx';
import CtaSection from './components/CtaSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <AnnouncementCards />
        <LatestReleases />
        <Statement />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Add the CSS to `src/index.css`**

Inside `@layer components`, between the Statement/link-list block (ends with `.linklist__cat`, ~line 215) and the `/* Footer */` comment, add:

```css
  /* CTA band — full-bleed footer-dark run into the footer */
  .cta { margin-top: 96px; background: var(--color-footer); padding: 96px 0 104px; }
  .cta__title { margin: 0 0 20px; font-size: 44px; font-weight: 700; letter-spacing: -0.022em; line-height: 1.15; color: #f4f2ec; }
  .cta__sub { margin: 0 0 36px; font-size: 18px; line-height: 1.55; color: var(--color-footer-link); max-width: 52ch; }
  .cta__actions { display: flex; flex-wrap: wrap; gap: 12px; }
  .cta__btn { display: inline-flex; align-items: center; font-size: 15px; font-weight: 500; border-radius: 8px; padding: 11px 20px; transition: background .2s ease; }
  .cta__btn--primary { background: var(--color-canvas); color: var(--color-ink); }
  .cta__btn--primary:hover { background: #fff; }
  .cta__btn--secondary { background: rgba(255,255,255,.12); color: #f4f2ec; }
  .cta__btn--secondary:hover { background: rgba(255,255,255,.18); }
```

Change the `.footer` rule (the CTA takes over the page-end margin; the hairline is the seam):

```css
  .footer { margin-top: 0; border-top: 1px solid rgba(255,255,255,.08); background: var(--color-footer); color: var(--color-footer-text); }
```

In the existing `@media (max-width: 767px)` block, after the `.statement__lead` line, add:

```css
  .cta { padding: 64px 0; }
  .cta__title { font-size: 32px; }
```

- [ ] **Step 5: Verify in the dev server**

Run: `npm run dev` and open http://localhost:5173. Check:
- Dark band appears after the link list; heading "Ready to build with Claude?", one body line, two buttons (light primary, translucent secondary).
- Band is full-bleed (reaches both viewport edges); text left-aligned inside the 1272px container.
- No canvas-colored gap between band and footer; a faint hairline separates CTA content from the ANTHROP\C wordmark row.
- At 375px width: title 32px, reduced padding, buttons wrap if needed.
- Hovers: primary → white, secondary → lighter translucent.

Expected: all five hold; no horizontal scrollbar at any width.

- [ ] **Step 6: Commit**

```bash
git add src/data.js src/components/CtaSection.jsx src/App.jsx src/index.css
git commit -m "Add bottom CTA section to React app

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: Document the CTA section in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md:35` (page-composition line)

**Interfaces:**
- Consumes: component name `CtaSection` from Task 1.
- Produces: nothing further.

- [ ] **Step 1: Update the composition line**

Change line 35 from:

```markdown
**Page composition** is flat: `App.jsx` renders Nav → Hero → AnnouncementCards → LatestReleases → Statement → Footer. Shared inline SVGs are in `src/components/Icons.jsx`.
```

to:

```markdown
**Page composition** is flat: `App.jsx` renders Nav → Hero → AnnouncementCards → LatestReleases → Statement → CtaSection → Footer. Shared inline SVGs are in `src/components/Icons.jsx`. The CTA band and the footer share the same dark surface and sit flush: the page-end margin lives on `.cta` (not `.footer`), and `.footer`'s hairline top border is the seam between them.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "Document CTA section in CLAUDE.md

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```
