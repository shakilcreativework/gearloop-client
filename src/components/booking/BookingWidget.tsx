"use client";

import { useCallback, useEffect, useState } from "react";
import type { ListingDoc } from "@/types";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { usePaddle } from "@/components/booking/PaddleProvider";
import {
  createBooking,
  getListingAvailability,
} from "@/lib/api";

interface BookingWidgetProps {
  listing: ListingDoc;
}

type BookingPhase =
  | "idle"
  | "submitting"
  | "paying"
  | "success"
  | "conflict"
  | "error";

function datesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export default function BookingWidget({ listing }: BookingWidgetProps) {
  const { user } = useCurrentUser();
  const { paddle, ready: paddleReady } = usePaddle();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bookedRanges, setBookedRanges] = useState<
    { startDate: string; endDate: string }[]
  >([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [phase, setPhase] = useState<BookingPhase>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  // Fetch booked date ranges on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setAvailabilityLoading(true);
        const ranges = await getListingAvailability(listing._id);
        if (!cancelled) setBookedRanges(ranges);
      } catch {
        // Availability fetch failure is non-critical — server overlap check is authoritative
      } finally {
        if (!cancelled) setAvailabilityLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [listing._id]);

  const refreshAvailability = useCallback(async () => {
    try {
      const ranges = await getListingAvailability(listing._id);
      setBookedRanges(ranges);
    } catch {
      // Non-critical
    }
  }, [listing._id]);

  // Client-side overlap check (UX only — server is source of truth)
  const clientOverlapsBooked = useCallback((): boolean => {
    if (!startDate || !endDate) return false;
    return bookedRanges.some((r) =>
      datesOverlap(startDate, endDate, r.startDate, r.endDate),
    );
  }, [startDate, endDate, bookedRanges]);

  if (!listing.available) {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted">
          This gear is currently unavailable.
        </p>
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

  function validateDates(): string | null {
    if (!startDate || !endDate) return "Please select start and end dates.";
    if (new Date(endDate) <= new Date(startDate))
      return "End date must be after start date.";
    if (totalDays < 1) return "Booking must be at least 1 day.";
    if (clientOverlapsBooked())
      return "Selected dates overlap with an existing booking. Please choose different dates.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const validationError = validateDates();
    if (validationError) {
      setPhase("error");
      setErrorMessage(validationError);
      return;
    }

    setPhase("submitting");
    setErrorMessage(null);

    try {
      // Get the session token for auth
      const sessionRes = await fetch("/api/auth/get-session", {
        credentials: "include",
      });
      const sessionData = await sessionRes.json();
      const token = sessionData?.session?.token;

      if (!token) {
        throw new Error("No active session. Please log in again.");
      }

      // Create booking via Express (server recalculates totalDays/totalPrice + runs overlap check)
      const booking = await createBooking(
        {
          listingId: listing._id,
          renterId: user.id,
          startDate,
          endDate,
        },
        token,
      );

      setBookingId(booking._id);

      // Open Paddle checkout
      if (!paddle || !paddleReady) {
        // Paddle not available — booking was created, show success without payment
        setPhase("success");
        return;
      }

      const priceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;
      if (!priceId) {
        // No price ID configured — booking created, payment deferred
        setPhase("success");
        return;
      }

      setPhase("paying");

      paddle.Checkout.open({
        items: [
          {
            priceId,
            quantity: 1,
          },
        ],
        customData: {
          bookingId: booking._id,
          listingId: listing._id,
        },
      });

      // Paddle checkout is now open (inline or overlay).
      // The webhook (transaction.completed) handles payment confirmation server-side.
      // Show success to the user — the booking was already created with status "requested".
      setPhase("success");
      refreshAvailability();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";

      if (msg.includes("DATE_CONFLICT") || msg.includes("conflict")) {
        setPhase("conflict");
        setErrorMessage(
          "Those dates are no longer available. Another booking was just confirmed. Please select different dates.",
        );
        refreshAvailability();
      } else {
        setPhase("error");
        setErrorMessage(msg);
      }
    }
  }

  function handleDismiss() {
    setPhase("idle");
    setErrorMessage(null);
    setBookingId(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-card p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Request to Book
      </h3>

      {/* Booked dates info */}
      {!availabilityLoading && bookedRanges.length > 0 && (
        <div className="mb-4 rounded-lg bg-surface p-3">
          <p className="text-xs font-medium text-muted mb-1.5">
            Unavailable dates:
          </p>
          <div className="space-y-1">
            {bookedRanges.map((r, i) => (
              <p key={i} className="text-xs text-muted">
                {r.startDate} → {r.endDate}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label
            htmlFor="start-date"
            className="mb-1 block text-xs text-muted"
          >
            Start date
          </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (phase !== "idle") handleDismiss();
            }}
            disabled={phase === "submitting" || phase === "paying"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
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
            onChange={(e) => {
              setEndDate(e.target.value);
              if (phase !== "idle") handleDismiss();
            }}
            disabled={phase === "submitting" || phase === "paying"}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      {totalDays > 0 && (
        <div className="mt-4 space-y-1 border-t border-border pt-4">
          <div className="flex justify-between text-sm text-muted">
            <span>
              ${listing.pricePerDay} x {totalDays} day
              {totalDays !== 1 ? "s" : ""}
            </span>
            <span className="font-medium text-foreground">${totalPrice}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-foreground">
            <span>Total</span>
            <span className="text-primary">${totalPrice}</span>
          </div>
        </div>
      )}

      {/* Status messages */}
      {phase === "conflict" && errorMessage && (
        <div className="mt-3 rounded-lg border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start gap-2">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
            <p className="text-xs text-yellow-800 dark:text-yellow-300">
              {errorMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            className="mt-2 text-xs font-medium text-yellow-800 underline dark:text-yellow-300"
          >
            Dismiss
          </button>
        </div>
      )}

      {phase === "error" && errorMessage && (
        <div className="mt-3 rounded-lg border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-xs text-red-600 dark:text-red-400">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={handleDismiss}
            className="mt-2 text-xs font-medium text-red-600 underline dark:text-red-400"
          >
            Dismiss
          </button>
        </div>
      )}

      {phase === "success" && (
        <div className="mt-3 rounded-lg border border-green-300 bg-green-50 p-3 dark:border-green-800 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-300">
            {bookingId
              ? "Booking submitted! The owner will confirm your request shortly."
              : "Booking submitted!"}
          </p>
        </div>
      )}

      {phase === "paying" && (
        <div className="mt-3 flex items-center gap-2 text-xs text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Completing payment…
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={phase === "submitting" || phase === "paying"}
        className="mt-4 w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {!user
          ? "Log in to Book"
          : phase === "submitting"
            ? "Creating booking…"
            : phase === "paying"
              ? "Processing payment…"
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
