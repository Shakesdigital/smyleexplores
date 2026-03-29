import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuoteForm } from "@/components/forms";
import { RelatedToursCarousel } from "@/components/related-tours-carousel";
import { SectionHeading } from "@/components/section-heading";
import { TourHeroSlider } from "@/components/tour-hero-slider";
import { getSiteSettings, getTourBySlug, getTours } from "@/lib/cms";

export async function generateStaticParams() {
  const tours = await getTours();
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [tour, settings] = await Promise.all([getTourBySlug(slug), getSiteSettings()]);

  if (!tour) return {};

  return {
    title: tour.metaTitle ?? `${tour.title} | ${settings.siteName}`,
    description: tour.metaDescription ?? tour.shortDescription,
    openGraph: {
      title: tour.metaTitle ?? `${tour.title} | ${settings.siteName}`,
      description: tour.metaDescription ?? tour.shortDescription,
      images: tour.metaImageUrl ? [tour.metaImageUrl] : tour.heroImage ? [tour.heroImage] : undefined,
    },
  };
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [tour, allTours, settings] = await Promise.all([getTourBySlug(slug), getTours(), getSiteSettings()]);
  if (!tour) notFound();

  const relatedTours = allTours.filter((item) => item.slug !== slug && tour.relatedTourSlugs.includes(item.slug));
  const fallbackRelatedTours = allTours.filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <main>
      <TourHeroSlider slides={tour.heroSlides.length ? tour.heroSlides : [{ image: tour.heroImage, title: tour.title, subtitle: tour.shortDescription }]} fallbackTitle={tour.title} />

      <section className="section-space">
        <div className="container-shell grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow={tour.destination} title={tour.title} description={tour.shortDescription} />

            <div className="mt-6 space-y-5 text-base leading-8 text-neutral-600">
              {tour.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {[
                ["Duration", tour.duration],
                ["Destination", tour.destination],
                ["Pace", tour.difficulty],
                ["Group Size", tour.groupSize],
                ["Starting Price", tour.startingPrice],
                ["Location", tour.location],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.75rem] bg-[var(--sand)] px-5 py-5">
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{label}</div>
                  <div className="mt-2 text-base font-bold text-[var(--forest-deep)]">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-14 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-8">
                <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
                  <SectionHeading eyebrow="Itinerary" title="Day-by-day journey" description="The full itinerary is grouped into one continuous section for easier browsing." />
                  <div className="mt-8 space-y-8">
                    {tour.itineraryDays.map((day) => (
                      <article key={`${day.dayLabel}-${day.title}`} className="border-b border-black/5 pb-8 last:border-b-0 last:pb-0">
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--orange)]">{day.dayLabel}</div>
                        <h2 className="mt-3 text-2xl font-black text-[var(--forest-deep)]">{day.title}</h2>
                        <p className="mt-4 text-sm leading-7 text-neutral-600">{day.description}</p>
                        {day.activities.length ? (
                          <ul className="mt-5 grid gap-3 text-sm leading-7 text-neutral-700">
                            {day.activities.map((activity) => (
                              <li key={`${day.dayLabel}-${activity}`} className="rounded-2xl bg-[var(--sand)] px-4 py-3">
                                {activity}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
                  <h2 className="text-3xl font-black text-[var(--forest-deep)]">What to Bring</h2>
                  <ul className="mt-6 grid gap-3 text-sm leading-7 text-neutral-700">
                    {tour.bring.map((item) => (
                      <li key={item} className="rounded-2xl bg-[var(--orange)]/10 px-5 py-4 font-medium text-[var(--charcoal)]">
                        Bring: {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
                  <SectionHeading eyebrow="Trip Highlights" title="What this itinerary is built around" />
                  <ul className="mt-6 grid gap-4 text-sm leading-7 text-neutral-600">
                    {tour.highlights.map((item) => (
                      <li key={item} className="rounded-2xl border border-black/5 bg-[var(--sand)]/35 px-5 py-4">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
                  <h2 className="text-3xl font-black text-[var(--forest-deep)]">What's Included</h2>
                  <ul className="mt-6 grid gap-3 text-sm leading-7 text-neutral-700">
                    {tour.included.map((item) => (
                      <li key={item} className="rounded-2xl bg-[var(--forest)]/8 px-5 py-4 font-medium text-[var(--forest-deep)]">
                        Included: {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--orange)]">Booking</div>
              <h2 className="mt-3 text-3xl font-black">{tour.bookingTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-neutral-600">{tour.bookingDescription}</p>
            </div>

            <div id="quote">
              <QuoteForm whatsappUrl={settings.whatsappUrl} preferredTour={tour.title} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-space bg-white/70">
        <div className="container-shell">
          <SectionHeading eyebrow="Related Tours" title="Keep exploring Uganda." />
          <RelatedToursCarousel tours={relatedTours.length ? relatedTours : fallbackRelatedTours} />
        </div>
      </section>
    </main>
  );
}
