import { products } from './products'
import type { Family, Product, Size } from './types'

export type FamilyCount = { readonly family: Family; readonly count: number }

const FAMILY_ORDER: readonly Family[] = ['Fresh', 'Floral', 'Amber', 'Woody']

function isPerfume(product: Product): product is Product & { family: Family } {
  return product.family !== null
}

/**
 * The only place pages get product data from. Today it reads a local file; a real store would swap
 * these functions for API calls without touching the pages.
 */
export const productRepository = {
  /** Perfumes shown in the shop, in catalogue order. */
  findAll(): readonly Product[] {
    return products.filter(isPerfume)
  },

  /** Any sellable item by slug, including the discovery set. */
  findBySlug(slug: string): Product | undefined {
    return products.find((product) => product.slug === slug)
  },

  findSize(slug: string, ml: number): Size | undefined {
    return this.findBySlug(slug)?.sizes.find((size) => size.ml === ml)
  },

  /** Other perfumes to suggest next to `slug`. */
  findRelated(slug: string, limit = 3): readonly Product[] {
    return this.findAll()
      .filter((product) => product.slug !== slug)
      .slice(0, limit)
  },

  familyCounts(): readonly FamilyCount[] {
    const perfumes = this.findAll()
    return FAMILY_ORDER.map((family) => ({
      family,
      count: perfumes.filter((product) => product.family === family).length,
    }))
  },
}
