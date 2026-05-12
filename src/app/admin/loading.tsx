export default function AdminLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-10 w-36 rounded-lg bg-muted" />
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-5 gap-4 p-4 border-b border-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 rounded bg-muted" />
          ))}
        </div>
        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-0">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-4 rounded bg-muted" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
