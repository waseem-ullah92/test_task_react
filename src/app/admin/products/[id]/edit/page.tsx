import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createServerQueryClient } from '@/lib/api/queryClient'
import { productsApi } from '@/features/products/api/productsApi'
import { queryKeys } from '@/lib/api/queryKeys'
import { ProductForm } from '@/features/admin/components/ProductForm'
import type { Product } from '@/types/product'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const product = await productsApi.getById(id)
    return { title: `Edit – ${product.title}` }
  } catch {
    return { title: 'Edit Product' }
  }
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const queryClient = createServerQueryClient()

  await queryClient.prefetchQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.getById(id),
  })

  const product = queryClient.getQueryData<Product>(queryKeys.products.detail(id))
  if (!product) notFound()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <h1 className="text-2xl font-bold mb-8">Edit: {product.title}</h1>
        <ProductForm mode="edit" product={product} />
      </div>
    </HydrationBoundary>
  )
}
