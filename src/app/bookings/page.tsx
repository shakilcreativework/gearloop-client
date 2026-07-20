"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getRenterBookings, getListingById } from "@/lib/api";
import type { BookingDoc, ListingDoc } from "@/types";

const STATUS_STYLES: Record<string, string> = {
  requested:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  completed:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

interface BookingWithListing extends BookingDoc {
  _listing?: ListingDoc;
}

function BookingCard({ booking }: { booking: BookingWithListing }) {
  const listing = booking._listing;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Listing image */}
        {listing && listing.images[0] && (
          <Link
            href={`/listings/${listing._id}`}
            className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg"
          >
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          </Link>
        )}

        {/* Booking info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {listing ? (
                <Link
                  href={`/listings/${listing._id}`}
                  className="text-sm font-semibold text-foreground transition-colors hover:text-primary truncate block"
                >
                  {listing.title}
                </Link>
              ) : (
                <span className="text-sm font-semibold text-foreground">
                  Loading listing…
                </span>
              )}
              <p className="mt-0.5 text-xs text-muted">
                {booking.startDate} → {booking.endDate} ({booking.totalDays} day
                {booking.totalDays !== 1 ? "s" : ""})
              </p>
            </div>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[booking.status] ?? "bg-gray-100 text-gray-800"}`}
            >
              {booking.status}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
            <span>
              Total:{" "}
              <span className="font-medium text-foreground">
                ${booking.totalPrice}
              </span>
            </span>
            <span className="text-border">|</span>
            <span>
              Payment:{" "}
              <span className="font-medium capitalize text-foreground">
                {booking.paymentStatus}
              </span>
            </span>
            <span className="text-border">|</span>
            <span>
              Booked{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingsContent() {
  const { user, sessionToken } = useCurrentUser();
  const [bookings, setBookings] = useState<BookingWithListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (!sessionToken) {
          throw new Error("No active session. Please log in again.");
        }

        const data = await getRenterBookings(user!.id, sessionToken);

        if (cancelled) return;

        const withListings = await Promise.all(
          data.map(async (b) => {
            try {
              const res = await getListingById(b.listingId);
              return { ...b, _listing: res.listing } as BookingWithListing;
            } catch {
              return { ...b } as BookingWithListing;
            }
          }),
        );

        if (!cancelled) {
          setBookings(withListings);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load bookings",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user, sessionToken]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
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
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
          />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-foreground">
          No bookings yet
        </h3>
        <p className="mt-1 text-xs text-muted">
          When you book gear, your reservations will appear here.
        </p>
        <Link
          href="/explore"
          className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Explore Gear
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
          My Bookings
        </h1>
        <BookingsContent />
      </div>
    </ProtectedRoute>
  );
}
