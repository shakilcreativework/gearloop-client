export default function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Image placeholder */}
      <div className="aspect-4/3 w-full animate-pulse bg-border" />

      {/* Body placeholder */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 h-3 w-16 animate-pulse rounded bg-border" />
        <div className="mb-1 h-4 w-3/4 animate-pulse rounded bg-border" />
        <div className="mb-3 space-y-1.5">
          <div className="h-3 w-full animate-pulse rounded bg-border" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-border" />
        </div>
        <div className="mt-auto flex items-center justify-between">
          <div className="h-4 w-14 animate-pulse rounded bg-border" />
          <div className="h-4 w-12 animate-pulse rounded bg-border" />
        </div>
        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-border" />
      </div>
    </div>
  );
}
