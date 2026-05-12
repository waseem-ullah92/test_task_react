import { Suspense } from 'react'
import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createServerQueryClient } from '@/lib/api/queryClient'
import { productsApi } from '@/features/products/api/productsApi'
import { queryKeys } from '@/lib/api/queryKeys'
import { StorefrontContent } from '@/features/storefront/components/StorefrontContent'
import { Skeleton } from '@/components/ui/Skeleton'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse our collection of products',
  openGraph: {
    title: 'ACS Store – Shop',
    description: 'Browse our collection of clothing, accessories, and footwear',
  },
}

export const revalidate = 60

export default async function StorefrontPage() {
  const queryClient = createServerQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: productsApi.getAll,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Shop</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<StorefrontSkeleton />}>
          <StorefrontContent />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}

function StorefrontSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="h-4 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
