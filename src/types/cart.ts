export type CartItem = {
  id: string
  productId: string
  variantId: string
  quantity: number
}

export type CartState = {
  items: CartItem[]
}
