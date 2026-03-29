import { BlogCard } from "@/components/blog-card";
import { HeroBanner } from "@/components/hero-banner";
import { SectionHeading } from "@/components/section-heading";
import { getBlogPosts, getPageContent } from "@/lib/cms";

const blogFallbackContent = {
  heroImage: "/images/blog-hero-tubing-sunset.jpeg",
  heroTitle: "Stories from the Pearl of Africa",
  heroSubtitle: "Travel notes, practical advice, and inspiration from Smyle Explores.",
  introEyebrow: "Journal",
  introTitle: "Fresh inspiration for your next Uganda journey.",
  introDescription: "These entries are managed from the CMS with category tags, dates, excerpts, and publishing status.",
};

export default async function BlogPage() {
  const [{ content }, blogPosts] = await Promise.all([
    getPageContent("blog", blogFallbackContent),
    getBlogPosts(),
  ]);
  const heroSlidesValue = (content as Record<string, unknown>).heroSlides;
  const heroSlides =
    Array.isArray(heroSlidesValue) && heroSlidesValue.length
      ? (heroSlidesValue as { image: string; title: string; subtitle?: string }[])
      : undefined;

  return (
    <main>
      <HeroBanner image={String(content.heroImage)} title={String(content.heroTitle)} subtitle={String(content.heroSubtitle)} slides={heroSlides} compact />
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading eyebrow={String(content.introEyebrow)} title={String(content.introTitle)} description={String(content.introDescription)} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {blogPosts.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
