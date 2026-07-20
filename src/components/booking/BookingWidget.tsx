"use client";

import { useState } from "react";
import type { ListingDoc } from "@/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface BookingWidgetProps {
  listing: ListingDoc;
}

export default function BookingWidget({ listing }: BookingWidgetProps) {
  const { user } = useCurrentUser();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!listing.available) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted">This gear is currently unavailable.</p>
      </div>
    );
  }

  const totalDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  const totalPrice = totalDays * listing.pricePerDay;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    if (!startDate || !endDate || totalDays < 1) {
      setError("Please select valid start and end dates.");
      return;
    }
    setSubmitting(true);
    setError(null);

    // Placeholder — booking flow (prompt 2.7) will wire POST /api/bookings + Paddle
    setTimeout(() => {
      setSubmitting(false);
      setError("Booking flow coming soon — this is a placeholder.");
    }, 1000);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Request to Book
      </h3>

      <div className="space-y-3">
        <div>
          <label htmlFor="start-date" className="mb-1 block text-xs text-muted">
            Start date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="end-date" className="mb-1 block text-xs text-muted">
            End date
          </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {totalDays > 0 && (
        <div className="mt-4 space-y-1 border-t border-border pt-4">
          <div className="flex justify-between text-sm text-muted">
            <span>
              ${listing.pricePerDay} x {totalDays} day{totalDays !== 1 ? "s" : ""}
            </span>
            <span className="font-medium text-foreground">${totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-foreground">
            <span>Total</span>
            <span className="text-primary">${totalPrice}</span>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!user
          ? "Log in to Book"
          : submitting
            ? "Submitting..."
            : "Request to Book"}
      </button>

      {!user && (
        <p className="mt-2 text-center text-xs text-muted">
          You&apos;ll be redirected to log in first.
        </p>
      )}
    </form>
  );
}
