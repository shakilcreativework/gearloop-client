"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ListingDoc } from "@/types";

const PLACEHOLDER = "/images/placeholder-gear.jpg";

const CATEGORY_LABELS: Record<string, string> = {
  camping: "Camping",
  "water-sports": "Water Sports",
  cycling: "Cycling",
  climbing: "Climbing",
  photography: "Photography",
  "winter-sports": "Winter Sports",
};

interface Recommendation {
  listing: ListingDoc;
  reason: string;
}

interface RecommendationPanelProps {
  title?: string;
  category?: string;
  listingId?: string;
  limit?: number;
}

export default function RecommendationPanel({
  title = "You might also need",
  category,
  listingId,
  limit = 4,
}: RecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | undefined>(category);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: filterCategory,
          listingId,
          limit,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to load recommendations");
      }

      setRecommendations(data.recommendations ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load recommendations",
      );
    } finally {
      setLoading(false);
    }
  }, [filterCategory, listingId, limit]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  if (loading) {
    return (
      <section>
        {title && (
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: limit }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-border bg-card p-4"
            >
              <div className="mb-3 aspect-4/3 w-full rounded-lg bg-surface" />
              <div className="mb-2 h-3 w-2/3 rounded bg-surface" />
              <div className="h-3 w-1/2 rounded bg-surface" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted">{error}</p>
      </section>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const allCategories = Array.from(
    new Set(recommendations.map((r) => r.listing.category)),
  );

  return (
    <section>
      {title && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {allCategories.length > 1 && !category && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setFilterCategory(undefined)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  !filterCategory
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-muted hover:border-primary/40"
                }`}
              >
                All
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    filterCategory === cat
                      ? "bg-primary text-white"
                      : "border border-border bg-card text-muted hover:border-primary/40"
                  }`}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((rec) => (
          <Link
            key={rec.listing._id}
            href={`/listings/${rec.listing._id}`}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden">
              <Image
                src={rec.listing.images?.[0] || PLACEHOLDER}
                alt={rec.listing.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-3">
              <h3 className="mb-1 text-sm font-semibold leading-snug text-foreground line-clamp-1">
                {rec.listing.title}
              </h3>
              <p className="mb-2 text-xs text-muted">
                ${rec.listing.pricePerDay}
                <span className="text-muted">/day</span>
              </p>
              {rec.reason && (
                <p className="mt-auto text-xs italic leading-relaxed text-muted line-clamp-2">
                  {rec.reason}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
