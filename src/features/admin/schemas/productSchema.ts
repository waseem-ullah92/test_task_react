import { z } from 'zod'
import { CATEGORIES } from '@/constants/categories'

const variantTypeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Variant type name is required'),
  values: z.array(z.string().min(1)).min(1, 'At least one value is required'),
})

const variantSchema = z.object({
  id: z.string(),
  sku: z.string().min(1, 'SKU is required'),
  // Zod v4: z.record requires both key type and value type
  options: z.record(z.string(), z.string()),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  priceOverride: z.number().positive().nullable(),
  enabled: z.boolean(),
})

export const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description is too long'),
  // Zod v4: error option replaces errorMap
  category: z.enum(CATEGORIES as unknown as [string, ...string[]], {
    error: 'Please select a category',
  }),
  basePrice: z.number().positive('Price must be a positive number'),
  images: z.array(z.string().url('Each image must be a valid URL')).min(1, 'Add at least one image'),
  status: z.enum(['active', 'inactive']),
  variantTypes: z.array(variantTypeSchema),
  variants: z.array(variantSchema),
})

export type ProductFormValues = z.infer<typeof productSchema>
