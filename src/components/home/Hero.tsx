"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

const CATEGORY_QUICK_PICKS = [
  { label: "Camping", value: "camping", icon: "⛺" },
  { label: "Kayaks", value: "water-sports", icon: "🛶" },
  { label: "Bikes", value: "cycling", icon: "🚴" },
  { label: "Climbing", value: "climbing", icon: "🧗" },
  { label: "Cameras", value: "photography", icon: "📷" },
  { label: "Ski Gear", value: "winter-sports", icon: "🎿" },
] as const;

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    router.push(`/explore?${params.toString()}`);
  }

  function handleCategoryClick(category: string) {
    router.push(`/explore?category=${category}`);
  }

  return (
    <section className="relative flex min-h-[65vh] items-center overflow-hidden bg-surface">
      {/* Background linear overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Rent &amp; lend outdoor gear
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Find the gear you need.{" "}
            <span className="text-primary">Share the gear you own.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
            className="mx-auto mt-5 max-w-xl text-base text-muted sm:text-lg"
          >
            GearLoop connects outdoor enthusiasts who have gear with adventurers
            who need it. Save money, reduce waste, explore more.
          </motion.p>

          {/* Search bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-sm"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for tents, kayaks, cameras..."
              className="flex-1 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              Find Gear Near You
            </button>
          </motion.form>

          {/* Category quick-picks */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2"
          >
            <span className="text-xs text-muted">Popular:</span>
            {CATEGORY_QUICK_PICKS.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleCategoryClick(cat.value)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
