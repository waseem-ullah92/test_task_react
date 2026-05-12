export type VariantType = {
  id: string
  name: string
  values: string[]
}

export type Variant = {
  id: string
  sku: string
  options: Record<string, string>
  stock: number
  priceOverride: number | null
  enabled: boolean
}
