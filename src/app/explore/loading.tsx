import SkeletonCard from "@/components/gear/SkeletonCard";

export default function ExploreLoading() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-48 animate-pulse rounded bg-border" />
        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-border" />
      </div>

      {/* Search bar skeleton */}
      <div className="mb-6 h-12 w-full animate-pulse rounded-xl border border-border bg-card" />

      {/* Filter bar skeleton */}
      <div className="mb-6 flex gap-3">
        <div className="h-10 w-36 animate-pulse rounded-lg border border-border bg-card" />
        <div className="h-10 w-36 animate-pulse rounded-lg border border-border bg-card" />
        <div className="h-10 w-32 animate-pulse rounded-lg border border-border bg-card" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
