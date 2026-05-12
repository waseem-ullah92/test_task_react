export const CATEGORIES = ['Clothing', 'Accessories', 'Footwear'] as const

export type Category = (typeof CATEGORIES)[number]
