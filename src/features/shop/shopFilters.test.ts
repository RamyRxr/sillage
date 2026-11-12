import { describe, expect, it } from 'vitest'
import { productRepository } from '../../data/productRepository'
import { filterAndSort, parseFamily, parseSort } from './shopFilters'

const all = productRepository.findAll()
const names = (list: ReadonlyArray<{ name: string }>) => list.map((product) => product.name)

describe('parse helpers', () => {
  it('accept known values and fall back on anything else', () => {
    expect(parseFamily('Floral')).toBe('Floral')
    expect(parseFamily('<script>')).toBe('All')
    expect(parseFamily(null)).toBe('All')
    expect(parseSort('price-desc')).toBe('price-desc')
    expect(parseSort('cheapest')).toBe('featured')
  })
})

describe('filterAndSort', () => {
  it('keeps catalogue order for "featured"', () => {
    expect(names(filterAndSort(all, { family: 'All', sort: 'featured', query: '' }))).toEqual(names(all))
  })

  it('filters by family', () => {
    expect(names(filterAndSort(all, { family: 'Floral', sort: 'featured', query: '' }))).toEqual(['Iris Blanc', "Fleur d'Ombre"])
  })

  it('searches names and notes, ignoring case', () => {
    expect(names(filterAndSort(all, { family: 'All', sort: 'featured', query: 'CEDAR' }))).toEqual(['Bois Tendre'])
    expect(names(filterAndSort(all, { family: 'All', sort: 'featured', query: 'iris' }))).toEqual(['Ombre Claire', 'Iris Blanc'])
  })

  it('sorts by price both ways and by name', () => {
    const ascending = filterAndSort(all, { family: 'All', sort: 'price-asc', query: '' })
    expect(ascending[0].name).toBe('Peau de Sel')
    expect(filterAndSort(all, { family: 'All', sort: 'price-desc', query: '' })[0].sizes[1].priceCents).toBe(24_000)
    expect(names(filterAndSort(all, { family: 'All', sort: 'name', query: '' }))[0]).toBe('Bois Tendre')
  })

  it('does not reorder the original list', () => {
    const before = names(all)
    filterAndSort(all, { family: 'All', sort: 'name', query: '' })
    expect(names(all)).toEqual(before)
  })
})
