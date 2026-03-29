import { BlogPost, TeamMember, Testimonial, Tour, ValueItem } from "@/lib/types";

export const siteSettings = {
  siteName: "Smyle Explores",
  tagline: "Explore Uganda. Feel Alive.",
  mission:
    "To create unforgettable travel experiences across Uganda by delivering safe, exciting, and authentic adventures that allow clients to explore the beauty, culture, and hidden gems of the Pearl of Africa while creating lasting memories and genuine connections.",
  email: "info@smyleexplores.com",
  phone: "+256 759 211 663",
  whatsappUrl: "https://wa.me/256759211663",
  address: "Jinja, Uganda",
  officeHours: [
    "Monday - Friday: 8:00 AM - 6:00 PM",
    "Saturday: 9:00 AM - 4:00 PM",
    "Sunday: By prior booking only",
  ],
  socialLinks: {
    instagram: "#",
    facebook: "#",
    whatsapp: "https://wa.me/256759211663",
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
    title: "Destination-Led Planning",
    description:
      "Every itinerary is built around a real Uganda destination, with pacing, lodging, and activities shaped to fit that place.",
    icon: "map",
  },
  {
    title: "Trusted Local Handling",
    description:
      "We work with experienced guides, drivers, and community partners so every trip feels smooth, safe, and grounded.",
    icon: "shield",
  },
  {
    title: "Flexible Experiences",
    description:
      "From primate safaris to waterfall escapes and Nile adventures, the CMS can now manage the exact experience your guests want to book.",
    icon: "spark",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Amelia R.",
    title: "Adventure Traveler, Nairobi",
    quote:
      "The itinerary felt considered from the first transfer to the final activity. Smyle Explores made Uganda feel exciting and easy to navigate.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Daniel K.",
    title: "Family Traveler, Kampala",
    quote:
      "Our guide understood how to balance wildlife, comfort, and timing. The whole trip felt personal rather than packaged.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Sophie M.",
    title: "Couples Getaway, London",
    quote:
      "We loved that every destination had its own pace and character. It felt curated, not copied from a generic safari template.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&q=80",
  },
];

export const teamMembers: TeamMember[] = [
  {
    name: "Sarah Namugenyi",
    role: "Founder & Experience Curator",
    bio: "Sarah shapes every itinerary around safety, storytelling, and the hidden beauty of Uganda's most memorable places.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Joel Ssemanda",
    role: "Lead Adventure Guide",
    bio: "Joel brings calm leadership, destination knowledge, and practical field experience across Uganda's varied routes.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Faith Nalwadda",
    role: "Guest Relations Manager",
    bio: "Faith ensures every guest feels prepared, welcomed, and supported from first inquiry through the final travel day.",
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
    slug: "sipi-falls-3-days-escape",
    title: "Sipi Falls 3 Days Escape",
    destination: "Sipi Falls",
    shortDescription: "A cool-climate eastern Uganda escape centered on waterfalls, coffee, mountain views, and soft adventure.",
    duration: "3 Days / 2 Nights",
    difficulty: "Moderate",
    minAge: "12+",
    groupSize: "2-12 guests",
    startingPrice: "From $640 per person",
    location: "Sipi Falls, Kapchorwa, Uganda",
    heroImage: "/images/about-story-gogolo.jpeg",
    heroSlides: [
      {
        image: "/images/about-story-gogolo.jpeg",
        title: "Arrival in the foothills",
        subtitle: "Ease into the highlands with valley views and a slower mountain rhythm.",
      },
      {
        image: "/images/home-pearl-of-africa.jpeg",
        title: "Waterfalls and caves",
        subtitle: "Walk the falls circuit and explore the dramatic rock formations around Sipi.",
      },
      {
        image: "/images/blog-jinja-weekend-getaway.jpeg",
        title: "Coffee and community",
        subtitle: "Meet local coffee growers and experience the story behind Sipi's beans.",
      },
    ],
    highlights: [
      "Waterfall hikes with panoramic viewpoints",
      "Arabica coffee experience with local farmers",
      "Community-led cave and village walks",
      "Cool-climate mountain retreat atmosphere",
    ],
    included: [
      "Accommodation for 2 nights",
      "Ground transport",
      "Guide services",
      "Coffee experience",
      "Waterfall hike fees",
      "Daily breakfast",
    ],
    bring: ["Hiking shoes", "Warm layer for cool evenings", "Rain jacket", "Camera", "Reusable water bottle"],
    overview: [
      "Spend three days in the Sipi highlands where cool air, layered waterfalls, and coffee culture create one of Uganda's most photogenic escapes.",
      "This itinerary balances gentle adventure with local connection, giving guests enough time to hike, learn, rest, and absorb the landscape without rushing.",
      "It works well for couples, small groups, and travelers who want Uganda beyond the standard safari circuit.",
    ],
    itineraryDays: [
      {
        dayLabel: "Day 1",
        title: "Travel to Sipi Falls",
        description: "Drive east into the Mount Elgon foothills and settle into the lodge with escarpment views.",
        activities: ["Scenic transfer from Kampala or Jinja", "Check-in with ridge views", "Sunset walk or relaxed lodge evening"],
        image: "/images/about-story-gogolo.jpeg",
      },
      {
        dayLabel: "Day 2",
        title: "Waterfall circuit and coffee tour",
        description: "Spend the day with Sipi's landscapes and the coffee-growing families that define the area.",
        activities: ["Guided hike to the main Sipi Falls", "Explore caves and cliff viewpoints", "Arabica coffee tour and tasting"],
        image: "/images/home-pearl-of-africa.jpeg",
      },
      {
        dayLabel: "Day 3",
        title: "Morning activity and return",
        description: "Choose one last gentle activity before the transfer back.",
        activities: ["Optional abseiling or nature walk", "Breakfast with valley views", "Return transfer"],
        image: "/images/blog-jinja-weekend-getaway.jpeg",
      },
    ],
    bookingTitle: "Plan Your Sipi Escape",
    bookingDescription: "Share your dates, group size, and any hiking or comfort preferences. We will tailor the Sipi Falls escape around them.",
    relatedTourSlugs: ["queen-elizabeth-3-days", "lake-mburo-3-days", "jinja-5-days"],
  },
  {
    slug: "gorilla-and-chimpanzee-safari-5-days",
    title: "5-Day Gorilla and Chimpanzee Safari",
    destination: "Western Uganda Primates",
    shortDescription: "A primate-focused western Uganda safari connecting chimp trekking in Kibale with gorilla trekking in Bwindi.",
    duration: "5 Days / 4 Nights",
    difficulty: "Moderate to Active",
    minAge: "15+",
    groupSize: "2-8 guests",
    startingPrice: "From $2,850 per person",
    location: "Kibale Forest and Bwindi Impenetrable Forest, Uganda",
    heroImage: "/images/home-hero-rafting.jpeg",
    heroSlides: [
      {
        image: "/images/home-hero-rafting.jpeg",
        title: "Kibale forest encounter",
        subtitle: "Track chimpanzees through one of East Africa's richest tropical forests.",
      },
      {
        image: "/images/boat-ride-girls.jpeg",
        title: "Bwindi gorilla trekking",
        subtitle: "Spend an unforgettable hour with a habituated gorilla family.",
      },
      {
        image: "/images/blog-top-5-jinja.jpeg",
        title: "Scenic western Uganda",
        subtitle: "Travel through crater lakes, tea country, and mountain roads between experiences.",
      },
    ],
    highlights: [
      "Chimpanzee trekking permit in Kibale",
      "Gorilla trekking permit in Bwindi",
      "Scenic safari drives through western Uganda",
      "Comfort-focused lodge routing with experienced guides",
    ],
    included: [
      "Accommodation for 4 nights",
      "Primate permits",
      "Private transport",
      "English-speaking guide",
      "Daily breakfast and selected meals",
    ],
    bring: ["Sturdy hiking boots", "Long trousers", "Rain jacket", "Daypack", "Passport for permit checks"],
    overview: [
      "This five-day safari is designed for travelers who want Uganda's most iconic wildlife encounters in one tightly run journey.",
      "You move from Kibale's forest primates to Bwindi's mountain gorillas, with scenic transfers and cultural context woven in.",
      "The pace is active but rewarding, making it ideal for guests prioritizing once-in-a-lifetime wildlife moments.",
    ],
    itineraryDays: [
      {
        dayLabel: "Day 1",
        title: "Transfer to Kibale region",
        description: "Travel west through tea country and crater lake landscapes toward Kibale.",
        activities: ["Pick-up and safari briefing", "Scenic transfer with lunch en route", "Lodge check-in near Kibale"],
        image: "/images/home-hero-rafting.jpeg",
      },
      {
        dayLabel: "Day 2",
        title: "Chimpanzee trekking and Bigodi",
        description: "Head into the forest early, then explore a community wetland walk in the afternoon.",
        activities: ["Chimpanzee tracking session", "Lunch at the lodge", "Bigodi wetland or community walk"],
        image: "/images/boat-ride-girls.jpeg",
      },
      {
        dayLabel: "Day 3",
        title: "Transfer to Bwindi",
        description: "Cross western Uganda's rolling landscapes toward the gorilla trekking region.",
        activities: ["Morning departure", "Scenic drive via Queen Elizabeth corridor", "Arrival and trek briefing"],
        image: "/images/blog-top-5-jinja.jpeg",
      },
      {
        dayLabel: "Day 4",
        title: "Gorilla trekking day",
        description: "Meet your ranger team and trek for a deeply memorable hour with a habituated gorilla family.",
        activities: ["Early park registration", "Guided gorilla trek", "Post-trek rest and celebration"],
        image: "/images/home-pearl-of-africa.jpeg",
      },
      {
        dayLabel: "Day 5",
        title: "Return journey",
        description: "Begin the drive back with scheduled breaks and optional souvenir stops.",
        activities: ["Breakfast at the lodge", "Return transfer", "Drop-off in Kampala or Entebbe"],
        image: "/images/about-story-gogolo.jpeg",
      },
    ],
    bookingTitle: "Request Your Primate Safari",
    bookingDescription: "Tell us your preferred travel window, permit priorities, and accommodation level. We will shape the safari around availability and pace.",
    relatedTourSlugs: ["queen-elizabeth-3-days", "lake-mburo-3-days", "sipi-falls-3-days-escape"],
  },
  {
    slug: "queen-elizabeth-3-days",
    title: "Queen Elizabeth 3 Days",
    destination: "Queen Elizabeth National Park",
    shortDescription: "A compact safari into Queen Elizabeth National Park for game drives, crater landscapes, and the Kazinga Channel.",
    duration: "3 Days / 2 Nights",
    difficulty: "Easy to Moderate",
    minAge: "8+",
    groupSize: "2-16 guests",
    startingPrice: "From $790 per person",
    location: "Queen Elizabeth National Park, Uganda",
    heroImage: "/images/white-water-rafting.jpeg",
    heroSlides: [
      {
        image: "/images/white-water-rafting.jpeg",
        title: "Savannah game drives",
        subtitle: "Search for elephants, buffalo, antelope, and predators across open plains.",
      },
      {
        image: "/images/sunset-cruise.jpeg",
        title: "Kazinga Channel cruise",
        subtitle: "Watch hippos, crocodiles, and birdlife gather on one of Uganda's richest waterways.",
      },
      {
        image: "/images/blog-hero-tubing-sunset.jpeg",
        title: "Crater and rift landscapes",
        subtitle: "Travel through volcanic scenery and broad valley views that define the park.",
      },
    ],
    highlights: [
      "Classic savannah wildlife viewing",
      "Kazinga Channel boat safari",
      "Comfortable short-format national park itinerary",
      "Strong fit for first-time Uganda safari guests",
    ],
    included: ["Accommodation for 2 nights", "Park entry fees", "Boat safari", "Ground transport", "Guide services", "Daily breakfast"],
    bring: ["Neutral safari clothing", "Binoculars", "Sun hat", "Camera", "Small overnight bag"],
    overview: [
      "Queen Elizabeth National Park delivers one of Uganda's strongest short safari combinations: open savannah, water wildlife, and big scenic range.",
      "This three-day itinerary is paced for guests who want real safari time without committing to a full week on the road.",
      "Game drives and the Kazinga Channel boat trip anchor the experience, with room for comfortable lodge downtime.",
    ],
    itineraryDays: [
      {
        dayLabel: "Day 1",
        title: "Travel to Queen Elizabeth",
        description: "Drive west through countryside and into the park ecosystem.",
        activities: ["Pick-up and departure", "Lunch stop en route", "Evening arrival and lodge check-in"],
        image: "/images/white-water-rafting.jpeg",
      },
      {
        dayLabel: "Day 2",
        title: "Game drive and channel cruise",
        description: "Dedicate the full day to the park's signature land and water wildlife experiences.",
        activities: ["Morning game drive", "Afternoon Kazinga Channel boat trip", "Sunset lodge relaxation"],
        image: "/images/sunset-cruise.jpeg",
      },
      {
        dayLabel: "Day 3",
        title: "Final wildlife viewing and return",
        description: "Catch a final short drive or viewpoint stop before the journey back.",
        activities: ["Optional early game activity", "Breakfast and departure", "Return transfer"],
        image: "/images/blog-hero-tubing-sunset.jpeg",
      },
    ],
    bookingTitle: "Book the Queen Elizabeth Safari",
    bookingDescription: "Share your dates and room preferences. We will quote the right lodge category and safari routing for your group.",
    relatedTourSlugs: ["lake-mburo-3-days", "gorilla-and-chimpanzee-safari-5-days", "sipi-falls-3-days-escape"],
  },
  {
    slug: "lake-mburo-3-days",
    title: "Lake Mburo 3 Days",
    destination: "Lake Mburo National Park",
    shortDescription: "A relaxed three-day safari ideal for wildlife viewing, walking safaris, and a softer introduction to Uganda's parks.",
    duration: "3 Days / 2 Nights",
    difficulty: "Easy",
    minAge: "6+",
    groupSize: "2-12 guests",
    startingPrice: "From $680 per person",
    location: "Lake Mburo National Park, Uganda",
    heroImage: "/images/nile-kayaking.jpg",
    heroSlides: [
      {
        image: "/images/nile-kayaking.jpg",
        title: "Wildlife at a softer pace",
        subtitle: "See zebra, impala, buffalo, and birds in a park well suited to relaxed safari travel.",
      },
      {
        image: "/images/source-of-the-nile-boat-tour.jpg",
        title: "Boat and walking safari",
        subtitle: "Combine water-based wildlife viewing with an on-foot perspective uncommon in many parks.",
      },
      {
        image: "/images/horseback-riding.jpeg",
        title: "Comfortable lodge downtime",
        subtitle: "Stay close to the park and let the landscape set the pace for the trip.",
      },
    ],
    highlights: [
      "Walking safari opportunity",
      "Boat trip on Lake Mburo",
      "Zebra and impala-rich landscapes",
      "Excellent short safari for mixed-age groups",
    ],
    included: ["Accommodation for 2 nights", "Park fees", "Walking safari", "Boat trip", "Transport", "Daily breakfast"],
    bring: ["Light neutral clothing", "Walking shoes", "Hat", "Insect repellent", "Binoculars"],
    overview: [
      "Lake Mburo works especially well for guests who want zebra, impala, wetlands, and close-to-nature safari moments without long transfer fatigue.",
      "The park's smaller scale makes it perfect for walking safaris, boat trips, and a calm lodge rhythm.",
      "This itinerary is popular with couples, families, and travelers pairing wildlife with other Uganda destinations.",
    ],
    itineraryDays: [
      {
        dayLabel: "Day 1",
        title: "Travel to Lake Mburo",
        description: "Journey to one of Uganda's most accessible parks and settle into a relaxed safari base.",
        activities: ["Morning departure", "Equator stop if routing allows", "Evening game drive"],
        image: "/images/nile-kayaking.jpg",
      },
      {
        dayLabel: "Day 2",
        title: "Walking safari and boat trip",
        description: "See the park from two very different vantage points in one rewarding day.",
        activities: ["Guided walking safari", "Rest and lunch at the lodge", "Afternoon boat safari"],
        image: "/images/source-of-the-nile-boat-tour.jpg",
      },
      {
        dayLabel: "Day 3",
        title: "Morning drive and return",
        description: "Catch a final wildlife window before returning east.",
        activities: ["Sunrise game drive", "Breakfast and checkout", "Return transfer"],
        image: "/images/horseback-riding.jpeg",
      },
    ],
    bookingTitle: "Plan Your Lake Mburo Getaway",
    bookingDescription: "Send your travel dates and we will build the right Lake Mburo stay with lodging and activity options that fit your pace.",
    relatedTourSlugs: ["queen-elizabeth-3-days", "jinja-5-days", "sipi-falls-3-days-escape"],
  },
  {
    slug: "jinja-5-days",
    title: "Jinja 5 Days",
    destination: "Jinja and the Nile",
    shortDescription: "A five-day Jinja itinerary that treats the Nile city as a full destination rather than a single stop.",
    duration: "5 Days / 4 Nights",
    difficulty: "Flexible",
    minAge: "8+",
    groupSize: "2-14 guests",
    startingPrice: "From $920 per person",
    location: "Jinja, Uganda",
    heroImage: "/images/boat-ride-girls.jpeg",
    heroSlides: [
      {
        image: "/images/boat-ride-girls.jpeg",
        title: "Nile adventure days",
        subtitle: "Build your stay around rafting, tubing, kayaking, or jet boating depending on pace and appetite.",
      },
      {
        image: "/images/sunset-cruise.jpeg",
        title: "Source of the Nile and sunset water",
        subtitle: "Layer in calmer boat experiences that show the softer side of Jinja.",
      },
      {
        image: "/images/quad-biking.jpeg",
        title: "Culture and countryside",
        subtitle: "Step beyond the river with community visits, horseback riding, or quad biking.",
      },
    ],
    highlights: [
      "Flexible multi-day Jinja planning",
      "Combination of adventure and cultural moments",
      "Ideal for groups wanting a destination base",
      "Booking form tied directly to the itinerary page",
    ],
    included: ["Accommodation for 4 nights", "Private transfers", "Selected activities from itinerary design", "Guide coordination", "Daily breakfast"],
    bring: ["Comfortable adventure clothing", "Closed shoes and sandals", "Swimwear", "Light evening layer", "Phone or camera"],
    overview: [
      "This itinerary repositions Jinja as a complete destination rather than a single-activity stop.",
      "Across five days, guests can combine river adventure, boat time, village encounters, and slower scenic moments while keeping a comfortable home base.",
      "It is the best choice for travelers who want variety and a deeper stay around Uganda's adventure capital.",
    ],
    itineraryDays: [
      {
        dayLabel: "Day 1",
        title: "Arrival and orientation",
        description: "Arrive in Jinja and settle into the riverside atmosphere before the itinerary begins in full.",
        activities: ["Arrival transfer", "Check-in", "Evening briefing and relaxed Nile view"],
        image: "/images/boat-ride-girls.jpeg",
      },
      {
        dayLabel: "Day 2",
        title: "Adventure on the Nile",
        description: "Choose a signature high-energy river activity based on your preferred intensity.",
        activities: ["White-water rafting or tubing", "Lunch and recovery time", "Optional evening social stop"],
        image: "/images/home-hero-rafting.jpeg",
      },
      {
        dayLabel: "Day 3",
        title: "Source of the Nile and local encounters",
        description: "Slow the pace with history, water, and local stories around Jinja.",
        activities: ["Source of the Nile boat tour", "Craft or market stop", "Sunset cruise option"],
        image: "/images/sunset-cruise.jpeg",
      },
      {
        dayLabel: "Day 4",
        title: "Countryside activity day",
        description: "Take Jinja beyond the river with a land-based experience.",
        activities: ["Quad biking, horseback riding, or ziplining", "Community interaction stop", "Free evening"],
        image: "/images/quad-biking.jpeg",
      },
      {
        dayLabel: "Day 5",
        title: "Leisure morning and departure",
        description: "Close the trip with one last gentle river or cafe moment before departure.",
        activities: ["Breakfast and optional short walk", "Checkout", "Departure transfer"],
        image: "/images/source-of-the-nile-boat-tour.jpg",
      },
    ],
    bookingTitle: "Customize Your Jinja Stay",
    bookingDescription: "Tell us which Jinja experiences matter most to your group and we will shape the five-day itinerary around them.",
    relatedTourSlugs: ["sipi-falls-3-days-escape", "lake-mburo-3-days", "queen-elizabeth-3-days"],
  },
];

export const featuredTours = tours.slice(0, 5);

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
  "\"Uganda is not just a destination; it is a feeling of wild beauty, warm people, and journeys that stay with you long after the road ends.\"";

export const aboutStory = [
  "Smyle Explores was created to help travelers experience Uganda with confidence, wonder, and genuine local connection. Based in Jinja, we design journeys that balance adventure with comfort and authenticity.",
  "Our team works with trusted local operators and community partners to create experiences that feel both elevated and grounded. Every itinerary is shaped around what makes the Pearl of Africa so magnetic: dramatic landscapes, generous hospitality, and stories worth hearing firsthand.",
  "Whether you are chasing gorillas in Bwindi, waterfalls in Sipi, or a longer stay in Jinja, we believe travel should leave you feeling more alive than when you arrived.",
];

export const cmsCollections = [
  { name: "Settings", count: 7, description: "Branding, SEO, contact, and integrations grouped for CMS editing." },
  { name: "Pages", count: 5, description: "CMS-manageable core pages with metadata and section-aligned content fields." },
  { name: "Modules", count: 12, description: "Reusable sections for heroes, CTAs, testimonials, rich text, and forms." },
  { name: "Tours", count: tours.length, description: "Destination-based itinerary tours with hero slides, itinerary days, and booking content." },
  { name: "Blog Posts", count: blogPosts.length, description: "Editorial stories with categories, hero images, and excerpts." },
  { name: "Submissions", count: 2, description: "Contact inquiries and quote requests persisted through API endpoints." },
];
