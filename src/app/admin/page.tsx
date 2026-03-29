import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { aboutStory, whyChooseUs } from "@/lib/content";
import { getAdminDashboardData } from "@/lib/cms";
import { isAdminSessionValid } from "@/lib/admin-session";
import { CmsPage, Tour } from "@/lib/types";

import {
  deleteTestimonialAction,
  logoutAdminAction,
  updateSubmissionStatusAction,
  updateAdminCredentialsAction,
  upsertBlogPostAction,
  upsertCompanyValueAction,
  upsertPageAction,
  upsertSettingAction,
  upsertTestimonialAction,
  upsertTourAction,
} from "./actions";

export const dynamic = "force-dynamic";

type AdminTab = "landing" | "tours" | "blog" | "submissions";
type SlideContent = { image: string; title: string; subtitle: string };

function prettyJson(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2);
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : fallback;
}

function asObjectArray<T extends Record<string, unknown>>(value: unknown, fallback: T[] = []) {
  return Array.isArray(value) ? value.filter((item): item is T => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : fallback;
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <input name={name} defaultValue={defaultValue ?? ""} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
    </label>
  );
}

function ImageField({
  label,
  name,
  defaultValue,
  folder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  folder: string;
}) {
  return <ImageUploadField label={label} name={name} defaultValue={defaultValue} folder={folder} />;
}

function TextAreaField({
  label,
  name,
  defaultValue,
  rows = 4,
  mono = false,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        className={`mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 ${mono ? "font-mono text-sm" : ""}`}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <label className="block text-sm font-semibold text-neutral-700">
      {label}
      <select name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3">
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function isSettingsImageField(key: string) {
  return key === "logo_url" || key === "seo_default_image";
}

function SaveButton({ children }: { children: string }) {
  return (
    <button type="submit" className="mt-5 rounded-full bg-[var(--forest)] px-5 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
      {children}
    </button>
  );
}

function WorkspaceHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
      <div className="max-w-3xl">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{eyebrow}</div>
        <h2 className="mt-3 text-3xl font-black text-[var(--forest-deep)]">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-neutral-600">{description}</p>
      </div>
    </section>
  );
}

function SectionTab({ tab, label, active }: { tab: AdminTab; label: string; active: boolean }) {
  return (
    <Link
      href={`/admin?tab=${tab}`}
      className={`rounded-full px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition ${
        active
          ? "bg-white text-[var(--forest-deep)]"
          : "border border-white/15 bg-white/5 text-white/85 hover:border-white hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );
}

function BasePageFields({ page }: { page: CmsPage }) {
  return (
    <>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Field label="Page Title" name="title" defaultValue={page.title} />
        <SelectField label="Status" name="status" defaultValue={page.status} options={["draft", "published"]} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <ImageField label="Featured Image" name="featured_image_url" defaultValue={page.featuredImageUrl ?? ""} folder={`pages/${page.slug}`} />
        <Field label="Meta Title" name="meta_title" defaultValue={page.metaTitle ?? ""} />
        <ImageField label="Meta Image" name="meta_image_url" defaultValue={page.metaImageUrl ?? ""} folder={`pages/${page.slug}/meta`} />
      </div>
      <TextAreaField label="Meta Description" name="meta_description" defaultValue={page.metaDescription ?? ""} rows={3} />
    </>
  );
}

function TourEditor({
  tour,
  slides,
  addSlideHref,
  getRemoveSlideHref,
}: {
  tour: Tour;
  slides: SlideContent[];
  addSlideHref: string;
  getRemoveSlideHref: (index: number) => string;
}) {

  const itineraryDays = [...tour.itineraryDays];
  while (itineraryDays.length < 5) {
    const index = itineraryDays.length + 1;
    itineraryDays.push({ dayLabel: `Day ${index}`, title: "", description: "", activities: [], image: "" });
  }

  const overview = [...tour.overview];
  while (overview.length < 3) overview.push("");

  return (
    <form action={upsertTourAction} className="rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <Field label="Slug" name="slug" defaultValue={tour.slug} />
        <Field label="Title" name="title" defaultValue={tour.title} />
        <SelectField label="Status" name="status" defaultValue={tour.status ?? "published"} options={["draft", "published"]} />
        <Field label="Destination" name="destination" defaultValue={tour.destination} />
        <Field label="Duration" name="duration" defaultValue={tour.duration} />
        <Field label="Pace / Difficulty" name="difficulty" defaultValue={tour.difficulty} />
        <Field label="Minimum Age" name="minimum_age" defaultValue={tour.minAge} />
        <Field label="Group Size" name="group_size" defaultValue={tour.groupSize} />
        <Field label="Starting Price" name="starting_price" defaultValue={tour.startingPrice} />
        <Field label="Location" name="location" defaultValue={tour.location} />
        <ImageField label="Hero Fallback Image" name="hero_image_url" defaultValue={tour.heroImage} folder={`tours/${tour.slug || "new-tour"}/hero`} />
        <Field label="Published At" name="published_at" defaultValue={tour.publishedAt ?? ""} />
      </div>

      <TextAreaField label="Short Description" name="summary" defaultValue={tour.shortDescription} rows={3} />

      <div className="mt-6 rounded-[1.75rem] border border-black/5 bg-white p-5">
        <h3 className="text-xl font-black text-[var(--forest-deep)]">Overview Paragraphs</h3>
        <p className="mt-2 text-sm leading-7 text-neutral-600">These paragraphs map to the top descriptive copy on the landing page.</p>
        <div className="mt-4 grid gap-4">
          {overview.map((paragraph, index) => (
            <TextAreaField key={`${tour.slug}-overview-${index}`} label={`Overview Paragraph ${index + 1}`} name={`overview_${index}`} defaultValue={paragraph} rows={3} />
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-black/5 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-[var(--forest-deep)]">Hero Slides</h3>
            <p className="mt-2 text-sm leading-7 text-neutral-600">These cards map directly to the rotating hero slides on the tour page.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-[var(--forest)]/20 bg-[var(--forest)]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)]">
              {slides.length} slide slots
            </div>
            <Link
              href={addSlideHref}
              className="rounded-full border border-[var(--forest)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-white"
            >
              Add Another Hero Slide
            </Link>
          </div>
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {slides.map((slide, index) => (
            <div key={`${tour.slug}-slide-${index}`} className="rounded-2xl border border-black/5 bg-[var(--sand)]/35 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Slide {index + 1}</div>
                <Link
                  href={getRemoveSlideHref(index)}
                  className="rounded-full border border-red-200 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50"
                >
                  Delete Slide
                </Link>
              </div>
              <ImageField label={`Slide ${index + 1} Image`} name={`slideImage_${index + 1}`} defaultValue={slide.image} folder={`tours/${tour.slug || "new-tour"}/slides`} />
              <div className="mt-3">
                <Field label={`Slide ${index + 1} Title`} name={`slideTitle_${index + 1}`} defaultValue={slide.title} />
              </div>
              <div className="mt-3">
                <TextAreaField label={`Slide ${index + 1} Subtitle`} name={`slideSubtitle_${index + 1}`} defaultValue={slide.subtitle} rows={3} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-black/5 bg-white p-5">
        <h3 className="text-xl font-black text-[var(--forest-deep)]">Itinerary Days</h3>
        <p className="mt-2 text-sm leading-7 text-neutral-600">Each itinerary day renders as its own frontend section with title, description, activities, and image.</p>
        <div className="mt-4 space-y-5">
          {itineraryDays.map((day, index) => (
            <div key={`${tour.slug}-day-${index}`} className="rounded-2xl border border-black/5 bg-[var(--sand)]/35 p-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <Field label="Day Label" name={`dayLabel_${index + 1}`} defaultValue={day.dayLabel} />
                <Field label="Day Title" name={`dayTitle_${index + 1}`} defaultValue={day.title} />
                <ImageField label="Day Image" name={`dayImage_${index + 1}`} defaultValue={day.image} folder={`tours/${tour.slug || "new-tour"}/days`} />
              </div>
              <div className="mt-4">
                <TextAreaField label="Day Description" name={`dayDescription_${index + 1}`} defaultValue={day.description} rows={3} />
              </div>
              <div className="mt-4">
                <TextAreaField label="Activities" name={`dayActivities_${index + 1}`} defaultValue={day.activities.join("\n")} rows={4} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <TextAreaField label="Highlights" name="highlights" defaultValue={tour.highlights.join("\n")} rows={6} />
        <TextAreaField label="Included" name="included" defaultValue={tour.included.join("\n")} rows={6} />
        <TextAreaField label="What to Bring" name="what_to_bring" defaultValue={tour.bring.join("\n")} rows={6} />
        <TextAreaField label="Related Tour Slugs" name="related_tour_slugs" defaultValue={tour.relatedTourSlugs.join("\n")} rows={6} />
      </div>

      <div className="mt-6 rounded-[1.75rem] border border-black/5 bg-white p-5">
        <h3 className="text-xl font-black text-[var(--forest-deep)]">Booking Section</h3>
        <p className="mt-2 text-sm leading-7 text-neutral-600">These fields appear beside the quote form on the live landing page.</p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <Field label="Booking Title" name="booking_title" defaultValue={tour.bookingTitle} />
          <Field label="Meta Title" name="meta_title" defaultValue={tour.metaTitle ?? ""} />
          <TextAreaField label="Booking Description" name="booking_description" defaultValue={tour.bookingDescription} rows={4} />
          <TextAreaField label="Meta Description" name="meta_description" defaultValue={tour.metaDescription ?? ""} rows={4} />
          <ImageField label="Meta Image" name="meta_image_url" defaultValue={tour.metaImageUrl ?? ""} folder={`tours/${tour.slug || "new-tour"}/meta`} />
        </div>
      </div>

      <SaveButton>Save Tour</SaveButton>
    </form>
  );
}

function HeroEditor({
  page,
  label,
  extraFields,
  slides,
  addSlideHref,
  getRemoveSlideHref,
}: {
  page: CmsPage;
  label: string;
  extraFields?: ReactNode;
  slides: SlideContent[];
  addSlideHref: string;
  getRemoveSlideHref: (index: number) => string;
}) {
  return (
    <form action={upsertPageAction} className="rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
      <input type="hidden" name="slug" value={page.slug} />
      <h3 className="text-2xl font-black text-[var(--forest-deep)]">{label}</h3>
      <p className="mt-2 text-sm leading-7 text-neutral-600">Quick hero controls for the live page banner.</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ImageField label="Hero Image" name="heroImage" defaultValue={asString(page.content.heroImage)} folder={`pages/${page.slug}/hero`} />
        <Field label="Hero Title" name="heroTitle" defaultValue={asString(page.content.heroTitle)} />
        <TextAreaField label="Hero Subtitle" name="heroSubtitle" defaultValue={asString(page.content.heroSubtitle)} rows={3} />
        <SelectField label="Status" name="status" defaultValue={page.status} options={["draft", "published"]} />
        <Field label="Page Title" name="title" defaultValue={page.title} />
        <ImageField label="Meta Image" name="meta_image_url" defaultValue={page.metaImageUrl ?? ""} folder={`pages/${page.slug}/meta`} />
      </div>
      <div className="mt-6 rounded-[1.75rem] border border-black/5 bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h4 className="text-xl font-black text-[var(--forest-deep)]">Hero Slides</h4>
            <p className="mt-2 text-sm leading-7 text-neutral-600">Add multiple hero slides for this landing page and save to publish them on the frontend.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full border border-[var(--forest)]/20 bg-[var(--forest)]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)]">
              {slides.length} slide slots
            </div>
            <Link
              href={addSlideHref}
              className="rounded-full border border-[var(--forest)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-white"
            >
              Add Another Hero Slide
            </Link>
          </div>
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {slides.map((slide, index) => (
            <div key={`${page.slug}-hero-slide-${index}`} className="rounded-2xl border border-black/5 bg-[var(--sand)]/35 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Slide {index + 1}</div>
                <Link
                  href={getRemoveSlideHref(index)}
                  className="rounded-full border border-red-200 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50"
                >
                  Delete Slide
                </Link>
              </div>
              <ImageField label={`Slide ${index + 1} Image`} name={`heroSlideImage_${index + 1}`} defaultValue={slide.image} folder={`pages/${page.slug}/slides`} />
              <div className="mt-3">
                <Field label={`Slide ${index + 1} Title`} name={`heroSlideTitle_${index + 1}`} defaultValue={slide.title} />
              </div>
              <div className="mt-3">
                <TextAreaField label={`Slide ${index + 1} Subtitle`} name={`heroSlideSubtitle_${index + 1}`} defaultValue={slide.subtitle} rows={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
      {extraFields ? <div className="mt-4 grid gap-4 lg:grid-cols-2">{extraFields}</div> : null}
      <SaveButton>Save Hero</SaveButton>
    </form>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<{ success?: string; error?: string; tab?: string; tour?: string; page?: string; post?: string; slides?: string; pageSlides?: string; removeSlide?: string; removePageSlide?: string }>;
}) {
  if (!(await isAdminSessionValid())) redirect("/admin/login");

  const params = searchParams ? await searchParams : undefined;
  const activeTab: AdminTab =
    params?.tab === "tours" || params?.tab === "blog" || params?.tab === "submissions" || params?.tab === "landing"
      ? params.tab
      : "landing";
  const activeTourSlug = params?.tour;
  const activePageSlug = params?.page;
  const activePostSlug = params?.post;
  const requestedSlideCount = Number(params?.slides ?? "0");
  const requestedPageSlideCount = Number(params?.pageSlides ?? "0");
  const requestedRemoveSlideIndex = Number(params?.removeSlide ?? "-1");
  const requestedRemovePageSlideIndex = Number(params?.removePageSlide ?? "-1");
  const dashboard = await getAdminDashboardData();
  const homePage = dashboard.pages.find((page) => page.slug === "home");
  const aboutPage = dashboard.pages.find((page) => page.slug === "about");
  const toursPage = dashboard.pages.find((page) => page.slug === "tours");
  const blogPage = dashboard.pages.find((page) => page.slug === "blog");
  const contactPage = dashboard.pages.find((page) => page.slug === "contact");
  const selectedTour = dashboard.tours.find((tour) => tour.slug === activeTourSlug) ?? null;
  const landingPages = [homePage, aboutPage, toursPage, blogPage, contactPage].filter((page): page is CmsPage => Boolean(page));
  const selectedLandingPage = landingPages.find((page) => page.slug === activePageSlug) ?? null;
  const selectedBlogPost = dashboard.blogPosts.find((post) => post.slug === activePostSlug) ?? null;

  function buildEditableSlides(existingSlides: SlideContent[], minimumCount: number, removeIndex: number) {
    const normalized = existingSlides
      .filter((_, index) => index !== removeIndex)
      .map((slide) => ({
        image: asString(slide.image),
        title: asString(slide.title),
        subtitle: asString(slide.subtitle),
      }));

    const nextSlides = [...normalized];
    while (nextSlides.length < minimumCount) nextSlides.push({ image: "", title: "", subtitle: "" });
    return nextSlides;
  }

  const selectedTourSlideCount = Math.max((selectedTour?.heroSlides.length ?? 0) - (requestedRemoveSlideIndex >= 0 ? 1 : 0), requestedSlideCount || 0, 1);
  const newTourSlideCount = Math.max(requestedSlideCount || 0, 1);
  const selectedTourSlides = selectedTour ? buildEditableSlides(selectedTour.heroSlides, selectedTourSlideCount, requestedRemoveSlideIndex) : [];
  const newTourSlides = buildEditableSlides([], newTourSlideCount, -1);
  const selectedPageSlideCount = Math.max(
    (asObjectArray<SlideContent>(selectedLandingPage?.content.heroSlides, []).length || 0) - (requestedRemovePageSlideIndex >= 0 ? 1 : 0),
    requestedPageSlideCount || 0,
    1,
  );
  const selectedPageSlides = selectedLandingPage
    ? buildEditableSlides(asObjectArray<SlideContent>(selectedLandingPage.content.heroSlides, []), selectedPageSlideCount, requestedRemovePageSlideIndex)
    : [];

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

        <section className="rounded-[2rem] bg-[var(--charcoal)] px-6 py-5 shadow-soft">
          <div className="flex flex-wrap gap-3">
            <SectionTab tab="landing" label="Landing Pages" active={activeTab === "landing"} />
            <SectionTab tab="tours" label="Tour Pages" active={activeTab === "tours"} />
            <SectionTab tab="blog" label="Blog" active={activeTab === "blog"} />
            <SectionTab tab="submissions" label="Form Submissions" active={activeTab === "submissions"} />
          </div>
        </section>

        {!dashboard.hasServiceRole ? (
          <div className="rounded-[2rem] border border-yellow-200 bg-yellow-50 p-6 text-sm leading-7 text-yellow-900">
            `SUPABASE_SERVICE_ROLE_KEY` is not configured, so this dashboard is running in fallback mode. Add the service role key to enable CMS writes and submission review.
          </div>
        ) : null}

        {params?.success ? (
          <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6 text-sm leading-7 text-emerald-900">{params.success}</div>
        ) : null}

        {params?.error ? (
          <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-sm leading-7 text-red-900">{params.error}</div>
        ) : null}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Pages", value: dashboard.stats.find((item) => item.label === "Pages")?.value ?? 0 },
            { label: "Tours", value: dashboard.stats.find((item) => item.label === "Tours")?.value ?? 0 },
            { label: "Blog Posts", value: dashboard.stats.find((item) => item.label === "Blog Posts")?.value ?? 0 },
            { label: "Submissions", value: dashboard.stats.find((item) => item.label === "Submissions")?.value ?? 0 },
          ].map((item) => (
            <article key={item.label} className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-soft">
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{item.label}</div>
              <div className="mt-4 text-4xl font-black text-[var(--forest-deep)]">{item.value}</div>
            </article>
          ))}
        </section>

        {activeTab === "landing" ? (
          <>
        <WorkspaceHeader
          eyebrow="Landing Pages"
          title="Edit core page content"
          description="Focus on hero sections, landing-page copy, homepage support blocks, and site settings without unrelated tour or blog forms on screen."
        />

        <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Existing Landing Pages</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Open a specific landing page to edit the exact frontend content for that page.</p>
          <div className="mt-6 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
            {landingPages.map((page) => (
              <Link
                key={`landing-link-${page.slug}`}
                href={`/admin?tab=landing&page=${page.slug}`}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-[var(--sand)]/35 px-5 py-4 transition hover:border-[var(--forest)] hover:bg-[var(--sand)]/60"
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{page.slug}</span>
                  <span className="mt-1 block text-base font-black text-[var(--forest-deep)]">{page.title}</span>
                </span>
                <span className="rounded-full border border-[var(--forest)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)]">
                  Edit this Page
                </span>
              </Link>
            ))}
          </div>
          {activePageSlug ? (
            <div className="mt-6">
              <Link href="/admin?tab=landing" className="rounded-full border border-black/10 px-5 py-3 text-sm font-bold text-[var(--charcoal)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]">
                Back to Landing Pages
              </Link>
            </div>
          ) : null}
        </section>

        <section id="settings-suite" className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Settings Suite</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Grouped public settings for branding, contact, and SEO defaults.</p>
          <div className="mt-8 rounded-[1.75rem] border border-black/5 bg-[var(--sand)]/45 p-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <h3 className="text-2xl font-black text-[var(--forest-deep)]">Admin Access</h3>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  Change the CMS login username and password here instead of updating environment configuration. The current active login source is{" "}
                  <span className="font-bold text-[var(--forest)]">{dashboard.adminAccess.source}</span>.
                </p>
              </div>
              <div className="rounded-full border border-[var(--forest)]/20 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)]">
                Current username: {dashboard.adminAccess.username}
              </div>
            </div>
            <form action={updateAdminCredentialsAction} className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="block text-sm font-semibold text-neutral-700">
                Current Password
                <input name="current_password" type="password" required className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
              </label>
              <Field label="New Username" name="username" defaultValue={dashboard.adminAccess.username} />
              <label className="block text-sm font-semibold text-neutral-700">
                New Password
                <input name="new_password" type="password" required className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
              </label>
              <label className="block text-sm font-semibold text-neutral-700">
                Confirm New Password
                <input name="confirm_password" type="password" required className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3" />
              </label>
              <div className="md:col-span-2 xl:col-span-4">
                <SaveButton>Update Admin Access</SaveButton>
              </div>
            </form>
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {settingsFields.map((field) => (
              <form key={field.key} action={upsertSettingAction} className="rounded-2xl border border-black/5 bg-[var(--sand)]/45 p-5">
                <input type="hidden" name="group_key" value={field.groupKey} />
                <input type="hidden" name="key" value={field.key} />
                <input type="hidden" name="value_type" value={field.type} />
                <input type="hidden" name="is_public" value="true" />
                {field.type === "array" ? (
                  <TextAreaField label={field.label} name="value" defaultValue={field.value} rows={4} />
                ) : isSettingsImageField(field.key) ? (
                  <ImageField label={field.label} name="value" defaultValue={field.value} folder={`settings/${field.key}`} />
                ) : (
                  <Field label={field.label} name="value" defaultValue={field.value} />
                )}
                <SaveButton>Save Setting</SaveButton>
              </form>
            ))}
          </div>
        </section>

        {selectedLandingPage ? (
        <section id="hero-editors" className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Hero Editors</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Quick access to the hero image and headline content for the selected landing page.</p>
          <div className={`mt-8 grid gap-6 ${selectedLandingPage?.slug === "home" ? "xl:grid-cols-1" : "xl:grid-cols-2"}`}>
            {selectedLandingPage.slug === "home" && homePage ? (
              <HeroEditor
                page={homePage}
                label="Home Hero"
                slides={selectedPageSlides}
                addSlideHref={`/admin?tab=landing&page=home&pageSlides=${selectedPageSlideCount + 1}`}
                getRemoveSlideHref={(index) => `/admin?tab=landing&page=home&pageSlides=${Math.max(selectedPageSlideCount - 1, 1)}&removePageSlide=${index}`}
                extraFields={
                  <>
                    <Field label="Intro Eyebrow" name="introEyebrow" defaultValue={asString(homePage.content.introEyebrow)} />
                    <Field label="Intro Title" name="introTitle" defaultValue={asString(homePage.content.introTitle)} />
                    <TextAreaField label="Intro Description" name="introDescription" defaultValue={asString(homePage.content.introDescription)} rows={3} />
                    <ImageField label="Feature Image" name="featureImage" defaultValue={asString(homePage.content.featureImage)} folder="pages/home/feature" />
                    <Field label="Tours Title" name="toursTitle" defaultValue={asString(homePage.content.toursTitle)} />
                  </>
                }
              />
            ) : null}
            {selectedLandingPage.slug === "about" && aboutPage ? (
              <HeroEditor
                page={aboutPage}
                label="About Hero"
                slides={selectedPageSlides}
                addSlideHref={`/admin?tab=landing&page=about&pageSlides=${selectedPageSlideCount + 1}`}
                getRemoveSlideHref={(index) => `/admin?tab=landing&page=about&pageSlides=${Math.max(selectedPageSlideCount - 1, 1)}&removePageSlide=${index}`}
                extraFields={
                  <>
                    <Field label="Story Eyebrow" name="storyEyebrow" defaultValue={asString(aboutPage.content.storyEyebrow)} />
                    <Field label="Story Title" name="storyTitle" defaultValue={asString(aboutPage.content.storyTitle)} />
                    <ImageField label="Story Image" name="storyImage" defaultValue={asString(aboutPage.content.storyImage)} folder="pages/about/story" />
                  </>
                }
              />
            ) : null}
            {selectedLandingPage.slug === "tours" && toursPage ? (
              <HeroEditor
                page={toursPage}
                label="Tours Hero"
                slides={selectedPageSlides}
                addSlideHref={`/admin?tab=landing&page=tours&pageSlides=${selectedPageSlideCount + 1}`}
                getRemoveSlideHref={(index) => `/admin?tab=landing&page=tours&pageSlides=${Math.max(selectedPageSlideCount - 1, 1)}&removePageSlide=${index}`}
                extraFields={
                  <>
                    <Field label="Intro Eyebrow" name="introEyebrow" defaultValue={asString(toursPage.content.introEyebrow)} />
                    <Field label="Intro Title" name="introTitle" defaultValue={asString(toursPage.content.introTitle)} />
                    <TextAreaField label="Intro Description" name="introDescription" defaultValue={asString(toursPage.content.introDescription)} rows={3} />
                  </>
                }
              />
            ) : null}
            {selectedLandingPage.slug === "blog" && blogPage ? (
              <HeroEditor
                page={blogPage}
                label="Blog Hero"
                slides={selectedPageSlides}
                addSlideHref={`/admin?tab=landing&page=blog&pageSlides=${selectedPageSlideCount + 1}`}
                getRemoveSlideHref={(index) => `/admin?tab=landing&page=blog&pageSlides=${Math.max(selectedPageSlideCount - 1, 1)}&removePageSlide=${index}`}
                extraFields={
                  <>
                    <Field label="Intro Eyebrow" name="introEyebrow" defaultValue={asString(blogPage.content.introEyebrow)} />
                    <Field label="Intro Title" name="introTitle" defaultValue={asString(blogPage.content.introTitle)} />
                    <TextAreaField label="Intro Description" name="introDescription" defaultValue={asString(blogPage.content.introDescription)} rows={3} />
                  </>
                }
              />
            ) : null}
            {selectedLandingPage.slug === "contact" && contactPage ? (
              <HeroEditor
                page={contactPage}
                label="Contact Hero"
                slides={selectedPageSlides}
                addSlideHref={`/admin?tab=landing&page=contact&pageSlides=${selectedPageSlideCount + 1}`}
                getRemoveSlideHref={(index) => `/admin?tab=landing&page=contact&pageSlides=${Math.max(selectedPageSlideCount - 1, 1)}&removePageSlide=${index}`}
                extraFields={
                  <>
                    <Field label="Intro Eyebrow" name="introEyebrow" defaultValue={asString(contactPage.content.introEyebrow)} />
                    <Field label="Intro Title" name="introTitle" defaultValue={asString(contactPage.content.introTitle)} />
                    <Field label="Quote Eyebrow" name="quoteEyebrow" defaultValue={asString(contactPage.content.quoteEyebrow)} />
                    <Field label="Quote Title" name="quoteTitle" defaultValue={asString(contactPage.content.quoteTitle)} />
                  </>
                }
              />
            ) : null}
          </div>
        </section>
        ) : null}

        {selectedLandingPage ? (
        <section id="page-editors" className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Frontend Page Editors</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">These forms reflect the sections visitors see on the selected page, rather than generic JSON blobs.</p>

          {selectedLandingPage.slug === "home" && homePage ? (
            <form action={upsertPageAction} className="mt-8 rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
              <input type="hidden" name="slug" value="home" />
              <h3 className="text-2xl font-black text-[var(--forest-deep)]">Home Page</h3>
              <BasePageFields page={homePage} />
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ImageField label="Hero Image" name="heroImage" defaultValue={asString(homePage.content.heroImage)} folder="pages/home/hero" />
                <ImageField label="Feature Image" name="featureImage" defaultValue={asString(homePage.content.featureImage)} folder="pages/home/feature" />
                <Field label="Hero Title" name="heroTitle" defaultValue={asString(homePage.content.heroTitle)} />
                <TextAreaField label="Hero Subtitle" name="heroSubtitle" defaultValue={asString(homePage.content.heroSubtitle)} rows={3} />
                <Field label="Intro Eyebrow" name="introEyebrow" defaultValue={asString(homePage.content.introEyebrow)} />
                <Field label="Intro Title" name="introTitle" defaultValue={asString(homePage.content.introTitle)} />
                <TextAreaField label="Intro Description" name="introDescription" defaultValue={asString(homePage.content.introDescription)} rows={3} />
              </div>
              {asStringArray(homePage.content.introParagraphs, ["", ""]).map((paragraph, index) => (
                <div key={`home-intro-${index}`} className="mt-4">
                  <TextAreaField label={`Intro Paragraph ${index + 1}`} name={`introParagraph_${index}`} defaultValue={paragraph} rows={3} />
                </div>
              ))}
              <div className="mt-6 rounded-2xl border border-black/5 bg-white p-5">
                <h4 className="text-lg font-black text-[var(--forest-deep)]">Why Choose Us Cards</h4>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  {asObjectArray<{ title: string; description: string; icon: string }>(homePage.content.whyChooseUsItems, whyChooseUs).slice(0, 3).map((item, index) => (
                    <div key={`why-item-${index}`} className="rounded-2xl border border-black/5 bg-[var(--sand)]/40 p-4">
                      <Field label="Card Title" name={`whyItemTitle_${index + 1}`} defaultValue={item.title} />
                      <div className="mt-3">
                        <TextAreaField label="Description" name={`whyItemDescription_${index + 1}`} defaultValue={item.description} rows={4} />
                      </div>
                      <div className="mt-3">
                        <Field label="Icon" name={`whyItemIcon_${index + 1}`} defaultValue={item.icon} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <Field label="Why Eyebrow" name="whyEyebrow" defaultValue={asString(homePage.content.whyEyebrow)} />
                <Field label="Why Title" name="whyTitle" defaultValue={asString(homePage.content.whyTitle)} />
                <TextAreaField label="Why Description" name="whyDescription" defaultValue={asString(homePage.content.whyDescription)} rows={3} />
                <Field label="Tours Eyebrow" name="toursEyebrow" defaultValue={asString(homePage.content.toursEyebrow)} />
                <Field label="Tours Title" name="toursTitle" defaultValue={asString(homePage.content.toursTitle)} />
                <TextAreaField label="Tours Description" name="toursDescription" defaultValue={asString(homePage.content.toursDescription)} rows={3} />
                <ImageField label="Quote Image" name="quoteImage" defaultValue={asString(homePage.content.quoteImage)} folder="pages/home/quote" />
                <TextAreaField label="Quote Text" name="quoteText" defaultValue={asString(homePage.content.quoteText)} rows={4} />
                <Field label="Testimonials Eyebrow" name="testimonialsEyebrow" defaultValue={asString(homePage.content.testimonialsEyebrow)} />
                <Field label="Testimonials Title" name="testimonialsTitle" defaultValue={asString(homePage.content.testimonialsTitle)} />
                <TextAreaField label="Testimonials Description" name="testimonialsDescription" defaultValue={asString(homePage.content.testimonialsDescription)} rows={3} />
                <Field label="CTA Eyebrow" name="ctaEyebrow" defaultValue={asString(homePage.content.ctaEyebrow)} />
                <Field label="CTA Title" name="ctaTitle" defaultValue={asString(homePage.content.ctaTitle)} />
                <TextAreaField label="CTA Description" name="ctaDescription" defaultValue={asString(homePage.content.ctaDescription)} rows={3} />
              </div>
              <SaveButton>Save Home Page</SaveButton>
            </form>
          ) : null}

          {selectedLandingPage.slug === "about" && aboutPage ? (
            <form action={upsertPageAction} className="mt-8 rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
              <input type="hidden" name="slug" value="about" />
              <h3 className="text-2xl font-black text-[var(--forest-deep)]">About Page</h3>
              <BasePageFields page={aboutPage} />
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ImageField label="Hero Image" name="heroImage" defaultValue={asString(aboutPage.content.heroImage)} folder="pages/about/hero" />
                <ImageField label="Story Image" name="storyImage" defaultValue={asString(aboutPage.content.storyImage)} folder="pages/about/story" />
                <Field label="Hero Title" name="heroTitle" defaultValue={asString(aboutPage.content.heroTitle)} />
                <TextAreaField label="Hero Subtitle" name="heroSubtitle" defaultValue={asString(aboutPage.content.heroSubtitle)} rows={3} />
                <Field label="Story Eyebrow" name="storyEyebrow" defaultValue={asString(aboutPage.content.storyEyebrow)} />
                <Field label="Story Title" name="storyTitle" defaultValue={asString(aboutPage.content.storyTitle)} />
              </div>
              {asStringArray(aboutPage.content.storyParagraphs, aboutStory).map((paragraph, index) => (
                <div key={`about-story-${index}`} className="mt-4">
                  <TextAreaField label={`Story Paragraph ${index + 1}`} name={`storyParagraph_${index}`} defaultValue={paragraph} rows={3} />
                </div>
              ))}
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Field label="Mission Eyebrow" name="missionEyebrow" defaultValue={asString(aboutPage.content.missionEyebrow)} />
                <TextAreaField label="Mission Quote" name="missionQuote" defaultValue={asString(aboutPage.content.missionQuote)} rows={3} />
                <Field label="Values Eyebrow" name="valuesEyebrow" defaultValue={asString(aboutPage.content.valuesEyebrow)} />
                <Field label="Values Title" name="valuesTitle" defaultValue={asString(aboutPage.content.valuesTitle)} />
                <Field label="CTA Title" name="ctaTitle" defaultValue={asString(aboutPage.content.ctaTitle)} />
              </div>
              <SaveButton>Save About Page</SaveButton>
            </form>
          ) : null}

          {selectedLandingPage.slug === "tours" && toursPage ? (
            <form action={upsertPageAction} className="mt-8 rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
              <input type="hidden" name="slug" value="tours" />
              <h3 className="text-2xl font-black text-[var(--forest-deep)]">Tours Index Page</h3>
              <BasePageFields page={toursPage} />
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ImageField label="Hero Image" name="heroImage" defaultValue={asString(toursPage.content.heroImage)} folder="pages/tours/hero" />
                <Field label="Hero Title" name="heroTitle" defaultValue={asString(toursPage.content.heroTitle)} />
                <TextAreaField label="Hero Subtitle" name="heroSubtitle" defaultValue={asString(toursPage.content.heroSubtitle)} rows={3} />
                <Field label="Intro Eyebrow" name="introEyebrow" defaultValue={asString(toursPage.content.introEyebrow)} />
                <Field label="Intro Title" name="introTitle" defaultValue={asString(toursPage.content.introTitle)} />
                <TextAreaField label="Intro Description" name="introDescription" defaultValue={asString(toursPage.content.introDescription)} rows={4} />
              </div>
              <SaveButton>Save Tours Page</SaveButton>
            </form>
          ) : null}

          {selectedLandingPage.slug === "blog" && blogPage ? (
            <form action={upsertPageAction} className="mt-8 rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
              <input type="hidden" name="slug" value="blog" />
              <h3 className="text-2xl font-black text-[var(--forest-deep)]">Blog Index Page</h3>
              <BasePageFields page={blogPage} />
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ImageField label="Hero Image" name="heroImage" defaultValue={asString(blogPage.content.heroImage)} folder="pages/blog/hero" />
                <Field label="Hero Title" name="heroTitle" defaultValue={asString(blogPage.content.heroTitle)} />
                <TextAreaField label="Hero Subtitle" name="heroSubtitle" defaultValue={asString(blogPage.content.heroSubtitle)} rows={3} />
                <Field label="Intro Eyebrow" name="introEyebrow" defaultValue={asString(blogPage.content.introEyebrow)} />
                <Field label="Intro Title" name="introTitle" defaultValue={asString(blogPage.content.introTitle)} />
                <TextAreaField label="Intro Description" name="introDescription" defaultValue={asString(blogPage.content.introDescription)} rows={4} />
              </div>
              <SaveButton>Save Blog Page</SaveButton>
            </form>
          ) : null}

          {selectedLandingPage.slug === "contact" && contactPage ? (
            <form action={upsertPageAction} className="mt-8 rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
              <input type="hidden" name="slug" value="contact" />
              <h3 className="text-2xl font-black text-[var(--forest-deep)]">Contact Page</h3>
              <BasePageFields page={contactPage} />
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <ImageField label="Hero Image" name="heroImage" defaultValue={asString(contactPage.content.heroImage)} folder="pages/contact/hero" />
                <Field label="Hero Title" name="heroTitle" defaultValue={asString(contactPage.content.heroTitle)} />
                <TextAreaField label="Hero Subtitle" name="heroSubtitle" defaultValue={asString(contactPage.content.heroSubtitle)} rows={3} />
                <Field label="Intro Eyebrow" name="introEyebrow" defaultValue={asString(contactPage.content.introEyebrow)} />
                <Field label="Intro Title" name="introTitle" defaultValue={asString(contactPage.content.introTitle)} />
                <Field label="Quote Eyebrow" name="quoteEyebrow" defaultValue={asString(contactPage.content.quoteEyebrow)} />
                <Field label="Quote Title" name="quoteTitle" defaultValue={asString(contactPage.content.quoteTitle)} />
              </div>
              <SaveButton>Save Contact Page</SaveButton>
            </form>
          ) : null}
        </section>
        ) : null}
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-3xl font-black text-[var(--forest-deep)]">Testimonials</h2>
            <p className="mt-2 text-sm leading-7 text-neutral-600">These records map directly to the testimonial cards on the homepage.</p>
            <form action={upsertTestimonialAction} className="mt-6 rounded-2xl border border-dashed border-[var(--forest)]/25 bg-[var(--sand)]/35 p-5">
              <div className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--orange)]">Add Testimonial</div>
              <input type="hidden" name="order_column" value={String(dashboard.testimonials.length)} />
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <Field label="Name" name="name" defaultValue="" />
                <Field label="Subtitle" name="title" defaultValue="" />
                <ImageField label="Profile Picture" name="photo_url" defaultValue="" folder="testimonials" />
              </div>
              <div className="mt-4">
                <TextAreaField label="Quote" name="quote" defaultValue="" rows={4} />
              </div>
              <SaveButton>Add Testimonial</SaveButton>
            </form>
            <div className="mt-8 space-y-6">
              {dashboard.testimonials.map((testimonial, index) => (
                <form key={testimonial.id ?? testimonial.name} action={upsertTestimonialAction} className="rounded-2xl border border-black/5 bg-[var(--sand)]/45 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Testimonial {index + 1}</div>
                    {testimonial.id ? (
                      <button
                        type="submit"
                        formAction={deleteTestimonialAction}
                        className="rounded-full border border-red-200 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    ) : null}
                  </div>
                  {testimonial.id ? <input type="hidden" name="id" value={testimonial.id} /> : null}
                  <input type="hidden" name="order_column" value={String(index)} />
                  <div className="mt-4 grid gap-4 lg:grid-cols-[180px_1fr]">
                    <div className="space-y-3">
                      <ImageField label="Profile Picture" name="photo_url" defaultValue={testimonial.image ?? ""} folder="testimonials" />
                      {testimonial.image ? (
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-black/5">
                          <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                        </div>
                      ) : null}
                    </div>
                    <div className="space-y-3">
                      <Field label="Name" name="name" defaultValue={testimonial.name} />
                      <Field label="Subtitle" name="title" defaultValue={testimonial.title} />
                      <TextAreaField label="Quote" name="quote" defaultValue={testimonial.quote} rows={5} />
                    </div>
                  </div>
                  <SaveButton>Save Testimonial</SaveButton>
                </form>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
            <h2 className="text-3xl font-black text-[var(--forest-deep)]">Company Values</h2>
            <p className="mt-2 text-sm leading-7 text-neutral-600">These records map directly to the value cards on the About page.</p>
            <div className="mt-8 space-y-6">
              {dashboard.companyValues.map((value, index) => (
                <form key={value.id ?? value.title} action={upsertCompanyValueAction} className="rounded-2xl border border-black/5 bg-[var(--sand)]/45 p-5">
                  {value.id ? <input type="hidden" name="id" value={value.id} /> : null}
                  <input type="hidden" name="order_column" value={String(index)} />
                  <Field label="Title" name="title" defaultValue={value.title} />
                  <div className="mt-3">
                    <TextAreaField label="Description" name="description" defaultValue={value.description} rows={4} />
                  </div>
                  <div className="mt-3">
                    <Field label="Icon" name="icon" defaultValue={value.icon} />
                  </div>
                  <SaveButton>Save Value</SaveButton>
                </form>
              ))}
            </div>
          </div>
        </section>
          </>
        ) : null}

        {activeTab === "tours" ? (
          <>
        <WorkspaceHeader
          eyebrow="Tour Pages"
          title="Manage destination tours"
          description="Open the current tours, edit each live itinerary, or start a new tour entry from one focused workspace."
        />

        <section id="tour-management" className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Destination Tour Editors</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">
            Choose one of the existing tours to make changes, or start a new itinerary with the dedicated action button.
          </p>
          <div className="mt-6">
            <Link
              href="#existing-tours"
              className="inline-flex items-center gap-3 rounded-[1.5rem] border border-black/5 bg-[var(--sand)]/45 px-5 py-4 text-left transition hover:border-[var(--forest)]/30 hover:bg-[var(--sand)]/75"
            >
              <span className="text-3xl font-black text-[var(--forest-deep)]">{dashboard.tours.length}</span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">Current Tours</span>
                <span className="block text-sm font-semibold text-neutral-600">Open the existing five tours and jump to the editor you need.</span>
              </span>
            </Link>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-black/5 bg-[var(--sand)]/35 p-6">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3 className="text-2xl font-black text-[var(--forest-deep)]">Existing 5 Tour Pages</h3>
                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  Click any tour below to open its existing frontend page in the CMS editor immediately.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {dashboard.tours.map((tour) => (
                <Link
                  key={`edit-link-${tour.slug}`}
                  href={`/admin?tab=tours&tour=${tour.slug}`}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-white px-5 py-4 transition hover:border-[var(--forest)] hover:bg-[var(--sand)]/35"
                >
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{tour.destination}</span>
                    <span className="mt-1 block text-base font-black text-[var(--forest-deep)]">{tour.title}</span>
                  </span>
                  <span className="rounded-full border border-[var(--forest)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)]">
                    Edit this Tour
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/admin?tab=tours&tour=new" className="rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest-deep)]">
              Add a Tour
            </Link>
            {activeTourSlug ? (
              <Link href="/admin?tab=tours" className="rounded-full border border-black/10 px-5 py-3 text-sm font-bold text-[var(--charcoal)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]">
                Back to Tour List
              </Link>
            ) : null}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-black text-[var(--forest-deep)]">Tour Cards</h3>
              <p className="mt-2 text-sm leading-7 text-neutral-600">These cards mirror the tours currently represented on the frontend and also open the editor.</p>
            </div>
          </div>

          <div id="existing-tours" className="mt-6 grid gap-5 xl:grid-cols-2">
            {dashboard.tours.map((tour) => (
              <article key={tour.slug} className="rounded-[1.75rem] border border-black/5 bg-[var(--sand)]/45 p-6 shadow-sm">
                <div className="flex h-full flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{tour.destination}</div>
                    <h3 className="mt-2 text-2xl font-black text-[var(--forest-deep)]">{tour.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-neutral-600">{tour.shortDescription}</p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500">
                      <span>{tour.duration}</span>
                      <span>{tour.status ?? "published"}</span>
                    </div>
                  </div>
                  <Link href={`/admin?tab=tours&tour=${tour.slug}`} className="mt-auto rounded-full border border-[var(--forest)] px-5 py-3 text-sm font-bold text-[var(--forest)] transition hover:bg-[var(--forest)] hover:text-white">
                    Edit this Tour
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {activeTourSlug === "new" ? (
            <div className="mt-10 rounded-[1.75rem] border border-black/5 bg-[var(--sand)]/35 p-6">
              <h3 className="text-2xl font-black text-[var(--forest-deep)]">Create New Tour</h3>
              <p className="mt-2 text-sm leading-7 text-neutral-600">Start a new destination tour entry, then save it to add it to the editable list.</p>
              <div className="mt-4">
              <TourEditor
                slides={newTourSlides}
                addSlideHref={`/admin?tab=tours&tour=new&slides=${newTourSlideCount + 1}`}
                getRemoveSlideHref={(index) => `/admin?tab=tours&tour=new&slides=${Math.max(newTourSlideCount - 1, 1)}&removeSlide=${index}`}
                tour={{
                  slug: "",
                  title: "",
                  destination: "",
                  shortDescription: "",
                  duration: "",
                  difficulty: "",
                  minAge: "",
                  groupSize: "",
                  startingPrice: "",
                  location: "",
                  heroImage: "",
                  heroSlides: [],
                  highlights: [],
                  included: [],
                  bring: [],
                  overview: [],
                  itineraryDays: [],
                  bookingTitle: "",
                  bookingDescription: "",
                  relatedTourSlugs: [],
                  status: "draft",
                  metaTitle: "",
                  metaDescription: "",
                  metaImageUrl: "",
                  publishedAt: "",
                }}
              />
              </div>
            </div>
          ) : null}

          {selectedTour ? (
            <div className="mt-10 rounded-[1.75rem] border border-black/5 bg-[var(--sand)]/35 p-6">
              <h3 className="text-2xl font-black text-[var(--forest-deep)]">Editing: {selectedTour.title}</h3>
              <p className="mt-2 text-sm leading-7 text-neutral-600">This form maps directly to the live landing page: hero slides, overview, itinerary days, booking copy, and SEO.</p>
              <div className="mt-4">
                <TourEditor
                  tour={selectedTour}
                  slides={selectedTourSlides}
                  addSlideHref={`/admin?tab=tours&tour=${selectedTour.slug}&slides=${selectedTourSlideCount + 1}`}
                  getRemoveSlideHref={(index) => `/admin?tab=tours&tour=${selectedTour.slug}&slides=${Math.max(selectedTourSlideCount - 1, 1)}&removeSlide=${index}`}
                />
              </div>
            </div>
          ) : null}
        </section>
          </>
        ) : null}

        {activeTab === "blog" ? (
          <>
        <WorkspaceHeader
          eyebrow="Blog"
          title="Manage journal content"
          description="Create and update blog posts in a dedicated writing workspace with blog landing-page controls and article editing together."
        />

        <section id="blog-management" className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Blog Posts</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Open an existing post to edit it, or start a new post from a dedicated creation action.</p>
          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            {dashboard.blogPosts.map((post) => (
              <Link
                key={`blog-link-${post.slug}`}
                href={`/admin?tab=blog&post=${post.slug}`}
                className="flex items-center justify-between rounded-2xl border border-black/5 bg-[var(--sand)]/35 px-5 py-4 transition hover:border-[var(--forest)] hover:bg-[var(--sand)]/60"
              >
                <span>
                  <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[var(--orange)]">{post.category}</span>
                  <span className="mt-1 block text-base font-black text-[var(--forest-deep)]">{post.title}</span>
                </span>
                <span className="rounded-full border border-[var(--forest)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[var(--forest)]">
                  Edit this Post
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/admin?tab=blog&post=new" className="rounded-full bg-[var(--forest)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--forest-deep)]">
              Add a Blog Post
            </Link>
            {activePostSlug ? (
              <Link href="/admin?tab=blog" className="rounded-full border border-black/10 px-5 py-3 text-sm font-bold text-[var(--charcoal)] transition hover:border-[var(--forest)] hover:text-[var(--forest)]">
                Back to Blog List
              </Link>
            ) : null}
          </div>
          {activePostSlug === "new" ? (
          <form action={upsertBlogPostAction} className="mt-8 rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
            <h3 className="text-2xl font-black text-[var(--forest-deep)]">Add New Blog Post</h3>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              <Field label="Slug" name="slug" defaultValue="" />
              <Field label="Title" name="title" defaultValue="" />
              <SelectField label="Status" name="status" defaultValue="draft" options={["draft", "published"]} />
              <Field label="Category" name="category" defaultValue="" />
              <ImageField label="Featured Image" name="featured_image_url" defaultValue="" folder="blog/featured" />
              <Field label="Published At" name="published_at" defaultValue="" />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <TextAreaField label="Excerpt" name="excerpt" defaultValue="" rows={3} />
              <TextAreaField label="Meta Description" name="meta_description" defaultValue="" rows={3} />
              <Field label="Meta Title" name="meta_title" defaultValue="" />
              <ImageField label="Meta Image" name="meta_image_url" defaultValue="" folder="blog/meta" />
            </div>
            <div className="mt-4">
              <TextAreaField
                label="Content JSON"
                name="content"
                defaultValue={prettyJson({ paragraphs: [], heroImage: "", ctaLabel: "", ctaHref: "" })}
                rows={10}
                mono
              />
            </div>
            <SaveButton>Create Blog Post</SaveButton>
          </form>
          ) : null}
          {selectedBlogPost ? (
              <form key={selectedBlogPost.slug} action={upsertBlogPostAction} className="mt-8 rounded-[2rem] border border-black/5 bg-[var(--sand)]/45 p-6">
                <h3 className="text-2xl font-black text-[var(--forest-deep)]">Editing: {selectedBlogPost.title}</h3>
                <div className="grid gap-4 lg:grid-cols-3">
                  <Field label="Slug" name="slug" defaultValue={selectedBlogPost.slug} />
                  <Field label="Title" name="title" defaultValue={selectedBlogPost.title} />
                  <SelectField label="Status" name="status" defaultValue={selectedBlogPost.status ?? "published"} options={["draft", "published"]} />
                  <Field label="Category" name="category" defaultValue={selectedBlogPost.category} />
                  <ImageField label="Featured Image" name="featured_image_url" defaultValue={selectedBlogPost.image} folder={`blog/${selectedBlogPost.slug}/featured`} />
                  <Field label="Published At" name="published_at" defaultValue={selectedBlogPost.publishedAt ?? ""} />
                </div>
                <div className="mt-4">
                  <TextAreaField label="Excerpt" name="excerpt" defaultValue={selectedBlogPost.excerpt} rows={3} />
                </div>
                <div className="mt-4">
                  <TextAreaField label="Content JSON" name="content" defaultValue={prettyJson(selectedBlogPost.content ?? {})} rows={10} mono />
                </div>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  <Field label="Meta Title" name="meta_title" defaultValue={selectedBlogPost.metaTitle ?? ""} />
                  <ImageField label="Meta Image" name="meta_image_url" defaultValue={selectedBlogPost.metaImageUrl ?? ""} folder={`blog/${selectedBlogPost.slug}/meta`} />
                </div>
                <div className="mt-4">
                  <TextAreaField label="Meta Description" name="meta_description" defaultValue={selectedBlogPost.metaDescription ?? ""} rows={3} />
                </div>
                <SaveButton>Save Post</SaveButton>
              </form>
          ) : null}
        </section>
          </>
        ) : null}

        {activeTab === "submissions" ? (
          <>
        <WorkspaceHeader
          eyebrow="Form Submissions"
          title="Review inquiries and quote requests"
          description="Monitor recent contact and quote submissions in one clean area without page-management forms around them."
        />

        <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-soft">
          <h2 className="text-3xl font-black text-[var(--forest-deep)]">Recent Submissions</h2>
          <p className="mt-2 text-sm leading-7 text-neutral-600">Contact inquiries and quote requests persist in Supabase through server routes.</p>
          <div className="mt-8 space-y-4">
            {dashboard.submissions.length ? (
              dashboard.submissions.map((submission) => (
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
                      <SelectField label="Status" name="status" defaultValue={submission.status} options={["new", "in_progress", "closed"]} />
                      <SaveButton>Update</SaveButton>
                    </form>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-black/10 bg-[var(--sand)]/35 p-6 text-sm leading-7 text-neutral-600">
                No stored submissions yet.
              </div>
            )}
          </div>
        </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
