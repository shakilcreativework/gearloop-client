import GearCard from "@/components/gear/GearCard";
import type { ListingDoc } from "@/types";

interface RelatedGearProps {
  listings: ListingDoc[];
}

export default function RelatedGear({ listings }: RelatedGearProps) {
  if (listings.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-foreground">Related Gear</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {listings.map((listing) => (
          <GearCard key={listing._id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
