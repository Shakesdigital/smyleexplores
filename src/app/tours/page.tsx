import { HeroBanner } from "@/components/hero-banner";
import { SectionHeading } from "@/components/section-heading";
import { TourCard } from "@/components/tour-card";
import { getPageContent, getTours } from "@/lib/cms";

const toursFallbackContent = {
  heroImage: "/images/boat-ride-girls.jpeg",
  heroTitle: "Our Tours",
  heroSubtitle: "Adventure Awaits on the Banks of the Nile",
  introEyebrow: "Adventure Capital",
  introTitle: "Jinja is Uganda's gateway to river adventure, local culture, and unforgettable landscapes.",
  introDescription: "Located on the shores of Lake Victoria at the source of the world's longest river, Jinja blends high-energy activities with relaxed beauty and meaningful local experiences.",
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
            {["All", "Thrilling", "Moderate", "Family-Friendly", "Culture"].map((filter) => (
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
