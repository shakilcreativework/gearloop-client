"use client";

import type { ListingsQuery } from "@/lib/api";

const SORT_OPTIONS: { value: ListingsQuery["sort"]; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

interface SortDropdownProps {
  value: ListingsQuery["sort"];
  onChange: (sort: ListingsQuery["sort"]) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="relative">
      <select
        value={value ?? "newest"}
        onChange={(e) => onChange(e.target.value as ListingsQuery["sort"])}
        className="appearance-none rounded-lg border border-border bg-card px-3 py-2 pr-8 text-sm text-foreground focus:border-primary focus:outline-none"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
}
