'use client'
// Requires client context: uses browser matchMedia API

import { useSyncExternalStore } from 'react'

function subscribe(query: string) {
  return (callback: () => void) => {
    const mediaQuery = window.matchMedia(query)
    mediaQuery.addEventListener('change', callback)
    return () => mediaQuery.removeEventListener('change', callback)
  }
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false
  )
}
