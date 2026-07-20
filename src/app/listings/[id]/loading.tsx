export default function ListingDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-border" />
        <div className="h-4 w-2 animate-pulse rounded bg-border" />
        <div className="h-4 w-16 animate-pulse rounded bg-border" />
        <div className="h-4 w-2 animate-pulse rounded bg-border" />
        <div className="h-4 w-32 animate-pulse rounded bg-border" />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Gallery skeleton */}
        <div className="lg:col-span-3">
          <div className="aspect-video w-full animate-pulse rounded-xl bg-border" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-16 w-16 animate-pulse rounded-lg bg-border"
              />
            ))}
          </div>
        </div>

        {/* Info skeleton */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="h-6 w-24 animate-pulse rounded-full bg-border" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-border" />
          <div className="h-4 w-40 animate-pulse rounded bg-border" />
          <div className="h-24 w-full animate-pulse rounded-xl border border-border bg-card" />
          <div className="h-36 w-full animate-pulse rounded-xl border border-border bg-card" />
          <div className="h-20 w-full animate-pulse rounded border border-border bg-card" />
          <div className="h-32 w-full animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </div>

      {/* Description skeleton */}
      <div className="mt-10 space-y-3">
        <div className="h-6 w-32 animate-pulse rounded bg-border" />
        <div className="h-4 w-full animate-pulse rounded bg-border" />
        <div className="h-4 w-full animate-pulse rounded bg-border" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-border" />
      </div>

      {/* Reviews skeleton */}
      <div className="mt-10">
        <div className="h-6 w-24 animate-pulse rounded bg-border" />
        <div className="mt-4 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-28 w-full animate-pulse rounded-xl border border-border bg-card"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
