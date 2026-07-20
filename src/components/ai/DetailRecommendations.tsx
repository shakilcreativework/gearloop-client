"use client";

import RecommendationPanel from "@/components/ai/RecommendationPanel";

interface DetailRecommendationsProps {
  category: string;
  listingId: string;
}

export default function DetailRecommendations({
  category,
  listingId,
}: DetailRecommendationsProps) {
  return (
    <RecommendationPanel
      title="You might also need"
      category={category}
      listingId={listingId}
      limit={4}
    />
  );
}
