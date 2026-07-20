"use client";

import { useState } from "react";
import type { ListingDoc, ListingCategory, ListingCondition } from "@/types";

const CATEGORIES: { value: ListingCategory; label: string }[] = [
  { value: "camping", label: "Camping" },
  { value: "water-sports", label: "Water Sports" },
  { value: "cycling", label: "Cycling" },
  { value: "climbing", label: "Climbing" },
  { value: "photography", label: "Photography" },
  { value: "winter-sports", label: "Winter Sports" },
];

const CONDITIONS: { value: ListingCondition; label: string }[] = [
  { value: "new", label: "New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

interface EditListingModalProps {
  listing: ListingDoc;
  onSave: (updates: Partial<ListingDoc>) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

export default function EditListingModal({
  listing,
  onSave,
  onCancel,
  saving,
}: EditListingModalProps) {
  const [title, setTitle] = useState(listing.title);
  const [shortDescription, setShortDescription] = useState(
    listing.shortDescription,
  );
  const [category, setCategory] = useState<ListingCategory>(listing.category);
  const [pricePerDay, setPricePerDay] = useState(
    String(listing.pricePerDay),
  );
  const [location, setLocation] = useState(listing.location);
  const [condition, setCondition] = useState<ListingCondition>(
    listing.condition,
  );
  const [available, setAvailable] = useState(listing.available);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = parseFloat(pricePerDay);
    if (!title.trim() || !shortDescription.trim() || !location.trim() || isNaN(parsed) || parsed <= 0) {
      setError("Please fill in all required fields with valid values.");
      return;
    }

    try {
      await onSave({
        title: title.trim(),
        shortDescription: shortDescription.trim(),
        category,
        pricePerDay: parsed,
        location: location.trim(),
        condition,
        available,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update listing");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground">
          Edit Listing
        </h3>

        {error && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="edit-title" className="mb-1 block text-sm font-medium text-foreground">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="edit-short-desc" className="mb-1 block text-sm font-medium text-foreground">
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              id="edit-short-desc"
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-category" className="mb-1 block text-sm font-medium text-foreground">
                Category
              </label>
              <select
                id="edit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ListingCategory)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-condition" className="mb-1 block text-sm font-medium text-foreground">
                Condition
              </label>
              <select
                id="edit-condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value as ListingCondition)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-price" className="mb-1 block text-sm font-medium text-foreground">
                Price/Day (USD) <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-price"
                type="number"
                min="1"
                step="0.01"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="edit-location" className="mb-1 block text-sm font-medium text-foreground">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            Available for rent
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="rounded-lg border border-border bg-card px-5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
