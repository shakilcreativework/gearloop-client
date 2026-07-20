import { notFound } from "next/navigation";
import Link from "next/link";
import { getListingById } from "@/lib/api";
import GearGallery from "@/components/gear/GearGallery";
import SpecsList from "@/components/gear/SpecsList";
import ReviewList from "@/components/gear/ReviewList";
import RelatedGear from "@/components/gear/RelatedGear";
import BookingWidget from "@/components/booking/BookingWidget";

const CATEGORY_LABELS: Record<string, string> = {
  camping: "Camping",
  "water-sports": "Water Sports",
  cycling: "Cycling",
  climbing: "Climbing",
  photography: "Photography",
  "winter-sports": "Winter Sports",
};

function StarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailsPage({ params }: PageProps) {
  const { id } = await params;

  let data;
  try {
    data = await getListingById(id);
  } catch {
    notFound();
  }

  if (!data || !data.listing) {
    notFound();
  }

  const { listing, related } = data;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/explore" className="transition-colors hover:text-primary">
          Explore
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{listing.title}</span>
      </nav>

      {/* Main layout: gallery + info */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Gallery — 3 cols */}
        <div className="lg:col-span-3">
          <GearGallery images={listing.images} title={listing.title} />
        </div>

        {/* Info sidebar — 2 cols */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Title + Rating */}
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {CATEGORY_LABELS[listing.category] ?? listing.category}
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {listing.title}
            </h1>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-center gap-1">
                <StarIcon className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {listing.rating > 0 ? listing.rating.toFixed(1) : "New"}
                </span>
                {listing.reviewCount > 0 && (
                  <span className="text-sm text-muted">
                    ({listing.reviewCount} review{listing.reviewCount !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
              <span className="text-sm text-muted">|</span>
              <div className="flex items-center gap-1 text-sm text-muted">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {listing.location}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="text-3xl font-bold text-primary">
              ${listing.pricePerDay}
              <span className="text-base font-normal text-muted">/day</span>
            </div>
            <p className="mt-1 text-xs text-muted">
              {listing.available ? "Available now" : "Currently unavailable"}
            </p>
          </div>

          {/* Booking widget placeholder */}
          <BookingWidget listing={listing} />

          {/* Short description */}
          <p className="text-sm leading-relaxed text-muted">
            {listing.shortDescription}
          </p>

          {/* Specs */}
          <SpecsList listing={listing} />
        </div>
      </div>

      {/* Full description */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Description</h2>
        <div className="prose prose-sm max-w-none text-muted leading-relaxed">
          {listing.fullDescription.split("\n").map((paragraph, i) => (
            <p key={i} className="mb-3">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Reviews
          {listing.reviewCount > 0 && (
            <span className="ml-2 text-sm font-normal text-muted">
              ({listing.reviewCount})
            </span>
          )}
        </h2>
        <ReviewList listingId={listing._id} />
      </div>

      {/* AI Recommendation Engine placeholder */}
      <div className="mt-10 rounded-xl border border-dashed border-border bg-surface p-8 text-center">
        <svg
          className="mx-auto h-10 w-10 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
          />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-foreground">
          You might also need
        </h3>
        <p className="mt-1 text-xs text-muted">
          AI-powered recommendations coming soon — personalized gear suggestions
          based on your rental history.
        </p>
      </div>

      {/* Related gear */}
      {related.length > 0 && (
        <div className="mt-10">
          <RelatedGear listings={related} />
        </div>
      )}
    </div>
  );
}
