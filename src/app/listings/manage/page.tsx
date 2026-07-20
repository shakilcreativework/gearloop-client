"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  getOwnerListings,
  updateListing,
  deleteListing,
} from "@/lib/api";
import DeleteConfirmModal from "@/components/listings/DeleteConfirmModal";
import EditListingModal from "@/components/listings/EditListingModal";
import type { ListingDoc } from "@/types";

function ManageListingsContent() {
  const { user, sessionToken } = useCurrentUser();
  const [listings, setListings] = useState<ListingDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<ListingDoc | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [editTarget, setEditTarget] = useState<ListingDoc | null>(null);
  const [saving, setSaving] = useState(false);

  const loadListings = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getOwnerListings(user.id);
      setListings(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load listings",
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  async function handleDelete() {
    if (!deleteTarget || !user) return;

    try {
      setDeleting(true);
      if (!sessionToken) throw new Error("No active session. Please log in again.");

      await deleteListing(deleteTarget._id, sessionToken);
      setListings((prev) =>
        prev.filter((l) => l._id !== deleteTarget._id),
      );
      setDeleteTarget(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete listing",
      );
    } finally {
      setDeleting(false);
    }
  }

  async function handleEditSave(updates: Partial<ListingDoc>) {
    if (!editTarget || !user) return;

    try {
      setSaving(true);
      if (!sessionToken) throw new Error("No active session. Please log in again.");

      const result = await updateListing(editTarget._id, updates, sessionToken);
      setListings((prev) =>
        prev.map((l) => (l._id === editTarget._id ? result : l)),
      );
      setEditTarget(null);
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-border bg-card"
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
          onClick={loadListings}
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (listings.length === 0) {
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-foreground">
          No listings yet
        </h3>
        <p className="mt-1 text-xs text-muted">
          Start earning by listing your gear for rent.
        </p>
        <Link
          href="/listings/add"
          className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          Add Gear
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th className="px-4 py-3 font-medium text-muted">Image</th>
              <th className="px-4 py-3 font-medium text-muted">Title</th>
              <th className="px-4 py-3 font-medium text-muted">Price/Day</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr
                key={listing._id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    <Image
                      src={listing.images[0] ?? "/placeholder.jpg"}
                      alt={listing.title}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground line-clamp-1">
                    {listing.title}
                  </span>
                  <span className="block text-xs text-muted line-clamp-1">
                    {listing.location}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  ${listing.pricePerDay}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      listing.available
                        ? "bg-success/15 text-success"
                        : "bg-muted/15 text-muted"
                    }`}
                  >
                    {listing.available ? "Available" : "Unavailable"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/listings/${listing._id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEditTarget(listing)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-secondary transition-colors hover:bg-secondary/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(listing)}
                      className="rounded-md px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {listings.map((listing) => (
          <div
            key={listing._id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={listing.images[0] ?? "/placeholder.jpg"}
                  alt={listing.title}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {listing.title}
                </h3>
                <p className="text-xs text-muted">{listing.location}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    ${listing.pricePerDay}/day
                  </span>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      listing.available
                        ? "bg-success/15 text-success"
                        : "bg-muted/15 text-muted"
                    }`}
                  >
                    {listing.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
              <Link
                href={`/listings/${listing._id}`}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              >
                View
              </Link>
              <button
                type="button"
                onClick={() => setEditTarget(listing)}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-secondary/10"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeleteTarget(listing)}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {deleteTarget && (
        <DeleteConfirmModal
          listingTitle={deleteTarget.title}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {editTarget && (
        <EditListingModal
          listing={editTarget}
          onSave={handleEditSave}
          onCancel={() => setEditTarget(null)}
          saving={saving}
        />
      )}
    </>
  );
}

export default function ManageListingsPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Manage Listings
            </h1>
            <p className="mt-1 text-sm text-muted">
              View, edit, or delete your gear listings.
            </p>
          </div>
          <Link
            href="/listings/add"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Add Gear
          </Link>
        </div>
        <ManageListingsContent />
      </div>
    </ProtectedRoute>
  );
}
