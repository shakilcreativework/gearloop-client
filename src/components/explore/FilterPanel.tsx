"use client";

import type { ListingCategory } from "@/types";

const CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: "camping", label: "Camping" },
  { value: "water-sports", label: "Water Sports" },
  { value: "cycling", label: "Cycling" },
  { value: "climbing", label: "Climbing" },
  { value: "photography", label: "Photography" },
  { value: "winter-sports", label: "Winter Sports" },
];

const PRICE_RANGES: { label: string; min?: number; max?: number }[] = [
  { label: "Any Price" },
  { label: "Under $25/day", max: 25 },
  { label: "$25 – $50/day", min: 25, max: 50 },
  { label: "$50 – $75/day", min: 50, max: 75 },
  { label: "$75+/day", min: 75 },
];

const RATING_OPTIONS: { label: string; value?: number }[] = [
  { label: "Any Rating" },
  { label: "4.5+ Stars", value: 4.5 },
  { label: "4+ Stars", value: 4 },
  { label: "3+ Stars", value: 3 },
];

interface FilterPanelProps {
  category?: ListingCategory;
  maxPrice?: number;
  minRating?: number;
  onCategoryChange: (cat: ListingCategory | undefined) => void;
  onPriceChange: (max: number | undefined) => void;
  onRatingChange: (min: number | undefined) => void;
}

export default function FilterPanel({
  category,
  maxPrice,
  minRating,
  onCategoryChange,
  onPriceChange,
  onRatingChange,
}: FilterPanelProps) {
  const activeCount =
    (category ? 1 : 0) + (maxPrice !== undefined ? 1 : 0) + (minRating !== undefined ? 1 : 0);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {activeCount > 0 && (
        <span className="text-xs font-medium text-muted">
          {activeCount} filter{activeCount !== 1 ? "s" : ""} active
        </span>
      )}

      {/* Category */}
      <div className="relative">
        <select
          value={category ?? ""}
          onChange={(e) =>
            onCategoryChange(
              e.target.value ? (e.target.value as ListingCategory) : undefined,
            )
          }
          className="appearance-none rounded-lg border border-border bg-card px-3 py-2 pr-8 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>

      {/* Price range */}
      <div className="relative">
        <select
          value={maxPrice === undefined ? "" : String(maxPrice)}
          onChange={(e) => {
            const range = PRICE_RANGES.find(
              (r) =>
                (r.max === undefined ? "" : String(r.max)) === e.target.value,
            );
            onPriceChange(range?.max);
          }}
          className="appearance-none rounded-lg border border-border bg-card px-3 py-2 pr-8 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          {PRICE_RANGES.map((r) => (
            <option
              key={r.label}
              value={r.max === undefined ? "" : String(r.max)}
            >
              {r.label}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>

      {/* Rating */}
      <div className="relative">
        <select
          value={minRating === undefined ? "" : String(minRating)}
          onChange={(e) => {
            const opt = RATING_OPTIONS.find(
              (r) =>
                (r.value === undefined ? "" : String(r.value)) ===
                e.target.value,
            );
            onRatingChange(opt?.value);
          }}
          className="appearance-none rounded-lg border border-border bg-card px-3 py-2 pr-8 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          {RATING_OPTIONS.map((r) => (
            <option
              key={r.label}
              value={r.value === undefined ? "" : String(r.value)}
            >
              {r.label}
            </option>
          ))}
        </select>
        <ChevronDown />
      </div>

      {/* Clear all */}
      {activeCount > 0 && (
        <button
          type="button"
          onClick={() => {
            onCategoryChange(undefined);
            onPriceChange(undefined);
            onRatingChange(undefined);
          }}
          className="text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg
      className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}
