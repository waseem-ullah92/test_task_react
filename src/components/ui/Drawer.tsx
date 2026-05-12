'use client'
// Requires client context: animation state, keyboard handling

import { useEffect, type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type DrawerSide = 'left' | 'right'

type DrawerProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  side?: DrawerSide
  className?: string
}

const slideClasses: Record<DrawerSide, { open: string; closed: string }> = {
  right: {
    open: 'translate-x-0',
    closed: 'translate-x-full',
  },
  left: {
    open: 'translate-x-0',
    closed: '-translate-x-full',
  },
}

export function Drawer({ isOpen, onClose, title, children, side = 'right', className }: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      />
      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className={cn(
          'fixed top-0 bottom-0 z-50 flex w-full max-w-sm flex-col bg-card shadow-xl',
          'transform transition-transform duration-300 ease-in-out',
          side === 'right' ? 'right-0' : 'left-0',
          isOpen ? slideClasses[side].open : slideClasses[side].closed,
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 id="drawer-title" className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <span aria-hidden="true" className="text-xl leading-none">×</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </aside>
    </>
  )
}
