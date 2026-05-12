# ACS Store — Mini E-Commerce Platform

A Shopify-inspired mini e-commerce platform built as a technical assessment. Features three distinct surfaces: Admin Product Management, Public Storefront, and a persistent Cart.

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Running the App

Start both the Next.js dev server and the json-server API together:

```bash
npm run start:all
```

Or separately:

```bash
npm run dev      # Next.js on http://localhost:3000
npm run server   # json-server API on http://localhost:3001
```

### Other Commands

```bash
npm test           # Run unit tests (Vitest)
npm run typecheck  # TypeScript type checking
npm run lint       # ESLint
npm run format     # Prettier
```

## Routes

| Route | Description |
|---|---|
| `/` | Storefront — browse products with search, category filter, and pagination |
| `/product/[id]` | Product detail — image gallery, variant selector, add to cart |
| `/admin` | Admin — product list table with edit/delete |
| `/admin/products/new` | Create a new product with variants |
| `/admin/products/[id]/edit` | Edit an existing product |

## Architecture

### Tech Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| State | Zustand v5 (cart), TanStack Query v5 (server data) |
| Forms | React Hook Form v7 + Zod v4 |
| API | json-server (REST) via Axios |
| Testing | Vitest + Testing Library |

### Key Design Decisions

**Server Components + HydrationBoundary**

Every page that shows product data prefetches via `createServerQueryClient()` on the server and passes dehydrated state to the client via TanStack Query's `HydrationBoundary`. This eliminates loading flicker on initial page load — the client sees data immediately after hydration without a second network round-trip.

```ts
// Server Component
const queryClient = createServerQueryClient()
await queryClient.prefetchQuery({ queryKey, queryFn })
return <HydrationBoundary state={dehydrate(queryClient)}> ... </HydrationBoundary>
```

**Variant Permutation Engine**

The core of the admin experience is `reconcileVariants` in `src/features/products/utils/permutations.ts`. When a merchant adds, removes, or edits a variant type (e.g. adding "Color" to a "Size-only" product), the engine:

1. Computes the full Cartesian product of all variant type values
2. Matches existing variants by their sorted options signature (`optionKey`) — so `{Color: 'Red', Size: 'M'}` matches regardless of insertion order
3. Preserves user-entered SKU, stock, price override, and enabled state for unchanged permutations
4. Creates defaults for genuinely new permutations
5. Drops permutations whose combination no longer exists

This means a merchant never loses hand-entered data just because they added a new option value.

**Cart: Zustand with `skipHydration`**

The cart is stored in `localStorage` via Zustand's `persist` middleware with `skipHydration: true`. This prevents the SSR mismatch that would otherwise occur when the server renders "empty cart" and the client immediately shows "3 items". The `CartHydrator` component in `providers.tsx` triggers explicit rehydration in a `useEffect` after mount.

**URL-driven Storefront Filters**

Search and category filters are stored in URL search params (`?q=...&category=...&page=...`). This makes filtered views shareable, bookmarkable, and supports browser back/forward. The `useStorefrontFilters` hook wraps `useRouter` + `useSearchParams` and exposes a clean setter API. Client-side filtering runs against the full product list already in the TanStack Query cache.

**Tailwind v4 CSS-first Config**

No `tailwind.config.ts`. All tokens are declared in `globals.css` using `@theme {}` (design tokens) and CSS custom properties (runtime-switchable dark/light values). Dark mode uses `@custom-variant dark` to target the `.dark` class applied by next-themes.

**React 19 Patterns**

- `useSyncExternalStore` for hydration detection (ThemeToggle, useMediaQuery) — avoids the banned `useEffect → setState` pattern
- Async `params` in all page components (`await params`) as required by Next.js 16
- `noUncheckedIndexedAccess: true` in `tsconfig.json` — array accesses return `T | undefined`, eliminating a whole class of runtime errors

### Folder Structure

```
src/
├── app/
│   ├── (storefront)/          # Public storefront routes
│   │   ├── page.tsx           # Home / product grid
│   │   └── product/[id]/      # Product detail
│   ├── admin/                 # Admin routes
│   │   ├── page.tsx           # Product list
│   │   └── products/
│   │       ├── new/           # Create product
│   │       └── [id]/edit/     # Edit product
│   ├── layout.tsx             # Root layout + Providers
│   └── globals.css            # Tailwind v4 CSS config + design tokens
├── features/
│   ├── admin/                 # Admin components, schemas, hooks
│   ├── cart/                  # Cart store, mutations, components
│   ├── products/              # Product API, hooks, utils
│   └── storefront/            # Storefront-specific components and hooks
├── components/
│   ├── layout/                # Header, Footer, AdminSidebar, ThemeToggle
│   └── ui/                    # Button, Input, Select, Badge, Modal, Drawer...
├── lib/
│   ├── api/                   # Axios client, TanStack Query client, query keys
│   ├── hooks/                 # useDebounce, useMediaQuery
│   └── utils/                 # cn (class merge), formatters
├── types/                     # Product, Variant, Cart, API types
└── constants/                 # CATEGORIES, ROUTES
```

### Testing

74 unit tests covering the pure utility layer:

- `permutations.ts` — Cartesian product, variant reconciliation, price range
- `sku.ts` — title slugification, SKU generation
- `formatters.ts` — currency and date formatting
- `cartCalculations.ts` — line total, subtotal, item count, available-to-add

```bash
npm test
```
