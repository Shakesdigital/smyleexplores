export type NavItem = {
  label: string;
  href: string;
};

export type SiteSettings = {
  siteName: string;
  tagline: string;
  mission: string;
  email: string;
  phone: string;
  whatsappUrl: string;
  address: string;
  officeHours: string[];
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
  branding: {
    logo: string;
    primaryColor: string;
    secondaryColor: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    defaultImage: string;
  };
};

export type CmsPage = {
  id?: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  status: string;
  content: Record<string, unknown>;
  featuredImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaImageUrl?: string | null;
  publishedAt?: string | null;
};

export type TourHeroSlide = {
  image: string;
  title: string;
  subtitle: string;
};

export type TourItineraryDay = {
  dayLabel: string;
  title: string;
  description: string;
  activities: string[];
  image?: string;
};

export type Tour = {
  id?: string;
  slug: string;
  title: string;
  destination: string;
  shortDescription: string;
  duration: string;
  difficulty: string;
  minAge: string;
  groupSize: string;
  startingPrice: string;
  location: string;
  heroImage: string;
  heroSlides: TourHeroSlide[];
  highlights: string[];
  included: string[];
  bring: string[];
  overview: string[];
  itineraryDays: TourItineraryDay[];
  bookingTitle: string;
  bookingDescription: string;
  relatedTourSlugs: string[];
  status?: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaImageUrl?: string | null;
  publishedAt?: string | null;
};

export type Testimonial = {
  id?: string;
  name: string;
  title: string;
  quote: string;
};

export type TeamMember = {
  id?: string;
  name: string;
  role: string;
  bio: string;
  image: string;
};

export type ValueItem = {
  id?: string;
  title: string;
  description: string;
  icon: string;
};

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image: string;
  status?: string;
  content?: Record<string, unknown>;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaImageUrl?: string | null;
  publishedAt?: string | null;
};

export type SubmissionRecord = {
  id: string;
  type: "contact" | "quote";
  name: string;
  email: string;
  phone: string;
  status: string;
  summary: string;
  createdAt: string;
};

export type AdminAccessSummary = {
  username: string;
  source: "database" | "environment" | "unconfigured";
};
