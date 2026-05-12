'use client'
// Requires client context: QueryClient, ThemeProvider, Sonner Toaster,
// and Zustand rehydration all need browser APIs or React context.

import { useState, useEffect, type ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { useCartStore } from '@/features/cart/store/cartStore'

/**
 * Triggers Zustand cart rehydration from localStorage after mount.
 * The cart store uses skipHydration: true to prevent SSR mismatch,
 * so this component is the single explicit rehydration trigger.
 */
function CartHydrator() {
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])
  return null
}

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })
}

// Singleton for client — avoids recreating on every re-render while
// still being safe for concurrent-mode React (created once in useState).
let browserQueryClient: QueryClient | undefined

function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new client (never share between requests)
    return makeQueryClient()
  }
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

type ProvidersProps = { children: ReactNode }

export function Providers({ children }: ProvidersProps) {
  // useState ensures we don't recreate the client on every render,
  // but also avoids the module-level singleton on the server.
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <CartHydrator />
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{ duration: 4000 }}
          closeButton
        />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
