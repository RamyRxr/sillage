# SILLAGE — Editorial Fragrance Site

**Type:** Frontend-only editorial product site (Project 1 scale)
**Stack:** React + TypeScript + Vite, no backend, no real commerce
**Goal:** make a fictional perfume house feel genuinely expensive — through type, light, whitespace and restraint — and ship it flawlessly.

---

## 1. One line

A perfume house site where **the bottle is revealed by light**: a single sweep of illumination travels down the page as you scroll, and the bottle only exists where the light has touched it.

---

## 2. Why this project exists (honest positioning)

### What it proves

| Skill | How the project forces it |
|---|---|
| Typography | A display serif at 10rem with negative tracking and real optical sizing. Unforgiving. |
| Motion craft | Scroll-linked reveal with correct easing, timing, and no jank. |
| Layout | Asymmetric editorial grid, generous whitespace, responsive recomposition (not shrinking). |
| Performance discipline | 60fps scroll on mid-range Android, LCP under 2s, zero CLS. |
| Accessibility | Focus management, reduced motion, keyboard-first menu, contrast. |

### What it does *not* prove

State management, data modelling, architecture, APIs, auth. This is a **craft** piece, not a **systems** piece. It complements a project like FireTrack; it does not replace the need for one.

### The honest risk

"Luxury perfume website" is one of the most saturated briefs in frontend. The category impresses nobody. Only execution does. Two things decide whether this lands:

1. **No stock photography.** One bad stock perfume photo and the whole thing reads as a template.
2. **One signature moment, not five effects.** Feature lists of parallax + mask + transitions + menu animation produce a busy page, not an expensive one.

Both are addressed below with locked decisions.

---

## 3. The brand

**House:** SILLAGE
*Sillage (noun, French): the trail of scent a person leaves behind after they have gone.*

**First fragrance:** OMBRE CLAIRE — *bright shadow*
**Format:** 50 ml Extrait de Parfum, €240
**Made in:** Grasse, France

The name is the concept. A perfume is not a smell, it's a trace. And the bottle is not an object, it's glass holding light. "Bright shadow" names exactly what the homepage does: a dark bottle, lit.

### Copy (locked — this is the bar, not a placeholder)

**Wordmark treatment:** `S I L L A G E` — 0.4em tracking, 12px, uppercase, bone.

**Hero:**
> OMBRE CLAIRE
>
> A perfume is not a smell.
> It is the space you leave behind.

**Manifesto (body, ~60 words):**
> Most fragrances announce themselves. This one waits. Bergamot opens and withdraws within the hour; what remains for the rest of the day is iris, ambrette, and a warm salt skin of ambergris. Worn close, it reads as your own warmth. Worn at a distance, it is only a suggestion that someone was here.

**The three notes:**

| Note | Position | Copy |
|---|---|---|
| Bergamot | Top | *Cold, green, brief. It exists to leave.* |
| Iris | Heart | *Powder and root. The part that stays in the room.* |
| Ambergris | Base | *Salt, skin, warmth. Not a scent so much as a presence.* |

**Pull quote (used on `/maison`):**
> "We did not make a perfume to be noticed. We made one to be remembered."

**CTA:** `Request an invitation` — no cart, no checkout, no fake prices. It's a maison, not a shop. (Clicking it opens a small panel explaining it's a concept piece — honest and in-brand.)

---

## 4. Art direction — locked decision

### Direction A — **Type and light** (chosen)

No photography. The bottle is a **hand-drawn SVG silhouette**. Everything else is type, near-black, bone, grain, and a single moving light.

Why:
- Removes the single biggest execution risk (bad assets) and the entire licensing question.
- It is *more* original than an image-led perfume site, not less.
- Ships at ~150KB total. Loads instantly. Feels expensive precisely because it's quiet.
- A silhouette + light is a stronger concept than a photo: the bottle is never fully shown, so the imagination fills it in.

### Direction B — **Self-shot photography** (fallback / phase 2)

Only if Direction A is finished and deployed. Cheap rectangular bottle, black backdrop, one window, phone on a tripod, long exposure for a highlight along the glass edge. The site is built with an `<img>` slot behind the mask, so Direction B can be swapped in without touching layout.

**Decision rule:** if the light mechanic doesn't feel good by end of week 1, do not "fix it with photos." Cut the mechanic instead.

### Palette

| Token | Value | Use |
|---|---|---|
| `--ink` | `#0A0A0B` | Background. Not pure black — pure black looks like a plugin. |
| `--bone` | `#EDE8E1` | Primary text. Warm off-white. |
| `--ash` | `#6E6A64` | Secondary text, hairlines. |
| `--light` | `#F7F2E9` | The sweep only. Never used for text. |
| `--glass` | `#7E8F8C` | Single cold accent. Caustics only. |

Grain: one 200×200 SVG `feTurbulence` tile, fixed, `pointer-events: none`, 3% opacity, `mix-blend-mode: soft-light`. It is the difference between "flat black div" and "photographed dark room."

### Type system

| Role | Face | Notes |
|---|---|---|
| Display | **Bodoni Moda** (variable) | High-contrast Didone. The fashion archetype. `font-optical-sizing: auto`, letter-spacing `-0.03em` at large sizes. |
| Text | **Inter Tight** | Neutral grotesque. Prevents the page reading as a wedding invitation. |
| Micro | Inter Tight, uppercase, `0.35em` tracking, 11px | Labels, nav, prices. |

Rules:
- Display sizes: `clamp(4rem, 12vw, 11rem)`. Line-height `0.9`. Never centered — always on the grid.
- Body measure: 58–62ch. Never full width.
- One display face, one text face. No third font, ever.
- Self-host both as `woff2` (variable, subset to Latin). Preload the display face only. `font-display: swap`.
- `text-wrap: balance` on headlines, `pretty` on body.

---

## 5. The signature moment — "Revealed by light"

**One mechanic.** Not three effects stacked — a single idea applied consistently.

### Spec

1. The hero contains a dark bottle silhouette (`--ink` fill, barely visible, ~4% lighter than background).
2. A **light layer** sits above it: a duplicate of the silhouette filled with a diagonal `--light` → transparent gradient.
3. That layer is clipped by a mask whose vertical position is driven by scroll progress:
   `mask-position: calc(var(--reveal) * 120% - 10%)`
4. `--reveal` is `0 → 1` as the hero travels from viewport-top to `-60vh`. Written once per frame to the root element.
5. Behind the bottle: two blurred, skewed copies of the silhouette at 8% opacity (`--glass`), offset by pointer position — max ±12px, lerped at `0.08`. This is the caustic shadow; it sells the glass.
6. Headline enters in two staggered groups, also driven by `--reveal`, not by time.
7. When `--reveal` passes `0.75`, the price and CTA fade up. The page reveals itself in the order the light arrives.

### Why this works technically

- **Only `transform`, `opacity` and `mask-position` animate.** No layout, no paint-heavy properties.
- **One scroll listener**, throttled to `requestAnimationFrame`, writing a **single CSS variable**. All motion is CSS reading that variable. This is the pattern that keeps it at 60fps and the reason not to reach for a scroll library.
- **Progressive enhancement:** `--reveal` defaults to `1` in CSS. If JS never runs, the bottle is simply fully lit and the page still works. JS *dims* it, then reveals. Nothing is hidden behind JavaScript.
- **No scroll hijacking.** Native scroll, no smooth-scroll library. Lenis et al. break trackpads, keyboards and screen readers.

### Reduced motion

`prefers-reduced-motion: reduce` pins `--reveal: 1`, kills pointer parallax, kills staggers, and keeps only instant state changes. The page must still look finished — this is a design requirement, not a checkbox.

### If it doesn't land

Fallback mechanic, same slot: the bottle is fully lit from the start and the light instead **follows the pointer** across the silhouette. Simpler, still distinctive, zero scroll dependency. Decide by end of week 1.

---

## 6. Site structure

Three real routes, so page transitions mean something. (A one-pager with "page transitions" in the brief is a contradiction.)

### `/` — The object
1. Wordmark + nav (hairline, 1px, `--ash`)
2. Hero: OMBRE CLAIRE, light reveal, scroll cue
3. Manifesto — narrow column, no ornament
4. Three notes — horizontal on desktop, stacked on mobile, each expanding on hover/focus
5. Spec strip: 50 ml / Extrait / €240 — typographic table, not cards
6. CTA — "Request an invitation"
7. Footer — minimal, one line

### `/fragrance` — The composition
- Notes in depth, revealed by the same light mechanic at smaller scale
- Macro-zoom: hovering a note pushes a blurred texture field and its copy through a mask
- Longevity and sillage presented as an editorial table (24h timeline as a hairline rule), not a chart
- Ingredients and origin

### `/maison` — The house
- Three paragraphs, one pull quote
- Numbers only: est. 2024, twelve ingredients, one atelier
- No images. Rules and whitespace.

### Navigation & menu
- Desktop: inline, 4 items max, `0.35em` tracked micro type
- Mobile: full-screen overlay — bone background, display-size items, staggered 50ms, `0.45s` expo-out
- Focus trap, `Escape` closes, focus returns to the toggle, `aria-expanded` correct
- Route transition: 700ms, `cubic-bezier(0.65, 0, 0.35, 1)`, bone curtain wipe, with `document.startViewTransition` where available and a CSS fallback elsewhere

---

## 7. Motion language

| Purpose | Duration | Easing |
|---|---|---|
| Hover / micro | 160ms | `ease-out` |
| Menu open | 520ms | `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) |
| Menu close | 380ms | `cubic-bezier(0.4, 0, 1, 1)` (expo in) |
| Route transition | 700ms | `cubic-bezier(0.65, 0, 0.35, 1)` |
| Stagger step | 50ms | — |
| Scroll-linked | **progress-driven** | never time-based |

**Rule:** nothing that is tied to scroll is animated on a clock. Scroll motion is a function of scroll position. Entrance and UI motion is time-based. Mixing the two is what makes scroll sites feel cheap.

**Rule:** no bounce, no elastic, no spring overshoot. Luxury doesn't wobble.

---

## 8. Tech stack (and why, specifically)

| Choice | Why |
|---|---|
| **React 19 + TypeScript + Vite** | Already your stack. Fast feedback, and TS pays off on the geometry/motion code. No reason to switch for a one-page site. |
| **React Router (data router)** | Three real routes, scroll restoration control, and a navigation lifecycle you can hook transitions into. TanStack Router is also fine but React Router is better documented at your stage. |
| **`motion` (Motion for React)** | Menu stagger, route transitions, `AnimatePresence`, and `useReducedMotion` built in. You'd hand-roll all of this otherwise. **No GSAP** — ScrollTrigger is designed for pinning and timelines you don't need here, and it's a large dependency for one mechanic. |
| **CSS Modules + design tokens in `:root`** | Not Tailwind. Tailwind is excellent, but this project is 80% typographic micro-tuning (optical sizing, tracking at 11px vs 10rem, measure, baseline alignment). Utility classes fight that. CSS Modules keep the typography readable and teach you the actual CSS. |
| **No state library** | There is no state. Scroll progress lives in a CSS variable. Adding Zustand here would be résumé-driven development. |
| **Vitest + React Testing Library** | Menu focus trap, Escape, routing, reduced-motion branch. Behaviour, not snapshots. |
| **Playwright** | One e2e: hero reveal reaches full light, menu is keyboard-operable, routes transition. |
| **Lighthouse CI** | Enforce the budgets below in CI. This is the whole point of the project. |
| **Vercel / Netlify** | Static, free, instant. Deploy from the first week — not at the end. |

**Browsers:** the JS-driven `--reveal` baseline works everywhere. Layer `animation-timeline` (CSS scroll-driven animations) as a progressive enhancement only if it's a clean win — do not build the site on it.

---

## 9. Quality bar (this is the project)

### Performance budgets
- LCP **< 2.0s** on throttled 4G
- CLS **0**
- JS **< 120KB** gzipped
- No long task **> 50ms** during scroll
- 60fps scroll on a mid-range Android (test on a real device, or 4× CPU throttle)
- Lighthouse: **Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100**

### Accessibility checklist
- [ ] Menu: focus trap, Escape, focus return, `aria-expanded`, `aria-controls`
- [ ] Full keyboard path through every interactive element, visible focus ring on `--ink` and on `--bone`
- [ ] Contrast ≥ 4.5:1 for all text (`--ash` on `--ink` needs checking — lighten if it fails)
- [ ] `prefers-reduced-motion` yields a complete, static, still-beautiful page
- [ ] Semantic landmarks: `header / nav / main / section / footer`, one `h1` per route
- [ ] Skip link
- [ ] No content hidden pending JS
- [ ] SVG bottle has `role="img"` + `<title>`, or is `aria-hidden` if purely decorative

---

## 10. Scope

### In
- 3 routes, one fragrance, one house
- The light reveal mechanic (one)
- Menu overlay with real focus management
- Route transitions
- Note interactions on `/fragrance`
- Grain, caustics, type system
- Deployed, tested, Lighthouse-gated, README with a 20s demo clip

### Out (write this on the wall)
- Cart, checkout, payments
- CMS, admin, backend of any kind
- Multiple products / collection pages
- Blog, journal, press
- i18n / French toggle
- Theme toggle
- 3D bottle model (Three.js) — the silhouette is the concept
- GSAP, Lenis, smooth-scroll hijacking
- Analytics
- Stock photography
- Sound

Every item above is a legitimate future addition and every one of them would turn a 2–3 week project into a 3-month abandoned one.

---

## 11. Build order

| # | Milestone | Est. | Done when |
|---|---|---|---|
| 0 | Lock brand copy, palette, type pairing | 0.5d | All copy in this file is final |
| 1 | Static layout, no motion, all 3 routes | 2d | Looks good as a printed page on mobile and desktop |
| 2 | Nav + mobile menu + focus management | 2d | Keyboard-only pass, no motion yet |
| 3 | **Light reveal mechanic** | 3d | 60fps on throttled CPU; reduced-motion fallback complete |
| 4 | Note interactions + `/fragrance` detail | 2d | Hover, focus and touch all work |
| 5 | Motion polish + route transitions | 2d | Every duration/easing from the table, no ad-hoc values |
| 6 | A11y + performance pass, Lighthouse CI | 2d | All budgets green in CI |
| 7 | Deploy, README, 20s demo recording | 1d | Live URL + clip at top of README |

**≈ 14 working days.** If it's running past 3 weeks, cut `/maison` before cutting the quality bar.

**Build the risky thing early.** Milestone 3 is the one that might not work. Do not leave it until week 3 — and do not build 4 other sections to "warm up" first.

---

## 12. Risks

| Risk | Mitigation |
|---|---|
| The light mechanic looks like a cheap gradient wipe | Build it in week 1 on a bare page, with nothing else. If it isn't convincing in isolation, switch to the pointer-follow variant. |
| Silhouette SVG looks amateur | Draw it with straight lines and a chamfered cap — a rectangular flacon reads as luxury; a curved "perfume bottle" reads as clipart. Keep it geometric. |
| Scroll jank on mobile | Single rAF scroll handler → one CSS var. Test on a real phone from day 1, not at the end. |
| Scope creep into a shop | The "Request an invitation" panel is the pressure valve. It absorbs every "shouldn't there be a cart?" impulse. |
| Looks like every other Awwwards perfume site | No photography, no centered hero, no scroll hijack, one mechanic, real copy. |
| Bodoni at huge sizes on Windows looks different | Test in Chrome, Firefox, Safari (real device). Check optical sizing and fallback metrics. |
| Project stalls after the pretty hero | Milestone 1 requires *all* copy and *all* routes before any motion. Content-first. |

---

## 13. Definition of done

- [ ] Live URL, cold-loaded, works with JS disabled (bottle lit, copy readable)
- [ ] 3 routes, keyboard-operable end to end
- [ ] Reduced-motion version is designed, not degraded
- [ ] Lighthouse CI green in the repo
- [ ] README: what it is, why, stack reasoning, setup, live link, 20s clip
- [ ] No `console.log`, no dead code, no unused dependency
- [ ] One clean commit history — feature-sized commits, no "wip" noise

---

## 14. Open decisions

| # | Decision | Default if unresolved |
|---|---|---|
| 1 | Final house name (SILLAGE) | Keep — it names the concept |
| 2 | Language: English or French copy | English, with French only for the wordmark and note names |
| 3 | Accent: `--glass` cold green, or none at all | Try none first; add `--glass` only to the caustics |
| 4 | Photography phase 2 | No. Ship Direction A. |
| 5 | `/maison`: 3 paragraphs or one long editorial | 3 short paragraphs + pull quote |
| 6 | Add `animation-timeline` enhancement | No, unless it's a 20-line win |

---

## 15. The 20-second demo

This is what goes in the README and what you show people. Design toward it:

> Black screen, wordmark fades in → silence → you scroll once → light slides down and the bottle appears out of the darkness, its shadow drifting → the headline resolves → cut to the menu opening, staggered → cut to a route transition wiping in bone → cut to mobile, same scroll, equally smooth.

If any of those frames looks cheap, that's the work for that week.
