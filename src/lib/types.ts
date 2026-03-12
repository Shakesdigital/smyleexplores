export type Tour = {
  slug: string;
  title: string;
  shortDescription: string;
  duration: string;
  difficulty: string;
  minAge: string;
  groupSize: string;
  startingPrice: string;
  location: string;
  heroImage: string;
  highlights: string[];
  included: string[];
  bring: string[];
  overview: string[];
  relatedTourSlugs: string[];
};

export type Testimonial = {
  name: string;
  title: string;
  quote: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export type ValueItem = {
  title: string;
  description: string;
  icon: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: string;
  image: string;
};
