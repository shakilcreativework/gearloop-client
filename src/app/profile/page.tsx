"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { authClient } from "@/lib/auth-client";
import { getOwnerListings, getRenterBookings } from "@/lib/api";

const ROLE_BADGE_CLASSES: Record<string, string> = {
  renter: "bg-primary/10 text-primary",
  owner: "bg-secondary/10 text-secondary",
  admin: "bg-success/10 text-success",
};

function ProfileContent() {
  const { user, isPending: userPending } = useCurrentUser();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [listingCount, setListingCount] = useState<number | null>(null);
  const [bookingCount, setBookingCount] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Populate form from session when user loads
  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setImage(user.image ?? "");
    }
  }, [user]);

  // Fetch listing + booking counts
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    (async () => {
      try {
        const [listings, bookings] = await Promise.all([
          getOwnerListings(user.id).catch(() => []),
          getRenterBookings(user.id, "").catch(() => []),
        ]);
        if (!cancelled) {
          setListingCount(listings.length);
          setBookingCount(bookings.length);
          setStatsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setStatsError("Unable to load stats.");
          setStatsLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveMsg(null);

    try {
      await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || undefined,
      });
      setSaveMsg({ type: "ok", text: "Profile updated." });
    } catch {
      setSaveMsg({ type: "err", text: "Failed to update profile." });
    } finally {
      setSaving(false);
    }
  }

  if (userPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-foreground">Your Profile</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Left column — avatar + stats */}
        <div className="flex flex-col items-center gap-4 md:w-1/3">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name ?? "Avatar"}
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-border"
            />
          ) : (
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary ring-2 ring-border">
              {user.name?.charAt(0).toUpperCase() ?? "U"}
            </span>
          )}

          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${ROLE_BADGE_CLASSES[user.role] ?? ROLE_BADGE_CLASSES.renter}`}>
            {user.role}
          </span>

          <div className="w-full rounded-xl border border-border bg-card p-4 text-center">
            {statsLoading ? (
              <div className="space-y-2">
                <div className="mx-auto h-4 w-16 animate-pulse rounded bg-border" />
                <div className="mx-auto h-4 w-16 animate-pulse rounded bg-border" />
              </div>
            ) : statsError ? (
              <p className="text-sm text-muted">{statsError}</p>
            ) : (
              <div className="flex justify-around">
                <div>
                  <p className="text-lg font-bold text-foreground">{listingCount ?? 0}</p>
                  <p className="text-xs text-muted">Listings</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{bookingCount ?? 0}</p>
                  <p className="text-xs text-muted">Bookings</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column — edit form */}
        <div className="flex-1">
          <form onSubmit={handleSave} className="space-y-5 rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">Account Details</h2>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-muted">Email</label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted"
              />
            </div>

            <div>
              <label htmlFor="profile-name" className="mb-1 block text-sm font-medium text-foreground/70">Name</label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="profile-image" className="mb-1 block text-sm font-medium text-foreground/70">Avatar URL</label>
              <input
                id="profile-image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted">Paste a direct link to an image file.</p>
            </div>

            {saveMsg && (
              <p className={`text-sm ${saveMsg.type === "ok" ? "text-success" : "text-red-500"}`}>
                {saveMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
