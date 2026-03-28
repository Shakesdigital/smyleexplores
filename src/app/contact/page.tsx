import Link from "next/link";

import { ContactForm, QuoteForm } from "@/components/forms";
import { HeroBanner } from "@/components/hero-banner";
import { SectionHeading } from "@/components/section-heading";
import { getPageContent, getSiteSettings } from "@/lib/cms";

const contactFallbackContent = {
  heroImage: "/images/boat-ride-girls.jpeg",
  heroTitle: "Get in Touch",
  heroSubtitle: "Tell us what kind of Uganda experience you're looking for and we'll help shape the journey.",
  introEyebrow: "Contact Us",
  introTitle: "Plan your Uganda itinerary with a local team that understands destinations across the country.",
  quoteEyebrow: "Request a Quote",
  quoteTitle: "Share your dates and travel ideas.",
};

export default async function ContactPage() {
  const [siteSettings, { content }] = await Promise.all([
    getSiteSettings(),
    getPageContent("contact", contactFallbackContent),
  ]);

  return (
    <main>
      <HeroBanner image={String(content.heroImage)} title={String(content.heroTitle)} subtitle={String(content.heroSubtitle)} compact />
      <section className="section-space">
        <div className="container-shell grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow={String(content.introEyebrow)} title={String(content.introTitle)} />
            <div className="mt-8"><ContactForm whatsappUrl={siteSettings.whatsappUrl} /></div>
          </div>
          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-soft">
              <h2 className="text-3xl font-black">Contact Details</h2>
              <div className="mt-6 space-y-3 text-base text-neutral-700">
                <p>Address: {siteSettings.address}</p>
                <p>Email: {siteSettings.email}</p>
                <p>Phone: {siteSettings.phone}</p>
                <p>WhatsApp: <Link href={siteSettings.whatsappUrl} className="font-bold text-[var(--forest)]">Message the team</Link></p>
              </div>
            </div>
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft">
              <iframe title="Jinja, Uganda Map" src="https://www.google.com/maps?q=Jinja%2C%20Uganda&z=11&output=embed" className="h-[320px] w-full" loading="lazy" />
            </div>
            <div className="rounded-[2rem] bg-[var(--forest-deep)] p-8 text-white">
              <h2 className="text-2xl font-black">Office Hours</h2>
              <div className="mt-4 space-y-2 text-sm text-white/75">{siteSettings.officeHours.map((hours) => <p key={hours}>{hours}</p>)}</div>
              <p className="mt-6 text-sm text-white/75">Or browse our tours and request a quote directly.</p>
              <Link href="/tours" className="mt-5 inline-flex rounded-full bg-[var(--orange)] px-5 py-3 text-sm font-bold text-white">Browse Tours</Link>
            </div>
          </div>
        </div>
      </section>
      <section id="quote" className="section-space bg-white/70">
        <div className="container-shell">
          <SectionHeading eyebrow={String(content.quoteEyebrow)} title={String(content.quoteTitle)} />
          <div className="mt-8 max-w-4xl"><QuoteForm whatsappUrl={siteSettings.whatsappUrl} /></div>
        </div>
      </section>
    </main>
  );
}
