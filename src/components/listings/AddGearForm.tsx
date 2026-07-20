"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { createListing } from "@/lib/api";
import type { ListingCategory, ListingCondition } from "@/types";

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

interface FormErrors {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  category?: string;
  pricePerDay?: string;
  location?: string;
  images?: string;
}

export default function AddGearForm() {
  const { user } = useCurrentUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState<ListingCategory>("camping");
  const [pricePerDay, setPricePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState<ListingCondition>("good");
  const [imageUrls, setImageUrls] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  function validate(): FormErrors {
    const e: FormErrors = {};

    if (!title.trim()) e.title = "Title is required";
    else if (title.length > 100) e.title = "Title must be 100 characters or fewer";

    if (!shortDescription.trim()) e.shortDescription = "Short description is required";
    else if (shortDescription.length > 300) e.shortDescription = "Must be 300 characters or fewer";

    if (!fullDescription.trim()) e.fullDescription = "Full description is required";

    if (!category) e.category = "Category is required";

    const parsed = parseFloat(pricePerDay);
    if (!pricePerDay || isNaN(parsed) || parsed <= 0) e.pricePerDay = "Enter a valid price";

    if (!location.trim()) e.location = "Location is required";

    const urls = imageUrls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);
    if (urls.length === 0) e.images = "Add at least one image URL";
    else {
      for (const u of urls) {
        try {
          new URL(u);
        } catch {
          e.images = "One or more image URLs are invalid";
          break;
        }
      }
    }

    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!user) {
      setSubmitError("You must be logged in to create a listing.");
      return;
    }

    try {
      setSubmitting(true);

      const sessionRes = await fetch("/api/auth/get-session", {
        credentials: "include",
      });
      const sessionData = await sessionRes.json();
      const token = sessionData?.session?.token;
      if (!token) throw new Error("No session token found");

      const images = imageUrls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);

      await createListing(
        {
          ownerId: user.id,
          title: title.trim(),
          shortDescription: shortDescription.trim(),
          fullDescription: fullDescription.trim(),
          category,
          pricePerDay: parseFloat(pricePerDay),
          currency: "USD",
          location: location.trim(),
          images,
          condition,
          available: true,
          tags: [],
        },
        token,
      );

      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create listing",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitSuccess) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/10 p-8 text-center">
        <svg
          className="mx-auto h-12 w-12 text-success"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-3 text-lg font-semibold text-foreground">
          Listing created!
        </h3>
        <p className="mt-1 text-sm text-muted">
          Your gear is now available for others to rent.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setTitle("");
              setShortDescription("");
              setFullDescription("");
              setPricePerDay("");
              setLocation("");
              setImageUrls("");
              setSubmitSuccess(false);
              setErrors({});
            }}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
          >
            Add Another
          </button>
          <button
            type="button"
            onClick={() => router.push("/listings/manage")}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Manage Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {submitError}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. MSR Hubba Hubba 2-Person Tent"
          className={`w-full rounded-lg border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.title ? "border-red-500" : "border-border"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.title}
          </p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <label
          htmlFor="shortDescription"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Short Description <span className="text-red-500">*</span>
        </label>
        <input
          id="shortDescription"
          type="text"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Brief summary visible on the listing card"
          className={`w-full rounded-lg border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
            errors.shortDescription ? "border-red-500" : "border-border"
          }`}
        />
        <div className="mt-1 flex items-center justify-between">
          {errors.shortDescription ? (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.shortDescription}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted">
            {shortDescription.length}/300
          </span>
        </div>
      </div>

      {/* Full Description */}
      <div>
        <label
          htmlFor="fullDescription"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Full Description <span className="text-red-500">*</span>
        </label>
        {/* AI Content Generator will attach here */}
        <textarea
          id="fullDescription"
          value={fullDescription}
          onChange={(e) => setFullDescription(e.target.value)}
          rows={6}
          placeholder="Detailed description of your gear — condition, what's included, ideal use cases..."
          className={`w-full rounded-lg border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y ${
            errors.fullDescription ? "border-red-500" : "border-border"
          }`}
        />
        {errors.fullDescription && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.fullDescription}
          </p>
        )}
      </div>

      {/* Category + Condition row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ListingCategory)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="condition"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Condition <span className="text-red-500">*</span>
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value as ListingCondition)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {CONDITIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price + Location row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="pricePerDay"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Price per Day (USD) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
              $
            </span>
            <input
              id="pricePerDay"
              type="number"
              min="1"
              step="0.01"
              value={pricePerDay}
              onChange={(e) => setPricePerDay(e.target.value)}
              placeholder="0.00"
              className={`w-full rounded-lg border bg-card py-2.5 pl-7 pr-4 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.pricePerDay ? "border-red-500" : "border-border"
              }`}
            />
          </div>
          {errors.pricePerDay && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.pricePerDay}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Denver, CO"
            className={`w-full rounded-lg border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
              errors.location ? "border-red-500" : "border-border"
            }`}
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              {errors.location}
            </p>
          )}
        </div>
      </div>

      {/* Image URLs */}
      <div>
        <label
          htmlFor="images"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Image URLs <span className="text-red-500">*</span>
        </label>
        <textarea
          id="images"
          value={imageUrls}
          onChange={(e) => setImageUrls(e.target.value)}
          rows={3}
          placeholder={"One URL per line\ne.g. https://images.unsplash.com/photo-..."}
          className={`w-full rounded-lg border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-y ${
            errors.images ? "border-red-500" : "border-border"
          }`}
        />
        {errors.images && (
          <p className="mt-1 text-xs text-red-600 dark:text-red-400">
            {errors.images}
          </p>
        )}
        <p className="mt-1 text-xs text-muted">
          Paste direct image links, one per line. The first image will be the
          cover photo.
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create Listing"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
