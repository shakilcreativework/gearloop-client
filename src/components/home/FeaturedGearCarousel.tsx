"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import GearCard from "@/components/gear/GearCard";
import type { ListingDoc } from "@/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FEATURED_GEAR: ListingDoc[] = [
  {
    _id: "f1",
    ownerId: "owner1",
    title: "REI Half Dome 2 Plus Tent",
    shortDescription: "Spacious 2-person backpacking tent with full rainfly. Freestanding design, easy setup.",
    fullDescription: "",
    category: "camping",
    pricePerDay: 35,
    currency: "USD",
    location: "Boulder, CO",
    images: ["https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&h=450&fit=crop"],
    condition: "excellent",
    available: true,
    rating: 4.8,
    reviewCount: 12,
    tags: ["tent", "backpacking", "camping"],
    createdAt: "2026-06-15T00:00:00Z",
  },
  {
    _id: "f2",
    ownerId: "owner2",
    title: "Pelican Sentinel 100X Sit-On Kayak",
    shortDescription: "Stable and durable sit-on-top kayak, perfect for lakes and calm rivers.",
    fullDescription: "",
    category: "water-sports",
    pricePerDay: 45,
    currency: "USD",
    location: "Portland, OR",
    images: ["https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=600&h=450&fit=crop"],
    condition: "good",
    available: true,
    rating: 4.5,
    reviewCount: 8,
    tags: ["kayak", "water-sports", "lake"],
    createdAt: "2026-06-10T00:00:00Z",
  },
  {
    _id: "f3",
    ownerId: "owner3",
    title: "Trek Marlin 7 Mountain Bike",
    shortDescription: "Lightweight aluminum frame, 29-inch wheels. Perfect for trail riding and commuting.",
    fullDescription: "",
    category: "cycling",
    pricePerDay: 55,
    currency: "USD",
    location: "Asheville, NC",
    images: ["https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=600&h=450&fit=crop"],
    condition: "excellent",
    available: true,
    rating: 4.9,
    reviewCount: 15,
    tags: ["mountain-bike", "cycling", "trail"],
    createdAt: "2026-06-20T00:00:00Z",
  },
  {
    _id: "f4",
    ownerId: "owner4",
    title: "Black Diamond Momentum Climbing Harness",
    shortDescription: "Comfortable all-around harness for gym and crag climbing. Size M.",
    fullDescription: "",
    category: "climbing",
    pricePerDay: 18,
    currency: "USD",
    location: "Salt Lake City, UT",
    images: ["https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&h=450&fit=crop"],
    condition: "new",
    available: true,
    rating: 4.7,
    reviewCount: 6,
    tags: ["harness", "climbing", "bouldering"],
    createdAt: "2026-07-01T00:00:00Z",
  },
  {
    _id: "f5",
    ownerId: "owner5",
    title: "Sony A7III Mirrorless Camera + 24-70mm f/2.8",
    shortDescription: "Full-frame mirrorless camera with versatile zoom lens. Includes extra battery.",
    fullDescription: "",
    category: "photography",
    pricePerDay: 75,
    currency: "USD",
    location: "Seattle, WA",
    images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=450&fit=crop"],
    condition: "excellent",
    available: true,
    rating: 5.0,
    reviewCount: 9,
    tags: ["camera", "mirrorless", "photography"],
    createdAt: "2026-06-28T00:00:00Z",
  },
  {
    _id: "f6",
    ownerId: "owner6",
    title: "Burton Custom Camber Snowboard",
    shortDescription: "All-mountain snowboard, 158cm. Responsive and versatile for intermediate riders.",
    fullDescription: "",
    category: "winter-sports",
    pricePerDay: 50,
    currency: "USD",
    location: "Park City, UT",
    images: ["https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=450&fit=crop"],
    condition: "good",
    available: true,
    rating: 4.6,
    reviewCount: 7,
    tags: ["snowboard", "winter", "all-mountain"],
    createdAt: "2026-07-05T00:00:00Z",
  },
];

export default function FeaturedGearCarousel() {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Featured Gear
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Top-rated gear available near you
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Hand-picked selections from our most trusted gear owners. Quality
            equipment, ready for your next adventure.
          </p>
        </div>

        <div className="mt-12">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-14"
          >
            {FEATURED_GEAR.map((listing) => (
              <SwiperSlide key={listing._id}>
                <GearCard listing={listing} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
