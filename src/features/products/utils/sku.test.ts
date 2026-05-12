import { describe, it, expect } from 'vitest'
import { titleToSlug, suggestSku } from './sku'

describe('titleToSlug', () => {
  it('lowercases and trims the title', () => {
    expect(titleToSlug('  Classic Tee  ')).toBe('classic-tee')
  })

  it('replaces spaces with hyphens', () => {
    expect(titleToSlug('Classic Crew Tee')).toBe('classic-crew-tee')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(titleToSlug('Too   Many   Spaces')).toBe('too-many-spaces')
  })

  it('removes special characters', () => {
    expect(titleToSlug("Men's T-Shirt & Shorts!")).toBe('men-s-t-shirt-shorts')
  })

  it('handles numbers in the title', () => {
    expect(titleToSlug('Model 3000 Pro')).toBe('model-3000-pro')
  })

  it('strips leading and trailing hyphens', () => {
    expect(titleToSlug('---hello---')).toBe('hello')
  })

  it('returns empty string for a title that is only special characters', () => {
    expect(titleToSlug('!!!')).toBe('')
  })

  it('handles unicode by stripping non-ASCII chars', () => {
    // Non-ASCII chars are treated as special chars and replaced
    expect(titleToSlug('Café Noir')).toBe('caf-noir')
  })
})

describe('suggestSku', () => {
  it('combines title slug and option values with hyphens', () => {
    expect(suggestSku('Classic Tee', { Size: 'M', Color: 'Red' })).toBe('classic-tee-m-red')
  })

  it('returns just the title slug when options is empty', () => {
    expect(suggestSku('Classic Tee', {})).toBe('classic-tee')
  })

  it('lowercases option values', () => {
    expect(suggestSku('Hoodie', { Size: 'XL' })).toBe('hoodie-xl')
  })

  it('replaces spaces in option values with hyphens', () => {
    expect(suggestSku('Shoe', { Color: 'Dark Brown' })).toBe('shoe-dark-brown')
  })

  it('handles a single option', () => {
    expect(suggestSku('Wallet', { Color: 'Black' })).toBe('wallet-black')
  })
})
