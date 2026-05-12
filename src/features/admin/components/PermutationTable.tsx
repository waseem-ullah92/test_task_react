'use client'

import { useFieldArray } from 'react-hook-form'
import type { Control, UseFormRegister, UseFormGetValues, FieldErrors } from 'react-hook-form'
import { Switch } from '@/components/ui/Switch'
import type { ProductFormValues } from '../schemas/productSchema'

type Props = {
  control: Control<ProductFormValues>
  register: UseFormRegister<ProductFormValues>
  getValues: UseFormGetValues<ProductFormValues>
  errors: FieldErrors<ProductFormValues>
}

export function PermutationTable({ control, register, getValues, errors }: Props) {
  const { fields, update } = useFieldArray({ control, name: 'variants' })

  if (fields.length === 0) return null

  function toggleEnabled(index: number, checked: boolean) {
    const allVariants = getValues('variants')
    const current = allVariants[index]
    if (!current) return
    update(index, { ...current, enabled: checked })
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">
        Variants <span className="text-muted-foreground font-normal">({fields.length})</span>
      </p>
      <div className="rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-3 py-2.5 text-left font-medium">Options</th>
              <th className="px-3 py-2.5 text-left font-medium">SKU</th>
              <th className="px-3 py-2.5 text-left font-medium w-24">Stock</th>
              <th className="px-3 py-2.5 text-left font-medium w-32">Price Override</th>
              <th className="px-3 py-2.5 text-center font-medium w-20">Enabled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {fields.map((field, index) => {
              const variantErrors = errors.variants?.[index]
              return (
                <tr key={field.id}>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(field.options).map(([k, v]) => (
                        <span
                          key={k}
                          className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {k}:{' '}
                          <span className="font-medium text-foreground">{v}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      {...register(`variants.${index}.sku`)}
                      className="h-8 w-full min-w-[7rem] rounded-lg border border-border bg-card px-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                    {variantErrors?.sku && (
                      <p className="mt-0.5 text-xs text-red-500">{variantErrors.sku.message}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      {...register(`variants.${index}.stock`, { valueAsNumber: true })}
                      className="h-8 w-20 rounded-lg border border-border bg-card px-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="—"
                      {...register(`variants.${index}.priceOverride`, {
                        setValueAs: (v) =>
                          v === '' || v === null || v === undefined ? null : Number(v),
                      })}
                      className="h-8 w-28 rounded-lg border border-border bg-card px-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
                    />
                  </td>
                  <td className="px-3 py-2 flex justify-center">
                    <Switch
                      checked={field.enabled}
                      onChange={(checked) => toggleEnabled(index, checked)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
