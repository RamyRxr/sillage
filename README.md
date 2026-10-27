# SILLAGE

An editorial site for a fictional perfume house. The bottle is revealed by light: a single sweep of illumination travels down the page as you scroll, and the bottle only exists where the light has touched it.

> **Live:** _not deployed yet_ · **Demo clip:** _coming in Milestone 7_

A craft piece: typography, scroll-linked motion, layout, performance and accessibility. It has no backend, no cart and no stock photography.

- Concept, brand, art direction and quality bar: [IDEA.md](IDEA.md)
- Work plan and progress: [TODO.md](TODO.md)

## Stack

| Tool | Why |
|---|---|
| React 19 + TypeScript + Vite | Fast feedback; types pay off in the geometry/motion code |
| React Router (data router) | Three real routes, scroll restoration and a navigation lifecycle to hang transitions on |
| CSS Modules + tokens in `:root` | The work is typographic micro-tuning; utility classes fight it |
| Vitest + React Testing Library | Behaviour tests: routing, focus management, reduced motion |
| oxlint | Fast linting shipped with the Vite template |

No state library, because there is no state: scroll progress lives in a single CSS variable.

## Getting started

Requires Node 22.12+ (Vitest 5 minimum).

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm test           # tests in watch mode
npm run test:run   # tests once (CI)
npm run lint
npm run build      # typecheck + production build
npm run preview    # serve the production build
```

## Project layout

```
src/
├── content/copy.ts      # all brand copy, one source of truth
├── layouts/             # shared chrome (header, nav, footer)
├── routes/              # one component per route
├── routes.tsx           # route table, shared by app and tests
├── styles/              # tokens.css (palette, type, motion) + global.css
└── test/setup.ts        # Vitest + jest-dom setup
```
