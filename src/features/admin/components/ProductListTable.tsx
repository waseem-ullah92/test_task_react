'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useProducts } from '@/features/products/hooks/useProducts'
import { useDeleteProduct } from '@/features/products/hooks/useDeleteProduct'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatCurrency } from '@/lib/utils/formatters'
import type { Product } from '@/types/product'

export function ProductListTable() {
  const { data: products = [], isLoading } = useProducts()
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  if (isLoading) return null

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        description="Create your first product to get started selling."
        action={
          <Link href="/admin/products/new">
            <Button>Add Product</Button>
          </Link>
        }
      />
    )
  }

  function handleDelete(id: string) {
    if (confirmId === id) {
      deleteProduct(id)
      setConfirmId(null)
    } else {
      setConfirmId(id)
    }
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-muted-foreground">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Product</th>
            <th className="px-4 py-3 text-left font-medium">Category</th>
            <th className="px-4 py-3 text-left font-medium">Base Price</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Variants</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {(products as Product[]).map((product) => (
            <tr key={product.id} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                      className="rounded-lg object-cover shrink-0"
                    />
                  )}
                  <span className="font-medium">{product.title}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
              <td className="px-4 py-3">{formatCurrency(product.basePrice)}</td>
              <td className="px-4 py-3">
                <Badge variant={product.status === 'active' ? 'success' : 'default'}>
                  {product.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{product.variants.length}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                  {confirmId === product.id ? (
                    <>
                      <Button
                        variant="destructive"
                        size="sm"
                        isLoading={isDeleting}
                        onClick={() => handleDelete(product.id)}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmId(null)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
