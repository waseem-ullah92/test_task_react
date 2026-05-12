'use client'

import { useFieldArray } from 'react-hook-form'
import type { Control, UseFormGetValues, UseFormSetValue } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { reconcileVariants } from '@/features/products/utils/permutations'
import { titleToSlug } from '@/features/products/utils/sku'
import type { ProductFormValues } from '../schemas/productSchema'

type Props = {
  control: Control<ProductFormValues>
  getValues: UseFormGetValues<ProductFormValues>
  setValue: UseFormSetValue<ProductFormValues>
}

export function VariantTypeEditor({ control, getValues, setValue }: Props) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'variantTypes',
  })

  function reconcile() {
    const { variantTypes, variants, title } = getValues()
    const reconciled = reconcileVariants(variantTypes, variants, titleToSlug(title), nanoid)
    setValue('variants', reconciled, { shouldDirty: true })
  }

  function addVariantType() {
    append({ id: nanoid(), name: '', values: [] })
  }

  function removeVariantType(index: number) {
    remove(index)
    reconcile()
  }

  function handleNameChange(typeIndex: number, name: string) {
    const allTypes = getValues('variantTypes')
    const current = allTypes[typeIndex]
    if (!current) return
    update(typeIndex, { ...current, name })
  }

  function addValue(typeIndex: number, raw: string) {
    const value = raw.trim()
    if (!value) return
    const allTypes = getValues('variantTypes')
    const current = allTypes[typeIndex]
    if (!current || current.values.includes(value)) return
    update(typeIndex, { ...current, values: [...current.values, value] })
    reconcile()
  }

  function removeValue(typeIndex: number, valueIndex: number) {
    const allTypes = getValues('variantTypes')
    const current = allTypes[typeIndex]
    if (!current) return
    const newValues = current.values.filter((_, i) => i !== valueIndex)
    update(typeIndex, { ...current, values: newValues })
    reconcile()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Variant Types</p>
        <Button type="button" variant="secondary" size="sm" onClick={addVariantType}>
          + Add Type
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground py-2">
          No variant types — all customers receive the same product.
        </p>
      )}

      {fields.map((field, typeIndex) => (
        <div key={field.id} className="rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Input
                label="Type name"
                placeholder="e.g. Size, Color, Material"
                defaultValue={field.name}
                onChange={(e) => handleNameChange(typeIndex, e.target.value)}
              />
            </div>
            <button
              type="button"
              className="mt-7 rounded-lg p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              onClick={() => removeVariantType(typeIndex)}
              aria-label={`Remove ${field.name || 'variant type'}`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Values</p>
            <div className="flex flex-wrap gap-2">
              {field.values.map((val, valueIndex) => (
                <span
                  key={val}
                  className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium"
                >
                  {val}
                  <button
                    type="button"
                    className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => removeValue(typeIndex, valueIndex)}
                    aria-label={`Remove ${val}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <AddValueInput onAdd={(v) => addValue(typeIndex, v)} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function AddValueInput({ onAdd }: { onAdd: (value: string) => void }) {
  return (
    <input
      type="text"
      placeholder="Add value…"
      className="h-7 min-w-[7rem] max-w-[12rem] rounded-full border border-dashed border-border bg-transparent px-3 text-xs focus:outline-none focus:border-brand"
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          const el = e.currentTarget
          if (el.value.trim()) {
            onAdd(el.value)
            el.value = ''
          }
        }
      }}
      onBlur={(e) => {
        if (e.target.value.trim()) {
          onAdd(e.target.value)
          e.target.value = ''
        }
      }}
    />
  )
}
