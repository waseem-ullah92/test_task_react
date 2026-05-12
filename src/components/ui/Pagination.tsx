'use client'
// Requires client context: interactive page buttons with onClick

import { cn } from '@/lib/utils/cn'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = buildPageRange(currentPage, totalPages)

  return (
    <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ‹
      </PageButton>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-3 py-2 text-sm text-muted-foreground select-none">
            …
          </span>
        ) : (
          <PageButton
            key={page}
            onClick={() => onPageChange(page as number)}
            isActive={page === currentPage}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </PageButton>
        )
      )}

      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        ›
      </PageButton>
    </nav>
  )
}

type PageButtonProps = {
  children: React.ReactNode
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  'aria-label'?: string
  'aria-current'?: 'page' | undefined
}

function PageButton({ children, onClick, isActive, disabled, ...rest }: PageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-lg text-sm font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        'disabled:pointer-events-none disabled:opacity-40',
        isActive
          ? 'bg-brand text-brand-foreground'
          : 'hover:bg-muted text-foreground'
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

function buildPageRange(current: number, total: number): Array<number | '...'> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: Array<number | '...'> = [1]

  if (current > 3) pages.push('...')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('...')
  pages.push(total)

  return pages
}
