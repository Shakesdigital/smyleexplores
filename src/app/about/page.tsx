import Image from "next/image";
import Link from "next/link";

import { HeroBanner } from "@/components/hero-banner";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { getCompanyValues, getPageContent, getStaticFallbackContent } from "@/lib/cms";

const aboutFallbackContent = {
  heroImage: "/images/about-hero-tubing.jpeg",
  heroTitle: "About Smyle Explores",
  heroSubtitle: "A travel company rooted in Jinja, built around safe adventure, authentic encounters, and the living beauty of Uganda.",
  storyEyebrow: "Our Story",
  storyTitle: "Born in Jinja. Built to help travelers feel Uganda, not just see it.",
  storyImage: "/images/about-story-gogolo.jpeg",
  storyParagraphs: getStaticFallbackContent().aboutStory,
  missionEyebrow: "Mission",
  missionQuote: "To create unforgettable travel experiences across Uganda by delivering safe, exciting, and authentic adventures.",
  valuesEyebrow: "Values",
  valuesTitle: "What we protect in every trip we design.",
  ctaTitle: "Ready to Explore Uganda?",
};

export default async function AboutPage() {
  const [{ content }, valueItems] = await Promise.all([
    getPageContent("about", aboutFallbackContent),
    getCompanyValues(),
  ]);
  const { aboutStory } = getStaticFallbackContent();
  const storyParagraphs =
    Array.isArray(content.storyParagraphs) && content.storyParagraphs.length
      ? (content.storyParagraphs as string[])
      : aboutStory;

  return (
    <main>
      <HeroBanner image={String(content.heroImage)} title={String(content.heroTitle)} subtitle={String(content.heroSubtitle)} compact />
      <section className="section-space">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <SectionHeading eyebrow={String(content.storyEyebrow)} title={String(content.storyTitle)} />
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft">
              <div className="relative h-80">
                <Image src={String(content.storyImage)} alt="Smyle Explores team member on a boat" fill className="object-cover" />
              </div>
            </div>
          </div>
          <div className="prose-copy text-neutral-600">{storyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>
      <section className="section-space pt-0">
        <div className="container-shell">
          <div className="rounded-[2rem] bg-[var(--forest)] px-8 py-12 text-center text-white shadow-soft md:px-16">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--orange-soft)]">{String(content.missionEyebrow)}</div>
            <blockquote className="mx-auto mt-4 max-w-4xl text-2xl font-black leading-tight md:text-4xl">
              {String(content.missionQuote)}
            </blockquote>
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading eyebrow={String(content.valuesEyebrow)} title={String(content.valuesTitle)} />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {valueItems.map((item) => (
              <article key={item.title} className="rounded-[2rem] border border-black/5 bg-white p-8">
                <div className="inline-flex rounded-2xl bg-[var(--orange)]/10 p-4 text-[var(--orange)]"><Icon name={item.icon} className="h-7 w-7" /></div>
                <h3 className="mt-6 text-2xl font-black">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-neutral-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space pt-0">
        <div className="container-shell">
          <div className="rounded-[2rem] bg-[var(--forest-deep)] p-10 text-center text-white">
            <div className="text-4xl font-black">{String(content.ctaTitle)}</div>
            <Link href="/contact" className="mt-6 inline-flex rounded-full bg-[var(--orange)] px-6 py-4 text-sm font-bold text-white">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
