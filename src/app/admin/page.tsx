import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdminDashboardData } from "@/lib/cms";
import { hasCmsAdminPassword, isAdminSessionValid } from "@/lib/admin-session";

import {
  logoutAdminAction,
  updateSubmissionStatusAction,
  upsertBlogPostAction,
  upsertPageAction,
  upsertSettingAction,
  upsertTourAction,
} from "./actions";

export const dynamic = "force-dynamic";

function prettyJson(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2);
}

export default async function AdminPage() {
  if (!hasCmsAdminPassword()) {
    redirect("/admin/login");
  }

  if (!(await isAdminSessionValid())) {
    redirect("/admin/login");
  }

  const dashboard = await getAdminDashboardData();

  const settingsFields = [
    { label: "Site Name", groupKey: "general", key: "site_name", value: dashboard.settings.siteName, type: "string" },
    { label: "Tagline", groupKey: "general", key: "tagline", value: dashboard.settings.tagline, type: "string" },
    { label: "Mission", groupKey: "general", key: "mission", value: dashboard.settings.mission, type: "string" },
    { label: "Email", groupKey: "contact", key: "email", value: dashboard.settings.email, type: "string" },
    { label: "Phone", groupKey: "contact", key: "phone", value: dashboard.settings.phone, type: "string" },
    { label: "WhatsApp URL", groupKey: "contact", key: "whatsapp_url", value: dashboard.settings.whatsappUrl, type: "string" },
    { label: "Address", groupKey: "contact", key: "address", value: dashboard.settings.address, type: "string" },
    { label: "Office Hours", groupKey: "contact", key: "office_hours", value: dashboard.settings.officeHours.join("\n"), type: "array" },
    { label: "Instagram URL", groupKey: "branding", key: "instagram_url", value: dashboard.settings.socialLinks.instagram, type: "string" },
    { label: "Facebook URL", groupKey: "branding", key: "facebook_url", value: dashboard.settings.socialLinks.facebook, type: "string" },
    { label: "Logo URL", groupKey: "branding", key: "logo_url", value: dashboard.settings.branding.logo, type: "string" },
    { label: "Primary Color", groupKey: "branding", key: "primary_color", value: dashboard.settings.branding.primaryColor, type: "string" },
    { label: "Secondary Color", groupKey: "branding", key: "secondary_color", value: dashboard.settings.branding.secondaryColor, type: "string" },
    { label: "SEO Default Title", groupKey: "seo", key: "seo_default_title", value: dashboard.settings.seo.defaultTitle, type: "string" },
    { label: "SEO Default Description", groupKey: "seo", key: "seo_default_description", value: dashboard.settings.seo.defaultDescription, type: "string" },
    { label: "SEO Default Image", groupKey: "seo", key: "seo_default_image", value: dashboard.settings.seo.defaultImage, type: "string" },
  ];

  return (
    <main className="section-space">
      <div className="container-shell space-y-10">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-[var(--forest-deep)] p-8 text-white shadow-soft lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--orange-soft)]">Backend CMS</div>
            <h1 className="mt-3 text-4xl font-black">Smyle Explores content operations</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
              Settings, page JSON, tours, blog posts, and inquiry review now run through the CMS layer. Public pages read Supabase first and fall back to local seed content when keys are missing.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-white">
              View Site
            </Link>
            <form action={logoutAdminAction}>
              <button type="submit" className="rounded-full bg-[var(--orange)] px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[var(--forest-deep)]">
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {!dashboard.hasServiceRole ? (
          <div className="rounded-[2rem] border border-yellow-200 bg-yellow-50 p-6 text-sm leading-7 text-yellow-900">
            `SUPABASE_SERVICE_ROLE_KEY` is not configured, so this dashboard is running in fallback mode. Add the service role key to enable CMS writes and submission review.
          </div>
        ) : null}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {dashboard.stats.map((item) => (
            <article key={item.label} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{item.label}</div>
              <div className="mt-4 text-4xl font-black text-[var(--forest-deep)]">{item.value}</div>
            </article>
          ))}
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Settings Suite</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Grouped public settings for branding, contact, and SEO defaults.</p>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {settingsFields.map((field) => (
              <form key={field.key} action={upsertSettingAction} className="rounded-2xl border border-black/5 bg-[var(--sand)]/45 p-5">
                <input type="hidden" name="group_key" value={field.groupKey} />
                <input type="hidden" name="key" value={field.key} />
                <input type="hidden" name="value_type" value={field.type} />
                <input type="hidden" name="is_public" value="true" />
                <label className="block text-sm font-bold text-[var(--forest-deep)]">
                  {field.label}
                  {field.type === "array" ? (
                    <textarea name="value" defaultValue={field.value} rows={4} className="mt-3 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none focus:border-[var(--forest)]" />
                  ) : (
                    <input name="value" defaultValue={field.value} className="mt-3 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 outline-none focus:border-[var(--forest)]" />
                  )}
                </label>
                <button type="submit" className="mt-4 rounded-full bg-[var(--forest)] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
                  Save Setting
                </button>
              </form>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Pages</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Edit static-route content as JSON payloads keyed by page slug.</p>
          <div className="mt-8 space-y-6">
            {dashboard.pages.length ? dashboard.pages.map((page) => (
              <form key={page.slug} action={upsertPageAction} className="rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="text-sm font-semibold text-neutral-700">
                    Slug
                    <input name="slug" defaultValue={page.slug} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Title
                    <input name="title" defaultValue={page.title} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Status
                    <select name="status" defaultValue={page.status} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Published At
                    <input name="published_at" defaultValue={page.publishedAt ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Excerpt
                  <textarea name="excerpt" defaultValue={page.excerpt ?? ""} rows={2} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                </label>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Content JSON
                  <textarea name="content" defaultValue={prettyJson(page.content)} rows={12} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 font-mono text-sm" />
                </label>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <label className="text-sm font-semibold text-neutral-700">
                    Featured Image URL
                    <input name="featured_image_url" defaultValue={page.featuredImageUrl ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Meta Title
                    <input name="meta_title" defaultValue={page.metaTitle ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Meta Image URL
                    <input name="meta_image_url" defaultValue={page.metaImageUrl ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Meta Description
                  <textarea name="meta_description" defaultValue={page.metaDescription ?? ""} rows={3} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                </label>
                <button type="submit" className="mt-5 rounded-full bg-[var(--forest)] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
                  Save Page
                </button>
              </form>
            )) : (
              <div className="rounded-2xl border border-dashed border-black/10 bg-[var(--sand)]/35 p-6 text-sm leading-7 text-neutral-600">
                No page records were found yet. Create `home`, `about`, `tours`, `blog`, and `contact` rows in Supabase to take full control of each static route from the CMS.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Tours</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Core tour inventory with publishing state, pricing, imagery, and long-form details.</p>
          <div className="mt-8 space-y-8">
            {dashboard.tours.map((tour) => (
              <form key={tour.slug} action={upsertTourAction} className="rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
                <div className="grid gap-4 lg:grid-cols-3">
                  <label className="text-sm font-semibold text-neutral-700">
                    Slug
                    <input name="slug" defaultValue={tour.slug} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Title
                    <input name="title" defaultValue={tour.title} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Status
                    <select name="status" defaultValue={tour.status ?? "published"} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Duration
                    <input name="duration" defaultValue={tour.duration} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Difficulty
                    <input name="difficulty" defaultValue={tour.difficulty} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Minimum Age
                    <input name="minimum_age" defaultValue={tour.minAge} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Group Size
                    <input name="group_size" defaultValue={tour.groupSize} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Starting Price
                    <input name="starting_price" defaultValue={tour.startingPrice} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Location
                    <input name="location" defaultValue={tour.location} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Summary
                  <textarea name="summary" defaultValue={tour.shortDescription} rows={2} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                </label>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Hero Image URL
                  <input name="hero_image_url" defaultValue={tour.heroImage} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                </label>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <label className="text-sm font-semibold text-neutral-700">
                    Overview
                    <textarea name="description" defaultValue={tour.overview.join("\n")} rows={8} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Highlights
                    <textarea name="highlights" defaultValue={tour.highlights.join("\n")} rows={8} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <div>
                    <label className="text-sm font-semibold text-neutral-700">
                      Included
                      <textarea name="included" defaultValue={tour.included.join("\n")} rows={4} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                    </label>
                    <label className="mt-4 block text-sm font-semibold text-neutral-700">
                      What To Bring
                      <textarea name="what_to_bring" defaultValue={tour.bring.join("\n")} rows={4} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                    </label>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <label className="text-sm font-semibold text-neutral-700">
                    Meta Title
                    <input name="meta_title" defaultValue={tour.metaTitle ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Meta Image URL
                    <input name="meta_image_url" defaultValue={tour.metaImageUrl ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Published At
                    <input name="published_at" defaultValue={tour.publishedAt ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Meta Description
                  <textarea name="meta_description" defaultValue={tour.metaDescription ?? ""} rows={3} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                </label>
                <button type="submit" className="mt-5 rounded-full bg-[var(--forest)] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
                  Save Tour
                </button>
              </form>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Blog Posts</h2>
          <div className="mt-8 space-y-8">
            {dashboard.blogPosts.map((post) => (
              <form key={post.slug} action={upsertBlogPostAction} className="rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
                <div className="grid gap-4 lg:grid-cols-3">
                  <label className="text-sm font-semibold text-neutral-700">
                    Slug
                    <input name="slug" defaultValue={post.slug} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Title
                    <input name="title" defaultValue={post.title} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Status
                    <select name="status" defaultValue={post.status ?? "published"} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                    </select>
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Category
                    <input name="category" defaultValue={post.category} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Featured Image URL
                    <input name="featured_image_url" defaultValue={post.image} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Published At
                    <input name="published_at" defaultValue={post.publishedAt ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Excerpt
                  <textarea name="excerpt" defaultValue={post.excerpt} rows={3} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                </label>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Content JSON
                  <textarea name="content" defaultValue={prettyJson(post.content ?? {})} rows={10} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 font-mono text-sm" />
                </label>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <label className="text-sm font-semibold text-neutral-700">
                    Meta Title
                    <input name="meta_title" defaultValue={post.metaTitle ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                  <label className="text-sm font-semibold text-neutral-700">
                    Meta Image URL
                    <input name="meta_image_url" defaultValue={post.metaImageUrl ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                  </label>
                </div>
                <label className="mt-4 block text-sm font-semibold text-neutral-700">
                  Meta Description
                  <textarea name="meta_description" defaultValue={post.metaDescription ?? ""} rows={3} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
                </label>
                <button type="submit" className="mt-5 rounded-full bg-[var(--forest)] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
                  Save Post
                </button>
              </form>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Recent Submissions</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Contact inquiries and quote requests persist in Supabase through server routes.</p>
          <div className="mt-8 space-y-4">
            {dashboard.submissions.length ? dashboard.submissions.map((submission) => (
              <article key={submission.id} className="rounded-2xl border border-black/5 bg-[var(--sand)]/40 p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{submission.type}</div>
                    <h3 className="mt-2 text-xl font-black text-[var(--forest-deep)]">{submission.name}</h3>
                    <p className="mt-2 text-sm text-neutral-600">{submission.email} | {submission.phone}</p>
                    <p className="mt-4 text-sm leading-7 text-neutral-700">{submission.summary}</p>
                  </div>
                  <form action={updateSubmissionStatusAction} className="min-w-[220px] rounded-2xl bg-white p-4 shadow-sm">
                    <input type="hidden" name="id" value={submission.id} />
                    <input type="hidden" name="table" value={submission.type === "contact" ? "contact_submissions" : "quote_requests"} />
                    <label className="block text-sm font-semibold text-neutral-700">
                      Status
                      <select name="status" defaultValue={submission.status} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3">
                        <option value="new">new</option>
                        <option value="in_progress">in_progress</option>
                        <option value="closed">closed</option>
                      </select>
                    </label>
                    <button type="submit" className="mt-4 rounded-full bg-[var(--forest)] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
                      Update
                    </button>
                  </form>
                </div>
              </article>
            )) : (
              <div className="rounded-2xl border border-dashed border-black/10 bg-[var(--sand)]/35 p-6 text-sm leading-7 text-neutral-600">
                No stored submissions yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
