"use client";

import RecommendationPanel from "@/components/ai/RecommendationPanel";

export default function HomeRecommendations() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <RecommendationPanel title="Recommended for You" limit={4} />
    </section>
  );
}
