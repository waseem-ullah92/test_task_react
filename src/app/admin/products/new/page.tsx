import type { Metadata } from 'next'
import { ProductForm } from '@/features/admin/components/ProductForm'

export const metadata: Metadata = {
  title: 'New Product',
  description: 'Add a new product to your catalog',
}

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">New Product</h1>
      <ProductForm mode="create" />
    </div>
  )
}
