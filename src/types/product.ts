import type { Variant, VariantType } from './variant'

export type ProductStatus = 'active' | 'inactive'

export type Product = {
  id: string
  title: string
  description: string
  category: string
  basePrice: number
  status: ProductStatus
  images: string[]
  variantTypes: VariantType[]
  variants: Variant[]
}
