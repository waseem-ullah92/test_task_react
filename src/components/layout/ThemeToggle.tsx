'use client'
// Requires client context: reads/writes theme via next-themes

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { cn } from '@/lib/utils/cn'

// useSyncExternalStore is the React 19 recommended way to detect hydration
// without the useEffect/setState pattern. Server snapshot returns false so
// the component renders a placeholder until the client mounts.
function useIsHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const hydrated = useIsHydrated()

  if (!hydrated) return <div className={cn('size-9 rounded-lg', className)} aria-hidden="true" />

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-lg text-lg',
        'hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        className
      )}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
