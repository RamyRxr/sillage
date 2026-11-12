import * as z from 'zod/mini'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { productRepository } from '../../data/productRepository'
import { MAX_QUANTITY, MAX_SAMPLES, STORAGE_KEY } from '../../lib/config'
import { addLine, priceLines, removeLine, setQuantity, summarize, toggleSample, type CartLine } from './cartLogic'

export type OrderItem = {
  readonly name: string
  readonly sizeLabel: string
  readonly quantity: number
  readonly totalCents: number
}

/** What the confirmation page shows. It deliberately holds no payment details. */
export type Order = {
  readonly number: string
  readonly email: string
  readonly firstName: string
  readonly items: readonly OrderItem[]
  readonly samples: readonly string[]
  readonly subtotalCents: number
  readonly deliveryCents: number
  readonly totalCents: number
  readonly placedAt: string
}

export type Customer = { readonly email: string; readonly firstName: string }

type CartState = {
  lines: readonly CartLine[]
  samples: readonly string[]
  /** Kept in memory only, never saved, so a visitor's name and email do not stay in the browser. */
  lastOrder: Order | null
  isDrawerOpen: boolean
  add: (slug: string, ml: number, quantity?: number) => void
  setQuantity: (key: string, quantity: number) => void
  remove: (key: string) => void
  toggleSample: (slug: string) => void
  clear: () => void
  openDrawer: () => void
  closeDrawer: () => void
  /** Returns null, and changes nothing, when the cart is empty. */
  placeOrder: (customer: Customer) => Order | null
}

type PersistedCart = Pick<CartState, 'lines' | 'samples'>

// Saved data comes back from the browser, so it is validated before use, like any outside input.
// zod/mini keeps this validation small enough for the first page load.
const persistedSchema = z.object({
  lines: z
    .array(
      z.object({
        slug: z.string().check(z.maxLength(60)),
        ml: z.int().check(z.positive()),
        quantity: z.int().check(z.minimum(1), z.maximum(MAX_QUANTITY)),
      }),
    )
    .check(z.maxLength(50)),
  samples: z._default(z.array(z.string().check(z.maxLength(60))).check(z.maxLength(MAX_SAMPLES)), []),
})

const EMPTY_CART: PersistedCart = { lines: [], samples: [] }

/**
 * Validate a saved cart and drop anything the catalogue no longer sells, so a returning visitor never
 * sees a cart count for items that cannot be shown or removed.
 */
export function parsePersistedCart(raw: unknown): PersistedCart {
  const result = persistedSchema.safeParse(raw)
  if (!result.success) return EMPTY_CART
  return {
    lines: result.data.lines.filter((line) => productRepository.findSize(line.slug, line.ml) !== undefined),
    samples: result.data.samples.filter((slug) => productRepository.findBySlug(slug) !== undefined),
  }
}

function orderNumber(): string {
  const [value] = crypto.getRandomValues(new Uint32Array(1))
  return `SL-${1000 + (value % 9000)}`
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      ...EMPTY_CART,
      lastOrder: null,
      isDrawerOpen: false,
      add: (slug, ml, quantity = 1) => set({ lines: addLine(get().lines, slug, ml, quantity), isDrawerOpen: true }),
      setQuantity: (key, quantity) => set({ lines: setQuantity(get().lines, key, quantity) }),
      remove: (key) => set({ lines: removeLine(get().lines, key) }),
      toggleSample: (slug) => set({ samples: toggleSample(get().samples, slug) }),
      clear: () => set(EMPTY_CART),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      placeOrder: (customer) => {
        const priced = priceLines(get().lines)
        if (priced.length === 0) return null
        const summary = summarize(priced)
        const order: Order = {
          number: orderNumber(),
          email: customer.email,
          firstName: customer.firstName,
          items: priced.map((line) => ({
            name: line.product.name,
            sizeLabel: line.size.label,
            quantity: line.quantity,
            totalCents: line.totalCents,
          })),
          samples: get().samples,
          subtotalCents: summary.subtotalCents,
          deliveryCents: summary.deliveryCents,
          totalCents: summary.totalCents,
          placedAt: new Date().toISOString(),
        }
        set({ ...EMPTY_CART, lastOrder: order, isDrawerOpen: false })
        return order
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      // Only the cart itself is saved: no order, no name, no email.
      partialize: (state): PersistedCart => ({ lines: state.lines, samples: state.samples }),
      merge: (persisted, current) => ({ ...current, ...parsePersistedCart(persisted) }),
    },
  ),
)
