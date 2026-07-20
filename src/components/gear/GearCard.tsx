"use client";

import Link from "next/link";
import Image from "next/image";
import type { ListingDoc } from "@/types";

const PLACEHOLDER = "/images/placeholder-gear.jpg";

const CATEGORY_LABELS: Record<ListingDoc["category"], string> = {
  camping: "Camping",
  "water-sports": "Water Sports",
  cycling: "Cycling",
  climbing: "Climbing",
  photography: "Photography",
  "winter-sports": "Winter Sports",
};

const CONDITION_BADGE: Record<ListingDoc["condition"], string> = {
  new: "bg-success/15 text-success",
  excellent: "bg-primary/15 text-primary",
  good: "bg-secondary/15 text-secondary",
  fair: "bg-muted/15 text-muted",
};

function StarIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function GearCard({ listing }: { listing: ListingDoc }) {
  const imgSrc = listing.images?.[0] || PLACEHOLDER;

  return (
    <Link
      href={`/listings/${listing._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/30"
    >
      {/* Image */}
      <div className="relative aspect-4/3 w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={listing.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-medium ${CONDITION_BADGE[listing.condition]}`}
        >
          {listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-1 text-xs font-medium text-muted">
          {CATEGORY_LABELS[listing.category]}
        </span>
        <h3 className="mb-1 text-sm font-semibold leading-snug text-foreground line-clamp-1">
          {listing.title}
        </h3>
        <p className="mb-3 text-xs leading-relaxed text-muted line-clamp-2">
          {listing.shortDescription}
        </p>

        {/* Meta row */}
        <div className="mt-auto flex items-center justify-between text-xs">
          <span className="font-bold text-primary">
            ${listing.pricePerDay}
            <span className="font-normal text-muted">/day</span>
          </span>
          <div className="flex items-center gap-1 text-foreground">
            <StarIcon className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">{listing.rating > 0 ? listing.rating.toFixed(1) : "New"}</span>
            {listing.reviewCount > 0 && (
              <span className="text-muted">({listing.reviewCount})</span>
            )}
          </div>
        </div>

        <div className="mt-1 flex items-center gap-1 text-xs text-muted">
          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="truncate">{listing.location}</span>
        </div>
      </div>
    </Link>
  );
}
