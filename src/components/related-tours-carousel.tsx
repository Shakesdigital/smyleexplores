"use client";

import { useRef } from "react";

import { TourCard } from "@/components/tour-card";
import { Tour } from "@/lib/types";

export function RelatedToursCarousel({
  tours,
  showPrice = true,
  showHighlights = true,
}: {
  tours: Tour[];
  showPrice?: boolean;
  showHighlights?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(direction: "prev" | "next") {
    const track = trackRef.current;
    if (!track) return;

    const amount = Math.round(track.clientWidth * 0.9);
    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <div>
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollByAmount("prev")}
          className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[var(--charcoal)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
          aria-label="Scroll related tours left"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount("next")}
          className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[var(--charcoal)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
          aria-label="Scroll related tours right"
        >
          Next
        </button>
      </div>
      <div
        ref={trackRef}
        className="carousel-track mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
      >
        {tours.map((tour) => (
          <div key={tour.slug} className="min-w-[88%] snap-start sm:min-w-[70%] md:min-w-[48%] lg:min-w-[calc((100%-3rem)/3)]">
            <TourCard tour={tour} showPrice={showPrice} showHighlights={showHighlights} />
          </div>
        ))}
      </div>
    </div>
  );
}
