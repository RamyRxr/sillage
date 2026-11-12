import { describe, expect, it } from 'vitest'
import { checkoutSchema, type CheckoutInput } from './checkoutSchema'

const NOW = new Date('2026-11-12T10:00:00Z')

const valid: CheckoutInput = {
  email: 'claire@example.com',
  firstName: 'Claire',
  lastName: 'Martin',
  address: '12 rue des Fleurs',
  city: 'Grasse',
  postcode: '06130',
  country: 'France',
  cardNumber: '4242 4242 4242 4242',
  expiry: '12/28',
  cvc: '123',
}

function errorsFor(input: Partial<CheckoutInput>): Record<string, string> {
  const result = checkoutSchema(NOW).safeParse({ ...valid, ...input })
  if (result.success) return {}
  return Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message]))
}

describe('checkoutSchema', () => {
  it('accepts a complete, valid form', () => {
    expect(errorsFor({})).toEqual({})
  })

  it('rejects a bad email', () => {
    expect(errorsFor({ email: 'claire@' })).toHaveProperty('email', 'Enter a valid email address')
  })

  it('requires the name and address fields', () => {
    const errors = errorsFor({ firstName: ' ', city: '' })

    expect(errors).toHaveProperty('firstName')
    expect(errors).toHaveProperty('city')
  })

  it('rejects a card number that fails the checksum', () => {
    expect(errorsFor({ cardNumber: '4242 4242 4242 4241' })).toHaveProperty('cardNumber', 'Check the card number')
  })

  it('rejects an expired card and a bad format', () => {
    expect(errorsFor({ expiry: '10/26' })).toHaveProperty('expiry', 'This card has expired')
    expect(errorsFor({ expiry: '13/28' })).toHaveProperty('expiry', 'Use MM / YY')
  })

  it('rejects a short security code', () => {
    expect(errorsFor({ cvc: '12' })).toHaveProperty('cvc')
  })
})
