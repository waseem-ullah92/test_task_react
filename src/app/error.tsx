'use client'
// Requires client context: error boundaries must be client components in Next.js

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

type ErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // In production, send to error monitoring (e.g. Sentry)
    if (process.env.NODE_ENV === 'development') console.error(error)
  }, [error])

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
        <span className="text-3xl">⚠️</span>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="max-w-md text-muted-foreground">
          {process.env.NODE_ENV === 'development'
            ? error.message
            : 'An unexpected error occurred. Please try again.'}
        </p>
        {error.digest && (
          <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
        )}
      </div>
      <Button onClick={reset} variant="primary">
        Try again
      </Button>
    </main>
  )
}
