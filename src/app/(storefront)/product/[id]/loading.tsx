export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
        {/* Image gallery skeleton */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl bg-muted" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-lg bg-muted" />
            ))}
          </div>
        </div>
        {/* Product info skeleton */}
        <div className="space-y-6">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-3/4 rounded bg-muted" />
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
          <div className="h-12 w-full rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}
