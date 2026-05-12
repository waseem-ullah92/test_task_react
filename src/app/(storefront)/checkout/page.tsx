'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartQuery } from '@/features/cart/hooks/useCartQuery'
import { useProducts } from '@/features/products/hooks/useProducts'
import { usePlaceOrder } from '@/features/checkout/hooks/usePlaceOrder'
import { calcSubtotal } from '@/features/cart/utils/cartCalculations'
import { effectivePrice } from '@/features/products/utils/permutations'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatters'
import { ROUTES } from '@/constants/routes'
import type { ShippingAddress } from '@/types/order'

const EMPTY_FORM: ShippingAddress = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: '',
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: cartItems = [], isLoading: cartLoading } = useCartQuery()
  const { data: products = [], isLoading: productsLoading } = useProducts()
  const placeOrder = usePlaceOrder()
  const [form, setForm] = useState<ShippingAddress>(EMPTY_FORM)

  useEffect(() => {
    if (!cartLoading && cartItems.length === 0 && !placeOrder.isPending && !placeOrder.isSuccess) {
      router.replace(ROUTES.home)
    }
  }, [cartItems, cartLoading, placeOrder.isPending, placeOrder.isSuccess, router])

  const subtotal = calcSubtotal(cartItems, products)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    placeOrder.mutate({ cartItems, products, shipping: form })
  }

  if (cartLoading || productsLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="size-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    )
  }

  if (cartItems.length === 0) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Link
          href={ROUTES.home}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to store
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px]">
        {/* Shipping form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-4">Contact</h2>
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Shipping address</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First name"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                autoComplete="given-name"
              />
              <Input
                label="Last name"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                autoComplete="family-name"
              />
            </div>
            <Input
              label="Address"
              name="street"
              value={form.street}
              onChange={handleChange}
              required
              autoComplete="street-address"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                autoComplete="address-level2"
              />
              <Input
                label="State / Province"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                autoComplete="address-level1"
              />
            </div>
            <Input
              label="ZIP / Postal code"
              name="zip"
              value={form.zip}
              onChange={handleChange}
              required
              autoComplete="postal-code"
            />
          </section>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={placeOrder.isPending}
            disabled={placeOrder.isPending}
          >
            Place Order · {formatCurrency(subtotal)}
          </Button>
        </form>

        {/* Order summary */}
        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
            {cartItems.map((item) => {
              const product = products.find((p) => p.id === item.productId)
              const variant = product?.variants.find((v) => v.id === item.variantId)
              if (!product || !variant) return null
              const unitPrice = effectivePrice(product.basePrice, variant.priceOverride)
              return (
                <div key={item.id} className="flex gap-3 p-4">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {Object.entries(variant.options)
                        .map(([k, v]) => `${k}: ${v}`)
                        .join(' · ')}
                    </p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    {formatCurrency(unitPrice * item.quantity)}
                  </p>
                </div>
              )
            })}

            <div className="p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
            </div>

            <div className="flex justify-between p-4">
              <span className="font-semibold">Total</span>
              <span className="text-base font-bold">{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
