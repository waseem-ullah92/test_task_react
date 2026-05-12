'use client'
// Requires client context: usePathname for active link highlighting

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils/cn'

type NavItem = {
  label: string
  href: string
  exact?: boolean
}

const navItems: NavItem[] = [
  { label: 'Products', href: ROUTES.admin.root, exact: true },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link
          href={ROUTES.home}
          className="text-lg font-bold transition-colors hover:text-brand"
          aria-label="Go to storefront"
        >
          ACS Store
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive(item)
                ? 'bg-brand text-brand-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
            aria-current={isActive(item) ? 'page' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border p-4">
        <Link
          href={ROUTES.home}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to store
        </Link>
        <ThemeToggle />
      </div>
    </aside>
  )
}
