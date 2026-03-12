import { SectionHeading } from "@/components/section-heading";
import { cmsCollections, siteSettings } from "@/lib/content";

export default function AdminPage() {
  return (
    <main className="section-space">
      <div className="container-shell">
        <SectionHeading eyebrow="CMS Dashboard" title="Supabase-ready content architecture for Smyle Explores." description="This starter admin surface shows the modeled collections and editorial scope. It is designed to be connected to Supabase Auth, RLS, and CRUD flows as environment keys are configured." />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {cmsCollections.map((collection) => (
            <article key={collection.name} className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{collection.name}</div>
              <div className="mt-4 text-5xl font-black text-[var(--forest)]">{collection.count}</div>
              <p className="mt-4 text-sm leading-7 text-neutral-600">{collection.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-[2rem] bg-[var(--forest-deep)] p-8 text-white">
          <h2 className="text-3xl font-black">Configured Collections</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">Brand settings, pages, modules, tours, blog posts, testimonials, team profiles, values, contact submissions, and quote requests are defined in the SQL migration and mirrored in the frontend content layer.</p>
          <p className="mt-4 text-sm text-white/65">Current organization: {siteSettings.siteName}</p>
        </div>
      </div>
    </main>
  );
}
