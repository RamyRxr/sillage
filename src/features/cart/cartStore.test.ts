import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../../lib/config'
import { parsePersistedCart, useCartStore } from './cartStore'

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clear()
    useCartStore.setState({ isDrawerOpen: false, lastOrder: null })
  })

  it('adds an item and opens the cart drawer', () => {
    useCartStore.getState().add('ombre-claire', 50)

    const state = useCartStore.getState()
    expect(state.lines).toEqual([{ slug: 'ombre-claire', ml: 50, quantity: 1 }])
    expect(state.isDrawerOpen).toBe(true)
  })

  it('changes and removes quantities', () => {
    const { add, setQuantity } = useCartStore.getState()
    add('ombre-claire', 50)
    setQuantity('ombre-claire:50', 3)
    expect(useCartStore.getState().lines[0].quantity).toBe(3)

    setQuantity('ombre-claire:50', 0)
    expect(useCartStore.getState().lines).toEqual([])
  })

  it('places an order without keeping any card details, then empties the cart', () => {
    const { add, toggleSample, placeOrder } = useCartStore.getState()
    add('ombre-claire', 50)
    toggleSample('iris-blanc')

    const order = placeOrder({ email: 'claire@example.com', firstName: 'Claire' })

    expect(order?.number).toMatch(/^SL-\d{4}$/)
    expect(order?.totalCents).toBe(24_000)
    expect(order?.samples).toEqual(['iris-blanc'])
    expect(JSON.stringify(order)).not.toMatch(/card|cvc|expiry/i)
    expect(useCartStore.getState().lines).toEqual([])
    expect(useCartStore.getState().lastOrder).toEqual(order)
  })

  it('never saves the order, name or email to localStorage', () => {
    const { add, placeOrder } = useCartStore.getState()
    add('ombre-claire', 50)
    placeOrder({ email: 'claire@example.com', firstName: 'Claire' })

    const saved = localStorage.getItem(STORAGE_KEY) ?? ''
    expect(saved).not.toContain('claire@example.com')
    expect(saved).not.toContain('lastOrder')
  })

  it('saves the cart to localStorage', () => {
    useCartStore.getState().add('peau-de-sel', 50)

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    expect(saved.state.lines).toEqual([{ slug: 'peau-de-sel', ml: 50, quantity: 1 }])
  })
})

describe('placeOrder with an empty cart', () => {
  it('returns null and leaves everything as it was', () => {
    useCartStore.setState({ lines: [], samples: [], lastOrder: null })

    expect(useCartStore.getState().placeOrder({ email: 'a@b.co', firstName: 'A' })).toBeNull()
    expect(useCartStore.getState().lastOrder).toBeNull()
  })
})

describe('parsePersistedCart', () => {
  it('drops saved items the catalogue no longer sells', () => {
    const parsed = parsePersistedCart({
      lines: [{ slug: 'ombre-claire', ml: 50, quantity: 1 }, { slug: 'retired-perfume', ml: 50, quantity: 2 }, { slug: 'ombre-claire', ml: 75, quantity: 1 }],
      samples: ['iris-blanc', 'retired-perfume'],
    })

    expect(parsed.lines).toEqual([{ slug: 'ombre-claire', ml: 50, quantity: 1 }])
    expect(parsed.samples).toEqual(['iris-blanc'])
  })

  it('keeps valid saved data', () => {
    const parsed = parsePersistedCart({ lines: [{ slug: 'ombre-claire', ml: 50, quantity: 2 }], samples: ['iris-blanc'] })

    expect(parsed.lines).toHaveLength(1)
    expect(parsed.samples).toEqual(['iris-blanc'])
  })

  it('throws away tampered or broken saved data instead of crashing', () => {
    expect(parsePersistedCart({ lines: [{ slug: 1, quantity: -4 }] })).toEqual({ lines: [], samples: [] })
    expect(parsePersistedCart('garbage')).toEqual({ lines: [], samples: [] })
  })
})
