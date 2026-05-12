import Link from 'next/link'
import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createServerQueryClient } from '@/lib/api/queryClient'
import { productsApi } from '@/features/products/api/productsApi'
import { queryKeys } from '@/lib/api/queryKeys'
import { ProductListTable } from '@/features/admin/components/ProductListTable'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Manage your product catalog',
}

export default async function AdminProductsPage() {
  const queryClient = createServerQueryClient()
  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.lists(),
    queryFn: productsApi.getAll,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Products</h1>
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
        </div>
        <ProductListTable />
      </div>
    </HydrationBoundary>
  )
}
