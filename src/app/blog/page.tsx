import { BlogCard } from "@/components/blog-card";
import { HeroBanner } from "@/components/hero-banner";
import { SectionHeading } from "@/components/section-heading";
import { blogPosts } from "@/lib/content";

export default function BlogPage() {
  return (
    <main>
      <HeroBanner image="/images/blog-hero-tubing-sunset.jpeg" title="Stories from the Pearl of Africa" subtitle="Travel notes, practical advice, and inspiration from Smyle Explores." compact />
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading eyebrow="Journal" title="Fresh inspiration for your next Uganda journey." description="These placeholder articles are set up as CMS-managed blog cards with category tags, dates, and excerpts." />
          <div className="mt-12 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {blogPosts.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        </div>
      </section>
    </main>
  );
}
