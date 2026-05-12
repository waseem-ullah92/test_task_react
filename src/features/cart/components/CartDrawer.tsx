'use client'

import { Drawer } from '@/components/ui/Drawer'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { EmptyState } from '@/components/ui/EmptyState'
import { useCartQuery } from '../hooks/useCartQuery'
import { useProducts } from '@/features/products/hooks/useProducts'
import type { Product } from '@/types/product'

type CartDrawerProps = {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { data: items = [] } = useCartQuery()
  const { data: products = [] } = useProducts()

  const hasItems = items.length > 0

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Your Cart">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          {hasItems ? (
            items.map((item) => (
              <CartItem key={item.id} item={item} products={products as Product[]} />
            ))
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <EmptyState
                title="Your cart is empty"
                description="Browse the shop and add something you love."
              />
            </div>
          )}
        </div>
        {hasItems && <CartSummary products={products as Product[]} />}
      </div>
    </Drawer>
  )
}
