import { describe, expect, it } from 'vitest'
import { formatPrice } from './money'

describe('formatPrice', () => {
  it('shows whole amounts without decimals', () => {
    expect(formatPrice(24_000)).toBe('€240')
  })

  it('shows two decimals when there are cents', () => {
    expect(formatPrice(2_450)).toBe('€24.50')
  })

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('€0')
  })
})
