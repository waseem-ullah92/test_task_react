import type { Metadata } from 'next'
import Link from 'next/link'
import { ROUTES } from '@/constants/routes'

export const metadata: Metadata = { title: 'Order Confirmed' }

type Props = { searchParams: Promise<{ orderId?: string }> }

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center text-center max-w-md">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-10 text-green-600 dark:text-green-400"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="text-2xl font-bold mb-2">Order Confirmed!</h1>
      <p className="text-muted-foreground mb-2">
        Thank you for your purchase. Your order is being processed.
      </p>

      {orderId && (
        <p className="text-sm text-muted-foreground mb-8">
          Order ID:{' '}
          <span className="font-mono font-medium text-foreground">{orderId}</span>
        </p>
      )}

      <Link
        href={ROUTES.home}
        className="inline-flex items-center justify-center gap-2 font-medium transition-all focus-visible:outline-none h-12 px-6 text-base rounded-xl bg-brand text-brand-foreground hover:opacity-90 focus-visible:ring-2 focus-visible:ring-brand"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
