"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type HeroSlide = {
  image: string;
  title: string;
  subtitle?: string;
};

export function HeroBanner({
  image,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  compact = false,
  slides,
}: {
  image: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  compact?: boolean;
  slides?: HeroSlide[];
}) {
  const normalizedSlides = slides?.length ? slides.filter((slide) => slide.image && slide.title) : [{ image, title, subtitle }];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (normalizedSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [normalizedSlides.length]);

  const activeSlide = normalizedSlides[activeIndex] ?? { image, title, subtitle };

  return (
    <section className={`relative overflow-hidden ${compact ? "min-h-[320px]" : "min-h-[80vh]"}`}>
      {normalizedSlides.map((slide, index) => (
        <div
          key={`${slide.title}-${index}`}
          className={`absolute inset-0 transition-opacity duration-700 ${index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <Image src={slide.image} alt={slide.title} fill priority={index === 0} className="object-cover" />
        </div>
      ))}
      <div className="hero-overlay absolute inset-0" />
      <div className="pattern-grid absolute inset-0 opacity-40" />
      <div className="container-shell relative flex min-h-[inherit] items-center py-24">
        <div className="max-w-3xl text-white">
          <div className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-[var(--orange-soft)]">Smyle Explores</div>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">{activeSlide.title}</h1>
          {activeSlide.subtitle ? <p className="mt-6 max-w-2xl text-lg leading-8 text-white/85 md:text-xl">{activeSlide.subtitle}</p> : null}
          {ctaLabel && ctaHref ? (
            <Link href={ctaHref} className="mt-10 inline-flex rounded-full bg-[var(--orange)] px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[var(--forest)]">
              {ctaLabel}
            </Link>
          ) : null}
          {normalizedSlides.length > 1 ? (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {normalizedSlides.map((slide, index) => (
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
      </div>
    </section>
  );
}
