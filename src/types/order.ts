export type OrderItem = {
  productId: string
  variantId: string
  quantity: number
  title: string
  variantLabel: string
  unitPrice: number
}

export type ShippingAddress = {
  firstName: string
  lastName: string
  email: string
  street: string
  city: string
  state: string
  zip: string
}

export type Order = {
  id: string
  items: OrderItem[]
  shipping: ShippingAddress
  subtotal: number
  status: 'confirmed'
  createdAt: string
}
