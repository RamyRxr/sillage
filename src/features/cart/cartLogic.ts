import { productRepository } from '../../data/productRepository'
import type { Product, Size } from '../../data/types'
import { DELIVERY_CENTS, FREE_DELIVERY_FROM_CENTS, MAX_QUANTITY, MAX_SAMPLES } from '../../lib/config'

// Pure cart maths. Every function returns a new value and never changes its input.

export type CartLine = {
  readonly slug: string
  readonly ml: number
  readonly quantity: number
}

export type PricedLine = CartLine & {
  readonly key: string
  readonly product: Product
  readonly size: Size
  readonly unitCents: number
  readonly totalCents: number
}

export type CartSummary = {
  readonly itemCount: number
  readonly subtotalCents: number
  readonly deliveryCents: number
  readonly totalCents: number
}

export function lineKey(slug: string, ml: number): string {
  return `${slug}:${ml}`
}

function clampQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 0
  return Math.min(Math.max(Math.trunc(quantity), 0), MAX_QUANTITY)
}

export function addLine(lines: readonly CartLine[], slug: string, ml: number, quantity = 1): CartLine[] {
  const key = lineKey(slug, ml)
  const existing = lines.find((line) => lineKey(line.slug, line.ml) === key)
  if (!existing) {
    const initial = clampQuantity(quantity)
    // Never create an empty line: saved carts reject them, which would wipe the whole cart on reload.
    return initial === 0 ? [...lines] : [...lines, { slug, ml, quantity: initial }]
  }
  return lines.map((line) =>
    line === existing ? { ...line, quantity: clampQuantity(line.quantity + quantity) } : line,
  )
}

export function setQuantity(lines: readonly CartLine[], key: string, quantity: number): CartLine[] {
  const next = clampQuantity(quantity)
  if (next === 0) {
    return removeLine(lines, key)
  }
  return lines.map((line) => (lineKey(line.slug, line.ml) === key ? { ...line, quantity: next } : line))
}

export function removeLine(lines: readonly CartLine[], key: string): CartLine[] {
  return lines.filter((line) => lineKey(line.slug, line.ml) !== key)
}

/** Choose up to two free samples. Picking a third replaces the oldest pick. */
export function toggleSample(samples: readonly string[], slug: string): string[] {
  if (samples.includes(slug)) {
    return samples.filter((sample) => sample !== slug)
  }
  return [...samples, slug].slice(-MAX_SAMPLES)
}

/** Attach product data and prices. Lines whose product or size no longer exists are dropped. */
export function priceLines(lines: readonly CartLine[]): PricedLine[] {
  return lines.flatMap((line) => {
    const product = productRepository.findBySlug(line.slug)
    const size = product?.sizes.find((candidate) => candidate.ml === line.ml)
    if (!product || !size) {
      return []
    }
    return [
      {
        ...line,
        key: lineKey(line.slug, line.ml),
        product,
        size,
        unitCents: size.priceCents,
        totalCents: size.priceCents * line.quantity,
      },
    ]
  })
}

export function summarize(lines: readonly PricedLine[]): CartSummary {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotalCents = lines.reduce((sum, line) => sum + line.totalCents, 0)
  const isFree = itemCount === 0 || subtotalCents >= FREE_DELIVERY_FROM_CENTS
  const deliveryCents = isFree ? 0 : DELIVERY_CENTS
  return { itemCount, subtotalCents, deliveryCents, totalCents: subtotalCents + deliveryCents }
}
