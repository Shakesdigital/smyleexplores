import { HeroBanner } from "@/components/hero-banner";
import { SectionHeading } from "@/components/section-heading";
import { TourCard } from "@/components/tour-card";
import { getPageContent, getTours } from "@/lib/cms";

const toursFallbackContent = {
  heroImage: "/images/boat-ride-girls.jpeg",
  heroTitle: "Uganda Tours Built Around Real Destinations",
  heroSubtitle: "From waterfalls and gorillas to classic safaris and longer Nile stays, each itinerary is managed in the CMS and reflected directly on the frontend.",
  introEyebrow: "Tailored Itineraries",
  introTitle: "Choose the Uganda destination that matches your pace, interests, and travel goals.",
  introDescription: "Each landing page combines hero slides, short trip context, day-by-day itinerary details, and a booking form so visitors can move from browsing to planning without friction.",
};

export default async function ToursPage() {
  const [{ content }, tours] = await Promise.all([
    getPageContent("tours", toursFallbackContent),
    getTours(),
  ]);

  return (
    <main>
      <HeroBanner image={String(content.heroImage)} title={String(content.heroTitle)} subtitle={String(content.heroSubtitle)} compact />
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading eyebrow={String(content.introEyebrow)} title={String(content.introTitle)} description={String(content.introDescription)} />
          <div className="mt-8 flex flex-wrap gap-3">
            {["All Uganda", "Waterfalls", "Primate Safaris", "Classic Safaris", "Jinja Escapes"].map((filter) => (
              <span key={filter} className="rounded-full border border-[var(--forest)]/15 bg-white px-4 py-2 text-sm font-semibold text-[var(--forest)]">{filter}</span>
            ))}
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {tours.map((tour) => <TourCard key={tour.slug} tour={tour} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
