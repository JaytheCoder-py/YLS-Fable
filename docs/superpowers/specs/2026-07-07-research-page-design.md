# Research page replica — design

**Date:** 2026-07-07 · **Status:** approved by user · **Target:** replica of anthropic.com/research (captured 2026-07-07, desktop 1440px + mobile 390px)

A second page for the anthropic.com replica: the Research page, reusing the existing Nav, Footer, design tokens, and CSS conventions. React app only (user decision).

## Decisions (user-confirmed)

1. **Routing:** Vite MPA — `research.html` as a second entry with its own mount; no router dependency.
2. **No static twin:** the research page exists only in the React app.
3. **Publications volume:** the 50 rows dated 2026 (Jul 6, 2026 → Jan 8, 2026) from the live archive of 149 — the year boundary is the natural cut closest to the requested "~40 recent".

## Architecture

- **`research.html`** (repo root) — second Vite entry. Same Google-Fonts preloads as `index.html`; `<title>Research \ Anthropic</title>`; meta description: "Our research teams investigate the safety, inner workings, and societal impacts of AI models."; mounts `/src/research.jsx` into `#root`.
- **`src/research.jsx`** — `createRoot` + `<ResearchApp/>` in StrictMode + `import './index.css'` (single shared stylesheet).
- **`src/ResearchApp.jsx`** — flat composition mirroring `App.jsx`:
  `Nav → <main id="main"> ResearchHero → ResearchTeams → FeaturedResearch → Publications → JoinCta </main> → Footer`.
- **`vite.config.js`** — `build.rollupOptions.input = { main: <index.html>, research: <research.html> }` (paths via `fileURLToPath(new URL(...))` — ESM, Windows-safe). Dev URL: `http://localhost:5173/research.html`.
- **`src/data.js`** — new `researchPage` export holding every piece of copy (below); `navLinks` "Research" href `'#'` → `'/research.html'`; `WORDMARK` anchor href `'#'` → `'/'` (in `Nav.jsx`). Footer untouched (links are plain strings).
- **Untouched:** AnnouncementCards and all homepage sections, `netlify.toml` (main checkout only; a `/research → /research.html` redirect can be added there later).

## Components and styling

All styling in `src/index.css` `@layer components`, BEM-ish class names, existing tokens only (`--color-canvas/ink/graphite/ashen/divider/kraft/footer…`, `--container-page`). All sections use `.container-page`.

### ResearchHero (`.rhero`)
- Grid `1fr 1fr`, gap 40px, `align-items: start` (heading top-aligns with the intro on the live page); padding-top ~104px (match `.hero`), padding-bottom ~56px.
- Left: `<h1>` "Research" — same scale as homepage h1 (sans 64px/700/−0.022em), wrapped in existing `WordReveal` (single word rises on load; respects reduced motion already).
- Right: serif 24px intro (`.hero__sub` scale):
  > Our research teams investigate the safety, inner workings, and societal impacts of AI models—so that artificial intelligence has a positive impact as it becomes increasingly capable.
- Under the intro, the teams line: bold sans ~14px label **Research teams:** followed by inline links (14px, underlined, graphite → ink on hover, wrap allowed, gap ~20px): Alignment, Economic Research, Interpretability, Societal Impacts, Frontier Red Team. All hrefs `#` (team pages don't exist in the replica).

### ResearchTeams (`.teams`)
- Full container row between two hairline rules (`border-top` + `border-bottom`, `--color-divider`); padding-block ~40px.
- Grid 4 × 1fr, gap 24px. Each cell: `<h3>` sans 17px/600 name + ~14px/1.5 body (color ink, slightly muted OK).
- Copy (verbatim):
  - **Interpretability** — The mission of the Interpretability team is to understand how large language models work internally, as a foundation for AI safety and positive outcomes.
  - **Alignment** — The Alignment team works to understand the risks of AI models and develop ways to ensure that future ones remain helpful, honest, and harmless.
  - **Societal Impacts** — Working closely with the Anthropic Policy and Safeguards teams, Societal Impacts is a technical research team that explores how AI is used in the real world.
  - **Frontier Red Team** — The Frontier Red Team analyzes the implications of frontier AI models for cybersecurity, biosecurity, and autonomous systems.
- ≤1024px: 2×2; ≤767px: single column.

### FeaturedResearch (`.featured`)
- Section padding-block ~56px top / ~72px bottom, hairline `border-bottom` (seam before Publications).
- Grid `2fr 1fr`, gap 48px.
- **Main feature** — one `<a>` wrapping an `<article>`:
  - Media block: `aspect-ratio: 16/9`, square corners, `overflow: hidden`.
  - Placeholder artwork (original is a ship painting dissolving into typed ASCII words — non-redistributable). Repo convention (CSS stand-in): kraft radial-gradient base + the existing grain SVG overlay, plus a "dissolving text" layer — an SVG data-URI background repeating monospace words `CLOUDS` / `BOAT` / `OCEAN` in ink at low opacity, `mask-image: linear-gradient(to right, transparent 35%, #000 75%)` so the text fades in from the left, echoing image-into-text. Static; nothing to freeze for reduced motion.
  - Below media, grid `1fr 1fr` gap 48px: left — serif ~28px/1.2 title "A global workspace in language models" (underline on hover); right — meta line (bold sans 13px "Interpretability" + ashen 13px "Jul 6, 2026", gap 12px) above 14px teaser:
    > New interpretability research reveals an emergent mental workspace in Claude that holds internal thoughts that don't appear in the model's output.
- **Side stack** — 4 `<a>`-wrapped items, hairline `border-top` separators between items (none before the first; first item top-aligns with the media block). Each: meta line (bold 13px category + ashen 13px date), serif ~20px title (hover underline), 14px graphite teaser. Padding-block ~20px. Copy (verbatim):
  1. Economic Research · Jun 26, 2026 — **Anthropic Economic Index report: Cadences** — In our latest Economic Index report, we sample hourly for the first time to ask: When do people come to Claude? What do they produce with it? And how do they perceive AI's impact on their work?
  2. Alignment · May 8, 2026 — **Teaching Claude why** — New research on how we've reduced agentic misalignment.
  3. Research · Apr 24, 2026 — **Project Deal** — We created a marketplace for employees in our San Francisco office, with one big twist. We tasked Claude with buying, selling and negotiating on our colleagues' behalf.
  4. Societal Impacts · Mar 18, 2026 — **What 81,000 people want from AI** — We invited Claude.ai users to share how they use AI, what they dream it could make possible, and what they fear it might do. Nearly 81,000 people participated—the largest and most multilingual qualitative study of its kind. Here's what we found.
- ≤1024px: single column (main feature, then side stack); ≤767px: same, tighter spacing.

### Publications (`.pubs`) — the page's only stateful component
- Section padding-top ~88px. Grid `3fr 1fr`, gap 48px: left column holds `<h2>` "Publications" (sans ~32px/600) and the list; right column holds the search field (top-aligned).
- **Search**: rounded-pill input (border 1px `--color-divider`, canvas background, height ~40px, radius 9999px), magnifier icon inside-left (new `Search` icon in `Icons.jsx`), placeholder "Search", `aria-label="Search publications"`. Focus: border-color ink.
- **List**: `<ul>` of `<li><a>` rows, each laid out as grid `140px 220px 1fr` (gap 24px):
  - Header row (not a list item): DATE / CATEGORY / TITLE — uppercase 11px, letter-spacing .08em, ashen, hairline below, `aria-hidden="true"`; an `.u-sr-only` caption ("Publications list: date, category, title") stands in for AT.
  - Rows: 14px — date graphite, category graphite, title ink/500; hairline `border-bottom` per row; title underlines on hover (like `.linklist__row`). Hrefs `#`.
- **Behavior** (React state: `expanded: bool`, `query: string`):
  - Initial: first 10 rows. **See more ↓** button below (full width of list column, light warm pill — `color-mix(in srgb, var(--color-ink) 5%, var(--color-canvas))`, radius 8px, 14px label, down-arrow icon — new `ArrowDown` in `Icons.jsx` alongside the new `Search` icon). Click → `expanded = true`, all rows render, button unmounts, focus moves to the first newly revealed row's link.
  - Search: live filter, case-insensitive substring over `title + category`, always across the **full** carried archive regardless of `expanded` (mirrors the real page, where search covers the whole archive even before See more). While `query` non-empty: See more hidden. Clearing the query restores the prior collapsed/expanded view.
  - No matches: single ashen row "No results".
  - `.u-sr-only` `aria-live="polite"` line announces "N publications shown".
- **Data**: 50 rows, all 2026 (Jul 6, 2026 → Jan 8, 2026), verbatim from the live archive (list below).
- ≤767px: search full-width under the heading (grid stacks); header row hidden; each row becomes two lines — meta ("Category  Date") then title — matching live mobile.

### JoinCta (`.joincta`)
- Full-bleed ink band (`--color-footer`) in the CtaSection slot; carries the page-end `margin-top: 96px`; footer sits flush below with its hairline top border as the seam (same invariant as `.cta`).
- Centered: `<h2>` sans ~52px/700 "Join the Research team" (color `#f4f2ec`), then a centered pill button (canvas background, ink text, matches `.cta__btn--primary`) "See open roles" + existing `ArrowRight` icon. Padding-block ~110px / 96px. ≤767px: title ~32px, padding 64px.

## Data shape (`src/data.js`)

```js
export const researchPage = {
  title: 'Research',
  intro: '…',                       // hero paragraph
  teamsLabel: 'Research teams:',
  teamLinks: [{ label, href: '#' } × 5],
  teams: [{ name, body } × 4],
  featured: {
    main: { category, date, title, teaser, href: '#' },
    side: [{ category, date, title, teaser, href: '#' } × 4],
  },
  publications: [{ date, category, title, href: '#' } × 50],
  join: { title: 'Join the Research team', cta: { label: 'See open roles', href: '#' } },
};
```

## Accessibility

- One `<h1>` (Research); `<h2>` Publications + Join band; `<h3>` team names and featured titles.
- Publications rows are links (like the live site), not a `<table>`; column headers are decorative (`aria-hidden`) with an sr-only caption; live-region count for search feedback; focus handoff on See more.
- WordReveal already keeps an intact sr-only copy and respects `prefers-reduced-motion`; nothing else on the page animates.

## Verification (no test framework in repo)

1. `npm run build` — both entries emit.
2. `npm run dev` → drive `http://localhost:5173/research.html` with Playwright: full-page screenshots at 1440px and 390px, compared against the captured references; exercise search (e.g. "agent", garbage string for empty state) and See more (row count 10 → 50, button disappears, focus lands on row 11).
3. Homepage regression: `/` still renders identically (only data.js hrefs and vite config changed).
4. Append a short "Research page" section to CLAUDE.md (worktree copy) documenting the second entry point and the Publications behavior — kept to one appended section because the main checkout's CLAUDE.md has diverged (uncommitted homepage rewrites).

## Publications data (50 rows, verbatim)

| Date | Category | Title |
|---|---|---|
| Jul 6, 2026 | Interpretability | A global workspace in language models |
| Jun 26, 2026 | Economic Research | Anthropic Economic Index report: Cadences |
| Jun 18, 2026 | Frontier Red Team | Project Fetch: Phase two |
| Jun 16, 2026 | Economic Research | Agentic coding and persistent returns to expertise |
| Jun 8, 2026 | Science | Paving the way for agents in biology |
| Jun 8, 2026 | Frontier Red Team | Measuring LLMs' impact on N-day exploits |
| Jun 5, 2026 | Science | Making Claude a chemist |
| Jun 3, 2026 | Frontier Red Team | Mapping AI-enabled cyber threats: Insights from the LLM ATT&CK Navigator |
| Jun 3, 2026 | Policy | What we learned mapping a year's worth of AI-enabled cyber threats |
| May 27, 2026 | Economic Research | Coding agents in the social sciences |
| May 22, 2026 | Announcements | Project Glasswing: An initial update |
| May 22, 2026 | Frontier Red Team | Measuring LLMs' ability to develop exploits |
| May 14, 2026 | Policy | 2028: Two scenarios for global AI leadership |
| May 8, 2026 | Alignment | Teaching Claude why |
| May 7, 2026 | Interpretability | Natural Language Autoencoders: Turning Claude's thoughts into text |
| May 7, 2026 | Alignment | Donating our open-source alignment tool |
| May 7, 2026 | Policy | Focus areas for The Anthropic Institute |
| Apr 30, 2026 | Societal Impacts | How people ask Claude for personal guidance |
| Apr 29, 2026 | Science | Evaluating Claude's bioinformatics research capabilities with BioMysteryBench |
| Apr 22, 2026 | Economic Research | Announcing the Anthropic Economic Index Survey |
| Apr 22, 2026 | Economic Research | What 81,000 people told us about the economics of AI |
| Apr 14, 2026 | Alignment | Automated Alignment Researchers: Using large language models to scale scalable oversight |
| Apr 9, 2026 | Policy | Trustworthy agents in practice |
| Apr 7, 2026 | Frontier Red Team | Assessing Claude Mythos Preview's cybersecurity capabilities |
| Apr 2, 2026 | Interpretability | Emotion concepts and their function in a large language model |
| Mar 31, 2026 | Economic Research | How Australia Uses Claude: Findings from the Anthropic Economic Index |
| Mar 24, 2026 | Economic Research | Anthropic Economic Index report: Learning curves |
| Mar 23, 2026 | Science | Introducing our Science Blog |
| Mar 23, 2026 | Science | Long-running Claude for scientific computing |
| Mar 23, 2026 | Science | Vibe physics: The AI grad student |
| Mar 13, 2026 | Interpretability | A "diff" tool for AI: Finding behavioral differences in new models |
| Mar 6, 2026 | Policy | Partnering with Mozilla to improve Firefox's security |
| Mar 6, 2026 | Frontier Red Team | Reverse engineering Claude's CVE-2026-2796 exploit |
| Mar 5, 2026 | Economic Research | Labor market impacts of AI: A new measure and early evidence |
| Feb 25, 2026 | Alignment | An update on our model deprecation commitments for Claude Opus 3 |
| Feb 23, 2026 | Alignment | The persona selection model |
| Feb 23, 2026 | Announcements | Anthropic Education Report: The AI Fluency Index |
| Feb 18, 2026 | Societal Impacts | Measuring AI agent autonomy in practice |
| Feb 16, 2026 | Economic Research | India Country Brief: The Anthropic Economic Index |
| Feb 5, 2026 | Frontier Red Team | Evaluating and mitigating the growing risk of LLM-discovered 0-days |
| Jan 29, 2026 | Alignment | How AI assistance impacts the formation of coding skills |
| Jan 28, 2026 | Alignment | Disempowerment patterns in real-world AI usage |
| Jan 22, 2026 | Announcements | Claude's new constitution |
| Jan 19, 2026 | Interpretability | The assistant axis: situating and stabilizing the character of large language models |
| Jan 16, 2026 | Frontier Red Team | AI models are showing a greater ability to find and exploit vulnerabilities on realistic cyber ranges |
| Jan 15, 2026 | Economic Research | Anthropic Economic Index: New building blocks for understanding AI use |
| Jan 15, 2026 | Economic Research | Anthropic Economic Index report: Economic primitives |
| Jan 14, 2026 | Frontier Red Team | Finding bugs across the Python ecosystem with Claude and property-based testing |
| Jan 9, 2026 | Alignment | Next-generation Constitutional Classifiers: More efficient protection against universal jailbreaks |
| Jan 8, 2026 | Frontier Red Team | Experimenting with AI to defend critical infrastructure |

## Reference captures (session scratchpad)

`research-page-reference.md` (full layout notes), `publications.txt` (all 149 archive rows), `research-fullpage-clean.png` (desktop 1440), `research-mobile-top.png` / `research-mobile-pubs.png` (390px) — in the session scratchpad directory.
