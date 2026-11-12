import type { Family, Product } from '../../data/types'

export type FamilyFilter = Family | 'All'
export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name'

export const FAMILY_FILTERS: readonly FamilyFilter[] = ['All', 'Fresh', 'Floral', 'Amber', 'Woody']
export const SORT_OPTIONS: ReadonlyArray<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price, low to high' },
  { value: 'price-desc', label: 'Price, high to low' },
  { value: 'name', label: 'Name' },
]

// URL search params are user input, so anything unexpected falls back to the default.
export function parseFamily(value: string | null): FamilyFilter {
  return FAMILY_FILTERS.find((family) => family === value) ?? 'All'
}

export function parseSort(value: string | null): SortKey {
  return SORT_OPTIONS.find((option) => option.value === value)?.value ?? 'featured'
}

function standardPrice(product: Product): number {
  return product.sizes.find((size) => size.ml === product.defaultMl)?.priceCents ?? 0
}

function matchesQuery(product: Product, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [product.name, product.family ?? '', product.translation, ...product.notes.map((note) => note.name)]
  return haystack.some((text) => text.toLowerCase().includes(needle))
}

type FilterOptions = { family: FamilyFilter; sort: SortKey; query: string }

/** Filter by family and search text, then sort. Returns a new array. */
export function filterAndSort(products: readonly Product[], { family, sort, query }: FilterOptions): Product[] {
  const filtered = products.filter(
    (product) => (family === 'All' || product.family === family) && matchesQuery(product, query),
  )
  switch (sort) {
    case 'price-asc':
      return [...filtered].sort((a, b) => standardPrice(a) - standardPrice(b))
    case 'price-desc':
      return [...filtered].sort((a, b) => standardPrice(b) - standardPrice(a))
    case 'name':
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name))
    default:
      return filtered
  }
}
