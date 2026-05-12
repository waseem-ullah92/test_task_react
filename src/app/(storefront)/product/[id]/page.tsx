import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createServerQueryClient } from '@/lib/api/queryClient'
import { productsApi } from '@/features/products/api/productsApi'
import { queryKeys } from '@/lib/api/queryKeys'
import { ProductDetailView } from '@/features/storefront/components/ProductDetailView'
import type { Product } from '@/types/product'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await productsApi.getById(id)
    return {
      title: product.title,
      description: product.description.slice(0, 160),
      openGraph: {
        title: product.title,
        description: product.description.slice(0, 160),
        images: product.images[0] ? [{ url: product.images[0] }] : [],
      },
    }
  } catch {
    return { title: 'Product Not Found' }
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const queryClient = createServerQueryClient()

  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getById(id),
  })

  const product = queryClient.getQueryData<Product>(queryKeys.products.detail(id))

  if (!product || product.status !== 'active') notFound()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 py-8">
        <ProductDetailView product={product} />
      </div>
    </HydrationBoundary>
  )
}
