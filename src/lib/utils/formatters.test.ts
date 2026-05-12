import { describe, it, expect } from 'vitest'
import { formatCurrency, formatPriceRange, formatDate } from './formatters'

describe('formatCurrency', () => {
  it('formats a positive USD amount with 2 decimal places', () => {
    expect(formatCurrency(29.99)).toBe('$29.99')
  })

  it('formats a round number with .00 decimals', () => {
    expect(formatCurrency(30)).toBe('$30.00')
  })

  it('formats zero as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats a large number with comma separators', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56')
  })

  it('accepts a currency code override', () => {
    // EUR uses different symbol position by locale, check it at least contains the amount
    const result = formatCurrency(10, 'EUR')
    expect(result).toContain('10')
  })
})

describe('formatPriceRange', () => {
  it('returns a single formatted price when min equals max', () => {
    expect(formatPriceRange(29.99, 29.99)).toBe('$29.99')
  })

  it('returns a range string when min and max differ', () => {
    expect(formatPriceRange(19.99, 49.99)).toBe('$19.99 – $49.99')
  })

  it('orders min before max in the output', () => {
    const result = formatPriceRange(10, 20)
    const [low, high] = result.split(' – ')
    expect(low).toBe('$10.00')
    expect(high).toBe('$20.00')
  })
})

describe('formatDate', () => {
  it('formats a date string into a human-readable form', () => {
    const result = formatDate('2024-01-15')
    // Locale-dependent but should contain the year and day
    expect(result).toContain('2024')
    expect(result).toContain('15')
  })

  it('accepts a Date object', () => {
    const result = formatDate(new Date('2024-06-01'))
    expect(result).toContain('2024')
  })
})
