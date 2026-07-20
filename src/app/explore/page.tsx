"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import GearCard from "@/components/gear/GearCard";
import SkeletonCard from "@/components/gear/SkeletonCard";
import SearchBar from "@/components/explore/SearchBar";
import FilterPanel from "@/components/explore/FilterPanel";
import SortDropdown from "@/components/explore/SortDropdown";
import { getListings, type ListingsQuery } from "@/lib/api";
import type { ListingDoc, ListingCategory } from "@/types";

const PAGE_SIZE = 12;

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [listings, setListings] = useState<ListingDoc[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState<ListingCategory | undefined>(
    (searchParams.get("category") as ListingCategory) ?? undefined,
  );
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<ListingsQuery["sort"]>("newest");

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isLoadingMoreRef = useRef(false);
  const mountedRef = useRef(false);

  const buildQuery = useCallback(
    (p: number): ListingsQuery => ({
      search: search || undefined,
      category,
      maxPrice,
      minRating,
      sort,
      page: p,
      limit: PAGE_SIZE,
    }),
    [search, category, maxPrice, minRating, sort],
  );

  const fetchPage1 = useCallback(
    async (query: ListingsQuery) => {
      setLoading(true);
      setError(null);
      setPage(1);
      try {
        const res = await getListings(query);
        setListings(res.listings);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "Failed to load listings",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Initial fetch on mount
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      void fetchPage1(buildQuery(1));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !isLoadingMoreRef.current &&
          page < totalPages
        ) {
          isLoadingMoreRef.current = true;
          setLoadingMore(true);
          const nextPage = page + 1;

          getListings(buildQuery(nextPage))
            .then((res) => {
              setListings((prev) => [...prev, ...res.listings]);
              setPage(nextPage);
              setTotalPages(res.pagination.totalPages);
              setLoadingMore(false);
              isLoadingMoreRef.current = false;
            })
            .catch(() => {
              setLoadingMore(false);
              isLoadingMoreRef.current = false;
            });
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [page, totalPages, buildQuery]);

  function handleSearch(q: string) {
    setSearch(q);
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (category) params.set("category", category);
    router.push(`/explore?${params.toString()}`, { scroll: false });
    void fetchPage1({ ...buildQuery(1), search: q || undefined });
  }

  function handleCategoryChange(cat: ListingCategory | undefined) {
    setCategory(cat);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (cat) params.set("category", cat);
    router.push(`/explore?${params.toString()}`, { scroll: false });
    void fetchPage1({ ...buildQuery(1), category: cat });
  }

  function handleSortChange(newSort: ListingsQuery["sort"]) {
    setSort(newSort);
    void fetchPage1({ ...buildQuery(1), sort: newSort });
  }

  function handlePriceChange(max: number | undefined) {
    setMaxPrice(max);
    void fetchPage1({ ...buildQuery(1), maxPrice: max });
  }

  function handleRatingChange(min: number | undefined) {
    setMinRating(min);
    void fetchPage1({ ...buildQuery(1), minRating: min });
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Explore Gear
        </h1>
        <p className="mt-2 text-muted">
          Browse thousands of outdoor gear listings from people near you.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <SearchBar value={search} onSearch={handleSearch} />
      </div>

      {/* Filters + Sort bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterPanel
          category={category}
          maxPrice={maxPrice}
          minRating={minRating}
          onCategoryChange={handleCategoryChange}
          onPriceChange={handlePriceChange}
          onRatingChange={handleRatingChange}
        />
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted">
            {loading ? "" : `${total} listing${total !== 1 ? "s" : ""}`}
          </span>
          <SortDropdown value={sort} onChange={handleSortChange} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-950">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <button
            type="button"
            onClick={() => void fetchPage1(buildQuery(1))}
            className="mt-3 text-sm font-medium text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && listings.length === 0 && (
        <div className="rounded-xl border border-border bg-card py-16 text-center">
          <svg
            className="mx-auto h-12 w-12 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No gear found
          </h3>
          <p className="mt-1 text-sm text-muted">
            Try adjusting your search or filters to find what you&apos;re looking
            for.
          </p>
        </div>
      )}

      {/* Listings grid */}
      {!loading && !error && listings.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {listings.map((listing) => (
              <GearCard key={listing._id} listing={listing} />
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-4" />

          {/* Loading more indicator */}
          {loadingMore && (
            <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={`more-${i}`} />
              ))}
            </div>
          )}

          {/* End of results */}
          {page >= totalPages && !loadingMore && (
            <p className="py-8 text-center text-sm text-muted">
              You&apos;ve seen all {total} listing{total !== 1 ? "s" : ""}.
            </p>
          )}
        </>
      )}
    </section>
  );
}
