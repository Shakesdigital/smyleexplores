import Image from "next/image";
import { notFound } from "next/navigation";

import { QuoteForm } from "@/components/forms";
import { RelatedToursCarousel } from "@/components/related-tours-carousel";
import { SectionHeading } from "@/components/section-heading";
import { tours } from "@/lib/content";

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export default async function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tour = tours.find((item) => item.slug === slug);
  if (!tour) notFound();

  const relatedTours = tours.filter((item) => item.slug !== slug);

  return (
    <main>
      <section className="relative min-h-[70vh] overflow-hidden">
        <Image src={tour.heroImage} alt={tour.title} fill priority className="object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-shell relative flex min-h-[70vh] items-end py-16">
          <div className="max-w-3xl text-white">
            <div className="badge">{tour.difficulty}</div>
            <h1 className="mt-6 text-5xl font-black leading-tight md:text-7xl">{tour.title}</h1>
            <p className="mt-6 text-lg leading-8 text-white/85">{tour.shortDescription}</p>
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="container-shell grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Overview" title="A vivid experience designed around the best of Jinja." />
            <div className="prose-copy mt-6 text-neutral-600">{tour.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            <div className="mt-12">
              <h2 className="text-3xl font-black">Tour Highlights</h2>
              <ul className="mt-6 grid gap-4 text-sm leading-7 text-neutral-600 md:grid-cols-2">
                {tour.highlights.map((item) => <li key={item} className="rounded-2xl border border-black/5 bg-white px-5 py-4">{item}</li>)}
              </ul>
            </div>
            <div className="mt-12">
              <h2 className="text-3xl font-black">What&apos;s Included</h2>
              <ul className="mt-6 grid gap-3 text-sm leading-7 text-neutral-700 md:grid-cols-2">
                {tour.included.map((item) => <li key={item} className="rounded-2xl bg-[var(--forest)]/8 px-5 py-4 font-medium text-[var(--forest-deep)]">✓ {item}</li>)}
              </ul>
            </div>
            <div className="mt-12">
              <h2 className="text-3xl font-black">What to Bring</h2>
              <ul className="mt-6 grid gap-3 text-sm leading-7 text-neutral-700 md:grid-cols-2">
                {tour.bring.map((item) => <li key={item} className="rounded-2xl bg-[var(--orange)]/10 px-5 py-4 font-medium text-[var(--charcoal)]">✓ {item}</li>)}
              </ul>
            </div>
          </div>
          <div className="space-y-8">
            <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
              <h2 className="text-3xl font-black">Tour Details</h2>
              <div className="mt-8 grid gap-4">
                {[
                  ["Duration", tour.duration],
                  ["Difficulty Level", tour.difficulty],
                  ["Minimum Age", tour.minAge],
                  ["Group Size", tour.groupSize],
                  ["Starting Price", tour.startingPrice],
                  ["Location", tour.location],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-[var(--sand)] px-5 py-4">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{label}</div>
                    <div className="mt-2 text-base font-bold text-[var(--charcoal)]">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div id="quote">
              <h2 className="text-3xl font-black">Request a Quote</h2>
              <p className="mt-3 text-sm leading-7 text-neutral-600">Share your preferred date, group size, and any special travel needs.</p>
              <div className="mt-6"><QuoteForm /></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-space bg-white/70">
        <div className="container-shell">
          <SectionHeading eyebrow="Related Tours" title="Keep exploring around Jinja." />
          <RelatedToursCarousel tours={relatedTours} />
        </div>
      </section>
    </main>
  );
}
