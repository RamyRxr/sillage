# Sillage: project notes for Claude

## Who you are working with

Ramy is learning web development (HTML/CSS/JS/TS done, React in progress, then Next.js, Node, Postgres). Explain *why* a choice fits, not only what to type. Build mode for this project: Claude writes the code and explains it; Ramy reviews.

## What this is

A **demo** online store for Sillage, a perfume house from Grasse that sells only its own perfumes. Ramy will show it to the store owner, who decides whether to use it. Everything runs in the browser: a real cart saved to localStorage and a simulated checkout. No server, no payment, nothing sent.

The visual design ("Halo": warm cream, peach, rose and amber glow, glass panels, arch shapes, Fraunces + Manrope) is in Figma file `kH3DBg6JJhrlzsVpKelrvX`. Desktop store pages are node 19:2 and 20:2; mobile are 28:2, 29:2 and 30:2. The Python generators that produced those frames live in `design/desktop/`. `IDEA.md` is the earlier single-fragrance concept and is out of date except for the brand copy.

## Stack

React 19 + TypeScript + Vite 8, React Router 8 (data router, `src/routes.tsx`), Tailwind v4 (tokens in `src/styles/global.css`), Motion (`motion/react`), Zustand with `persist` (cart), React Hook Form + Zod 4 (checkout; `zod/mini` in the cart store to keep the first load small), Vitest + Testing Library, Playwright. Deploy target: Vercel or Netlify (static), not set up yet.

## Commands

```bash
npm run dev          # dev server, port 5173
npm run test:run     # unit + page tests (65)
npm run test:coverage
npm run lint         # oxlint
npm run build        # tsc -b + vite build
npm run e2e          # Playwright, desktop + phone (9 run, 1 phone-only skipped on desktop)
```

Playwright's own Chromium may not be installed. Locally: `PLAYWRIGHT_CHROMIUM_PATH="$LOCALAPPDATA/ms-playwright/chromium-1248/chrome-win64/chrome.exe" npx playwright test`.

## Conventions

- Pages read products only through `productRepository`, never `products.ts` directly.
- Cart maths lives in pure functions (`src/features/cart/cartLogic.ts`); the store only wires them up. Never mutate; return new arrays.
- Every animation value comes from `src/lib/motion.ts`. Animate only transform, opacity and clip-path. Decorative CSS animations are switched off under `prefers-reduced-motion` in `global.css`.
- `Bottle` takes its width from `className`; without one it is full width.
- One `h1` per page. Dialogs (cart drawer, mobile menu) use `useDialog` for focus trap, Escape, scroll lock and focus return.
- Card details must never reach the store, localStorage or the URL. `placeOrder` takes only email and first name.
- The page wrapper in `Layout.tsx` moves focus only when a new page appears, never on URL changes within a page (that broke search typing once).

## Status

Done: all seven pages (Home, Shop, Product, Our story, Cart, Checkout, Order confirmed) plus 404, desktop and mobile, with motion; unit, page and end-to-end tests passing.

Not done: deployment and a live link, real product photos, the store's real catalogue, prices and policies, a real payment provider.

Known debt: nine components are 54-65 lines (over the 50-line rule), mostly markup: MenuPanel, AddToCartButton, Bottle, ProductCard, OptionGroup, DrawerPanel, CheckoutPage, ConfirmationPage, ProductPage.

Testing note: the Claude desktop browser pane pauses animation frames when hidden, so closing animations look stuck there. Verify motion in Playwright, not the hidden pane.

## Useful agents and skills

`code-reviewer`, `security-reviewer` (checkout input), `react-reviewer`, `typescript-reviewer`, `e2e-runner`; skills `motion-foundations`, `motion-patterns`, `motion-advanced`, `react-patterns`, `frontend-a11y`, `deployment-patterns`.
