import { describe, expect, it } from 'vitest'
import {
  addLine,
  lineKey,
  priceLines,
  removeLine,
  setQuantity,
  summarize,
  toggleSample,
  type CartLine,
} from './cartLogic'

const ombre50: CartLine = { slug: 'ombre-claire', ml: 50, quantity: 1 }

describe('addLine', () => {
  it('adds a new line to an empty cart', () => {
    expect(addLine([], 'ombre-claire', 50)).toEqual([ombre50])
  })

  it('merges the same perfume and size into one line', () => {
    const lines = addLine([ombre50], 'ombre-claire', 50, 2)

    expect(lines).toEqual([{ ...ombre50, quantity: 3 }])
  })

  it('keeps different sizes of the same perfume as separate lines', () => {
    const lines = addLine([ombre50], 'ombre-claire', 10)

    expect(lines).toHaveLength(2)
  })

  it('caps the quantity at the maximum', () => {
    const lines = addLine([{ ...ombre50, quantity: 9 }], 'ombre-claire', 50, 5)

    expect(lines[0].quantity).toBe(10)
  })

  it('never adds an empty or invalid quantity', () => {
    expect(addLine([], 'ombre-claire', 50, 0)).toEqual([])
    expect(addLine([], 'ombre-claire', 50, Number.NaN)).toEqual([])
  })

  it('does not change the original array', () => {
    const original = [ombre50]
    addLine(original, 'ombre-claire', 50)

    expect(original).toEqual([ombre50])
  })
})

describe('setQuantity and removeLine', () => {
  const key = lineKey('ombre-claire', 50)

  it('sets a new quantity', () => {
    expect(setQuantity([ombre50], key, 4)[0].quantity).toBe(4)
  })

  it('removes the line when the quantity drops to zero', () => {
    expect(setQuantity([ombre50], key, 0)).toEqual([])
  })

  it('caps the quantity at the maximum', () => {
    expect(setQuantity([ombre50], key, 99)[0].quantity).toBe(10)
  })

  it('removes a line by key', () => {
    expect(removeLine([ombre50], key)).toEqual([])
  })
})

describe('toggleSample', () => {
  it('adds a sample', () => {
    expect(toggleSample([], 'iris-blanc')).toEqual(['iris-blanc'])
  })

  it('removes a sample that is already chosen', () => {
    expect(toggleSample(['iris-blanc'], 'iris-blanc')).toEqual([])
  })

  it('replaces the oldest pick when two are already chosen', () => {
    expect(toggleSample(['iris-blanc', 'nuit-ambree'], 'bois-tendre')).toEqual(['nuit-ambree', 'bois-tendre'])
  })
})

describe('priceLines and summarize', () => {
  it('prices each line from the catalogue', () => {
    const [line] = priceLines([{ ...ombre50, quantity: 2 }])

    expect(line.product.name).toBe('Ombre Claire')
    expect(line.unitCents).toBe(24_000)
    expect(line.totalCents).toBe(48_000)
  })

  it('drops lines whose product or size no longer exists', () => {
    const priced = priceLines([ombre50, { slug: 'gone', ml: 50, quantity: 1 }, { slug: 'ombre-claire', ml: 75, quantity: 1 }])

    expect(priced).toHaveLength(1)
  })

  it('charges delivery below the free-delivery threshold', () => {
    const summary = summarize(priceLines([{ slug: 'ombre-claire', ml: 10, quantity: 1 }]))

    expect(summary).toEqual({ itemCount: 1, subtotalCents: 6_500, deliveryCents: 900, totalCents: 7_400 })
  })

  it('makes delivery free from the threshold up', () => {
    const summary = summarize(priceLines([ombre50]))

    expect(summary.deliveryCents).toBe(0)
    expect(summary.totalCents).toBe(24_000)
  })

  it('returns zeros for an empty cart', () => {
    expect(summarize([])).toEqual({ itemCount: 0, subtotalCents: 0, deliveryCents: 0, totalCents: 0 })
  })
})
