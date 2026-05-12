'use client'
// Requires client context: interactive toggle with onChange handler

import { cn } from '@/lib/utils/cn'

type SwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export function Switch({ checked, onChange, label, disabled, id }: SwitchProps) {
  const switchId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
          'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2',
          'focus-visible:ring-brand disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-brand' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block size-5 rounded-full bg-white shadow',
            'transform transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
      {label && (
        <label htmlFor={switchId} className="text-sm font-medium cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  )
}
