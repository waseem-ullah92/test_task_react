'use client'
// Requires client context: manages CartDrawer open state, CartTrigger

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ROUTES } from '@/constants/routes'
import { ThemeToggle } from './ThemeToggle'
import { CartTrigger } from '@/features/cart/components/CartTrigger'

// Code-split CartDrawer — heavy component only loaded when cart is opened
const CartDrawer = dynamic(
  () => import('@/features/cart/components/CartDrawer').then((m) => m.CartDrawer),
  { ssr: false }
)

export function Header() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            href={ROUTES.home}
            className="text-xl font-bold tracking-tight transition-colors hover:text-brand"
          >
            ACS Store
          </Link>

          <nav className="flex items-center gap-1" aria-label="Site navigation">
            <Link
              href={ROUTES.admin.root}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Admin
            </Link>
            <ThemeToggle />
            <CartTrigger onClick={() => setCartOpen(true)} />
          </nav>
        </div>
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
