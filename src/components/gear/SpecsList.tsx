import type { ListingDoc } from "@/types";

const CATEGORY_LABELS: Record<ListingDoc["category"], string> = {
  camping: "Camping",
  "water-sports": "Water Sports",
  cycling: "Cycling",
  climbing: "Climbing",
  photography: "Photography",
  "winter-sports": "Winter Sports",
};

const CONDITION_LABELS: Record<ListingDoc["condition"], string> = {
  new: "Brand New",
  excellent: "Excellent",
  good: "Good",
  fair: "Well Used",
};

interface SpecsListProps {
  listing: ListingDoc;
}

export default function SpecsList({ listing }: SpecsListProps) {
  const specs = [
    { label: "Category", value: CATEGORY_LABELS[listing.category] },
    { label: "Condition", value: CONDITION_LABELS[listing.condition] },
    { label: "Price", value: `$${listing.pricePerDay}/day` },
    { label: "Location", value: listing.location },
    { label: "Available", value: listing.available ? "Yes" : "No" },
  ];

  if (listing.tags.length > 0) {
    specs.push({ label: "Tags", value: listing.tags.join(", ") });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Specifications</h2>
      <dl className="space-y-3">
        {specs.map((spec) => (
          <div key={spec.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-sm text-muted">{spec.label}</dt>
            <dd className="text-sm font-medium text-foreground">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
