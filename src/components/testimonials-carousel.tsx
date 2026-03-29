"use client";

import { useRef } from "react";
import Image from "next/image";

import { Testimonial } from "@/lib/types";

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
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
          aria-label="Scroll testimonials left"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => scrollByAmount("next")}
          className="rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-bold text-[var(--charcoal)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]"
          aria-label="Scroll testimonials right"
        >
          Next
        </button>
      </div>
      <div
        ref={trackRef}
        className="carousel-track mt-8 flex items-stretch snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
      >
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.id ?? testimonial.name}
            className="flex min-w-[88%] snap-start rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft sm:min-w-[70%] md:min-w-[48%] lg:min-w-[calc((100%-3rem)/3)]"
          >
            <div className="flex h-full flex-col">
              {testimonial.image ? (
                <div className="mb-6 flex items-center gap-4">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full border border-black/5">
                    <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="text-lg font-black">{testimonial.name}</div>
                    <div className="text-sm text-neutral-500">{testimonial.title}</div>
                  </div>
                </div>
              ) : null}
              <p className="text-base leading-8 text-neutral-600">&ldquo;{testimonial.quote}&rdquo;</p>
              {!testimonial.image ? (
                <div className="mt-6">
                  <div className="text-lg font-black">{testimonial.name}</div>
                  <div className="text-sm text-neutral-500">{testimonial.title}</div>
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
