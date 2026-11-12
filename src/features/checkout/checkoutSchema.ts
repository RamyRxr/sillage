import { z } from 'zod'

const EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\s*\/\s*(\d{2})$/

/** Luhn checksum, the check digit every real card number passes. */
function passesLuhn(digits: string): boolean {
  let sum = 0
  for (let i = 0; i < digits.length; i += 1) {
    let digit = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

function isValidCardNumber(value: string): boolean {
  const digits = value.replace(/\s+/g, '')
  return /^\d{13,19}$/.test(digits) && passesLuhn(digits)
}

/** A card is valid until the end of its expiry month. Bad formats are reported separately. */
function isExpired(value: string, now: Date): boolean {
  const match = EXPIRY_PATTERN.exec(value)
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const nowYear = now.getFullYear()
  return year < nowYear || (year === nowYear && month < now.getMonth() + 1)
}

function required(message: string) {
  return z.string().trim().min(1, { error: message }).max(120, { error: 'This is too long' })
}

/**
 * Checkout form rules. `now` is passed in so expiry checks are testable. This is a demo: nothing that
 * passes these rules is sent or stored.
 */
export function checkoutSchema(now: Date = new Date()) {
  return z.object({
    email: z.email({ error: 'Enter a valid email address' }),
    firstName: required('Enter your first name'),
    lastName: required('Enter your last name'),
    address: required('Enter your street address'),
    city: required('Enter your city'),
    postcode: z.string().trim().min(3, { error: 'Enter your postcode' }).max(10, { error: 'Check the postcode' }),
    country: required('Enter your country'),
    cardNumber: z.string().refine(isValidCardNumber, { error: 'Check the card number' }),
    expiry: z
      .string()
      .trim()
      .regex(EXPIRY_PATTERN, { error: 'Use MM / YY' })
      .refine((value) => !isExpired(value, now), { error: 'This card has expired' }),
    cvc: z.string().trim().regex(/^\d{3,4}$/, { error: 'Enter the 3 or 4 digit code' }),
  })
}

export type CheckoutInput = z.input<ReturnType<typeof checkoutSchema>>
