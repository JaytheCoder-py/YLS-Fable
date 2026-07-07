# Research Page Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a second page to the anthropic.com replica — a faithful copy of anthropic.com/research (July 2026) — served as a Vite MPA entry, reusing the existing Nav, Footer, tokens, and CSS conventions.

**Architecture:** `research.html` is a second Vite entry mounting `src/research.jsx` → `ResearchApp.jsx`, which composes Nav → ResearchHero → ResearchTeams → FeaturedResearch → Publications → JoinCta → Footer. All copy lives in a new `researchPage` export in `src/data.js`; all styling goes into `src/index.css` `@layer components` using existing tokens. Publications is the only stateful component (live search + See-more reveal).

**Tech Stack:** React 18, Vite 6 (MPA via `build.rollupOptions.input`), Tailwind v4 tokens + handwritten component CSS. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-07-research-page-design.md` (approved). Read it for layout rationale; this plan contains all code.

## Global Constraints

- Work in the worktree `C:\Users\jason\Claude\Projects\YLS-Anthropic-style\.claude\worktrees\research-page` on branch `worktree-research-page`. Never touch the main checkout.
- **No test framework or linter exists.** The verify cycle for every task is: `npm run build` must succeed (and for UI tasks, a visual check on the dev server at review time). Do not add a test framework.
- Styling goes in `src/index.css` inside `@layer components`, BEM-ish class names, **existing tokens only** (`--color-canvas/ink/graphite/ashen/divider/kraft/footer`, `--color-footer-link`, `--container-page`, `--font-serif`). No inline styles, no Tailwind utility classes in JSX.
- All copy verbatim as given in this plan (it was captured from the live page). Straight apostrophes in JS strings, matching existing `data.js` style (double-quoted strings when the text contains an apostrophe).
- Components are presentational; content comes from `data.js`.
- Do not modify: `preview.html`, `preview.css`, `AnnouncementCards.jsx`, homepage sections, `netlify.toml`.
- Commit after every task with the trailer: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.

---

### Task 1: Vite MPA plumbing (research.html entry + app skeleton)

**Files:**
- Create: `research.html`
- Create: `src/research.jsx`
- Create: `src/ResearchApp.jsx`
- Modify: `vite.config.js`

**Interfaces:**
- Consumes: existing `Nav.jsx`, `Footer.jsx`, `index.css`.
- Produces: `ResearchApp.jsx` with a `<main id="main">` into which Tasks 3–6 insert section components; the dev URL `http://localhost:5173/research.html`.

- [ ] **Step 1: Baseline check — build passes before any change**

Run: `npm run build`
Expected: exits 0, `dist/index.html` emitted. (If this fails, STOP and report — pre-existing breakage.)

- [ ] **Step 2: Create `research.html`** (repo root, sibling of `index.html`)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Our research teams investigate the safety, inner workings, and societal impacts of AI models." />
    <title>Research \ Anthropic</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/research.jsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Create `src/research.jsx`**

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ResearchApp from './ResearchApp.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ResearchApp />
  </React.StrictMode>
);
```

- [ ] **Step 4: Create `src/ResearchApp.jsx`** (skeleton — sections arrive in Tasks 3–6)

```jsx
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';

export default function ResearchApp() {
  return (
    <>
      <Nav />
      <main id="main">
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Register both entries in `vite.config.js`** (replace the whole file)

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// Dev server runs on :5173 to match capture.mjs (npm run capture:build).
// Two MPA entries: the homepage and the research page.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173 },
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        research: fileURLToPath(new URL('./research.html', import.meta.url)),
      },
    },
  },
});
```

- [ ] **Step 6: Verify build emits both pages**

Run: `npm run build && ls dist/research.html dist/index.html`
Expected: exits 0; both files listed.

- [ ] **Step 7: Commit**

```bash
git add research.html src/research.jsx src/ResearchApp.jsx vite.config.js
git commit -m "Add research.html as a second Vite MPA entry with app skeleton"
```

---

### Task 2: Research page content in data.js + nav cross-links

**Files:**
- Modify: `src/data.js` (change `navLinks[0]`; append `researchPage` export at end of file)
- Modify: `src/components/Nav.jsx:8` (wordmark href)

**Interfaces:**
- Consumes: nothing new.
- Produces: `researchPage` export consumed by Tasks 3–6 with shape `{ title, intro, teamsLabel, teamLinks: [{label, href}], teams: [{name, body}], featured: { main: {category, date, title, teaser, href}, side: [same ×4] }, publications: [{date, category, title, href} ×50], join: { title, cta: {label, href} } }`.

- [ ] **Step 1: Point the nav "Research" link at the new page**

In `src/data.js`, change:

```js
  { label: 'Research', href: '#' },
```

to:

```js
  { label: 'Research', href: '/research.html' },
```

- [ ] **Step 2: Make the wordmark link home**

In `src/components/Nav.jsx`, change:

```jsx
        <a className="wordmark" href="#" aria-label="Anthropic home">{WORDMARK}</a>
```

to:

```jsx
        <a className="wordmark" href="/" aria-label="Anthropic home">{WORDMARK}</a>
```

- [ ] **Step 3: Append the `researchPage` export at the end of `src/data.js`**

```js
// Content for the /research page — copy captured verbatim from
// anthropic.com/research (July 2026). Publications carry the 50 rows
// dated 2026 out of the live 149-item archive (deliberate cut).
export const researchPage = {
  title: 'Research',
  intro:
    'Our research teams investigate the safety, inner workings, and societal impacts of AI models—so that artificial intelligence has a positive impact as it becomes increasingly capable.',
  teamsLabel: 'Research teams:',
  teamLinks: [
    { label: 'Alignment', href: '#' },
    { label: 'Economic Research', href: '#' },
    { label: 'Interpretability', href: '#' },
    { label: 'Societal Impacts', href: '#' },
    { label: 'Frontier Red Team', href: '#' },
  ],
  teams: [
    {
      name: 'Interpretability',
      body: 'The mission of the Interpretability team is to understand how large language models work internally, as a foundation for AI safety and positive outcomes.',
    },
    {
      name: 'Alignment',
      body: 'The Alignment team works to understand the risks of AI models and develop ways to ensure that future ones remain helpful, honest, and harmless.',
    },
    {
      name: 'Societal Impacts',
      body: 'Working closely with the Anthropic Policy and Safeguards teams, Societal Impacts is a technical research team that explores how AI is used in the real world.',
    },
    {
      name: 'Frontier Red Team',
      body: 'The Frontier Red Team analyzes the implications of frontier AI models for cybersecurity, biosecurity, and autonomous systems.',
    },
  ],
  featured: {
    main: {
      category: 'Interpretability',
      date: 'Jul 6, 2026',
      title: 'A global workspace in language models',
      teaser:
        "New interpretability research reveals an emergent mental workspace in Claude that holds internal thoughts that don't appear in the model's output.",
      href: '#',
    },
    side: [
      {
        category: 'Economic Research',
        date: 'Jun 26, 2026',
        title: 'Anthropic Economic Index report: Cadences',
        teaser:
          "In our latest Economic Index report, we sample hourly for the first time to ask: When do people come to Claude? What do they produce with it? And how do they perceive AI's impact on their work?",
        href: '#',
      },
      {
        category: 'Alignment',
        date: 'May 8, 2026',
        title: 'Teaching Claude why',
        teaser: "New research on how we've reduced agentic misalignment.",
        href: '#',
      },
      {
        category: 'Research',
        date: 'Apr 24, 2026',
        title: 'Project Deal',
        teaser:
          "We created a marketplace for employees in our San Francisco office, with one big twist. We tasked Claude with buying, selling and negotiating on our colleagues' behalf.",
        href: '#',
      },
      {
        category: 'Societal Impacts',
        date: 'Mar 18, 2026',
        title: 'What 81,000 people want from AI',
        teaser:
          "We invited Claude.ai users to share how they use AI, what they dream it could make possible, and what they fear it might do. Nearly 81,000 people participated—the largest and most multilingual qualitative study of its kind. Here's what we found.",
        href: '#',
      },
    ],
  },
  publications: [
    { date: 'Jul 6, 2026', category: 'Interpretability', title: 'A global workspace in language models', href: '#' },
    { date: 'Jun 26, 2026', category: 'Economic Research', title: 'Anthropic Economic Index report: Cadences', href: '#' },
    { date: 'Jun 18, 2026', category: 'Frontier Red Team', title: 'Project Fetch: Phase two', href: '#' },
    { date: 'Jun 16, 2026', category: 'Economic Research', title: 'Agentic coding and persistent returns to expertise', href: '#' },
    { date: 'Jun 8, 2026', category: 'Science', title: 'Paving the way for agents in biology', href: '#' },
    { date: 'Jun 8, 2026', category: 'Frontier Red Team', title: "Measuring LLMs' impact on N-day exploits", href: '#' },
    { date: 'Jun 5, 2026', category: 'Science', title: 'Making Claude a chemist', href: '#' },
    { date: 'Jun 3, 2026', category: 'Frontier Red Team', title: 'Mapping AI-enabled cyber threats: Insights from the LLM ATT&CK Navigator', href: '#' },
    { date: 'Jun 3, 2026', category: 'Policy', title: "What we learned mapping a year's worth of AI-enabled cyber threats", href: '#' },
    { date: 'May 27, 2026', category: 'Economic Research', title: 'Coding agents in the social sciences', href: '#' },
    { date: 'May 22, 2026', category: 'Announcements', title: 'Project Glasswing: An initial update', href: '#' },
    { date: 'May 22, 2026', category: 'Frontier Red Team', title: "Measuring LLMs' ability to develop exploits", href: '#' },
    { date: 'May 14, 2026', category: 'Policy', title: '2028: Two scenarios for global AI leadership', href: '#' },
    { date: 'May 8, 2026', category: 'Alignment', title: 'Teaching Claude why', href: '#' },
    { date: 'May 7, 2026', category: 'Interpretability', title: "Natural Language Autoencoders: Turning Claude's thoughts into text", href: '#' },
    { date: 'May 7, 2026', category: 'Alignment', title: 'Donating our open-source alignment tool', href: '#' },
    { date: 'May 7, 2026', category: 'Policy', title: 'Focus areas for The Anthropic Institute', href: '#' },
    { date: 'Apr 30, 2026', category: 'Societal Impacts', title: 'How people ask Claude for personal guidance', href: '#' },
    { date: 'Apr 29, 2026', category: 'Science', title: "Evaluating Claude's bioinformatics research capabilities with BioMysteryBench", href: '#' },
    { date: 'Apr 22, 2026', category: 'Economic Research', title: 'Announcing the Anthropic Economic Index Survey', href: '#' },
    { date: 'Apr 22, 2026', category: 'Economic Research', title: 'What 81,000 people told us about the economics of AI', href: '#' },
    { date: 'Apr 14, 2026', category: 'Alignment', title: 'Automated Alignment Researchers: Using large language models to scale scalable oversight', href: '#' },
    { date: 'Apr 9, 2026', category: 'Policy', title: 'Trustworthy agents in practice', href: '#' },
    { date: 'Apr 7, 2026', category: 'Frontier Red Team', title: "Assessing Claude Mythos Preview's cybersecurity capabilities", href: '#' },
    { date: 'Apr 2, 2026', category: 'Interpretability', title: 'Emotion concepts and their function in a large language model', href: '#' },
    { date: 'Mar 31, 2026', category: 'Economic Research', title: 'How Australia Uses Claude: Findings from the Anthropic Economic Index', href: '#' },
    { date: 'Mar 24, 2026', category: 'Economic Research', title: 'Anthropic Economic Index report: Learning curves', href: '#' },
    { date: 'Mar 23, 2026', category: 'Science', title: 'Introducing our Science Blog', href: '#' },
    { date: 'Mar 23, 2026', category: 'Science', title: 'Long-running Claude for scientific computing', href: '#' },
    { date: 'Mar 23, 2026', category: 'Science', title: 'Vibe physics: The AI grad student', href: '#' },
    { date: 'Mar 13, 2026', category: 'Interpretability', title: 'A "diff" tool for AI: Finding behavioral differences in new models', href: '#' },
    { date: 'Mar 6, 2026', category: 'Policy', title: "Partnering with Mozilla to improve Firefox's security", href: '#' },
    { date: 'Mar 6, 2026', category: 'Frontier Red Team', title: "Reverse engineering Claude's CVE-2026-2796 exploit", href: '#' },
    { date: 'Mar 5, 2026', category: 'Economic Research', title: 'Labor market impacts of AI: A new measure and early evidence', href: '#' },
    { date: 'Feb 25, 2026', category: 'Alignment', title: 'An update on our model deprecation commitments for Claude Opus 3', href: '#' },
    { date: 'Feb 23, 2026', category: 'Alignment', title: 'The persona selection model', href: '#' },
    { date: 'Feb 23, 2026', category: 'Announcements', title: 'Anthropic Education Report: The AI Fluency Index', href: '#' },
    { date: 'Feb 18, 2026', category: 'Societal Impacts', title: 'Measuring AI agent autonomy in practice', href: '#' },
    { date: 'Feb 16, 2026', category: 'Economic Research', title: 'India Country Brief: The Anthropic Economic Index', href: '#' },
    { date: 'Feb 5, 2026', category: 'Frontier Red Team', title: 'Evaluating and mitigating the growing risk of LLM-discovered 0-days', href: '#' },
    { date: 'Jan 29, 2026', category: 'Alignment', title: 'How AI assistance impacts the formation of coding skills', href: '#' },
    { date: 'Jan 28, 2026', category: 'Alignment', title: 'Disempowerment patterns in real-world AI usage', href: '#' },
    { date: 'Jan 22, 2026', category: 'Announcements', title: "Claude's new constitution", href: '#' },
    { date: 'Jan 19, 2026', category: 'Interpretability', title: 'The assistant axis: situating and stabilizing the character of large language models', href: '#' },
    { date: 'Jan 16, 2026', category: 'Frontier Red Team', title: 'AI models are showing a greater ability to find and exploit vulnerabilities on realistic cyber ranges', href: '#' },
    { date: 'Jan 15, 2026', category: 'Economic Research', title: 'Anthropic Economic Index: New building blocks for understanding AI use', href: '#' },
    { date: 'Jan 15, 2026', category: 'Economic Research', title: 'Anthropic Economic Index report: Economic primitives', href: '#' },
    { date: 'Jan 14, 2026', category: 'Frontier Red Team', title: 'Finding bugs across the Python ecosystem with Claude and property-based testing', href: '#' },
    { date: 'Jan 9, 2026', category: 'Alignment', title: 'Next-generation Constitutional Classifiers: More efficient protection against universal jailbreaks', href: '#' },
    { date: 'Jan 8, 2026', category: 'Frontier Red Team', title: 'Experimenting with AI to defend critical infrastructure', href: '#' },
  ],
  join: {
    title: 'Join the Research team',
    cta: { label: 'See open roles', href: '#' },
  },
};
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: exits 0. Then `node -e "import('./src/data.js').then(m => console.log(m.researchPage.publications.length))"` → prints `50`.

- [ ] **Step 5: Commit**

```bash
git add src/data.js src/components/Nav.jsx
git commit -m "Add researchPage content to data.js; wire nav Research link and wordmark"
```

---

### Task 3: ResearchHero + ResearchTeams components and CSS

**Files:**
- Create: `src/components/ResearchHero.jsx`
- Create: `src/components/ResearchTeams.jsx`
- Modify: `src/ResearchApp.jsx` (imports + two sections in `<main>`)
- Modify: `src/index.css` (new rules inside `@layer components`; responsive additions)

**Interfaces:**
- Consumes: `researchPage` from Task 2 (`intro`, `teamsLabel`, `teamLinks`, `teams`); existing `WordReveal`.
- Produces: `.rhero` and `.teams` sections; the CSS comment anchor `/* ==== Research page ==== */` in `index.css` that Tasks 4–6 append their rules under.

- [ ] **Step 1: Create `src/components/ResearchHero.jsx`**

```jsx
import WordReveal from './WordReveal.jsx';
import { researchPage } from '../data.js';

export default function ResearchHero() {
  return (
    <section className="rhero">
      <div className="container-page rhero__grid">
        <h1 className="rhero__title">
          <WordReveal>{researchPage.title}</WordReveal>
        </h1>
        <div>
          <p className="rhero__intro">{researchPage.intro}</p>
          <p className="rhero__teams">
            <span className="rhero__teams-label">{researchPage.teamsLabel}</span>
            {researchPage.teamLinks.map((t) => (
              <a key={t.label} className="rhero__team-link" href={t.href}>{t.label}</a>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/ResearchTeams.jsx`**

```jsx
import { researchPage } from '../data.js';

export default function ResearchTeams() {
  return (
    <section className="teams" aria-label="Research teams">
      <div className="container-page">
        <div className="teams__inner">
          {researchPage.teams.map((t) => (
            <div className="teams__cell" key={t.name}>
              <h3 className="teams__name">{t.name}</h3>
              <p className="teams__body">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount both in `src/ResearchApp.jsx`** (replace the whole file)

```jsx
import Nav from './components/Nav.jsx';
import ResearchHero from './components/ResearchHero.jsx';
import ResearchTeams from './components/ResearchTeams.jsx';
import Footer from './components/Footer.jsx';

export default function ResearchApp() {
  return (
    <>
      <Nav />
      <main id="main">
        <ResearchHero />
        <ResearchTeams />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Add the research CSS block to `src/index.css`**

Insert **inside `@layer components`, immediately after the `.footer__legal a:hover { … }` rule and before the layer's closing `}`**:

```css
  /* ==== Research page ==== */

  /* Research hero — h1 left, serif intro + team links right. */
  .rhero { padding-top: 104px; padding-bottom: 56px; }
  .rhero__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
  .rhero__title { margin: 0; font-weight: 700; font-size: 64px; line-height: 1.1; letter-spacing: -0.022em; color: var(--color-ink); }
  .rhero__intro { margin: 0 0 20px; font-family: var(--font-serif); font-size: 24px; line-height: 1.4; color: var(--color-ink); }
  .rhero__teams { margin: 0; display: flex; flex-wrap: wrap; gap: 8px 20px; align-items: baseline; }
  .rhero__teams-label { font-size: 14px; font-weight: 600; color: var(--color-ink); }
  .rhero__team-link { font-size: 14px; color: var(--color-graphite); text-decoration: underline; text-underline-offset: 3px; transition: color .2s ease; }
  .rhero__team-link:hover { color: var(--color-ink); }

  /* Research teams — 4 mission blurbs between hairline rules. */
  .teams__inner {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
    padding-block: 40px;
    border-top: 1px solid var(--color-divider);
    border-bottom: 1px solid var(--color-divider);
  }
  .teams__name { margin: 0 0 10px; font-size: 17px; font-weight: 600; color: var(--color-ink); }
  .teams__body { margin: 0; font-size: 14px; line-height: 1.5; color: var(--color-graphite); }
```

- [ ] **Step 5: Add responsive rules**

In the `@media (max-width: 1024px)` block, after `.footer__cols { grid-template-columns: repeat(3, 1fr); }`, add:

```css
  .rhero__title { font-size: 52px; }
  .teams__inner { grid-template-columns: repeat(2, 1fr); row-gap: 32px; }
```

In the `@media (max-width: 767px)` block, after `.footer__legal { margin-left: 0; }`, add:

```css
  .rhero { padding-top: 64px; padding-bottom: 40px; }
  .rhero__grid { grid-template-columns: 1fr; gap: 24px; }
  .rhero__title { font-size: 40px; }
  .rhero__intro { font-size: 20px; }
  .teams__inner { grid-template-columns: 1fr; }
```

- [ ] **Step 6: Verify**

Run: `npm run build`
Expected: exits 0. Visual check (reviewer): `http://localhost:5173/research.html` shows nav, "Research" h1 rising in on load, serif intro with 5 underlined team links, 4-column team row between hairlines, footer.

- [ ] **Step 7: Commit**

```bash
git add src/components/ResearchHero.jsx src/components/ResearchTeams.jsx src/ResearchApp.jsx src/index.css
git commit -m "Add research hero and teams sections"
```

---

### Task 4: FeaturedResearch component and CSS

**Files:**
- Create: `src/components/FeaturedResearch.jsx`
- Modify: `src/ResearchApp.jsx` (import + section after `<ResearchTeams />`)
- Modify: `src/index.css` (append under the Research-page CSS from Task 3; responsive additions)

**Interfaces:**
- Consumes: `researchPage.featured` (`main`, `side[4]`) from Task 2.
- Produces: `.featured` section between the teams row and Publications.

- [ ] **Step 1: Create `src/components/FeaturedResearch.jsx`**

```jsx
import { researchPage } from '../data.js';

function Meta({ category, date }) {
  return (
    <p className="featured__meta">
      <span className="featured__cat">{category}</span>
      <span className="featured__date">{date}</span>
    </p>
  );
}

export default function FeaturedResearch() {
  const { main, side } = researchPage.featured;
  return (
    <section className="featured" aria-label="Featured research">
      <div className="container-page">
        <div className="featured__inner">
          <a className="featured__main" href={main.href}>
            <article>
              <div className="featured__media" aria-hidden="true" />
              <div className="featured__caption">
                <h3 className="featured__title">{main.title}</h3>
                <div>
                  <Meta category={main.category} date={main.date} />
                  <p className="featured__teaser">{main.teaser}</p>
                </div>
              </div>
            </article>
          </a>
          <div className="featured__side">
            {side.map((item) => (
              <a className="featured__item" href={item.href} key={item.title}>
                <article>
                  <Meta category={item.category} date={item.date} />
                  <h3 className="featured__item-title">{item.title}</h3>
                  <p className="featured__teaser">{item.teaser}</p>
                </article>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount it in `src/ResearchApp.jsx`**

Add the import after the `ResearchTeams` import:

```jsx
import FeaturedResearch from './components/FeaturedResearch.jsx';
```

Add the section after `<ResearchTeams />`:

```jsx
        <FeaturedResearch />
```

- [ ] **Step 3: Append featured CSS to `src/index.css`**

Insert after the `.teams__body { … }` rule (still inside `@layer components`):

```css
  /* Featured research — big feature (2fr) + side stack (1fr), hairline
     seam below. The live feature artwork (a ship painting dissolving into
     typed ASCII words) is non-redistributable; per repo convention the
     stand-in is CSS-only: kraft gradients + grain, plus a repeating-word
     SVG layer masked to fade in from the left — image-into-text. */
  .featured { padding-top: 56px; }
  .featured__inner {
    display: grid; grid-template-columns: 2fr 1fr; gap: 48px;
    align-items: start;
    padding-bottom: 72px;
    border-bottom: 1px solid var(--color-divider);
  }
  .featured__media {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background:
      radial-gradient(120% 90% at 20% 25%, #f9edd8 0%, transparent 60%),
      radial-gradient(100% 80% at 80% 75%, #eccfa3 0%, transparent 65%),
      radial-gradient(90% 90% at 65% 20%, #f2ddbb 0%, transparent 55%),
      var(--color-kraft);
  }
  .featured__media::before {
    content: ""; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='132'%3E%3Cg font-family='ui-monospace,monospace' font-size='11' fill='%23141413'%3E%3Ctext x='6' y='16'%3ECLOUDS CLOUDS CLOUDS CLOUDS CLOUDS%3C/text%3E%3Ctext x='24' y='38'%3ECLOUDS CLOUDS CLOUDS CLOUDS%3C/text%3E%3Ctext x='6' y='64'%3EBOAT BOAT BOAT BOAT BOAT%3C/text%3E%3Ctext x='30' y='86'%3EBOAT BOAT BOAT%3C/text%3E%3Ctext x='6' y='110'%3EOCEAN OCEAN OCEAN OCEAN OCEAN%3C/text%3E%3Ctext x='22' y='128'%3EOCEAN OCEAN OCEAN OCEAN%3C/text%3E%3C/g%3E%3C/svg%3E");
    background-size: 360px 132px;
    opacity: .35;
    -webkit-mask-image: linear-gradient(to right, transparent 30%, #000 72%);
    mask-image: linear-gradient(to right, transparent 30%, #000 72%);
  }
  .featured__media::after {
    content: ""; position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
    opacity: .06; mix-blend-mode: multiply; pointer-events: none;
  }
  .featured__caption { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; padding-top: 24px; }
  .featured__title { margin: 0; font-family: var(--font-serif); font-size: 30px; line-height: 1.2; font-weight: 400; color: var(--color-ink); }
  .featured__main:hover .featured__title { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
  .featured__meta { margin: 0 0 10px; display: flex; gap: 12px; align-items: baseline; font-size: 13px; }
  .featured__cat { font-weight: 600; color: var(--color-ink); }
  .featured__date { color: var(--color-ashen); }
  .featured__teaser { margin: 0; font-size: 14px; line-height: 1.5; color: var(--color-graphite); }
  .featured__side { display: flex; flex-direction: column; }
  .featured__item { display: block; padding-block: 20px; border-top: 1px solid var(--color-divider); }
  .featured__item:first-child { border-top: 0; padding-top: 0; }
  .featured__item:hover .featured__item-title { text-decoration: underline; text-underline-offset: 3px; }
  .featured__item-title { margin: 0 0 8px; font-family: var(--font-serif); font-size: 20px; line-height: 1.25; font-weight: 400; color: var(--color-ink); }
```

- [ ] **Step 4: Add responsive rules**

In `@media (max-width: 1024px)`, after the `.teams__inner` line added in Task 3:

```css
  .featured__inner { grid-template-columns: 1fr; }
```

In `@media (max-width: 767px)`, after the `.teams__inner` line added in Task 3:

```css
  .featured { padding-top: 40px; }
  .featured__inner { padding-bottom: 48px; }
  .featured__caption { grid-template-columns: 1fr; gap: 12px; }
  .featured__title { font-size: 24px; }
```

- [ ] **Step 5: Verify**

Run: `npm run build`
Expected: exits 0. Visual check (reviewer): feature block shows kraft artwork with ASCII words fading in from the left, serif title + meta/teaser row beneath; 4 side items with hairline separators; titles underline on hover.

- [ ] **Step 6: Commit**

```bash
git add src/components/FeaturedResearch.jsx src/ResearchApp.jsx src/index.css
git commit -m "Add featured research section with CSS-only artwork stand-in"
```

---

### Task 5: Publications component (search + See more) and CSS

**Files:**
- Modify: `src/components/Icons.jsx` (add `Search`, `ArrowDown`)
- Create: `src/components/Publications.jsx`
- Modify: `src/ResearchApp.jsx` (import + section after `<FeaturedResearch />`)
- Modify: `src/index.css` (append CSS; responsive additions)

**Interfaces:**
- Consumes: `researchPage.publications` (50 × `{date, category, title, href}`) from Task 2.
- Produces: `.pubs` section; `Search` and `ArrowDown` icons in `Icons.jsx` (same `(props) => <svg>` shape as existing icons).

- [ ] **Step 1: Add two icons to `src/components/Icons.jsx`** (append at end of file, matching the existing mono/currentColor style)

```jsx
export const Search = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ArrowDown = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M8 3v10M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
```

- [ ] **Step 2: Create `src/components/Publications.jsx`**

Behavioral contract (from the spec): 10 rows initially; **See more** reveals all and unmounts, moving focus to the first newly revealed row link; search filters title+category (case-insensitive substring) across the **full** archive regardless of the See-more state; See more hidden while filtering; clearing the query restores the prior collapsed/expanded view; empty result renders a single "No results" row; an `aria-live` sr-only line announces the visible count.

```jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { researchPage } from '../data.js';
import { ArrowDown, Search } from './Icons.jsx';

const INITIAL_ROWS = 10;

export default function Publications() {
  const { publications } = researchPage;
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const firstRevealedRef = useRef(null);

  const q = query.trim().toLowerCase();
  const filtering = q !== '';

  const visible = useMemo(() => {
    if (filtering) {
      return publications.filter(
        (p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    return expanded ? publications : publications.slice(0, INITIAL_ROWS);
  }, [publications, filtering, q, expanded]);

  // After "See more", hand focus to the first newly revealed row so the
  // unmounted button doesn't strand keyboard users.
  useEffect(() => {
    if (expanded) firstRevealedRef.current?.focus();
  }, [expanded]);

  const showSeeMore = !filtering && !expanded && publications.length > INITIAL_ROWS;

  return (
    <section className="pubs" aria-label="Publications">
      <div className="container-page pubs__grid">
        <h2 className="pubs__heading">Publications</h2>
        <div className="pubs__search">
          <Search className="pubs__search-icon" />
          <input
            type="search"
            placeholder="Search"
            aria-label="Search publications"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="pubs__listwrap">
          <p className="u-sr-only" aria-live="polite">{visible.length} publications shown</p>
          <p className="u-sr-only">Publications list: date, category, title</p>
          <div className="pubs__colhead" aria-hidden="true">
            <span>Date</span>
            <span>Category</span>
            <span>Title</span>
          </div>
          <ul className="pubs__list">
            {visible.map((p, i) => (
              <li key={`${p.date}-${p.title}`}>
                <a
                  className="pubs__row"
                  href={p.href}
                  ref={!filtering && expanded && i === INITIAL_ROWS ? firstRevealedRef : null}
                >
                  <span className="pubs__date">{p.date}</span>
                  <span className="pubs__cat">{p.category}</span>
                  <span className="pubs__title">{p.title}</span>
                </a>
              </li>
            ))}
            {filtering && visible.length === 0 && <li className="pubs__empty">No results</li>}
          </ul>
          {showSeeMore && (
            <button className="pubs__more" type="button" onClick={() => setExpanded(true)}>
              See more <ArrowDown />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Mount it in `src/ResearchApp.jsx`**

Add the import after the `FeaturedResearch` import:

```jsx
import Publications from './components/Publications.jsx';
```

Add the section after `<FeaturedResearch />`:

```jsx
        <Publications />
```

- [ ] **Step 4: Append publications CSS to `src/index.css`**

Insert after the `.featured__item-title { … }` rule (still inside `@layer components`):

```css
  /* Publications — heading + link-rows left (3fr), search pill right (1fr).
     Rows are links laid out as a 3-column grid; the column header is
     decorative (aria-hidden) with an sr-only caption in the JSX. */
  .pubs { padding-top: 88px; }
  .pubs__grid {
    display: grid; grid-template-columns: 3fr 1fr;
    grid-template-areas: "head search" "list .";
    gap: 28px 48px; align-items: start;
  }
  .pubs__heading { grid-area: head; margin: 0; font-size: 32px; font-weight: 600; line-height: 1.2; color: var(--color-ink); }
  .pubs__search { grid-area: search; position: relative; justify-self: end; }
  .pubs__search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: var(--color-ashen); pointer-events: none; }
  .pubs__search input {
    width: 260px; height: 40px; box-sizing: border-box;
    border: 1px solid var(--color-divider); border-radius: 9999px;
    background: var(--color-canvas); color: var(--color-ink);
    font: inherit; font-size: 14px; padding: 0 16px 0 38px;
  }
  .pubs__search input::placeholder { color: var(--color-ashen); }
  .pubs__search input:focus { outline: none; border-color: var(--color-ink); }
  .pubs__search input::-webkit-search-cancel-button { -webkit-appearance: none; }
  .pubs__listwrap { grid-area: list; }
  .pubs__colhead, .pubs__row { display: grid; grid-template-columns: 140px 220px 1fr; gap: 24px; align-items: baseline; }
  .pubs__colhead { padding-bottom: 12px; border-bottom: 1px solid var(--color-divider); }
  .pubs__colhead span { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-ashen); }
  .pubs__list { list-style: none; margin: 0; padding: 0; }
  .pubs__row { padding-block: 14px; border-bottom: 1px solid var(--color-divider); font-size: 14px; }
  .pubs__row:hover .pubs__title { text-decoration: underline; text-underline-offset: 3px; }
  .pubs__date, .pubs__cat { color: var(--color-graphite); }
  .pubs__title { color: var(--color-ink); font-weight: 500; }
  .pubs__empty { padding-block: 14px; font-size: 14px; color: var(--color-ashen); }
  .pubs__more {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; margin-top: 16px; padding: 11px 20px;
    background: color-mix(in srgb, var(--color-ink) 5%, var(--color-canvas));
    border: 0; border-radius: 8px; cursor: pointer;
    font: inherit; font-size: 14px; font-weight: 500; color: var(--color-ink);
    transition: background .2s ease;
  }
  .pubs__more:hover { background: color-mix(in srgb, var(--color-ink) 9%, var(--color-canvas)); }
  .pubs__more svg { width: 13px; height: 13px; }
```

- [ ] **Step 5: Add responsive rules**

In `@media (max-width: 767px)`, after the `.featured__title` line added in Task 4:

```css
  .pubs { padding-top: 64px; }
  .pubs__grid { grid-template-columns: 1fr; grid-template-areas: "head" "search" "list"; gap: 20px; }
  .pubs__search { justify-self: stretch; }
  .pubs__search input { width: 100%; }
  .pubs__colhead { display: none; }
  .pubs__row { grid-template-columns: auto 1fr; grid-template-areas: "cat date" "title title"; gap: 4px 12px; }
  .pubs__cat { grid-area: cat; }
  .pubs__date { grid-area: date; }
  .pubs__title { grid-area: title; }
```

(Desktop `.pubs__row` places children by source order with no named areas; the named areas exist only in this mobile block, where all three children get explicit `grid-area` assignments — nothing is left implicitly placed.)

- [ ] **Step 6: Verify behavior on the dev server**

Run: `npm run build` — exits 0.
Reviewer drives `http://localhost:5173/research.html`:
- 10 rows initially, "See more ↓" below; click → 50 rows, button gone, focus on row 11's link.
- Type `index` → only Economic-Index-ish rows remain, See more hidden; clear → previous view restored.
- Type `zzz` → single "No results" row.
- Type `frontier` → only Frontier Red Team rows (case-insensitive category match works).

- [ ] **Step 7: Commit**

```bash
git add src/components/Icons.jsx src/components/Publications.jsx src/ResearchApp.jsx src/index.css
git commit -m "Add publications section with live search and see-more reveal"
```

---

### Task 6: JoinCta band

**Files:**
- Create: `src/components/JoinCta.jsx`
- Modify: `src/ResearchApp.jsx` (import + section after `<Publications />`)
- Modify: `src/index.css` (append CSS; responsive additions)

**Interfaces:**
- Consumes: `researchPage.join` from Task 2; existing `ArrowRight` icon.
- Produces: `.joincta` — the dark page-end band. Invariant (same as homepage `.cta`): the band carries `margin-top: 96px` as the page-end margin; `.footer` sits flush below it, its hairline top border being the seam.

- [ ] **Step 1: Create `src/components/JoinCta.jsx`**

```jsx
import { researchPage } from '../data.js';
import { ArrowRight } from './Icons.jsx';

export default function JoinCta() {
  return (
    <section className="joincta">
      <div className="container-page">
        <h2 className="joincta__title">{researchPage.join.title}</h2>
        <a className="joincta__btn" href={researchPage.join.cta.href}>
          {researchPage.join.cta.label} <ArrowRight />
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount it in `src/ResearchApp.jsx`** — final composition:

```jsx
import Nav from './components/Nav.jsx';
import ResearchHero from './components/ResearchHero.jsx';
import ResearchTeams from './components/ResearchTeams.jsx';
import FeaturedResearch from './components/FeaturedResearch.jsx';
import Publications from './components/Publications.jsx';
import JoinCta from './components/JoinCta.jsx';
import Footer from './components/Footer.jsx';

export default function ResearchApp() {
  return (
    <>
      <Nav />
      <main id="main">
        <ResearchHero />
        <ResearchTeams />
        <FeaturedResearch />
        <Publications />
        <JoinCta />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Append JoinCta CSS to `src/index.css`**

Insert after the `.pubs__more svg { … }` rule (still inside `@layer components`):

```css
  /* Join band — dark page-end band, centred; carries the page-end margin
     so the footer sits flush beneath it (hairline seam), like .cta. */
  .joincta { margin-top: 96px; background: var(--color-footer); padding: 110px 0 96px; text-align: center; }
  .joincta__title { margin: 0 0 36px; font-size: 52px; font-weight: 700; letter-spacing: -0.022em; line-height: 1.1; color: #f4f2ec; }
  .joincta__btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: var(--color-canvas); color: var(--color-ink);
    font-size: 15px; font-weight: 500; border-radius: 8px; padding: 11px 20px;
    transition: background .2s ease;
  }
  .joincta__btn:hover { background: #fff; }
  .joincta__btn svg { width: 15px; height: 15px; }
```

- [ ] **Step 4: Add responsive rules**

In `@media (max-width: 767px)`, after the `.pubs__title` line added in Task 5:

```css
  .joincta { padding: 64px 0; }
  .joincta__title { font-size: 32px; }
```

- [ ] **Step 5: Verify**

Run: `npm run build` — exits 0. Visual check (reviewer): dark centred band "Join the Research team" with canvas pill button, flush against the footer with only the hairline seam between.

- [ ] **Step 6: Commit**

```bash
git add src/components/JoinCta.jsx src/ResearchApp.jsx src/index.css
git commit -m "Add join-the-research-team band"
```

---

### Task 7: Full-page verification + CLAUDE.md documentation

**Files:**
- Modify: `CLAUDE.md` (append one section at the end of Architecture, before the "Fonts" paragraph)

**Interfaces:**
- Consumes: the finished page from Tasks 1–6; reference captures in the session scratchpad (`research-fullpage-clean.png`, `research-mobile-top.png`, `research-mobile-pubs.png`).
- Produces: verified page + docs. This task is executed by the main session (needs the Playwright browser tools).

- [ ] **Step 1: Build + serve**

Run: `npm run build` — exits 0 with both entries. Start dev server in background: `npm run dev`.

- [ ] **Step 2: Desktop visual pass (Playwright, 1440×900)**

Full-page screenshot of `http://localhost:5173/research.html`; compare against `research-fullpage-clean.png` reference: section order, hero split, teams row rules, featured split + artwork, publications table + search pill, dark join band, footer seam. Fix discrepancies before proceeding.

- [ ] **Step 3: Interaction pass**

On the live dev page: See more 10→50 + button unmount + focus on row 11; search `index`, `Frontier`, `zzz` (No results), clear restores; hover underlines on featured titles and row titles.

- [ ] **Step 4: Mobile visual pass (390×844)**

Everything single-column; teams stacked; search full-width; publication rows = category+date line then title, no column header; join band 32px title.

- [ ] **Step 5: Homepage regression**

`http://localhost:5173/` — renders as before (nav "Research" now navigates to the research page; wordmark returns home).

- [ ] **Step 6: Append research-page section to `CLAUDE.md`**

Insert before the `**Fonts are deliberate substitutes**` paragraph:

```markdown
**Research page** (`research.html` → `src/research.jsx` → `src/ResearchApp.jsx`): a second Vite MPA entry replicating anthropic.com/research — Nav → ResearchHero → ResearchTeams → FeaturedResearch → Publications → JoinCta → Footer, styled from the same tokens/component layer in `src/index.css` (rules under `/* ==== Research page ==== */`), all copy in `data.js` `researchPage` (50 publications, the 2026 rows of the live 149-item archive). `vite.config.js` lists both HTML entries in `build.rollupOptions.input`; the dev URL is `/research.html`. Publications is the page's only stateful component: live search filters title+category across the full carried archive regardless of the See-more state; "See more" reveals all rows once and unmounts, handing focus to the first revealed row. The featured artwork is a CSS-only stand-in (kraft gradients + grain + a masked repeating-word SVG layer) per the repo's no-redistributable-media convention. This page has no static preview twin (deliberate; user decision 2026-07-07).
```

- [ ] **Step 7: Final commit**

```bash
git add CLAUDE.md
git commit -m "Document the research page entry in CLAUDE.md"
```
