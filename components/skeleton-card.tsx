export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card border border-border p-0 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="h-48 bg-secondary" />

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-5 bg-secondary rounded w-3/4" />
        <div className="h-4 bg-secondary rounded w-1/2" />
        <div className="h-4 bg-secondary rounded w-2/3" />
        <div className="mt-auto h-10 bg-secondary rounded" />
      </div>
    </div>
  )
}
