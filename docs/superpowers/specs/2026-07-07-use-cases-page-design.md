# Use-cases page — design spec (2026-07-07)

## Goal

Add a second page at `/use-cases` that replicates the **grid section** of
https://claude.com/resources/use-cases (as of July 2026) inside this repo's
existing design system. The page reuses the homepage's Nav, Footer, and design
tokens verbatim. Only the grid section of the reference is copied — its nav,
breadcrumb subnav, footer, and CTA blocks are not.

## Reference findings (measured from the live page)

- **Hero**: small decorative mark, headline "Get inspired by what you can do
  with Claude", grey subcopy. The hero copy column left-aligns with the *grid*
  column (not the filter rail).
- **Filter rail** (left, ~260px): "Filter" heading over three accordion
  groups — **Category** (13 options), **Features** (7), **Product** (5) — each
  a full-width button with caret that expands an instant-apply checkbox list.
- **Toolbar**: pill search input ("Search use cases", magnifier icon) left;
  Grid/List segmented control right. Search filters live as you type
  (client-side), no submit.
- **Grid view**: 3 × 5 cards per page. Card = thumbnail, title, 3-line-clamped
  description, then two icon chips: author (Anthropic / GivingTuesday) and
  category.
- **List view**: table-like — column headers AUTHOR / CATEGORY / MODEL /
  FEATURES in small caps; hairline-separated rows with the title left.
- **Pagination**: centred "View more" button + "1 / 7" indicator. "View more"
  *replaces* the page (next page), it does not append. (The live site's
  "Previous" link exists in DOM but is always hidden; we show Previous from
  page 2 as a usability improvement.)
- **Dataset**: 90 unique cards scraped from all pages, each with title,
  description, author, model, product, categories (multi), features (multi).
  The live data is messy (typos like "Sonnnet", features not in the filter
  vocab such as "Browser Use"); the scraped set was normalised against the
  filter vocabularies and hand-patched where extraction was ambiguous.

## Decisions

1. **Routing — tiny pathname router, no new dependency.** The repo is
   deliberately minimal (react, react-dom, gsap). A ~30-line History-API
   router in `src/Router.jsx` (usePath hook + `<RouteLink>` + `navigate()`)
   handles `/` and `/use-cases`; unknown paths render Home. `netlify.toml`
   already rewrites `/* → /index.html`, and Vite's dev server falls back to
   `index.html`, so deep links work in both. Route changes set
   `document.title` ("Use cases \ Anthropic") and scroll to top.
   *Rejected*: react-router-dom (new dep for 2 routes), hash routing (ugly
   URLs, mismatch with reference).
2. **Entry points into the page**: the Nav stays identical to the homepage
   (per request). The wordmark links to `/`; "Use cases" is added to the
   footer's Resources column (where the real claude.com keeps it). Footer
   data entries may now be `string | {label, href}`.
3. **Data lives in `src/useCasesData.js`** — hero copy, filter vocabularies,
   and the 90-card dataset. `src/data.js` stays homepage/shared-only; both
   follow the "copy lives in data modules, components are presentational"
   rule.
4. **Type system: this repo's, not the reference's.** The reference sets card
   titles in its serif; this repo's card pattern (.rcard) is sans-600 titles +
   serif body, and only serif 400/500 is loaded. Cards and list rows use the
   repo pattern; the hero reuses the homepage hero ramp (sans 700 64→40px,
   serif subcopy) with the existing WordReveal treatment.
5. **Thumbnails are CSS placeholders** — kraft-palette gradient variants +
   the existing grain overlay (same stand-in strategy as the homepage's
   announcement cards; the real thumbnails are product screenshots we can't
   redistribute). Static (no drift animation) — 15 animated layers per page
   is a perf risk for zero payoff.
6. **Filter semantics**: within a group OR; across groups AND; search
   (title + description, case-insensitive substring) ANDs with filters. Any
   filter/search/view change resets to page 1. Empty state = "No results
   found" + hint + "Clear filters" action. A `.u-sr-only` aria-live region
   announces the result count.
7. **Page size 15** (3 × 5 like the reference) → 6 pages unfiltered.

## Components

```
src/Router.jsx              usePath / RouteLink / navigate (History API)
src/App.jsx                 Nav + <main> + routed page + Footer
src/components/HomePage.jsx existing homepage sections, moved out of App
src/components/UseCasesPage.jsx      hero + <UseCasesExplorer/>
src/components/UseCasesExplorer.jsx  state container: filters/query/view/page;
                                     toolbar, grid, list, pagination, empty state
src/components/UseCasesFilters.jsx   rail: 3 accordion checkbox groups + clear-all
src/components/UseCaseCard.jsx       grid card (media variant, title, desc, chips)
src/useCasesData.js                  copy + vocab + 90-card dataset
```

State is one `useState` object in UseCasesExplorer; filtering/pagination are
pure derivations (useMemo) — no effects needed. Accordion open/closed state
lives in UseCasesFilters; selected options are lifted.

## Styling

New `@layer components` section in `src/index.css` under a `.uc-` prefix,
tokens only (canvas/paper/card/kraft/ink/graphite/ashen/divider). Layout:
`.uc-layout` = `grid-template-columns: 260px minmax(0, 1fr); gap: 48px`.
Cards: paper bg, divider border, 16px radius (matches .rcard), media
`aspect-ratio: 7/5` with 4 gradient variants. Toggle: card-tone track,
paper active segment. Checkboxes: 18px, divider border, ink fill when
checked (custom, real `<input type="checkbox">` underneath).

Responsive: ≤1024px rail stacks above the toolbar (accordions collapsed);
grid 2-col. ≤767px grid 1-col; list header hidden, rows stack title + chips.
Section keeps ~96px bottom padding so the light canvas breathes before the
dark footer (the homepage gets this from `.cta`'s margin).

## Accessibility

Real checkboxes with labels; accordion buttons carry `aria-expanded`;
grid/list toggle = buttons with `aria-pressed`; labelled search input;
result count via aria-live; pagination controls are buttons with the "1 / N"
indicator as text; card link wraps the title (whole-card click via a
stretched link pseudo-element, matching the reference's semantics).

## Out of scope (YAGNI)

- URL sync for filters/search/page (client state only).
- Per-card detail pages (`/resources/use-cases/<slug>` links point at the
  live claude.com pages).
- The reference's breadcrumb subnav, lottie hero animation, cookie banner.

## Verification

Playwright against `npm run dev`: grid renders 15 cards; search narrows
live; each filter group narrows and combines (AND across groups); grid/list
toggle switches layouts; View more pages through 6 pages with indicator;
empty state + clear filters; mobile (390px) and tablet (768px) screenshots;
homepage regression (unchanged render, wordmark/footer routing works).
