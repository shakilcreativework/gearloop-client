import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getListings } from "@/lib/api";
import type { ListingCategory } from "@/types";

export const metadata: Metadata = {
  title: "Categories — GearLoop",
  description:
    "Browse all gear categories on GearLoop. Find tents, kayaks, bikes, climbing gear, cameras, skis, and more.",
};

const CATEGORIES: {
  key: ListingCategory;
  label: string;
  description: string;
  image: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "camping",
    label: "Camping",
    description:
      "Tents, sleeping bags, stoves & camp kitchen gear. Everything you need for nights under the stars.",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
  {
    key: "water-sports",
    label: "Water Sports",
    description:
      "Kayaks, paddleboards, wetsuits & water gear. Ride the waves with confidence.",
    image:
      "https://images.unsplash.com/photo-1472745942893-4b9f730c7668?w=800&q=80",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
    ),
  },
  {
    key: "cycling",
    label: "Cycling",
    description:
      "Mountain bikes, road bikes, helmets & accessories. Hit the trails or the open road.",
    image:
      "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&q=80",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-1.5M21 14.25v5.25a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 19.5v-5.25m18-2.25h-3.375"
        />
      </svg>
    ),
  },
  {
    key: "climbing",
    label: "Climbing",
    description:
      "Harnesses, ropes, shoes & bouldering pads. Scale new heights with the right gear.",
    image:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
        />
      </svg>
    ),
  },
  {
    key: "photography",
    label: "Photography",
    description:
      "Cameras, lenses, tripods & drone gear. Capture every moment of your adventure.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
        />
      </svg>
    ),
  },
  {
    key: "winter-sports",
    label: "Winter Sports",
    description:
      "Skis, snowboards, boots & winter layers. Carve through fresh powder this season.",
    image:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
        />
      </svg>
    ),
  },
];

async function getCategoryCounts(): Promise<Record<ListingCategory, number>> {
  const counts: Record<string, number> = {};

  await Promise.all(
    CATEGORIES.map(async (cat) => {
      try {
        const res = await getListings({ category: cat.key, limit: 1 });
        counts[cat.key] = res.pagination.total;
      } catch {
        counts[cat.key] = 0;
      }
    }),
  );

  return counts as Record<ListingCategory, number>;
}

export default async function CategoriesPage() {
  const counts = await getCategoryCounts();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          All Categories
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Gear for every adventure
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          From alpine climbing to coastal kayaking, explore all gear categories
          and find exactly what your next adventure demands.
        </p>
      </div>

      {/* Category cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.key}
            href={`/explore?category=${cat.key}`}
            className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
          >
            {/* Hero image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
                    {cat.icon}
                  </div>
                  <h2 className="text-lg font-bold text-white">{cat.label}</h2>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {counts[cat.key]} listing{counts[cat.key] !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="p-5">
              <p className="text-sm text-muted">{cat.description}</p>
              <p className="mt-3 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                Browse {cat.label.toLowerCase()} gear &rarr;
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
