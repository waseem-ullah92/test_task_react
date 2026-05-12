'use client'

import { useClearCart } from '../hooks/useClearCart'
import { useCartQuery } from '../hooks/useCartQuery'
import { calcSubtotal } from '../utils/cartCalculations'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatters'
import type { Product } from '@/types/product'

export function CartSummary({ products }: { products: Product[] }) {
  const { data: cartItems = [] } = useCartQuery()
  const clearCart = useClearCart()
  const subtotal = calcSubtotal(cartItems, products)

  return (
    <div className="border-t border-border p-4 space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-semibold text-base">{formatCurrency(subtotal)}</span>
      </div>
      <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
      <Button className="w-full" size="lg">
        Checkout
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => clearCart.mutate()}
        disabled={clearCart.isPending}
      >
        Clear Cart
      </Button>
    </div>
  )
}
