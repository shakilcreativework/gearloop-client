import type {
  ListingDoc,
  BookingDoc,
  ReviewDoc,
  UserDoc,
  ListingCategory,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

function getBaseUrl(): string {
  if (!API_BASE) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Add it to your .env file with the Express server URL (e.g. http://localhost:5000).",
    );
  }
  return API_BASE.replace(/\/+$/, "");
}

// ---------------------------------------------------------------------------
// Types for query / filter / sort params (mirrors Express query shape)
// ---------------------------------------------------------------------------

export interface ListingsQuery {
  search?: string;
  category?: ListingCategory;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: "price-asc" | "price-desc" | "rating" | "newest";
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  listings: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListingWithRelated {
  listing: ListingDoc;
  related: ListingDoc[];
}

export interface ApiResponseError {
  error: { message: string; code?: string };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json();

  if (!res.ok) {
    const msg =
      body && typeof body === "object" && "error" in body
        ? (body.error as { message?: string }).message ?? `Request failed (${res.status})`
        : `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return body as T;
}

// ---------------------------------------------------------------------------
// Listings
// ---------------------------------------------------------------------------

export async function getListings(
  query: ListingsQuery = {},
): Promise<PaginatedResponse<ListingDoc>> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
  if (query.minRating !== undefined) params.set("minRating", String(query.minRating));
  if (query.sort) params.set("sort", query.sort);
  if (query.page !== undefined) params.set("page", String(query.page));
  if (query.limit !== undefined) params.set("limit", String(query.limit));

  const qs = params.toString();
  const raw = await request<{ listings: ListingDoc[]; pagination: PaginatedResponse<ListingDoc>["pagination"] }>(
    `/api/listings${qs ? `?${qs}` : ""}`,
  );
  return {
    listings: raw.listings,
    pagination: raw.pagination,
  };
}

export async function getFeaturedListings(): Promise<ListingDoc[]> {
  return request<ListingDoc[]>("/api/listings/featured");
}

export async function getListingById(id: string): Promise<ListingWithRelated> {
  return request<ListingWithRelated>(`/api/listings/${encodeURIComponent(id)}`);
}

export async function getOwnerListings(ownerId: string): Promise<ListingDoc[]> {
  return request<ListingDoc[]>(`/api/owner/listings/${encodeURIComponent(ownerId)}`);
}

export async function createListing(
  data: Omit<ListingDoc, "_id" | "createdAt" | "updatedAt" | "rating" | "reviewCount">,
  token: string,
): Promise<ListingDoc> {
  return request<ListingDoc>("/api/listings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function updateListing(
  id: string,
  data: Partial<Omit<ListingDoc, "_id" | "createdAt">>,
  token: string,
): Promise<ListingDoc> {
  return request<ListingDoc>(`/api/listings/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function deleteListing(id: string, token: string): Promise<void> {
  await request(`/api/listings/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export async function createBooking(
  data: {
    listingId: string;
    renterId: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    totalPrice: number;
  },
  token: string,
): Promise<BookingDoc> {
  return request<BookingDoc>("/api/bookings", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

export async function getRenterBookings(
  renterId: string,
  token: string,
): Promise<BookingDoc[]> {
  return request<BookingDoc[]>(
    `/api/bookings/${encodeURIComponent(renterId)}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
}

export async function getListingAvailability(
  listingId: string,
): Promise<{ startDate: string; endDate: string }[]> {
  return request<{ startDate: string; endDate: string }[]>(
    `/api/listings/${encodeURIComponent(listingId)}/availability`,
  );
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function getListingReviews(listingId: string): Promise<ReviewDoc[]> {
  return request<ReviewDoc[]>(
    `/api/reviews/${encodeURIComponent(listingId)}`,
  );
}

export async function createReview(
  data: {
    listingId: string;
    reviewerId: string;
    rating: number;
    comment: string;
  },
  token: string,
): Promise<ReviewDoc> {
  return request<ReviewDoc>("/api/reviews", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export async function getUsers(): Promise<UserDoc[]> {
  return request<UserDoc[]>("/api/users");
}
