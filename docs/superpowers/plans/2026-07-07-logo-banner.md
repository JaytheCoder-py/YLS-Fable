# Autoscrolling Logo Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "trusted by" autoscrolling logo marquee (Samsung, DJI, BYD, Xiaomi, AIMA, Hyundai) between the Statement section and the Footer.

**Architecture:** A presentational `LogoBanner` component reads content from `data.js` and inline SVG marks from a new `LogoMarks.jsx`. The marquee is pure CSS: the six-logo list renders twice inside a `width: max-content` track; a keyframe slides the track `translateX(0 → -50%)` for a seamless infinite loop. No JS drives the animation.

**Tech Stack:** React 18 + Vite 6, Tailwind v4 `@theme` tokens, handwritten `@layer components` CSS. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-07-07-logo-banner-design.md`

## Global Constraints

- Styling lives in CSS files, never as utility classes in JSX. React-side rules go in `src/index.css` inside `@layer components` (keyframes and `prefers-reduced-motion` blocks sit *outside* the layer, next to the existing `vcard-drift` pattern).
- All copy lives in `src/data.js`; components are presentational.
- `prefers-reduced-motion: reduce` must fully disable the marquee animation (static row), matching the project's existing motion invariants.
- No tests or linter exist. Each task's check cycle is: `npm run build` must pass, plus visual verification in a browser (dev server on http://localhost:5173).
- Windows / PowerShell environment; repo root is the current worktree.
- Logo order everywhere: Samsung, DJI, BYD, Xiaomi, AIMA, Hyundai.
- AIMA has no sourceable SVG mark (verified against Simple Icons and Wikimedia); per the approved spec it is typeset as an Inter wordmark (`.logos__wordmark`).

## Measured logo geometry (do not re-derive)

ViewBoxes are cropped to each mark's true content bounds, measured with `getBBox()` in Chromium. Heights are starting values for even visual weight; Task 2 fine-tunes them by eye.

| Mark | viewBox | Aspect | Initial CSS height |
|---|---|---|---|
| Samsung | `0 10.166 24 3.668` | 6.544 | 16px |
| DJI | `0 4.92 24 14.159` | 1.695 | 28px |
| BYD | `1 1 529.031 326.568` | 1.620 | 32px |
| Xiaomi | `0 0 24 24` | 1.000 | 30px |
| Hyundai | `0 5.838 24 12.324` | 1.947 | 26px |
| AIMA | (typeset wordmark) | — | 22px font-size |

---

### Task 1: Data, logo marks, component, and wiring (React side)

**Files:**
- Modify: `src/data.js` (append after `footerLegal`, line 68)
- Create: `src/components/LogoMarks.jsx`
- Create: `src/components/LogoBanner.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `logoBanner` export in `data.js` (`{ eyebrow: string, logos: [{ id, name }] }`); `LOGO_MARKS` map in `LogoMarks.jsx` (`{ [id]: ReactComponent }`); `<LogoBanner />` default export used by `App.jsx`. Task 2 styles the class names emitted here: `.logos`, `.logos__eyebrow`, `.logos__marquee`, `.logos__track`, `.logos__set`, `.logos__item`, `.logos__mark`, `.logos__mark--{id}`, `.logos__wordmark`.

- [ ] **Step 1: Append the content block to `src/data.js`**

After the `footerLegal` export at the end of the file, add:

```js
export const logoBanner = {
  eyebrow: 'Trusted by teams worldwide',
  logos: [
    { id: 'samsung', name: 'Samsung' },
    { id: 'dji', name: 'DJI' },
    { id: 'byd', name: 'BYD' },
    { id: 'xiaomi', name: 'Xiaomi' },
    { id: 'aima', name: 'AIMA' },
    { id: 'hyundai', name: 'Hyundai' },
  ],
};
```

- [ ] **Step 2: Create `src/components/LogoMarks.jsx`**

Brand marks only (UI glyphs stay in `Icons.jsx`). Samsung, DJI, Xiaomi, Hyundai are Simple Icons paths; BYD is the Wikimedia Commons ellipse badge (fill changed to `currentColor`, viewBox cropped); AIMA is the approved typeset fallback. Every mark is `aria-hidden` — the accessible name comes from the sibling `.u-sr-only` span rendered by `LogoBanner`.

```jsx
// Brand marks for the logo banner. Sources: Simple Icons (Samsung, DJI,
// Xiaomi, Hyundai) and Wikimedia Commons (BYD). AIMA has no clean vector
// mark available, so it is typeset to match (see .logos__wordmark).
// ViewBoxes are cropped to content bounds so a CSS height on
// .logos__mark--* scales every mark to a comparable visual size.

export function SamsungMark() {
  return (
    <svg className="logos__mark logos__mark--samsung" viewBox="0 10.166 24 3.668" fill="currentColor" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.8166 10.2808l.0459 2.6934h-.023l-.7793-2.6934h-1.2837v3.3925h.8481l-.0458-2.785h.023l.8366 2.785h1.2264v-3.3925zm-16.149 0l-.6418 3.427h.9284l.4699-3.1175h.0229l.4585 3.1174h.9169l-.6304-3.4269zm5.1805 0l-.424 2.6132h-.023l-.424-2.6132H6.5788l-.0688 3.427h.8596l.023-3.0832h.0114l.573 3.0831h.8711l.5731-3.083h.023l.0228 3.083h.8596l-.0802-3.4269zm-7.2664 2.4527c.0343.0802.0229.1949.0114.2522-.0229.1146-.1031.2292-.3324.2292-.2177 0-.3438-.126-.3438-.3095v-.3323H0v.2636c0 .7679.6074.9971 1.2493.9971.6189 0 1.1346-.2178 1.2149-.7794.0458-.298.0114-.4928 0-.5616-.1605-.722-1.467-.9283-1.5588-1.3295-.0114-.0688-.0114-.1375 0-.1834.023-.1146.1032-.2292.3095-.2292.2063 0 .321.126.321.3095v.2063h.8595v-.2407c0-.745-.6762-.8596-1.1576-.8596-.6074 0-1.1117.2063-1.2034.7564-.023.149-.0344.2866.0114.4585.1376.7106 1.364.9169 1.5358 1.3524m11.152 0c.0343.0803.0228.1834.0114.2522-.023.1146-.1032.2292-.3324.2292-.2178 0-.3438-.126-.3438-.3095v-.3323h-.917v.2636c0 .7564.596.9857 1.2379.9857.6189 0 1.1232-.2063 1.2034-.7794.0459-.298.0115-.4814 0-.5616-.1375-.7106-1.4327-.9284-1.5243-1.318-.0115-.0688-.0115-.1376 0-.1835.0229-.1146.1031-.2292.3094-.2292.1948 0 .321.126.321.3095v.2063h.848v-.2407c0-.745-.6647-.8596-1.146-.8596-.6075 0-1.1004.1948-1.192.7564-.023.149-.023.2866.0114.4585.1376.7106 1.341.9054 1.513 1.3524m2.8882.4585c.2407 0 .3094-.1605.3323-.2522.0115-.0343.0115-.0917.0115-.126v-2.533h.871v2.4642c0 .0688 0 .1948-.0114.2292-.0573.6419-.5616.8482-1.192.8482-.6303 0-1.1346-.2063-1.192-.8482 0-.0344-.0114-.1604-.0114-.2292v-2.4642h.871v2.533c0 .0458 0 .0916.0115.126 0 .0917.0688.2522.3095.2522m7.1518-.0344c.2522 0 .3324-.1605.3553-.2522.0115-.0343.0115-.0917.0115-.126v-.4929h-.3553v-.5043H24v.917c0 .0687 0 .1145-.0115.2292-.0573.6303-.596.8481-1.2034.8481-.6075 0-1.1461-.2178-1.2034-.8481-.0115-.1147-.0115-.1605-.0115-.2293v-1.444c0-.0574.0115-.172.0115-.2293.0802-.6419.596-.8482 1.2034-.8482s1.1347.2063 1.2034.8482c.0115.1031.0115.2292.0115.2292v.1146h-.8596v-.1948s0-.0803-.0115-.1261c-.0114-.0802-.0802-.2521-.3438-.2521-.2521 0-.321.1604-.3438.2521-.0115.0458-.0115.1032-.0115.1605v1.5702c0 .0458 0 .0916.0115.126 0 .0917.0917.2522.3323.2522" />
    </svg>
  );
}

export function DjiMark() {
  return (
    <svg className="logos__mark logos__mark--dji" viewBox="0 4.92 24 14.159" fill="currentColor" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.2 7.8a716.856 716.856 0 0 0-1.232 4.63c-.202.772-.401 1.544-.634 2.308-.226.743-.504 1.535-.91 2.21-.422.703-.969 1.253-1.726 1.604-.3.137-.615.24-.939.306-.46.09-.926.146-1.394.165-1.163.065-3.628.056-4.79.056l.713-2.64c.539 0 1.078.002 1.617-.013.52-.014 1.092-.042 1.605-.163.56-.133.984-.36 1.355-.817.337-.416.564-.935.75-1.424.34-.893.688-2.173.934-3.093.277-1.041.544-2.085.812-3.129zm4.8 0-2.072 7.68h-3.84l2.073-7.68ZM11.339 4.92h3.84c-.403 1.5-.805 2.999-1.212 4.496-.283 1.044-.565 2.088-.872 3.124-.135.452-.269.903-.445 1.342-.141.352-.3.666-.591.93a1.908 1.908 0 0 1-.734.405c-.356.112-.717.154-1.085.184-.53.043-1.06.054-1.591.063-1.991.02-3.983.02-5.974-.001a21.408 21.408 0 0 1-.954-.034 5.319 5.319 0 0 1-.632-.07 1.851 1.851 0 0 1-.412-.119c-.44-.192-.664-.575-.677-1.043 0-.263.032-.525.093-.78.076-.367.171-.728.265-1.09.179-.691.506-1.966.762-2.638.2-.526.464-1.05.966-1.382.28-.186.576-.285.901-.35.241-.05.483-.075.728-.093.41-.03.82-.04 1.23-.047.582-.01 1.165-.013 1.748-.015L8.148 7.8h1.454l-.518 1.92c-.864 0-1.728-.002-2.593.003-.252.001-.504 0-.756.016a.968.968 0 0 0-.264.042c-.113.04-.17.11-.22.213-.073.15-.115.31-.162.468a84.804 84.804 0 0 0-.503 1.857c-.035.14-.07.28-.1.42-.022.099-.04.197-.05.298-.01.11-.014.242.053.345.068.103.182.127.29.143.12.018.241.021.363.025.199.006.398.007.597.008.544.003 1.089.003 1.633 0 .25-.002.501-.004.752-.014.173-.007.343-.013.513-.054.13-.031.23-.08.318-.186.056-.071.1-.15.133-.235.088-.209.15-.425.213-.641.245-.83.466-1.665.692-2.499l.675-2.503.67-2.505h3.84z" />
    </svg>
  );
}

export function BydMark() {
  return (
    <svg className="logos__mark logos__mark--byd" viewBox="1 1 529.031 326.568" fill="currentColor" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(-163.0558,-288.07832)">
        <path d="m 428.78321,289.07832 c -145.99399,0 -264.72741,73.14101 -264.72741,163.49565 0,89.65999 118.73342,163.07208 264.72741,163.07208 146.80723,0 264.30384,-73.41209 264.30384,-163.07208 0,-90.35464 -117.49661,-163.49565 -264.30384,-163.49565 z m 0,31.34373 c 136.5231,0 246.93772,58.67206 246.93772,132.15192 0,72.80215 -110.41462,131.72835 -246.93772,131.72835 -135.60821,0 -246.0906,-58.9262 -246.0906,-131.72835 0,-73.47986 110.48239,-132.15192 246.0906,-132.15192 z m -189.33304,71.15872 0,121.56283 31.34372,0 0,-51.25123 52.94548,0 0,21.60176 -46.16846,0 0,29.64947 59.29894,0 17.78968,-12.28335 0,-40.66213 -8.04771,-7.62415 8.04771,-7.20059 0,-34.73223 -16.09542,-19.06038 -99.11394,0 z m 127.91628,0 0,59.72251 13.13048,12.70691 29.2259,-0.42289 0,-28.80234 -5.50633,-5.08276 0,-38.12075 -36.85005,0 z m 89.79553,0 0,38.12075 -5.50633,5.08277 -35.15579,0 0,78.35931 36.42649,0 0,-49.55697 27.53165,0.42288 13.13048,-12.28335 0,-60.14607 -36.4265,0 z m 49.13341,0 0,121.56283 33.03798,0 0,-91.06623 36.00293,0 9.74197,11.01266 0,49.98053 -38.96788,0 0,30.07304 71.58229,0 0,-99.96107 -18.21324,-21.60176 -93.18405,0 z m -235.5015,29.64947 52.52192,0 0,21.60176 -52.52192,0 0,-21.60176 z" />
      </g>
    </svg>
  );
}

export function XiaomiMark() {
  return (
    <svg className="logos__mark logos__mark--xiaomi" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C8.016 0 4.756.255 2.493 2.516.23 4.776 0 8.033 0 12.012c0 3.98.23 7.235 2.494 9.497C4.757 23.77 8.017 24 12 24c3.983 0 7.243-.23 9.506-2.491C23.77 19.247 24 15.99 24 12.012c0-3.984-.233-7.243-2.502-9.504C19.234.252 15.978 0 12 0zM4.906 7.405h5.624c1.47 0 3.007.068 3.764.827.746.746.827 2.233.83 3.676v4.54a.15.15 0 0 1-.152.147h-1.947a.15.15 0 0 1-.152-.148V11.83c-.002-.806-.048-1.634-.464-2.051-.358-.36-1.026-.441-1.72-.458H7.158a.15.15 0 0 0-.151.147v6.98a.15.15 0 0 1-.152.148H4.906a.15.15 0 0 1-.15-.148V7.554a.15.15 0 0 1 .15-.149zm12.131 0h1.949a.15.15 0 0 1 .15.15v8.892a.15.15 0 0 1-.15.148h-1.949a.15.15 0 0 1-.151-.148V7.554a.15.15 0 0 1 .151-.149zM8.92 10.948h2.046c.083 0 .15.066.15.147v5.352a.15.15 0 0 1-.15.148H8.92a.15.15 0 0 1-.152-.148v-5.352a.15.15 0 0 1 .152-.147Z" />
    </svg>
  );
}

export function AimaMark() {
  return (
    <span className="logos__wordmark" aria-hidden="true">AIMA</span>
  );
}

export function HyundaiMark() {
  return (
    <svg className="logos__mark logos__mark--hyundai" viewBox="0 5.838 24 12.324" fill="currentColor" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 18.1622c-6.6275 0-12-2.7586-12-6.163 0-3.4028 5.3725-6.1614 12-6.1614 6.6278 0 12 2.7586 12 6.1614 0 3.4044-5.3722 6.163-12 6.163zM7.6023 7.17C3.701 7.9784.973 9.8302.973 11.9844c0 1.1929.8382 2.2932 2.248 3.1757.1174.0724.1941.0862.251.0826.1019-.006.1593-.0698.201-.146.028-.0485.0631-.1225.0972-.1968.4601-1.0834 2.0776-4.8333 4.2023-7.3758a1.1775 1.1775 0 0 0 .1048-.1461c.046-.084.0356-.1513.0006-.192-.0593-.0647-.2247-.065-.4756-.016zM9.742 8.8995c-1.1728 2.8492 1.0473 2.4961 1.6478 2.3637 1.0203-.2258 1.9944-.6128 2.7746-.925 2.2216-.8887 3.4012-1.7804 3.7925-2.123a1.9839 1.9839 0 0 0 .1076-.0988c.0557-.058.0976-.1192.0976-.2002 0-.0936-.081-.1687-.2374-.2231-.012-.0049-.0517-.021-.0641-.025-1.698-.5415-3.724-.8563-5.9016-.8563-.0168 0-.0586-.0022-.1169 0-.2608.0078-.5509.0664-.787.1888-.7777.4049-1.1163 1.4235-1.313 1.899zm10.5851.0037c-.0268.0487-.0612.1224-.0962.1974-.4599 1.0826-2.0774 4.831-4.2018 7.3733-.0515.063-.0796.1031-.1042.1467-.0492.0846-.0388.1535 0 .1935.0572.0641.2235.0654.474.0157 3.8998-.81 6.628-2.6606 6.628-4.8149 0-1.1925-.836-2.2928-2.2472-3.1745-.1161-.073-.1934-.0871-.25-.083-.1028.0067-.16.0699-.2026.1458zM14.258 15.099c1.173-2.849-1.0483-2.494-1.6467-2.3622-1.0218.225-1.996.613-2.7757.924-2.2226.8883-3.4017 1.782-3.7944 2.1234-.0468.0428-.0833.0742-.1066.0995-.0564.0573-.0967.1178-.0967.2007 0 .0923.08.1688.2362.2229.012.0048.0511.0213.0657.0255 1.696.54 3.722.8557 5.9.8557.0177 0 .0592.0016.1178 0 .2609-.0081.5522-.0677.7871-.1888.7781-.4052 1.1169-1.4234 1.3133-1.9007z" />
    </svg>
  );
}

export const LOGO_MARKS = {
  samsung: SamsungMark,
  dji: DjiMark,
  byd: BydMark,
  xiaomi: XiaomiMark,
  aima: AimaMark,
  hyundai: HyundaiMark,
};
```

- [ ] **Step 3: Create `src/components/LogoBanner.jsx`**

The track holds two identical `<ul class="logos__set">` halves; the second is `aria-hidden` so assistive tech hears each company once. Each item pairs a `.u-sr-only` company name with its `aria-hidden` mark.

```jsx
import { logoBanner } from '../data.js';
import { LOGO_MARKS } from './LogoMarks.jsx';

function LogoSet({ hidden = false }) {
  return (
    <ul className="logos__set" aria-hidden={hidden || undefined}>
      {logoBanner.logos.map(({ id, name }) => {
        const Mark = LOGO_MARKS[id];
        return (
          <li key={id} className="logos__item">
            <span className="u-sr-only">{name}</span>
            <Mark />
          </li>
        );
      })}
    </ul>
  );
}

export default function LogoBanner() {
  return (
    <section className="logos section" aria-label={logoBanner.eyebrow}>
      <div className="container-page">
        <p className="logos__eyebrow">{logoBanner.eyebrow}</p>
      </div>
      <div className="logos__marquee">
        <div className="logos__track">
          <LogoSet />
          <LogoSet hidden />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire into `src/App.jsx`**

Add the import and render between `Statement` and the closing of `main`:

```jsx
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import AnnouncementCards from './components/AnnouncementCards.jsx';
import LatestReleases from './components/LatestReleases.jsx';
import Statement from './components/Statement.jsx';
import LogoBanner from './components/LogoBanner.jsx';
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
        <LogoBanner />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify the build and unstyled render**

Run: `npm run build`
Expected: `✓ built` with no errors.

Run: `npm run dev`, open http://localhost:5173, scroll to just above the footer.
Expected: an unstyled section shows the eyebrow text and a bulleted list of twelve marks (six rendered twice; SVGs at natural size — large and black is fine at this stage). No console errors.

- [ ] **Step 6: Commit**

```powershell
git add src/data.js src/components/LogoMarks.jsx src/components/LogoBanner.jsx src/App.jsx
git commit -m "feat: add logo banner content, brand marks, and component"
```

---

### Task 2: Marquee styles (React side)

**Files:**
- Modify: `src/index.css` — component rules inside `@layer components` (insert between the `/* Statement + link list */` block ending at `.linklist__cat` (line 215) and the `/* Footer */` comment (line 217)); keyframes + reduced-motion outside the layer, next to the existing `vcard-drift` block (after line 246); mobile rules inside the existing `@media (max-width: 767px)` block (insert after the `.linklist__row` rule, line 273).

**Interfaces:**
- Consumes: class names from Task 1 (`.logos`, `.logos__eyebrow`, `.logos__marquee`, `.logos__track`, `.logos__set`, `.logos__item`, `.logos__mark`, `.logos__mark--samsung|dji|byd|xiaomi|hyundai`, `.logos__wordmark`); tokens `--color-ink`, `--color-ashen`.
- Produces: the marquee rule set.

- [ ] **Step 1: Add component rules to `@layer components` in `src/index.css`**

Loop math invariant: each `.logos__set` carries its own trailing 64px via `padding-right` and the track has **no** gap of its own, so the track is exactly 2 × (set + trailing pad) wide and `translateX(-50%)` lands the second half precisely at the first half's start position — a seamless wrap. Do not move the gap onto `.logos__track`.

```css
  /* Logo banner — "trusted by" marquee. The track holds the logo set
     twice; logos-scroll (defined below, outside the layer) slides it
     -50% for a seamless loop. Each set carries the inter-set gap as
     padding-right so -50% is exactly one set's footprint. */
  .logos__eyebrow {
    font-size: 12px; font-weight: 500; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--color-ashen);
    text-align: center; margin: 0 0 40px;
  }
  .logos__marquee {
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
    mask-image: linear-gradient(to right, transparent, #000 10%, #000 90%, transparent);
  }
  .logos__marquee:hover .logos__track { animation-play-state: paused; }
  .logos__track {
    display: flex;
    width: max-content;
    animation: logos-scroll 30s linear infinite;
    will-change: transform;
  }
  .logos__set {
    display: flex; align-items: center; gap: 64px;
    list-style: none; margin: 0; padding: 0 64px 0 0;
  }
  .logos__item {
    display: flex; align-items: center;
    color: color-mix(in srgb, var(--color-ink) 55%, transparent);
    transition: color .2s ease;
  }
  .logos__item:hover { color: var(--color-ink); }
  .logos__mark { display: block; width: auto; fill: currentColor; }
  .logos__mark--samsung { height: 16px; }
  .logos__mark--dji { height: 28px; }
  .logos__mark--byd { height: 32px; }
  .logos__mark--xiaomi { height: 30px; }
  .logos__mark--hyundai { height: 26px; }
  .logos__wordmark { font-size: 22px; font-weight: 700; letter-spacing: 0.08em; line-height: 1; }
```

- [ ] **Step 2: Add keyframes + reduced-motion outside the layer**

Directly after the existing `vcard-drift` reduced-motion block (line 244–246):

```css
/* Logo marquee. A static row when the user prefers reduced motion. */
@keyframes logos-scroll {
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .logos__track { animation: none; }
}
```

- [ ] **Step 3: Add the mobile rule inside the existing 767px media query**

After `.linklist__row { flex-wrap: wrap; gap: 4px; }`:

```css
  .logos__eyebrow { margin-bottom: 28px; }
  .logos__set { gap: 40px; padding-right: 40px; }
```

- [ ] **Step 4: Verify marquee behavior in the browser**

Run: `npm run dev` (if not already running), open http://localhost:5173.

Check all of the following:
1. The strip autoscrolls right-to-left continuously; watch one full 30s cycle — the wrap point must be invisible (no jump, no gap change between AIMA/Hyundai and the following Samsung).
2. Edges fade to transparent on both sides; no hard clipping.
3. Hovering anywhere over the strip pauses it; the hovered logo darkens to full ink.
4. No horizontal page scrollbar appears at any viewport width.
5. DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → the strip is static.
6. Narrow the window below 767px — tighter 40px gaps, layout intact.

- [ ] **Step 5: Tune visual weight**

Compare marks by eye at the strip's resting size. If any mark reads noticeably heavier or lighter than its neighbors, adjust only its `.logos__mark--*` height (or `.logos__wordmark` font-size for AIMA) in steps of 2px until the strip reads even. Record the final values — Task 3 documents them.

- [ ] **Step 6: Verify the production build**

Run: `npm run build`
Expected: `✓ built` with no errors.

- [ ] **Step 7: Commit**

```powershell
git add src/index.css
git commit -m "feat: style autoscrolling logo marquee"
```

---

### Task 3: Document in CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` — document the banner alongside the other animation notes.

**Interfaces:**
- Consumes: the final class names, rule values, and any Task 2 Step 5 height adjustments.
- Produces: nothing downstream.

- [ ] **Step 1: Document in `CLAUDE.md`**

In the Architecture section, after the **Hero word reveal** paragraph, add:

```markdown
**Logo banner** (`src/components/LogoBanner.jsx`): a pure-CSS "trusted by" marquee between Statement and Footer. The six brand marks (`src/components/LogoMarks.jsx`, content in `data.js` `logoBanner`) render twice inside a `width: max-content` track; `logos-scroll` slides it `translateX(-50%)` (30s linear infinite) for a seamless loop — each `.logos__set` carries the inter-set gap as `padding-right`, so keep the gap off `.logos__track` or the wrap point jumps. Hover pauses via `animation-play-state`; `prefers-reduced-motion` leaves a static row; the duplicate list half is `aria-hidden`. AIMA is a typeset wordmark (no clean vector mark exists); the other marks' viewBoxes are cropped to content bounds so per-mark CSS heights set visual weight.
```

- [ ] **Step 2: Commit the docs**

```powershell
git add CLAUDE.md
git commit -m "Document logo banner in CLAUDE.md"
```

---

## Final verification (after all tasks)

1. `npm run build` — passes.
2. Dev server — banner and behavior render correctly.
3. Reduced-motion emulation — static.
4. All six companies announced once each by screen reader (spot-check the accessibility tree in DevTools: one list of six items, duplicate list absent).
