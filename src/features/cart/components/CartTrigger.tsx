'use client'
// Requires client context: reads cart count from Zustand store

import { useCartQuery } from '../hooks/useCartQuery'
import { cn } from '@/lib/utils/cn'

type CartTriggerProps = {
  onClick: () => void
  className?: string
}

export function CartTrigger({ onClick, className }: CartTriggerProps) {
  const { data: cartItems = [] } = useCartQuery()
  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <button
      type="button"
      aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ''}`}
      onClick={onClick}
      className={cn(
        'relative inline-flex size-9 items-center justify-center rounded-lg',
        'hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        className
      )}
    >
      <span aria-hidden="true" className="text-lg">🛒</span>
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-brand text-brand-foreground text-xs font-bold"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
