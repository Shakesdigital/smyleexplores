import {
  aboutStory,
  blogPosts as fallbackBlogPosts,
  featuredTours as fallbackFeaturedTours,
  homeQuote,
  navigation as fallbackNavigation,
  siteSettings as fallbackSiteSettings,
  teamMembers as fallbackTeamMembers,
  testimonials as fallbackTestimonials,
  tours as fallbackTours,
  valueItems as fallbackValueItems,
  whyChooseUs,
} from "@/lib/content";
import { createSupabaseServerClient, createSupabaseServiceRoleClient } from "@/lib/supabase";
import {
  AdminAccessSummary,
  BlogPost,
  CmsPage,
  NavItem,
  SiteSettings,
  SubmissionRecord,
  TeamMember,
  Testimonial,
  Tour,
  TourHeroSlide,
  TourItineraryDay,
  ValueItem,
} from "@/lib/types";

type SettingRow = {
  group_key: string;
  key: string;
  value: unknown;
  is_public: boolean;
};

type PageRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  status: string;
  content: Record<string, unknown> | null;
  featured_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_image_url: string | null;
  published_at: string | null;
};

type TourRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: unknown;
  duration: string;
  difficulty: string;
  minimum_age: string;
  group_size: string | null;
  starting_price: string;
  location: string;
  destination: string | null;
  hero_image_url: string | null;
  hero_slides: unknown;
  highlights: unknown;
  itinerary_days: unknown;
  included: unknown;
  what_to_bring: unknown;
  booking_title: string | null;
  booking_description: string | null;
  cta_label: string | null;
  cta_href: string | null;
  related_tour_slugs: unknown;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_image_url: string | null;
  published_at: string | null;
};

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: Record<string, unknown> | null;
  category: string | null;
  featured_image_url: string | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  meta_image_url: string | null;
  published_at: string | null;
};

type TestimonialRow = {
  id: string;
  name: string;
  title: string | null;
  quote: string;
  photo_url: string | null;
};

type TeamMemberRow = {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url: string | null;
};

type ValueRow = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
};

type NavigationRow = {
  label: string;
  href: string;
};

type ContactSubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

type QuoteRequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  guests: string;
  preferred_tour: string | null;
  special_requests: string | null;
  status: string;
  created_at: string;
};

const TOUR_SELECT =
  "id,slug,title,summary,description,duration,difficulty,minimum_age,group_size,starting_price,location,destination,hero_image_url,hero_slides,highlights,itinerary_days,included,what_to_bring,booking_title,booking_description,cta_label,cta_href,related_tour_slugs,status,meta_title,meta_description,meta_image_url,published_at";

const LEGACY_TOUR_SELECT =
  "id,slug,title,summary,description,duration,difficulty,minimum_age,group_size,starting_price,location,hero_image_url,highlights,included,what_to_bring,status,meta_title,meta_description,meta_image_url,published_at";

function asString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function asObjectArray<T extends Record<string, unknown>>(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is T => Boolean(item) && typeof item === "object" && !Array.isArray(item));
}

function formatDisplayDate(value: string | null | undefined) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function mapSettings(rows: SettingRow[]): SiteSettings {
  const settings: SiteSettings = {
    ...fallbackSiteSettings,
    officeHours: [...fallbackSiteSettings.officeHours],
    socialLinks: { ...fallbackSiteSettings.socialLinks },
    branding: {
      logo: "/images/logo-edited.png",
      primaryColor: "#D56017",
      secondaryColor: "#12372A",
    },
    seo: {
      defaultTitle: `${fallbackSiteSettings.siteName} | ${fallbackSiteSettings.tagline}`,
      defaultDescription: fallbackSiteSettings.mission,
      defaultImage: "/images/logo-edited.png",
    },
  };

  for (const row of rows) {
    switch (row.key) {
      case "site_name":
        settings.siteName = asString(row.value, settings.siteName);
        break;
      case "tagline":
        settings.tagline = asString(row.value, settings.tagline);
        break;
      case "mission":
        settings.mission = asString(row.value, settings.mission);
        break;
      case "email":
        settings.email = asString(row.value, settings.email);
        break;
      case "phone":
        settings.phone = asString(row.value, settings.phone);
        break;
      case "whatsapp_url":
        settings.whatsappUrl = asString(row.value, settings.whatsappUrl);
        settings.socialLinks.whatsapp = settings.whatsappUrl;
        break;
      case "address":
        settings.address = asString(row.value, settings.address);
        break;
      case "office_hours":
        settings.officeHours = asStringArray(row.value, settings.officeHours);
        break;
      case "instagram_url":
        settings.socialLinks.instagram = asString(row.value, settings.socialLinks.instagram);
        break;
      case "facebook_url":
        settings.socialLinks.facebook = asString(row.value, settings.socialLinks.facebook);
        break;
      case "logo_url":
        settings.branding.logo = asString(row.value, settings.branding.logo);
        break;
      case "primary_color":
        settings.branding.primaryColor = asString(row.value, settings.branding.primaryColor);
        break;
      case "secondary_color":
        settings.branding.secondaryColor = asString(row.value, settings.branding.secondaryColor);
        break;
      case "seo_default_title":
        settings.seo.defaultTitle = asString(row.value, settings.seo.defaultTitle);
        break;
      case "seo_default_description":
        settings.seo.defaultDescription = asString(row.value, settings.seo.defaultDescription);
        break;
      case "seo_default_image":
        settings.seo.defaultImage = asString(row.value, settings.seo.defaultImage);
        break;
      default:
        break;
    }
  }

  return settings;
}

function mapTourHeroSlides(value: unknown, fallback: TourHeroSlide[]) {
  const slides = asObjectArray<Record<string, unknown>>(value)
    .map((item) => ({
      image: asString(item.image),
      title: asString(item.title),
      subtitle: asString(item.subtitle),
    }))
    .filter((item) => item.image && item.title);

  return slides.length ? slides : fallback;
}

function mapTourItineraryDays(value: unknown, fallback: TourItineraryDay[]) {
  const days = asObjectArray<Record<string, unknown>>(value)
    .map((item) => ({
      dayLabel: asString(item.dayLabel),
      title: asString(item.title),
      description: asString(item.description),
      activities: asStringArray(item.activities),
      image: asString(item.image),
    }))
    .filter((item) => item.dayLabel && item.title);

  return days.length ? days : fallback;
}

function getTourDescriptionObject(value: unknown) {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function mapTourOverview(value: unknown, fallback: string[]) {
  const descriptionObject = getTourDescriptionObject(value);
  if (descriptionObject) {
    return asStringArray(descriptionObject.overview, fallback);
  }

  return asStringArray(value, fallback);
}

function mapLegacyTourCardCta(value: unknown) {
  const descriptionObject = getTourDescriptionObject(value);
  if (!descriptionObject) return null;

  const cardCta = asObject(descriptionObject.cardCta);
  const label = asString(cardCta.label);
  const href = asString(cardCta.href);

  return label || href ? { label, href } : null;
}

function mapTour(row: TourRow): Tour {
  const fallbackTour = fallbackTours.find((item) => item.slug === row.slug);
  const legacyCardCta = mapLegacyTourCardCta(row.description);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    destination: asString(row.destination, fallbackTour?.destination ?? "Uganda"),
    shortDescription: row.summary ?? fallbackTour?.shortDescription ?? "",
    duration: row.duration,
    difficulty: row.difficulty,
    minAge: row.minimum_age,
    groupSize: row.group_size ?? fallbackTour?.groupSize ?? "",
    startingPrice: row.starting_price,
    location: row.location,
    heroImage: row.hero_image_url ?? fallbackTour?.heroImage ?? "/images/home-hero-rafting.jpeg",
    heroSlides: mapTourHeroSlides(row.hero_slides, fallbackTour?.heroSlides ?? []),
    highlights: asStringArray(row.highlights, fallbackTour?.highlights ?? []),
    included: asStringArray(row.included, fallbackTour?.included ?? []),
    bring: asStringArray(row.what_to_bring, fallbackTour?.bring ?? []),
    overview: mapTourOverview(row.description, fallbackTour?.overview ?? []),
    itineraryDays: mapTourItineraryDays(row.itinerary_days, fallbackTour?.itineraryDays ?? []),
    bookingTitle: asString(row.booking_title, fallbackTour?.bookingTitle ?? "Request a Quote"),
    bookingDescription: asString(
      row.booking_description,
      fallbackTour?.bookingDescription ?? "Share your dates, group size, and any special travel needs.",
    ),
    ctaLabel: asString(row.cta_label, legacyCardCta?.label || fallbackTour?.ctaLabel || "View Itinerary"),
    ctaHref: asString(row.cta_href, legacyCardCta?.href || fallbackTour?.ctaHref || `/tours/${row.slug}`),
    relatedTourSlugs: asStringArray(row.related_tour_slugs, fallbackTour?.relatedTourSlugs ?? []),
    status: row.status,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    metaImageUrl: row.meta_image_url,
    publishedAt: row.published_at,
  };
}

function mergeToursWithFallback(rows: TourRow[]) {
  const mappedTours = rows.map(mapTour);
  const mappedBySlug = new Map(mappedTours.map((tour) => [tour.slug, tour]));

  const merged = [
    ...mappedTours,
    ...fallbackTours.filter((tour) => !mappedBySlug.has(tour.slug)),
  ];

  return merged;
}

async function fetchPublishedTourRows(client: NonNullable<ReturnType<typeof createSupabaseServerClient>>) {
  const result = await client.from("tours").select(TOUR_SELECT).eq("status", "published").order("published_at", { ascending: false });
  if (!result.error) {
    return (result.data ?? []) as TourRow[];
  }

  const legacy = await client.from("tours").select(LEGACY_TOUR_SELECT).eq("status", "published").order("published_at", { ascending: false });
  return (legacy.data ?? []) as TourRow[];
}

async function fetchAdminTourRows(client: NonNullable<ReturnType<typeof createSupabaseServiceRoleClient>>) {
  const result = await client.from("tours").select(TOUR_SELECT).order("title", { ascending: true });
  if (!result.error) {
    return (result.data ?? []) as TourRow[];
  }

  const legacy = await client.from("tours").select(LEGACY_TOUR_SELECT).order("title", { ascending: true });
  return (legacy.data ?? []) as TourRow[];
}

function mapBlogPost(row: BlogRow): BlogPost {
  const fallbackPost = fallbackBlogPosts.find((item) => item.slug === row.slug);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: formatDisplayDate(row.published_at) || fallbackPost?.date || "",
    excerpt: row.excerpt ?? fallbackPost?.excerpt ?? "",
    category: row.category ?? fallbackPost?.category ?? "General",
    image: row.featured_image_url ?? fallbackPost?.image ?? "/images/blog-top-5-jinja.jpeg",
    status: row.status,
    content: row.content ?? fallbackPost?.content ?? {},
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    metaImageUrl: row.meta_image_url,
    publishedAt: row.published_at,
  };
}

function mergeBlogPostsWithFallback(rows: BlogRow[]) {
  const mappedPosts = rows.map(mapBlogPost);
  const mappedBySlug = new Map(mappedPosts.map((post) => [post.slug, post]));

  return [
    ...mappedPosts,
    ...fallbackBlogPosts.filter((post) => !mappedBySlug.has(post.slug)),
  ];
}

function mapPage(row: PageRow): CmsPage {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    status: row.status,
    content: row.content ?? {},
    featuredImageUrl: row.featured_image_url,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    metaImageUrl: row.meta_image_url,
    publishedAt: row.published_at,
  };
}

export async function getSiteSettings() {
  const client = createSupabaseServerClient();
  if (!client) return mapSettings([]);

  const { data } = await client.from("settings").select("group_key,key,value,is_public").eq("is_public", true);
  return mapSettings((data ?? []) as SettingRow[]);
}

export async function getNavigation(): Promise<NavItem[]> {
  const client = createSupabaseServerClient();
  if (!client) return fallbackNavigation;

  const { data } = await client
    .from("navigation_items")
    .select("label,href")
    .eq("status", "published")
    .order("order_column", { ascending: true });

  if (!data?.length) return fallbackNavigation;
  return data as NavigationRow[];
}

export async function getPageContent<T extends Record<string, unknown>>(slug: string, fallbackContent: T) {
  const client = createSupabaseServerClient();
  if (!client) {
    return { page: null as CmsPage | null, content: fallbackContent };
  }

  const { data } = await client
    .from("pages")
    .select("id,slug,title,excerpt,status,content,featured_image_url,meta_title,meta_description,meta_image_url,published_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!data) {
    return { page: null as CmsPage | null, content: fallbackContent };
  }

  const page = mapPage(data as PageRow);
  return {
    page,
    content: {
      ...fallbackContent,
      ...asObject(page.content),
    } as T,
  };
}

export async function getTours() {
  const client = createSupabaseServerClient();
  if (!client) return fallbackTours;

  const rows = await fetchPublishedTourRows(client);
  if (!rows.length) return fallbackTours;
  return mergeToursWithFallback(rows);
}

export async function getTourBySlug(slug: string) {
  const tours = await getTours();
  return tours.find((tour) => tour.slug === slug) ?? null;
}

export async function getFeaturedTours() {
  const tours = await getTours();
  return tours.slice(0, 6);
}

export async function getBlogPosts() {
  const client = createSupabaseServerClient();
  if (!client) return fallbackBlogPosts;

  const { data } = await client
    .from("blog_posts")
    .select("id,slug,title,excerpt,content,category,featured_image_url,status,meta_title,meta_description,meta_image_url,published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (!data?.length) return fallbackBlogPosts;
  return mergeBlogPostsWithFallback(data as BlogRow[]);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const client = createSupabaseServerClient();
  if (!client) return fallbackTestimonials;

  const { data } = await client.from("testimonials").select("id,name,title,quote,photo_url").order("order_column", { ascending: true });
  if (!data?.length) return fallbackTestimonials;

  return (data as TestimonialRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    title: row.title ?? "",
    quote: row.quote,
    image: row.photo_url ?? "",
  }));
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const client = createSupabaseServerClient();
  if (!client) return fallbackTeamMembers;

  const { data } = await client
    .from("team_members")
    .select("id,name,role,bio,photo_url")
    .order("order_column", { ascending: true });

  if (!data?.length) return fallbackTeamMembers;

  return (data as TeamMemberRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio ?? "",
    image: row.photo_url ?? "/images/about-story-gogolo.jpeg",
  }));
}

export async function getCompanyValues(): Promise<ValueItem[]> {
  const client = createSupabaseServerClient();
  if (!client) return fallbackValueItems;

  const { data } = await client.from("company_values").select("id,title,description,icon").order("order_column", { ascending: true });
  if (!data?.length) return fallbackValueItems;

  return (data as ValueRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description ?? "",
    icon: row.icon ?? "spark",
  }));
}

export function getStaticFallbackContent() {
  return {
    aboutStory,
    homeQuote,
    whyChooseUs,
  };
}

export async function getAdminDashboardData() {
  const client = createSupabaseServiceRoleClient();
  const settings = await getSiteSettings();
  const navigation = await getNavigation();
  const publicTours = await getTours();
  const publicBlogPosts = await getBlogPosts();

  if (!client) {
    return {
      settings,
      navigation,
      pages: [] as CmsPage[],
      tours: publicTours,
      blogPosts: publicBlogPosts,
      testimonials: fallbackTestimonials,
      companyValues: fallbackValueItems,
      submissions: [] as SubmissionRecord[],
      stats: [
        { label: "Settings", value: 16 },
        { label: "Pages", value: 0 },
        { label: "Tours", value: publicTours.length },
        { label: "Blog Posts", value: publicBlogPosts.length },
        { label: "Submissions", value: 0 },
      ],
      adminAccess: {
        username: process.env.CMS_ADMIN_USERNAME?.trim() || "admin",
        source: process.env.CMS_ADMIN_PASSWORD ? "environment" : "unconfigured",
      } as AdminAccessSummary,
      hasServiceRole: false,
    };
  }

  const [pagesResult, blogResult, testimonialsResult, valuesResult, contactResult, quoteResult, adminAccessResult] = await Promise.all([
    client.from("pages").select("id,slug,title,excerpt,status,content,featured_image_url,meta_title,meta_description,meta_image_url,published_at").order("slug", { ascending: true }),
    client.from("blog_posts").select("id,slug,title,excerpt,content,category,featured_image_url,status,meta_title,meta_description,meta_image_url,published_at").order("published_at", { ascending: false }),
    client.from("testimonials").select("id,name,title,quote,photo_url").order("order_column", { ascending: true }),
    client.from("company_values").select("id,title,description,icon").order("order_column", { ascending: true }),
    client.from("contact_submissions").select("id,name,email,phone,subject,message,status,created_at").order("created_at", { ascending: false }).limit(10),
    client.from("quote_requests").select("id,name,email,phone,guests,preferred_tour,special_requests,status,created_at").order("created_at", { ascending: false }).limit(10),
    client.from("admin_accounts").select("username").order("updated_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const toursRows = await fetchAdminTourRows(client);

  const pages = ((pagesResult.data ?? []) as PageRow[]).map(mapPage);
  const tours = toursRows.length ? mergeToursWithFallback(toursRows) : publicTours;
  const blogRows = (blogResult.data ?? []) as BlogRow[];
  const blogPosts = blogRows.length ? mergeBlogPostsWithFallback(blogRows) : publicBlogPosts;
  const testimonials = testimonialsResult.data?.length
    ? (testimonialsResult.data as TestimonialRow[]).map((row) => ({
        id: row.id,
        name: row.name,
        title: row.title ?? "",
        quote: row.quote,
        image: row.photo_url ?? "",
      }))
    : fallbackTestimonials;
  const companyValues = valuesResult.data?.length
    ? (valuesResult.data as ValueRow[]).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description ?? "",
        icon: row.icon ?? "spark",
      }))
    : fallbackValueItems;
  const contactSubmissions = ((contactResult.data ?? []) as ContactSubmissionRow[]).map((row) => ({
    id: row.id,
    type: "contact" as const,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    summary: `${row.subject}: ${row.message}`,
    createdAt: row.created_at,
  }));
  const quoteRequests = ((quoteResult.data ?? []) as QuoteRequestRow[]).map((row) => ({
    id: row.id,
    type: "quote" as const,
    name: row.name,
    email: row.email,
    phone: row.phone,
    status: row.status,
    summary: `${row.guests} guests${row.preferred_tour ? `, preferred tour: ${row.preferred_tour}` : ""}${row.special_requests ? `, notes: ${row.special_requests}` : ""}`,
    createdAt: row.created_at,
  }));
  const adminAccess = adminAccessResult.data?.username
    ? ({
        username: adminAccessResult.data.username,
        source: "database",
      } as AdminAccessSummary)
    : ({
        username: process.env.CMS_ADMIN_USERNAME?.trim() || "admin",
        source: process.env.CMS_ADMIN_PASSWORD ? "environment" : "unconfigured",
      } as AdminAccessSummary);

  return {
    settings,
    navigation,
    pages,
    tours,
    blogPosts,
    testimonials,
    companyValues,
    submissions: [...contactSubmissions, ...quoteRequests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    stats: [
      { label: "Settings", value: 16 },
      { label: "Pages", value: pages.length },
      { label: "Tours", value: tours.length },
      { label: "Blog Posts", value: blogPosts.length },
      { label: "Submissions", value: contactSubmissions.length + quoteRequests.length },
    ],
    adminAccess,
    hasServiceRole: true,
  };
}

export const featuredToursFallback = fallbackFeaturedTours;
