'use client'

import { useRouter } from 'next/navigation'
import { useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { VariantTypeEditor } from './VariantTypeEditor'
import { PermutationTable } from './PermutationTable'
import { useProductForm, productToFormValues } from '../hooks/useProductForm'
import { useCreateProduct } from '@/features/products/hooks/useCreateProduct'
import { useUpdateProduct } from '@/features/products/hooks/useUpdateProduct'
import { CATEGORIES } from '@/constants/categories'
import type { Product } from '@/types/product'
import type { ProductFormValues } from '../schemas/productSchema'

type Props = { mode: 'create' } | { mode: 'edit'; product: Product }

export function ProductForm(props: Props) {
  const router = useRouter()

  const defaultValues =
    props.mode === 'edit' ? productToFormValues(props.product) : undefined

  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useProductForm(defaultValues)

  const images = useWatch({ control, name: 'images' }) ?? []

  const { mutateAsync: createProduct } = useCreateProduct()
  const { mutateAsync: updateProduct } = useUpdateProduct()

  async function onSubmit(values: ProductFormValues) {
    try {
      if (props.mode === 'create') {
        await createProduct(values)
      } else {
        await updateProduct({ id: props.product.id, data: values })
      }
      router.push('/admin/products')
    } catch {
      // toast already shown by mutation's onError
    }
  }

  function addImage() {
    setValue('images', [...images, ''], { shouldDirty: true })
  }

  function removeImage(index: number) {
    setValue(
      'images',
      images.filter((_, i) => i !== index),
      { shouldDirty: true }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* ── Basic Info ─────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border p-6 space-y-5">
        <h2 className="font-semibold">Basic Information</h2>

        <Input
          label="Title"
          required
          placeholder="e.g. Classic Tee"
          error={errors.title?.message}
          {...register('title')}
        />

        <Textarea
          label="Description"
          required
          placeholder="Describe the product…"
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Category"
            required
            options={CATEGORIES.map((c) => ({ label: c, value: c }))}
            error={errors.category?.message}
            {...register('category')}
          />

          <Input
            label="Base Price"
            type="number"
            min={0}
            step={0.01}
            required
            placeholder="0.00"
            error={errors.basePrice?.message}
            {...register('basePrice', { valueAsNumber: true })}
          />
        </div>

        <Select
          label="Status"
          options={[
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
          ]}
          error={errors.status?.message}
          {...register('status')}
        />
      </section>

      {/* ── Images ─────────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Images</h2>
          <Button type="button" variant="secondary" size="sm" onClick={addImage}>
            + Add Image URL
          </Button>
        </div>

        {errors.images && !Array.isArray(errors.images) && (
          <p className="text-xs text-red-500" role="alert">
            {errors.images.message}
          </p>
        )}

        {images.length === 0 ? (
          <p className="text-sm text-muted-foreground">No images added yet.</p>
        ) : (
          <div className="space-y-2">
            {images.map((_, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="https://example.com/image.jpg"
                    error={errors.images?.[index]?.message}
                    {...register(`images.${index}`)}
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 rounded-lg p-2 text-muted-foreground hover:text-red-500 transition-colors"
                  onClick={() => removeImage(index)}
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Variants ───────────────────────────────────────────────────── */}
      <section className="rounded-xl border border-border p-6 space-y-6">
        <h2 className="font-semibold">Variants</h2>

        <VariantTypeEditor
          control={control}
          getValues={getValues}
          setValue={setValue}
        />

        <PermutationTable
          control={control}
          register={register}
          getValues={getValues}
          errors={errors}
        />
      </section>

      {/* ── Actions ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pb-8">
        <Button type="submit" isLoading={isSubmitting}>
          {props.mode === 'create' ? 'Create Product' : 'Save Changes'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/products')}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
