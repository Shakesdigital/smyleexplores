import Image from "next/image";
import Link from "next/link";

import { HeroBanner } from "@/components/hero-banner";
import { Icon } from "@/components/icons";
import { RelatedToursCarousel } from "@/components/related-tours-carousel";
import { SectionHeading } from "@/components/section-heading";
import { getFeaturedTours, getPageContent, getStaticFallbackContent, getTestimonials } from "@/lib/cms";

const homeFallbackContent = {
  heroImage: "/images/home-hero-rafting.jpeg",
  heroTitle: "Explore Uganda. Feel Alive.",
  heroSubtitle: "Destination-led Uganda tours with waterfall escapes, wildlife safaris, primate journeys, and immersive stays in Jinja.",
  introEyebrow: "Pearl of Africa",
  introTitle: "Travel deeper into Uganda with itineraries designed around the places that make the country unforgettable.",
  introParagraphs: [
    "Smyle Explores creates unforgettable journeys across Uganda, combining strong destination planning with the warmth of local hospitality.",
    "From Sipi Falls and Bwindi to Queen Elizabeth, Lake Mburo, and Jinja, every itinerary is built to feel clear, personal, and easy to act on.",
  ],
  featureImage: "/images/home-pearl-of-africa.jpeg",
  whyEyebrow: "Why Choose Us",
  whyTitle: "Destination planning with trust, local depth, and exceptional care.",
  whyDescription: "We design Uganda experiences that feel premium without losing the honesty and spirit of the places themselves.",
  whyChooseUsItems: getStaticFallbackContent().whyChooseUs,
  toursEyebrow: "Featured Tours",
  toursTitle: "Signature Uganda itineraries.",
  toursDescription: "A handpicked preview of destination-based tours guests can browse, compare, and book from the CMS-driven frontend.",
  quoteImage: "/images/home-quote-feature.jpeg",
  quoteText: getStaticFallbackContent().homeQuote,
  testimonialsEyebrow: "Testimonials",
  testimonialsTitle: "What travelers remember most.",
  testimonialsDescription: "Guest stories managed from the CMS.",
  ctaEyebrow: "Start Planning",
  ctaTitle: "Ready for your Uganda story?",
  ctaDescription: "Speak with Smyle Explores for tailored recommendations, group ideas, or a personalized travel quote.",
};

export default async function HomePage() {
  const [{ content }, featuredTours, testimonials] = await Promise.all([
    getPageContent("home", homeFallbackContent),
    getFeaturedTours(),
    getTestimonials(),
  ]);
  const { whyChooseUs } = getStaticFallbackContent();
  const whyChooseUsItems =
    Array.isArray(content.whyChooseUsItems) && content.whyChooseUsItems.length
      ? (content.whyChooseUsItems as { title: string; description: string; icon: string }[])
      : whyChooseUs;
  const heroSlidesValue = (content as Record<string, unknown>).heroSlides;
  const heroSlides =
    Array.isArray(heroSlidesValue) && heroSlidesValue.length
      ? (heroSlidesValue as { image: string; title: string; subtitle?: string }[])
      : undefined;

  return (
    <main>
      <HeroBanner
        image={String(content.heroImage)}
        title={String(content.heroTitle)}
        subtitle={String(content.heroSubtitle)}
        slides={heroSlides}
        ctaLabel="View Our Tours"
        ctaHref="/tours"
      />
      <section className="section-space">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-8 pt-4 lg:pt-8">
            <SectionHeading eyebrow={String(content.introEyebrow)} title={String(content.introTitle)} />
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft">
              <div className="space-y-6 p-8 text-lg leading-8 text-neutral-600 md:p-10">
                {Array.isArray(content.introParagraphs) ? (content.introParagraphs as string[]).map((paragraph) => <p key={paragraph}>{paragraph}</p>) : null}
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft">
            <div className="relative h-[520px]">
              <Image src={String(content.featureImage)} alt="Smyle Explores experience in Uganda" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>
      <section className="section-space pt-0">
        <div className="container-shell">
          <SectionHeading eyebrow={String(content.whyEyebrow)} title={String(content.whyTitle)} description={String(content.whyDescription)} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whyChooseUsItems.map((item) => (
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
            <SectionHeading eyebrow={String(content.toursEyebrow)} title={String(content.toursTitle)} description={String(content.toursDescription)} />
            <Link href="/tours" className="hidden rounded-full border border-[var(--forest)] px-5 py-3 text-sm font-bold text-[var(--forest)] lg:inline-flex">View All Tours</Link>
          </div>
          <RelatedToursCarousel tours={featuredTours} showPrice={false} showHighlights={false} />
        </div>
      </section>
      <section className="section-space relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url('${String(content.quoteImage)}')`, backgroundPosition: "center 22%" }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container-shell relative">
          <blockquote className="mx-auto max-w-4xl text-center text-3xl font-black leading-tight text-white md:text-5xl">{String(content.quoteText)}</blockquote>
        </div>
      </section>
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading eyebrow={String(content.testimonialsEyebrow)} title={String(content.testimonialsTitle)} description={String(content.testimonialsDescription)} />
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
            <div className="text-sm uppercase tracking-[0.2em] text-white/60">{String(content.ctaEyebrow)}</div>
            <div className="mt-2 text-3xl font-black">{String(content.ctaTitle)}</div>
            <p className="mt-4 max-w-2xl text-white/75">{String(content.ctaDescription)}</p>
            <Link href="/contact#quote" className="mt-6 inline-flex rounded-full bg-[var(--orange)] px-6 py-4 text-sm font-bold text-white">Request a Quote</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
