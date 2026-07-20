export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 animate-pulse rounded-full bg-primary/40" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xl font-bold tracking-tight text-primary">
          GearLoop
        </span>
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  );
}
