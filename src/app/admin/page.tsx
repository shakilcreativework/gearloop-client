"use client";

import { useEffect, useState, useCallback } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import AdminRoute from "@/components/auth/AdminRoute";
import {
  getAdminUsers,
  getAdminStats,
  getAdminListings,
  getAdminReviews,
  adminDeleteListing,
  adminDeleteReview,
  type AdminUserSummary,
  type AdminStats,
  type AdminReviewSummary,
} from "@/lib/api";
import type { ListingDoc } from "@/types";

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function SectionError({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
      {message}
    </div>
  );
}

function SectionEmpty({ message }: { message: string }) {
  return (
    <p className="py-8 text-center text-sm text-muted">{message}</p>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-primary" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

export default function AdminPage() {
  const { user, sessionToken } = useCurrentUser();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [usersError, setUsersError] = useState<string | null>(null);

  const [listings, setListings] = useState<ListingDoc[]>([]);
  const [listingsError, setListingsError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<AdminReviewSummary[]>([]);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [deletingListing, setDeletingListing] = useState<string | null>(null);
  const [deletingReview, setDeletingReview] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!sessionToken) return;
    setLoading(true);

    const [statsResult, usersResult, listingsResult, reviewsResult] =
      await Promise.allSettled([
        getAdminStats(sessionToken),
        getAdminUsers(sessionToken),
        getAdminListings(sessionToken),
        getAdminReviews(sessionToken),
      ]);

    if (statsResult.status === "fulfilled") setStats(statsResult.value);
    else setStatsError("Failed to load stats");

    if (usersResult.status === "fulfilled") setUsers(usersResult.value);
    else setUsersError("Failed to load users");

    if (listingsResult.status === "fulfilled") setListings(listingsResult.value);
    else setListingsError("Failed to load listings");

    if (reviewsResult.status === "fulfilled") setReviews(reviewsResult.value);
    else setReviewsError("Failed to load reviews");

    setLoading(false);
  }, [sessionToken]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteListing = async (id: string) => {
    if (!sessionToken) return;
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    setDeletingListing(id);
    try {
      await adminDeleteListing(id, sessionToken);
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch {
      alert("Failed to delete listing");
    } finally {
      setDeletingListing(null);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!sessionToken) return;
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setDeletingReview(id);
    try {
      await adminDeleteReview(id, sessionToken);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch {
      alert("Failed to delete review");
    } finally {
      setDeletingReview(null);
    }
  };

  return (
    <AdminRoute>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted">Platform administration</p>
        </div>

        {/* Stats */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Platform Stats
          </h2>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          ) : statsError ? (
            <SectionError message={statsError} />
          ) : stats ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard label="Total Users" value={stats.totalUsers} />
              <StatCard label="Total Listings" value={stats.totalListings} />
              <StatCard label="Total Bookings" value={stats.totalBookings} />
              <StatCard
                label="Total Revenue"
                value={`$${stats.totalRevenue.toFixed(2)}`}
              />
            </div>
          ) : null}
        </section>

        {/* Users */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Users</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-surface"
                />
              ))}
            </div>
          ) : usersError ? (
            <SectionError message={usersError} />
          ) : users.length === 0 ? (
            <SectionEmpty message="No users found" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted">Name</th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Email
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">Joined</th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Listings
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Bookings
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-surface/50">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-muted">{u.email}</td>
                      <td className="px-4 py-3 text-muted">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {u.listingCount}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {u.bookingCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Listings */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            All Listings
          </h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-surface"
                />
              ))}
            </div>
          ) : listingsError ? (
            <SectionError message={listingsError} />
          ) : listings.length === 0 ? (
            <SectionEmpty message="No listings found" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted">
                      Title
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Category
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Price/Day
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Rating
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Status
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {listings.map((l) => (
                    <tr key={l._id} className="hover:bg-surface/50">
                      <td className="max-w-[200px] truncate px-4 py-3 font-medium text-foreground">
                        {l.title}
                      </td>
                      <td className="px-4 py-3 text-muted capitalize">
                        {l.category.replace("-", " ")}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        ${l.pricePerDay}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {l.rating > 0 ? `${l.rating} ★` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            l.available
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {l.available ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteListing(l._id)}
                          disabled={deletingListing === l._id}
                          className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                        >
                          {deletingListing === l._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Reviews */}
        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            All Reviews
          </h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-lg bg-surface"
                />
              ))}
            </div>
          ) : reviewsError ? (
            <SectionError message={reviewsError} />
          ) : reviews.length === 0 ? (
            <SectionEmpty message="No reviews found" />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-surface">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted">
                      Reviewer
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Listing
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Rating
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Comment
                    </th>
                    <th className="px-4 py-3 font-medium text-muted">Date</th>
                    <th className="px-4 py-3 font-medium text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-surface/50">
                      <td className="px-4 py-3 text-muted">{r.reviewerId}</td>
                      <td className="max-w-[160px] truncate px-4 py-3 font-medium text-foreground">
                        {r.listingTitle}
                      </td>
                      <td className="px-4 py-3">
                        <Stars rating={r.rating} />
                      </td>
                      <td className="max-w-[250px] truncate px-4 py-3 text-muted">
                        {r.comment}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(r._id)}
                          disabled={deletingReview === r._id}
                          className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                        >
                          {deletingReview === r._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminRoute>
  );
}
