import { describe, expect, it } from 'vitest'
import { productRepository } from './productRepository'
import { DISCOVERY_SET_SLUG } from './products'

describe('productRepository', () => {
  it('lists the six perfumes and leaves the discovery set out of the shop', () => {
    const slugs = productRepository.findAll().map((product) => product.slug)

    expect(slugs).toHaveLength(6)
    expect(slugs).not.toContain(DISCOVERY_SET_SLUG)
  })

  it('finds any sellable item by slug, including the discovery set', () => {
    expect(productRepository.findBySlug('ombre-claire')?.name).toBe('Ombre Claire')
    expect(productRepository.findBySlug(DISCOVERY_SET_SLUG)?.family).toBeNull()
  })

  it('returns undefined for an unknown slug', () => {
    expect(productRepository.findBySlug('nope')).toBeUndefined()
  })

  it('finds a size and its price', () => {
    expect(productRepository.findSize('ombre-claire', 50)?.priceCents).toBe(24_000)
    expect(productRepository.findSize('ombre-claire', 75)).toBeUndefined()
  })

  it('suggests other perfumes, never the one being viewed', () => {
    const related = productRepository.findRelated('ombre-claire', 3)

    expect(related).toHaveLength(3)
    expect(related.map((product) => product.slug)).not.toContain('ombre-claire')
  })

  it('counts perfumes per family', () => {
    const counts = Object.fromEntries(productRepository.familyCounts().map((c) => [c.family, c.count]))

    expect(counts).toEqual({ Fresh: 1, Floral: 2, Amber: 2, Woody: 1 })
  })
})
