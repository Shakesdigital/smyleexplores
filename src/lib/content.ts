import { BlogPost, TeamMember, Testimonial, Tour, ValueItem } from "@/lib/types";

export const siteSettings = {
  siteName: "Smyle Explores",
  tagline: "Explore Uganda. Feel Alive.",
  mission:
    "To create unforgettable travel experiences across Uganda by delivering safe, exciting, and authentic adventures that allow clients to explore the beauty, culture, and hidden gems of the Pearl of Africa while creating lasting memories and genuine connections.",
  email: "info@smyleexplores.com",
  phone: "+256 700 000 000",
  whatsappUrl: "https://wa.me/256700000000",
  address: "Jinja, Uganda",
  officeHours: [
    "Monday - Friday: 8:00 AM - 6:00 PM",
    "Saturday: 9:00 AM - 4:00 PM",
    "Sunday: By prior booking only",
  ],
  socialLinks: {
    instagram: "#",
    facebook: "#",
    whatsapp: "https://wa.me/256700000000",
  },
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Our Tours", href: "/tours" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

export const whyChooseUs = [
  {
    title: "Safe & Expert-Led",
    description:
      "Experienced guides, clear briefings, and trusted local operators keep every adventure professional from start to finish.",
    icon: "shield",
  },
  {
    title: "Authentic Local Experiences",
    description:
      "Each itinerary is grounded in real connections with Jinja communities, culture, and the landscapes that make Uganda unforgettable.",
    icon: "map",
  },
  {
    title: "Unforgettable Memories",
    description:
      "From sunrise on the Nile to adrenaline on the rapids, we design moments that stay with travelers long after the journey ends.",
    icon: "spark",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Amelia R.",
    title: "Adventure Traveler, Nairobi",
    quote:
      "The rafting day was seamless, thrilling, and incredibly well organized. Smyle Explores made Uganda feel both exciting and deeply personal.",
  },
  {
    name: "Daniel K.",
    title: "Family Traveler, Kampala",
    quote:
      "Our sunset cruise and village walk were perfect for the whole family. The guides were warm, knowledgeable, and genuinely proud of their home.",
  },
  {
    name: "Sophie M.",
    title: "Couples Getaway, London",
    quote:
      "Every touch felt premium without being stiff. It was authentic, beautiful, and the easiest trip we planned in East Africa.",
  },
];

export const teamMembers: TeamMember[] = [
  {
    name: "Sarah Namugenyi",
    role: "Founder & Experience Curator",
    bio: "Sarah shapes every itinerary around safety, storytelling, and the hidden beauty of Uganda’s most memorable places.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Joel Ssemanda",
    role: "Lead Adventure Guide",
    bio: "Joel brings deep river knowledge, calm leadership, and years of guiding on the Nile for first-timers and thrill seekers alike.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Faith Nalwadda",
    role: "Guest Relations Manager",
    bio: "Faith ensures every guest feels prepared, welcomed, and connected from inquiry through the final day of their journey.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
  },
];

export const valueItems: ValueItem[] = [
  {
    title: "Safety",
    description: "Professional operators, clear standards, and responsible planning guide every itinerary.",
    icon: "shield",
  },
  {
    title: "Authenticity",
    description: "We lead travelers into the real rhythm of Uganda through local stories, food, and community.",
    icon: "leaf",
  },
  {
    title: "Adventure",
    description: "We balance exhilarating experiences with comfort and confidence for every type of explorer.",
    icon: "mountain",
  },
  {
    title: "Community",
    description: "Our experiences are designed to create value for local guides, partners, and neighborhoods.",
    icon: "people",
  },
];

export const tours: Tour[] = [
  {
    slug: "white-water-rafting-on-the-nile",
    title: "White Water Rafting on the Nile",
    shortDescription: "Tackle legendary rapids with expert crews on one of Africa’s most iconic river adventures.",
    duration: "Full Day (6-8 hrs) or Half Day (3-4 hrs)",
    difficulty: "Thrilling (Grade 4-5)",
    minAge: "16 (full day) / 12 (half day)",
    groupSize: "2-24 guests",
    startingPrice: "$115 per person (half day) / $145 per person (full day)",
    location: "Jinja, Uganda",
    heroImage: "/images/white-water-rafting.jpeg",
    highlights: [
      "Grade 4-5 rapids on the world's longest river",
      "No experience required",
      "Safety kayakers and rescue boats on standby",
      "Snacks and drinks included",
      "Free shuttle from Jinja town",
      "Spectacular Nile scenery between rapids",
    ],
    included: ["Safety gear (helmet, life jacket)", "Professional guide", "Snacks & drinks", "Rescue support", "Transport within Jinja"],
    bring: ["Quick-dry clothes", "Secure sandals", "Sunscreen", "Small towel", "Extra change of clothes"],
    overview: [
      "Tackle the legendary rapids of the White Nile in Jinja, Africa's best white water rafting destination.",
      "Navigate through Grade 4 and 5 rapids like \"Big Brother\" and \"Overtime,\" guided by expert crews.",
      "This is one of Uganda's most iconic adventures, pairing pure adrenaline with striking stretches of river scenery.",
      "Whether you choose the half-day or full-day option, the experience is designed to feel thrilling, safe, and unforgettable.",
    ],
    relatedTourSlugs: ["nile-kayaking-adventure", "nile-jet-boating", "sunset-cruise-on-the-nile"],
  },
  {
    slug: "bungee-jumping-over-the-nile",
    title: "Bungee Jumping over the Nile",
    shortDescription: "Leap from a 44-meter platform over the Victoria Nile for one of East Africa’s most intense thrills.",
    duration: "Half Day (2-3 hrs)",
    difficulty: "Extreme",
    minAge: "14 / Min Weight: 40kg / Max Weight: 120kg",
    groupSize: "1-12 guests",
    startingPrice: "$85 per person (approx UGX 310,000)",
    location: "Jinja, Uganda",
    heroImage: "/images/bungee-jumping.jpeg",
    highlights: [
      "44-meter free fall over the Victoria Nile",
      "Certified modern bungee equipment",
      "Option to touch the water",
      "Photography available",
      "One of only a handful of Nile bungee sites in Africa",
    ],
    included: ["Safety briefing", "Certified equipment", "Jump master supervision"],
    bring: ["Comfortable clothing", "Secure shoes", "Valid ID", "Courage", "Camera for ground photos"],
    overview: [
      "Leap from a 44-meter platform over the mighty River Nile for the ultimate adrenaline rush in East Africa.",
      "The Nile High Bungee is a bucket-list experience where the build-up is as electric as the plunge itself.",
      "As you stare down at the swirling Nile below, expert jump masters guide you through every safety step.",
      "It is a short experience in duration, but an unforgettable one in impact.",
    ],
    relatedTourSlugs: ["nile-jet-boating", "quad-biking-safari", "white-water-rafting-on-the-nile"],
  },
  {
    slug: "nile-kayaking-adventure",
    title: "Nile Kayaking Adventure",
    shortDescription: "Paddle the Nile at water level through calm channels, wildlife-rich stretches, and beginner-friendly routes.",
    duration: "Half Day (2-4 hrs) or Full Day",
    difficulty: "Moderate",
    minAge: "10",
    groupSize: "1-10 guests",
    startingPrice: "$45 per person (half day)",
    location: "Jinja, Uganda",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Tandem and solo kayak options",
      "Professional coaching for beginners",
      "Navigate calmer Nile channels",
      "Spot Nile monitor lizards, kingfishers, and otters",
      "Can be combined with rafting",
    ],
    included: ["Kayak", "Paddle", "Life jacket", "Helmet", "Guide", "Safety support"],
    bring: ["Quick-dry clothes", "Waterproof bag", "Sunscreen", "Hat", "Reusable water bottle"],
    overview: [
      "Experience the Nile from water level in a kayak and discover a different rhythm of Jinja.",
      "Whether you're a beginner or seasoned paddler, the route balances light coaching with scenic exploration.",
      "You will glide through stunning Nile channels, spot abundant wildlife, and enjoy the tranquility between thrilling moments.",
      "It is a perfect add-on for travelers who want adventure without the full intensity of rafting.",
    ],
    relatedTourSlugs: ["white-water-rafting-on-the-nile", "source-of-the-nile-boat-tour", "nile-tubing-experience"],
  },
  {
    slug: "nile-tubing-experience",
    title: "Nile Tubing Experience",
    shortDescription: "Float through gentle rapids and riverside scenery on the Nile’s most relaxed family-friendly adventure.",
    duration: "Half Day (2-3 hrs)",
    difficulty: "Easy / Family-Friendly",
    minAge: "8",
    groupSize: "2-20 guests",
    startingPrice: "$50 per person",
    location: "Jinja, Uganda",
    heroImage: "/images/nile-tubing.jpeg",
    highlights: [
      "Float on big inflatable tubes",
      "Class 1-3 rapids (gentle and fun)",
      "Colorful birdlife along the banks",
      "Playful monkeys in riverside trees",
      "Great for families and non-swimmers",
    ],
    included: ["Tube", "Life jacket", "Guide", "Safety support"],
    bring: ["Swimwear", "Sun hat", "Sunscreen", "Flip-flops", "Dry clothes for after"],
    overview: [
      "Float lazily down the Nile in a giant inflatable tube, the most relaxed way to experience Uganda's greatest river.",
      "This trip blends low-key fun, gentle rapids, and long scenic stretches along the lush banks near Jinja.",
      "Perfect for families, non-swimmers, and anyone who wants Nile fun without the intensity of rafting.",
      "It is playful, easygoing, and surprisingly immersive.",
    ],
    relatedTourSlugs: ["sunset-cruise-on-the-nile", "source-of-the-nile-boat-tour", "jinja-village-community-walk"],
  },
  {
    slug: "sunset-cruise-on-the-nile",
    title: "Sunset Cruise on the Nile",
    shortDescription: "Drift through golden-hour views, birdlife, and calm water as the Nile glows into evening.",
    duration: "1-2 hours",
    difficulty: "Easy / All Ages",
    minAge: "All ages welcome",
    groupSize: "2-30 guests",
    startingPrice: "$35 per person",
    location: "Jinja, Uganda",
    heroImage: "/images/sunset-cruise.jpeg",
    highlights: [
      "Golden-hour views of the Nile and Lake Victoria",
      "Spot fish eagles, cormorants, and egrets",
      "Drinks served on board",
      "Romantic and peaceful atmosphere",
      "Visit the Source of the Nile",
    ],
    included: ["Boat cruise", "Drinks (sodas/water)", "Life jackets", "Guide"],
    bring: ["Light jacket", "Camera", "Comfortable shoes", "Sunglasses", "Phone for sunset photos"],
    overview: [
      "As the African sun melts into the horizon, drift along the Nile and soak in the peace and beauty of Uganda's most famous river.",
      "The cruise moves at an unhurried pace, making it ideal for couples, families, and guests easing into Jinja.",
      "Along the way you can spot birdlife, enjoy cool evening air, and watch the water turn gold.",
      "It is one of the most atmospheric ways to end a day in the Pearl of Africa.",
    ],
    relatedTourSlugs: ["source-of-the-nile-boat-tour", "horseback-riding-along-the-nile", "nile-tubing-experience"],
  },
  {
    slug: "quad-biking-safari",
    title: "Quad Biking Safari",
    shortDescription: "Ride through villages, forests, and Nile-edge trails on one of Jinja’s most popular off-road experiences.",
    duration: "2 hours",
    difficulty: "Moderate (No experience needed)",
    minAge: "12 (10+ with parental consent)",
    groupSize: "1-16 guests",
    startingPrice: "$55 per person",
    location: "Jinja, Uganda",
    heroImage: "/images/quad-biking.jpeg",
    highlights: [
      "Ride through villages, forests, and along the Nile's edge",
      "Safety briefing and practice session included",
      "Stops to interact with local communities",
      "Great for groups and families",
      "Stunning countryside views",
    ],
    included: ["Quad bike", "Helmet", "Safety gear", "Guide", "Briefing"],
    bring: ["Closed shoes", "Sunglasses", "Dust-friendly clothing", "Small backpack", "Phone case"],
    overview: [
      "Jump on a quad bike and tear through the Ugandan countryside past villages, lush forests, and along the edge of the Nile.",
      "No experience is needed because the session begins with a clear safety briefing and guided practice.",
      "This 2-hour off-road adventure is one of Jinja's most popular activities for all ages.",
      "It delivers action, scenery, and authentic local encounters in one energetic outing.",
    ],
    relatedTourSlugs: ["horseback-riding-along-the-nile", "bungee-jumping-over-the-nile", "jinja-village-community-walk"],
  },
  {
    slug: "horseback-riding-along-the-nile",
    title: "Horseback Riding along the Nile",
    shortDescription: "Saddle up for a calm, scenic ride past villages and Nile-side landscapes with local guides.",
    duration: "1-2 hours",
    difficulty: "Easy / Moderate",
    minAge: "8",
    groupSize: "1-10 guests",
    startingPrice: "$45 per person",
    location: "Jinja, Uganda",
    heroImage: "/images/horseback-riding.jpeg",
    highlights: [
      "Ride well-trained horses along the Nile riverbank",
      "Pass through traditional Ugandan villages",
      "Sunset ride option available",
      "Suitable for beginners and experienced riders",
      "Incredible views of the Nile",
    ],
    included: ["Horse", "Riding helmet", "Guide", "Safety introduction"],
    bring: ["Long trousers", "Closed shoes", "Light camera", "Water bottle", "Sunscreen"],
    overview: [
      "Saddle up and ride along the banks of the mighty River Nile on a route that feels both peaceful and cinematic.",
      "Wind through local villages and open countryside as local guides share stories of the land.",
      "The horses are well trained and the pace can be adjusted for beginners or more confident riders.",
      "It is a gentle, memorable way to experience Jinja's breathtaking scenery.",
    ],
    relatedTourSlugs: ["sunset-cruise-on-the-nile", "quad-biking-safari", "jinja-village-community-walk"],
  },
  {
    slug: "nile-jet-boating",
    title: "Nile Jet Boating",
    shortDescription: "Race over the Nile in a high-speed jet boat built for sharp turns, spray, and river power.",
    duration: "30-60 minutes",
    difficulty: "Thrilling",
    minAge: "12",
    groupSize: "2-12 guests",
    startingPrice: "$70 per person",
    location: "Jinja, Uganda",
    heroImage: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "High-speed thrills on the Nile",
      "Race past Grade 5 rapids",
      "New Zealand-manufactured jet boats",
      "Helmets and life jackets provided",
      "Great photography opportunity",
    ],
    included: ["Life jacket", "Helmet", "Safety briefing", "Guide"],
    bring: ["Secure clothing", "Waterproof phone case", "Sunglasses strap", "Closed shoes", "Energy for the ride"],
    overview: [
      "Hold on tight as a jet boat screams down the rapids of the Nile at breathtaking speed.",
      "Powered by New Zealand-engineered boats, this is one of the most thrilling ways to experience the river's raw power.",
      "Sharp turns, spray, and precision driving make the short ride feel intense from the first minute.",
      "It is ideal for travelers who want a compact but high-impact adventure.",
    ],
    relatedTourSlugs: ["white-water-rafting-on-the-nile", "bungee-jumping-over-the-nile", "nile-kayaking-adventure"],
  },
  {
    slug: "source-of-the-nile-boat-tour",
    title: "Source of the Nile Boat Tour",
    shortDescription: "Cruise to the historic point where the Nile begins and discover one of Uganda’s most meaningful landmarks.",
    duration: "1-2 hours",
    difficulty: "Easy / All Ages",
    minAge: "All welcome",
    groupSize: "2-25 guests",
    startingPrice: "$30 per person",
    location: "Jinja, Uganda",
    heroImage: "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Guided boat ride to the exact source of the world's longest river",
      "Historical significance discovered by British explorer John Hanning Speke in 1858",
      "Spot otters, pied kingfishers, and fish eagles",
      "Great for history lovers and families",
    ],
    included: ["Boat", "Life jacket", "Guided commentary", "Transport within Jinja"],
    bring: ["Hat", "Camera", "Comfortable shoes", "Water bottle", "Light layer for breeze"],
    overview: [
      "Take a peaceful boat ride to the exact spot where the Nile begins its legendary 6,650 km journey to the Mediterranean Sea.",
      "Steeped in history and natural beauty, this is one of the most meaningful experiences Uganda has to offer.",
      "The trip blends storytelling, wildlife spotting, and a calm appreciation of place.",
      "It is especially rewarding for families, first-time visitors, and travelers who want more depth than adrenaline.",
    ],
    relatedTourSlugs: ["sunset-cruise-on-the-nile", "nile-kayaking-adventure", "jinja-village-community-walk"],
  },
  {
    slug: "jinja-village-community-walk",
    title: "Jinja Village & Community Walk",
    shortDescription: "Step into riverside village life with a local guide and experience culture, crafts, and genuine hospitality.",
    duration: "2-3 hours",
    difficulty: "Easy",
    minAge: "All welcome",
    groupSize: "2-18 guests",
    startingPrice: "$25 per person",
    location: "Jinja, Uganda",
    heroImage: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1600&q=80",
    highlights: [
      "Walk through authentic Ugandan villages along the Nile",
      "Meet local Basoga community members",
      "Learn about traditional culture and daily life",
      "See local crafts and cooking",
      "Experience genuine Ugandan hospitality",
    ],
    included: ["Local guide", "Cultural introduction", "Optional craft purchases"],
    bring: ["Comfortable walking shoes", "Respectful clothing", "Reusable water bottle", "Cash for crafts", "Curiosity"],
    overview: [
      "Step off the beaten path and into the heart of a Jinja riverside village.",
      "Walk with a local guide, share in community life, learn traditional crafts, taste local food, and leave with a deeper connection to Uganda and its people.",
      "This tour slows the pace and opens a more intimate view of the Pearl of Africa.",
      "It is ideal for travelers who value culture, context, and human connection.",
    ],
    relatedTourSlugs: ["source-of-the-nile-boat-tour", "quad-biking-safari", "horseback-riding-along-the-nile"],
  },
];

export const featuredTours = tours.slice(0, 6);
export const blogPosts: BlogPost[] = [
  {
    slug: "top-5-reasons-to-visit-jinja-in-2025",
    title: "Top 5 Reasons to Visit Jinja in 2025",
    date: "March 1, 2025",
    excerpt: "A curated story from Smyle Explores with practical insights, local perspective, and inspiration for your next journey in Uganda.",
    category: "Adventure",
    image: "/images/blog-top-5-jinja.jpeg",
  },
  {
    slug: "what-to-expect-on-your-first-white-water-rafting-trip",
    title: "What to Expect on Your First White Water Rafting Trip",
    date: "February 18, 2025",
    excerpt: "A curated story from Smyle Explores with practical insights, local perspective, and inspiration for your next journey in Uganda.",
    category: "Travel Tips",
    image: "/images/home-hero-rafting.jpeg",
  },
  {
    slug: "ugandas-hidden-gems-beyond-the-gorillas",
    title: "Uganda's Hidden Gems: Beyond the Gorillas",
    date: "January 28, 2025",
    excerpt: "A curated story from Smyle Explores with practical insights, local perspective, and inspiration for your next journey in Uganda.",
    category: "Culture",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "how-to-plan-the-perfect-jinja-weekend-getaway",
    title: "How to Plan the Perfect Jinja Weekend Getaway",
    date: "January 12, 2025",
    excerpt: "A curated story from Smyle Explores with practical insights, local perspective, and inspiration for your next journey in Uganda.",
    category: "Travel Tips",
    image: "/images/blog-jinja-weekend-getaway.jpeg",
  },
];

export const homeQuote =
  "\"Uganda is not just a destination; it is a feeling of wild beauty, warm people, and rivers that carry stories.\"";

export const aboutStory = [
  "Smyle Explores was created to help travelers experience Uganda with confidence, wonder, and genuine local connection. Based in Jinja, we design journeys that balance adventure with comfort and authenticity.",
  "Our team works with trusted local operators and community partners to create experiences that feel both elevated and grounded. Every itinerary is shaped around what makes the Pearl of Africa so magnetic: dramatic landscapes, generous hospitality, and stories worth hearing firsthand.",
  "Whether you are chasing adrenaline on the Nile or a slower cultural encounter in a riverside village, we believe travel should leave you feeling more alive than when you arrived.",
];

export const cmsCollections = [
  { name: "Settings", count: 7, description: "Branding, SEO, contact, and integrations grouped for CMS editing." },
  { name: "Pages", count: 5, description: "CMS-manageable core pages with metadata and ordered modules." },
  { name: "Modules", count: 12, description: "Reusable sections for heroes, CTAs, testimonials, rich text, and forms." },
  { name: "Tours", count: tours.length, description: "Public tour inventory with SEO fields, detail pages, and quote flows." },
  { name: "Blog Posts", count: blogPosts.length, description: "Editorial stories with categories, hero images, and excerpts." },
  { name: "Submissions", count: 2, description: "Contact inquiries and quote requests persisted through API endpoints." },
];
