import Image from "next/image";
import Link from "next/link";

import { HeroBanner } from "@/components/hero-banner";
import { Icon } from "@/components/icons";
import { SectionHeading } from "@/components/section-heading";
import { aboutStory, teamMembers, valueItems } from "@/lib/content";

export default function AboutPage() {
  return (
    <main>
      <HeroBanner image="/images/about-hero-tubing.jpeg" title="About Smyle Explores" subtitle="A travel company rooted in Jinja, built around safe adventure, authentic encounters, and the living beauty of Uganda." compact />
      <section className="section-space">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-8">
            <SectionHeading eyebrow="Our Story" title="Born in Jinja. Built to help travelers feel Uganda, not just see it." />
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-soft">
              <div className="relative h-80">
                <Image src="/images/about-story-gogolo.jpeg" alt="Smyle Explores team member on a boat" fill className="object-cover" />
              </div>
            </div>
          </div>
          <div className="prose-copy text-neutral-600">{aboutStory.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>
      <section className="section-space pt-0">
        <div className="container-shell">
          <div className="rounded-[2rem] bg-[var(--forest)] px-8 py-12 text-center text-white shadow-soft md:px-16">
            <div className="text-sm font-bold uppercase tracking-[0.25em] text-[var(--orange-soft)]">Mission</div>
            <blockquote className="mx-auto mt-4 max-w-4xl text-2xl font-black leading-tight md:text-4xl">“To create unforgettable travel experiences across Uganda by delivering safe, exciting, and authentic adventures.”</blockquote>
          </div>
        </div>
      </section>
      <section className="section-space bg-white/70">
        <div className="container-shell">
          <SectionHeading eyebrow="Meet The Team" title="The people shaping each journey behind the scenes and on the ground." />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {teamMembers.map((member) => (
              <article key={member.name} className="card-lift overflow-hidden rounded-[2rem] border border-black/5 bg-white">
                <div className="h-72 bg-cover bg-center" style={{ backgroundImage: `url(${member.image})` }} />
                <div className="p-6">
                  <h3 className="text-2xl font-black">{member.name}</h3>
                  <p className="mt-2 text-sm font-bold text-[var(--orange)]">{member.role}</p>
                  <p className="mt-4 text-sm leading-7 text-neutral-600">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading eyebrow="Values" title="What we protect in every trip we design." />
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
            <div className="text-4xl font-black">Ready to Explore Uganda?</div>
            <Link href="/contact" className="mt-6 inline-flex rounded-full bg-[var(--orange)] px-6 py-4 text-sm font-bold text-white">Contact Us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
