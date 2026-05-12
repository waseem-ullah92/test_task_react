import { Skeleton } from '@/components/ui/Skeleton'

export default function NewProductLoading() {
  return (
    <div className="max-w-3xl space-y-8 animate-pulse">
      <Skeleton className="h-8 w-40" />
      <div className="rounded-xl border border-border p-6 space-y-5">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="rounded-xl border border-border p-6 space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  )
}
