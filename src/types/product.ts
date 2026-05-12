import type { Variant, VariantType } from './variant'

export type ProductStatus = 'active' | 'inactive'

export type Product = {
  id: string
  /** Matches `prod_XXX` (e.g. prod_001 → 1) for simple API routes like GET /products/1 */
  numericId?: number
  title: string
  description: string
  category: string
  basePrice: number
  status: ProductStatus
  images: string[]
  variantTypes: VariantType[]
  variants: Variant[]
}
