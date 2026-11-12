import { CURRENCY, LOCALE } from './config'

/** Format an amount held in cents, e.g. 24000 -> "€240" and 2450 -> "€24.50". */
export function formatPrice(cents: number): string {
  const hasCents = cents % 100 !== 0
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(cents / 100)
}
