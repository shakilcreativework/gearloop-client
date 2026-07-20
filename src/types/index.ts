/**
 * Client-side type mirrors. These mirror the server's interfaces so
 * the client can usefully type API responses without importing the
 * server's MongoDB-dependent types directly.
 */

export type ListingCategory =
  | "camping"
  | "water-sports"
  | "cycling"
  | "climbing"
  | "photography"
  | "winter-sports";

export type ListingCondition = "new" | "excellent" | "good" | "fair";

export type BookingPaymentStatus = "pending" | "paid" | "refunded";

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface ListingDoc {
  _id: string;
  ownerId: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: ListingCategory;
  pricePerDay: number;
  currency: string;
  location: string;
  images: string[];
  condition: ListingCondition;
  available: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface BookingDoc {
  _id: string;
  listingId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  paymentProvider: "paddle";
  paymentStatus: BookingPaymentStatus;
  status: BookingStatus;
  createdAt: string;
}

export interface ReviewDoc {
  _id: string;
  listingId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface UserDoc {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "renter" | "owner" | "admin";
  rentalHistory: string[];
  createdAt: string;
}
