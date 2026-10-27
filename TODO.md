# SILLAGE — Work Plan

Source of truth for *what* and *why*: [IDEA.md](IDEA.md). This file is the *how* and *in what order*.
Tick boxes as you go; one milestone ≈ one or more feature-sized commits (`feat:`, `fix:`, `test:`, `chore:` …).

**Budget:** ≈ 14 working days. If it runs past 3 weeks → cut `/maison` before cutting the quality bar.
**Golden rule:** build the risky thing (M3 — light reveal) in week 1. Don't "warm up" with other sections first.

---

## Status snapshot

| # | Milestone | Est. | Status |
|---|---|---|---|
| — | Repo + scaffold | — | ✅ done |
| 0 | Decisions, deploy pipeline, fonts | 0.5–1d | ⬜ |
| 1 | Static layout, all copy, all 3 routes | 2d | ⬜ |
| 2 | Nav + mobile menu + focus management | 2d | ⬜ |
| 3 | **Light reveal mechanic** (the risky one) | 3d | ⬜ |
| 4 | Note interactions + `/fragrance` detail | 2d | ⬜ |
| 5 | Motion polish + route transitions | 2d | ⬜ |
| 6 | A11y + performance pass, Lighthouse CI | 2d | ⬜ |
| 7 | Deploy polish, README, 20s demo | 1d | ⬜ |

---

## ✅ Done — repo and scaffold

- [x] Private GitHub repo `sillage`
- [x] Vite 8 + React 19 + TypeScript 7 scaffold (oxlint as linter)
- [x] React Router 8 data router — `/`, `/fragrance`, `/maison` (`src/routes.tsx`)
- [x] Root layout with semantic landmarks: skip link, `header`, `nav[aria-label=Primary]`, `main#main`, `footer`
- [x] Design tokens from IDEA.md §4/§7 in `src/styles/tokens.css` (palette, type, motion, `--reveal: 1` default)
- [x] Locked brand copy in `src/content/copy.ts` (single source; never inline copy in components)
- [x] Vitest + React Testing Library + jsdom — route smoke tests (one `h1` per route, landmarks, nav works)
- [x] `.gitignore` covers env files, coverage, Playwright and Lighthouse output

---

## Milestone 0 — Decisions, deploy pipeline, fonts (0.5–1d)

### 0.1 Resolve the two conflicts found while planning ⚠️

- [ ] **D1 — "Works with JS disabled" vs. a client-only SPA.**
  IDEA §5 and §13 say: *no content hidden pending JS* and *works with JS disabled (bottle lit, copy readable)*.
  A plain Vite SPA ships an empty `<div id="root">`. With JS off, the page is blank. That also hurts LCP and SEO.
  - Option A (recommended): **pre-render the 3 routes to static HTML at build time.** React Router's framework mode does this with `ssr: false` + `prerender: ['/', '/fragrance', '/maison']`. Still deployed as static files, still no backend. Costs a small restructure: `app/root.tsx`, `app/routes.ts`, and the `@react-router/dev` Vite plugin.
  - Option B: Drop the "works with JS disabled" requirement and keep the plain SPA. Simpler, but it breaks a definition-of-done item and costs LCP.
  - Decide before M1. Moving the route components later is cheap; the layout code doesn't change.
- [ ] **D2 — JS budget vs. `motion`.**
  The bare scaffold (React + React DOM + React Router) is already **~100 KB gzipped** against a **120 KB** budget. Full `motion` adds roughly 30+ KB, which puts the site over budget.
  - Option A (recommended): **no `motion` dependency.** Every easing in IDEA §7 is a plain `cubic-bezier`, and there are no springs (no springs is a design rule anyway). Menu stagger = CSS `transition-delay: calc(var(--i) * var(--stagger-step))`. Exit animations = `@starting-style` + `transition-behavior: allow-discrete`, or a `transitionend` handler. Route wipe = View Transitions API. `useReducedMotion` = a ~10-line `matchMedia` hook.
  - Option B: `motion` with `LazyMotion` + `m` + `domAnimation` (~15–20 KB). Measure before committing.
  - Re-check the real bundle number after D1 (pre-rendering doesn't add client JS, but verify).

### 0.2 Close the open decisions in IDEA §14 (accept defaults unless you disagree)
- [ ] House name stays SILLAGE
- [ ] English copy; French only for the wordmark and note names
- [ ] `--glass`: try none first; add it only to caustics if they need it
- [ ] Photography phase 2: no, ship Direction A
- [ ] `/maison`: 3 short paragraphs + pull quote
- [ ] `animation-timeline` enhancement: no, unless it's a ~20-line win
- [ ] Write the missing copy that's referenced but not yet written:
  - [ ] `/maison` — the three paragraphs
  - [ ] `/fragrance` — longevity/sillage table rows, ingredients + origin text
  - [ ] "Request an invitation" panel text (honest: this is a concept piece)
  - [ ] Footer line
  - [ ] `<title>` + meta description per route
  - [ ] Add all of it to `src/content/copy.ts`

### 0.3 Deploy from week 1, not week 3
- [ ] Pick a host: **Vercel** (recommended: zero-config for Vite, preview URL per PR) or Netlify
- [ ] Connect the GitHub repo and confirm `main` auto-deploys
- [ ] SPA fallback so a refresh on `/maison` doesn't 404 (`vercel.json` rewrite). Not needed if D1 = pre-render, since real HTML files exist.
- [ ] Put the live URL in the README immediately

### 0.4 CI skeleton (GitHub Actions)
- [ ] `.github/workflows/ci.yml`: `npm ci` → `npm run lint` → `npx tsc -b` → `npm run test:run` → `npm run build`
- [ ] Branch protection on `main`: CI must pass (optional for a solo project, but good practice)
- [ ] Lighthouse CI gets added to this workflow in M6

### 0.5 Fonts (self-hosted, IDEA §4)
- [ ] Download **Bodoni Moda** (variable, includes `opsz`) and **Inter Tight** (variable). Both are OFL-licensed (Google Fonts).
- [ ] Subset to Latin and convert to `woff2` (`pyftsubset` from fonttools, or glyphhanger). Keep `€`, `—`, `·`, `é` and curly quotes in the subset.
- [ ] Put the files in `public/fonts/` and add `@font-face` with `font-display: swap` in `src/styles/fonts.css`
- [ ] `<link rel="preload" as="font" type="font/woff2" crossorigin>` for **Bodoni Moda only**
- [ ] Add fallback metric overrides (`size-adjust`, `ascent-override`) on the fallback face so the swap causes no layout shift (CLS must be 0)
- [ ] Commit the font licenses (`public/fonts/OFL.txt`)

---

## Milestone 1 — Static layout, no motion, all 3 routes (2d)

**Done when:** it looks good as a printed page on mobile and desktop. All copy, all routes. Zero animation.

### 1.1 Foundations
- [ ] `src/styles/typography.css`: display / text / micro roles as classes or mixins
  - [ ] Display: `var(--size-display)`, line-height `0.9`, `var(--tracking-display)`, `font-optical-sizing: auto`
  - [ ] Body: Inter Tight, measure `58–62ch`, `text-wrap: pretty`
  - [ ] Micro: 11px, uppercase, `0.35em` tracking
- [ ] Editorial grid in CSS (12-column, asymmetric placement, generous gutters). Headlines sit on the grid, never centered.
- [ ] Spacing scale tokens (`--space-*`) for intentional rhythm, not uniform padding
- [ ] Grain overlay: one 200×200 SVG `feTurbulence` tile, `position: fixed`, `pointer-events: none`, 3% opacity, `mix-blend-mode: soft-light`
- [ ] Hairline rule style: 1px `--ash`

### 1.2 Bottle silhouette (static)
- [ ] Draw the flacon as SVG: **straight lines, chamfered cap, rectangular body**. Geometric luxury, not curved clipart.
- [ ] Single `<path>` or `<symbol>` so it can be reused for the base layer, light layer and caustic copies (M3)
- [ ] `viewBox` sized so it scales without layout shift (explicit aspect ratio)
- [ ] Decide on a11y: `role="img"` + `<title>` ("Ombre Claire bottle"), or `aria-hidden` if purely decorative
- [ ] Leave an `<img>` slot behind the mask (Direction B swap-in point). Empty for now.

### 1.3 Shared chrome
- [ ] Wordmark `S I L L A G E`: 0.4em tracking, 12px, uppercase, bone. Use `letter-spacing`, **not** literal spaces (screen readers would spell it out).
- [ ] Header with hairline divider and inline desktop nav (4 items max, micro type)
- [ ] Footer: minimal, one line
- [ ] Skip link: visually hidden until focused

### 1.4 `/` — The object
- [ ] Hero: `OMBRE CLAIRE` h1 + the two hero lines + bottle (static, fully lit) + scroll cue
- [ ] Manifesto: narrow column, no ornament
- [ ] Three notes: horizontal on desktop, stacked on mobile (expand-on-hover comes in M4)
- [ ] Spec strip: 50 ml / Extrait / €240 as a **typographic table**, not cards (`<dl>` or `<table>`)
- [ ] CTA "Request an invitation" as a real `<button>`
- [ ] Invitation panel (static markup): explains it's a concept piece. Open/close behaviour comes in M2.

### 1.5 `/fragrance` — The composition
- [ ] Notes in depth (static version)
- [ ] Longevity and sillage as an editorial table; 24h timeline as a hairline rule, not a chart
- [ ] Ingredients and origin

### 1.6 `/maison` — The house
- [ ] Three paragraphs + pull quote (`<blockquote>` + `<figure>`/`<figcaption>`)
- [ ] Numbers: est. 2024 · twelve ingredients · one atelier
- [ ] No images. Rules and whitespace only.

### 1.7 Responsive recomposition
- [ ] Check at 320, 375, 768, 1024, 1440, 1920. Recompose the layout at each size; don't just shrink it.
- [ ] No horizontal overflow at any width
- [ ] Each route has a unique `<title>` and meta description (React 19 lets you render `<title>`/`<meta>` inside components)

### 1.8 Tests
- [ ] Every route renders its locked copy (import strings from `copy.ts`; don't duplicate them in tests)
- [ ] Spec strip renders as a table/description list with the 3 values
- [ ] Exactly one `h1` per route (already exists; extend it if routes change)

### 1.9 Verify
- [ ] Deployed preview looks right on a **real phone**
- [ ] Commit: `feat: static layout for all routes`

---

## Milestone 2 — Nav, mobile menu, focus management (2d)

**Done when:** a full keyboard-only pass works. No motion yet.

- [ ] Desktop nav: inline, active route marked with `aria-current="page"` (NavLink already does this)
- [ ] Mobile menu toggle button: `aria-expanded`, `aria-controls="site-menu"`, accessible name "Menu"
- [ ] Full-screen overlay: bone background, display-size items
- [ ] Focus management:
  - [ ] Opening moves focus to the first menu item
  - [ ] **Focus trap**: Tab/Shift+Tab cycle inside the overlay
  - [ ] `Escape` closes it
  - [ ] Closing returns focus to the toggle
  - [ ] Clicking a link closes the menu and navigates
  - [ ] Background is inert while open (`inert` attribute on `main`/`footer`) and body scroll is locked
- [ ] Consider native `<dialog>` + `showModal()`: free focus trap, `Escape` and inertness. Evaluate it before hand-rolling.
- [ ] Invitation panel: same focus rules (likely the same dialog primitive, so reuse it)
- [ ] Visible focus ring that works on both `--ink` and `--bone` backgrounds (`:focus-visible`, two-tone outline)
- [ ] Tests (RTL + user-event), write these **first**:
  - [ ] Toggle sets `aria-expanded` true/false
  - [ ] Focus moves into the menu on open
  - [ ] Tab from the last item wraps to the first (trap)
  - [ ] `Escape` closes and returns focus to the toggle
  - [ ] Selecting a link navigates and closes
  - [ ] Invitation panel opens, traps focus, and closes the same way
- [ ] Commit: `feat: accessible mobile menu and invitation panel`

---

## Milestone 3 — Light reveal mechanic ⚠️ the risky one (3d)

**Done when:** 60fps on a throttled CPU, and the reduced-motion version is complete.
**Decision rule:** if it isn't convincing **in isolation by end of week 1**, switch to the pointer-follow fallback. Don't "fix it with photos".

### 3.1 Spike on a bare page first
- [ ] Temporary `/lab` route (delete it before M7). Only the bottle, the light and scroll space.
- [ ] Base layer: silhouette in `--ink`, ~4% lighter than the background
- [ ] Light layer: duplicate silhouette filled with a diagonal `--light` → transparent gradient
- [ ] Mask on the light layer: `mask-position: calc(var(--reveal) * 120% - 10%)` (+ `-webkit-mask-*` for Safari)
- [ ] Judge it honestly on a real phone. Go / no-go.

### 3.2 Scroll → CSS variable
- [ ] `useScrollProgress` hook (or a plain module): **one** passive scroll listener, throttled with `requestAnimationFrame`
- [ ] Computes `--reveal` 0 → 1 as the hero travels from viewport-top to `-60vh`, clamped
- [ ] Writes **one** CSS variable on `document.documentElement`. No React state, no re-renders per frame.
- [ ] Cache the hero's offset; recompute on `resize` (and `ResizeObserver` for font swaps), never in the scroll handler
- [ ] Clean up listeners on unmount (route change)
- [ ] Unit-test the pure math separately: `progress(scrollY, heroTop, range) → clamp(0..1)`

### 3.3 Progressive enhancement
- [ ] CSS default `--reveal: 1` (already in tokens): without JS the bottle is fully lit
- [ ] JS sets the initial dim value **only once it's running**. Nothing is hidden behind JS.
- [ ] `prefers-reduced-motion: reduce` pins `--reveal: 1` (already in tokens), the hook doesn't attach a listener, and there's no parallax and no staggers

### 3.4 Caustics
- [ ] Two blurred, skewed copies of the silhouette behind the bottle, 8% opacity (`--glass` only if needed, per D-§14)
- [ ] Offset by pointer position: max ±12px, lerped at `0.08` per frame (same rAF loop; stop the loop when settled)
- [ ] `transform` only. Apply the blur once, statically; never animate `filter`.
- [ ] Disabled for touch-only devices (`(hover: none)`) and reduced motion

### 3.5 Choreography driven by `--reveal`
- [ ] Headline enters in two staggered groups as a **function of `--reveal`**, not time
- [ ] When `--reveal` > `0.75`, price and CTA fade up (opacity/transform from CSS `clamp()` math, or a class toggle at the threshold)
- [ ] Only `transform`, `opacity` and `mask-position` animate. Verify in DevTools → Rendering → Paint flashing.

### 3.6 Performance gate
- [ ] Chrome DevTools Performance, 4× CPU throttle: no long task > 50ms while scrolling, steady 60fps
- [ ] Test on a real mid-range Android over USB remote debugging
- [ ] Safari check (mask prefixes, `mask-position` behaviour)

### 3.7 Fallback (only if 3.1 is a no-go)
- [ ] Bottle fully lit from the start; the light follows the pointer across the silhouette instead (same mask, pointer-driven)
- [ ] Record the decision in IDEA.md §5

### 3.8 Wrap up
- [ ] Move the mechanic from `/lab` into the real hero
- [ ] Reduced-motion page reviewed **as a design**: it must look finished, not broken
- [ ] Commit: `feat: scroll-linked light reveal`

---

## Milestone 4 — Note interactions + `/fragrance` detail (2d)

**Done when:** hover, focus and touch all work.

- [ ] Home notes: each expands on hover **and** focus (`:hover, :focus-within`); on touch, tapping toggles it
- [ ] Notes are keyboard-reachable buttons or disclosure widgets (`aria-expanded`) if they reveal content
- [ ] `/fragrance`: notes revealed by the same light mechanic at a smaller scale. Reuse the M3 hook/component; don't fork it.
- [ ] Macro-zoom: hovering/focusing a note pushes a blurred texture field + its copy through a mask
  - [ ] Texture field = CSS/SVG (noise + gradient), **no images**
- [ ] 24h timeline: hairline rule with markers for top / heart / base
- [ ] Reduced motion: expanded content still reachable, with instant state changes
- [ ] Tests: expanding by keyboard (Enter/Space), `aria-expanded` toggles, content becomes visible
- [ ] Commit: `feat: note interactions and fragrance detail`

---

## Milestone 5 — Motion polish + route transitions (2d)

**Done when:** every duration and easing comes from the motion table (tokens). No ad-hoc values.

- [ ] Audit: `grep` for raw `ms` / `cubic-bezier` outside `tokens.css`. There should be none.
- [ ] Menu open: 520ms expo-out; items staggered 50ms (`--i` index per item)
- [ ] Menu close: 380ms expo-in
- [ ] Hover / micro: 160ms ease-out
- [ ] Route transition: 700ms `--ease-route`, bone curtain wipe
  - [ ] `document.startViewTransition` where available (React Router's `viewTransition` prop on `Link`/`NavLink`, or `useViewTransitionState`)
  - [ ] CSS fallback where unsupported (Firefox; check current support)
  - [ ] Focus moves to the new route's `h1` (or `main`) after navigation. Screen readers need to know the page changed.
  - [ ] Scroll goes to the top on new routes and is restored on back/forward (`ScrollRestoration` is already mounted)
- [ ] Wordmark fade-in on first load (time-based, it's entrance motion)
- [ ] Rules check: nothing scroll-tied runs on a clock; no bounce, elastic or overshoot
- [ ] Reduced motion: route change is instant, menu appears without stagger
- [ ] If D2 = no `motion` lib: write a small `usePrefersReducedMotion` hook (`matchMedia` + listener) and test it
- [ ] Commit: `feat: route transitions and motion polish`

---

## Milestone 6 — Accessibility + performance pass, Lighthouse CI (2d)

**Done when:** all budgets are green in CI.

### 6.1 Accessibility (IDEA §9 checklist)
- [ ] Menu: focus trap, Escape, focus return, `aria-expanded`, `aria-controls` (from M2; re-verify after the M5 motion work)
- [ ] Full keyboard path through every interactive element; visible focus ring on `--ink` and on `--bone`
- [ ] **Contrast ≥ 4.5:1 for all text.** Measured (WCAG formula):
  - `--ash` `#6E6A64` on `--ink` = **3.68:1 ❌ fails**. On `--bone` (mobile menu) = **4.41:1 ❌ fails**.
  - `--bone` on `--ink` = 16.24:1 ✅
  - Fix: keep `--ash` for hairlines only and add an `--ash-text` token for secondary text. On ink: `#85817B` = 5.11:1 (`#7E7A74` = 4.64:1 is the minimum that passes). On bone: needs a darker grey; compute it when the menu is styled.
  - Better: do this in **M1** when typography is set, so you don't restyle later.
- [ ] Reduced-motion page is complete, static and still beautiful
- [ ] Landmarks: `header / nav / main / section / footer`, one `h1` per route (already tested)
- [ ] Skip link works and is visible on focus
- [ ] No content hidden pending JS: check with JS disabled (depends on D1)
- [ ] SVG bottle: `role="img"` + `<title>`, or `aria-hidden`
- [ ] Add `vitest-axe` (or `jest-axe`) to component tests for automated a11y checks
- [ ] Manual screen reader pass: NVDA (Windows, free) on Firefox/Chrome; VoiceOver on iOS if available

### 6.2 Performance budgets
- [ ] LCP < 2.0s on throttled 4G
- [ ] CLS = 0 (fonts with metric overrides, SVG with fixed aspect ratio, nothing injected above the fold)
- [ ] JS < 120 KB gzipped (check `npm run build` output; add `rollup-plugin-visualizer` if it's close)
- [ ] No long task > 50ms during scroll
- [ ] 60fps scroll at 4× CPU throttle / real mid-range Android
- [ ] Total transfer ≈ 150 KB target (IDEA §4)

### 6.3 Lighthouse CI
- [ ] Add `@lhci/cli` + `lighthouserc.json`, run it against `vite preview` (or the pre-rendered `dist`) in GitHub Actions
- [ ] Assertions: Performance ≥ 95, Accessibility = 100, Best Practices = 100, SEO = 100
- [ ] Run against all 3 routes
- [ ] SEO basics: per-route title + description, `lang="en"`, `robots.txt`, valid link text, `theme-color`
- [ ] Best Practices: no console errors, HTTPS (host provides it), correct image aspect ratios

### 6.4 E2E (Playwright)
- [ ] Add `@playwright/test`; config with a `webServer` that runs `vite preview`
- [ ] Test 1: scroll the hero → `--reveal` reaches `1` (read the computed style on `:root`)
- [ ] Test 2: menu is keyboard-operable end to end (mobile viewport)
- [ ] Test 3: navigating between routes works and the transition completes, with focus landing on the new `h1`
- [ ] Test 4: `reducedMotion: 'reduce'` context means the bottle is fully lit on load
- [ ] Run in CI on Chromium; run locally on WebKit and Firefox too
- [ ] Commit: `test: e2e, axe and lighthouse ci`

### 6.5 Cross-browser
- [ ] Chrome, Firefox, Safari (real device): Bodoni optical sizing at huge sizes, fallback metrics, mask behaviour
- [ ] Windows font rendering check for Bodoni at 11rem (IDEA §12 risk)

---

## Milestone 7 — Deploy, README, 20s demo (1d)

**Done when:** there's a live URL and the clip sits at the top of the README.

- [ ] Delete `/lab` and any spike code
- [ ] Dead-code / unused-dependency sweep (`npx knip`)
- [ ] No `console.log` anywhere
- [ ] Final copy proofread (curly quotes, en/em dashes, `€240` formatting)
- [ ] Favicon final; add social preview image (OG) **made from type + silhouette**, not photography
- [ ] README:
  - [ ] What it is (one line) + live link + 20s clip at the top
  - [ ] Why (craft piece; what it proves, what it doesn't)
  - [ ] Stack reasoning (why no Tailwind, no GSAP, no state library, no Lenis)
  - [ ] How the light reveal works (one rAF listener → one CSS var)
  - [ ] Setup: `npm install`, `npm run dev`, `npm test`, `npm run build`
  - [ ] Lighthouse scores + budget table
- [ ] 20s demo per IDEA §15: black → wordmark → scroll → light reveals bottle → headline resolves → menu opens → route wipe → same scroll on mobile
  - [ ] Record (OBS / Windows Game Bar + phone screen recording), edit to 20s, export a small MP4 or GIF
- [ ] Cold-load test of the live URL on a phone over 4G
- [ ] Commit: `docs: readme and demo`

---

## Definition of done (IDEA §13)

- [ ] Live URL, cold-loaded, works with JS disabled (bottle lit, copy readable) ← depends on **D1**
- [ ] 3 routes, keyboard-operable end to end
- [ ] Reduced-motion version is designed, not degraded
- [ ] Lighthouse CI green in the repo
- [ ] README: what, why, stack reasoning, setup, live link, 20s clip
- [ ] No `console.log`, no dead code, no unused dependency
- [ ] Clean commit history: feature-sized commits, no "wip" noise

---

## Out of scope — do not build (IDEA §10)

Cart · checkout · payments · CMS/admin/backend · multiple products · blog/journal/press · i18n/French toggle · theme toggle · 3D bottle (Three.js) · GSAP · Lenis/smooth-scroll · analytics · stock photography · sound.

The "Request an invitation" panel is the pressure valve. It absorbs every "shouldn't there be a cart?" impulse.
