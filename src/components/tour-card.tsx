import Image from "next/image";
import Link from "next/link";

import { Tour } from "@/lib/types";

export function TourCard({
  tour,
  showPrice = true,
  showHighlights = true,
}: {
  tour: Tour;
  showPrice?: boolean;
  showHighlights?: boolean;
}) {
  return (
    <article className="card-lift overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
      <div className="relative h-56">
        <Image src={tour.heroImage} alt={tour.title} fill className="object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="badge">{tour.destination}</div>
            <h3 className="mt-4 text-2xl font-black text-[var(--charcoal)]">{tour.title}</h3>
          </div>
          {showPrice ? (
            <div className="rounded-2xl bg-[var(--forest)]/8 px-4 py-2 text-right text-sm font-bold text-[var(--forest)]">
              <div>From</div>
              <div>{tour.startingPrice.replace(" per person", "")}</div>
            </div>
          ) : null}
        </div>
        <p className="mt-4 text-sm leading-7 text-neutral-600">{tour.shortDescription}</p>
        <div className="mt-5 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
          <div><span className="font-bold text-[var(--forest)]">Duration:</span> {tour.duration}</div>
          <div><span className="font-bold text-[var(--forest)]">Location:</span> {tour.location}</div>
          <div><span className="font-bold text-[var(--forest)]">Pace:</span> {tour.difficulty}</div>
          <div><span className="font-bold text-[var(--forest)]">Group:</span> {tour.groupSize}</div>
        </div>
        {showHighlights ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {tour.highlights.slice(0, 3).map((item) => (
              <span key={item} className="rounded-full border border-[var(--forest)]/10 bg-white px-3 py-2 text-xs font-semibold text-[var(--forest-deep)]">
                {item}
              </span>
            ))}
          </div>
        ) : null}
        <Link href={`/tours/${tour.slug}`} className="mt-6 inline-flex rounded-full border border-[var(--forest)] px-5 py-3 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-white">
          View Itinerary
        </Link>
      </div>
    </article>
  );
}
