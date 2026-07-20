import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <svg
        className="h-24 w-24 text-primary/30"
        fill="none"
        viewBox="0 0 96 96"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="max-w-md text-muted">
          The page you’re looking for doesn’t exist or has been moved. Try
          heading back to the homepage or browse our available gear.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Back to Home
        </Link>
        <Link
          href="/explore"
          className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary"
        >
          Explore Gear
        </Link>
      </div>
    </div>
  );
}
