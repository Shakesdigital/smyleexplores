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
    <section className="relative min-h-[82vh] overflow-hidden bg-[var(--forest-deep)]">
      {slides.map((slide, index) => (
        <div
          key={`${slide.title}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Image src={slide.image} alt={slide.title || fallbackTitle} fill priority={index === 0} className="object-cover" />
          <div className="hero-overlay absolute inset-0 bg-black/28" />
        </div>
      ))}

      <div className="container-shell relative flex min-h-[82vh] flex-col justify-end py-16 text-white">
        <div className="max-w-4xl rounded-[2rem] border border-white/10 bg-black/10 p-8 backdrop-blur-[3px]">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--orange-soft)]">Destination Itinerary</div>
          <h1 className="mt-5 text-5xl font-black leading-tight md:text-7xl">{slides[activeIndex]?.title ?? fallbackTitle}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/85 md:text-lg">
            {slides[activeIndex]?.subtitle ?? "Explore this Uganda experience day by day."}
          </p>
        </div>

        {slides.length > 1 ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {slides.map((slide, index) => (
              <button
                key={`${slide.title}-indicator-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition ${
                  index === activeIndex
                    ? "bg-[var(--orange)] text-white"
                    : "border border-white/20 bg-white/10 text-white/80 hover:bg-white/15"
                }`}
              >
                {slide.title}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
