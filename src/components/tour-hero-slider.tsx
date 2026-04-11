"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { TourHeroSlide } from "@/lib/types";

export function TourHeroSlider({ slides, fallbackTitle }: { slides: TourHeroSlide[]; fallbackTitle: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-[76vh] overflow-hidden bg-[var(--forest-deep)]">
      {slides.map((slide, index) => (
        <div
          key={`${slide.title}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Image src={slide.image} alt={slide.title || fallbackTitle} fill priority={index === 0} className="object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
      ))}

      <div className="container-shell relative flex min-h-[76vh] flex-col justify-end py-16 text-white">
        <div className="max-w-4xl">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--orange-soft)]">Destination Itinerary</div>
          <h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl lg:text-[3.5rem]">
            <span className="box-decoration-clone inline bg-black/45 px-4 py-2">
              {slides[activeIndex]?.title ?? fallbackTitle}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/92 md:text-lg">
            <span className="box-decoration-clone inline bg-black/35 px-4 py-2">
              {slides[activeIndex]?.subtitle ?? "Explore this Uganda experience day by day."}
            </span>
          </p>
        </div>

        {slides.length > 1 ? (
          <div className="mt-8 flex justify-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={`${slide.title}-indicator-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show tour hero slide ${index + 1}`}
                className={`h-3 w-3 rounded-full transition ${
                  index === activeIndex
                    ? "bg-[var(--orange)] shadow-[0_0_0_6px_rgba(245,124,0,0.2)]"
                    : "bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
