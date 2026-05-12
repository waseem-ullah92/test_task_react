import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="space-y-1">
        <p className="text-8xl font-black text-brand leading-none">404</p>
        <h1 className="text-3xl font-bold">Page not found</h1>
      </div>
      <p className="max-w-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href={ROUTES.home}
        className="inline-flex h-10 items-center justify-center rounded-lg bg-brand px-6 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        Back to store
      </Link>
    </main>
  )
}
