"use client";

import { useEffect, useRef, useState } from "react";
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
  const baseSlide = { image, title, subtitle };
  const extraSlides = slides?.filter((slide) => slide.image && slide.title) ?? [];
  const normalizedSlides = [baseSlide, ...extraSlides].filter(
    (slide, index, collection) =>
      Boolean(slide.image && slide.title) &&
      collection.findIndex((candidate) => candidate.image === slide.image && candidate.title === slide.title) === index,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);

  useEffect(() => {
    if (normalizedSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [normalizedSlides.length]);

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
    touchDeltaX.current = 0;
  }

  function handleTouchMove(event: React.TouchEvent<HTMLElement>) {
    if (touchStartX.current === null) return;
    touchDeltaX.current = (event.touches[0]?.clientX ?? 0) - touchStartX.current;
  }

  function handleTouchEnd() {
    if (Math.abs(touchDeltaX.current) > 50) {
      setActiveIndex((current) =>
        touchDeltaX.current < 0
          ? (current + 1) % normalizedSlides.length
          : (current - 1 + normalizedSlides.length) % normalizedSlides.length,
      );
    }

    touchStartX.current = null;
    touchDeltaX.current = 0;
  }

  const activeSlide = normalizedSlides[activeIndex] ?? { image, title, subtitle };

  return (
    <section
      className={`relative overflow-hidden bg-[var(--forest-deep)] ${compact ? "min-h-[68vh] md:min-h-[74vh]" : "min-h-[68vh] md:min-h-[80vh]"}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
      <div className={`container-shell relative flex min-h-[inherit] flex-col justify-end ${compact ? "py-14 md:py-16" : "py-16 md:py-24"}`}>
        <div className="max-w-4xl text-white">
          <div className="mb-6 text-sm font-bold uppercase tracking-[0.3em] text-[var(--orange-soft)]">Smyle Explores</div>
          <h1 className="text-3xl font-black leading-tight md:text-5xl lg:text-[3.5rem]">
            <span className="box-decoration-clone inline bg-black/45 px-4 py-2">{activeSlide.title}</span>
          </h1>
          {activeSlide.subtitle ? (
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/92 md:text-lg">
              <span className="box-decoration-clone inline bg-black/35 px-4 py-2">{activeSlide.subtitle}</span>
            </p>
          ) : null}
          {ctaLabel && ctaHref ? (
            <Link href={ctaHref} className="mt-10 inline-flex rounded-full bg-[var(--orange)] px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[var(--forest)]">
              {ctaLabel}
            </Link>
          ) : null}
        </div>
        {normalizedSlides.length > 1 ? (
          <div className="mt-8 flex justify-center gap-3">
            {normalizedSlides.map((slide, index) => (
              <button
                key={`${slide.title}-indicator-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show hero slide ${index + 1}`}
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
