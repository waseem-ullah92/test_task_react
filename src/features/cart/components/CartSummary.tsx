'use client'

import { useRouter } from 'next/navigation'
import { useClearCart } from '../hooks/useClearCart'
import { useCartQuery } from '../hooks/useCartQuery'
import { calcSubtotal } from '../utils/cartCalculations'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils/formatters'
import { ROUTES } from '@/constants/routes'
import type { Product } from '@/types/product'

type Props = { products: Product[]; onClose?: () => void }

export function CartSummary({ products, onClose }: Props) {
  const router = useRouter()
  const { data: cartItems = [] } = useCartQuery()
  const clearCart = useClearCart()
  const subtotal = calcSubtotal(cartItems, products)

  function handleCheckout() {
    onClose?.()
    router.push(ROUTES.checkout)
  }

  return (
    <div className="border-t border-border p-4 space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-semibold text-base">{formatCurrency(subtotal)}</span>
      </div>
      <p className="text-xs text-muted-foreground">Free shipping on all orders.</p>
      <Button className="w-full" size="lg" onClick={handleCheckout}>
        Checkout
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        onClick={() => clearCart.mutate(cartItems)}
        disabled={clearCart.isPending}
      >
        Clear Cart
      </Button>
    </div>
  )
}
