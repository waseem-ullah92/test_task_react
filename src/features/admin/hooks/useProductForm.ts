'use client'
// Requires client context: uses React Hook Form

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, type ProductFormValues } from '../schemas/productSchema'
import type { Product } from '@/types/product'

export function useProductForm(defaultValues?: Partial<ProductFormValues>) {
  return useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues ?? {
      title: '',
      description: '',
      category: 'Clothing',
      basePrice: 0,
      images: [],
      status: 'active',
      variantTypes: [],
      variants: [],
    },
  })
}

export function productToFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    description: product.description,
    category: product.category,
    basePrice: product.basePrice,
    images: product.images,
    status: product.status,
    variantTypes: product.variantTypes,
    variants: product.variants,
  }
}
