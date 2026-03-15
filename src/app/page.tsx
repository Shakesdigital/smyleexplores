import Image from "next/image";
import Link from "next/link";

import { HeroBanner } from "@/components/hero-banner";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { TourCard } from "@/components/tour-card";
import { featuredTours, homeQuote, testimonials, whyChooseUs } from "@/lib/content";

export default function HomePage() {
  return (
    <main>
      <HeroBanner
        image="/images/home-hero-rafting.jpeg"
        title="Explore Uganda. Feel Alive."
        subtitle="Curated Nile adventures, authentic local encounters, and premium travel experiences crafted from the heart of Jinja."
        ctaLabel="View Our Tours"
        ctaHref="/tours"
      />
      <section className="section-space">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading eyebrow="Pearl of Africa" title="Travel deeper into Uganda with a team that knows how to make every moment count." />
          <div className="space-y-8">
            <div className="space-y-6 text-lg leading-8 text-neutral-600">
              <p>Smyle Explores creates unforgettable journeys across Uganda, combining the drama of the Nile with the warmth of local hospitality.</p>
              <p>Based in Jinja, we help travelers experience the Pearl of Africa through safe adventures, authentic cultural moments, and carefully handled details that make the trip feel effortless.</p>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft">
              <div className="relative h-72">
                <Image src="/images/home-pearl-of-africa.jpeg" alt="Smyle Explores experience in Uganda" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-space pt-0">
        <div className="container-shell">
          <SectionHeading eyebrow="Why Choose Us" title="Adventure with trust, local depth, and exceptional care." description="We design experiences that feel premium without losing the honesty and spirit of Uganda." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whyChooseUs.map((item) => (
              <article key={item.title} className="card-lift rounded-[2rem] border border-black/5 bg-white p-8">
                <div className="inline-flex rounded-2xl bg-[var(--forest)]/10 p-4 text-[var(--forest)]"><Icon name={item.icon} className="h-7 w-7" /></div>
                <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space bg-white/70">
        <div className="container-shell">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Featured Tours" title="Signature experiences on and around the Nile." description="A handpicked preview of the adventures guests ask for most." />
            <Link href="/tours" className="hidden rounded-full border border-[var(--forest)] px-5 py-3 text-sm font-bold text-[var(--forest)] lg:inline-flex">View All Tours</Link>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {featuredTours.map((tour) => <TourCard key={tour.slug} tour={tour} />)}
          </div>
        </div>
      </section>
      <section className="section-space relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: "url('/images/home-quote-feature.jpeg')", backgroundPosition: "center 22%" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container-shell relative">
          <blockquote className="mx-auto max-w-4xl text-center text-3xl font-black leading-tight text-white md:text-5xl">{homeQuote}</blockquote>
        </div>
      </section>
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading eyebrow="Testimonials" title="What travelers remember most." description="Placeholder guest stories ready to be replaced by live CMS-managed reviews." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
                <p className="text-base leading-8 text-neutral-600">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="mt-6">
                  <div className="text-lg font-black">{testimonial.name}</div>
                  <div className="text-sm text-neutral-500">{testimonial.title}</div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-[2rem] bg-[var(--forest-deep)] p-8 text-white">
            <div className="text-sm uppercase tracking-[0.2em] text-white/60">Start Planning</div>
            <div className="mt-2 text-3xl font-black">Ready for your Uganda story?</div>
            <p className="mt-4 max-w-2xl text-white/75">Speak with Smyle Explores for tailored recommendations, group ideas, or a personalized travel quote.</p>
            <Link href="/contact#quote" className="mt-6 inline-flex rounded-full bg-[var(--orange)] px-6 py-4 text-sm font-bold text-white">Request a Quote</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
