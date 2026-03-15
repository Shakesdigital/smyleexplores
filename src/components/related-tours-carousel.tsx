"use client";

import { useRef } from "react";

import { TourCard } from "@/components/tour-card";
import { Tour } from "@/lib/types";

export function RelatedToursCarousel({ tours }: { tours: Tour[] }) {
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
          <div key={tour.slug} className="min-w-[85%] snap-start md:min-w-[48%] xl:min-w-[31%]">
            <TourCard tour={tour} />
          </div>
        ))}
      </div>
    </div>
  );
}
