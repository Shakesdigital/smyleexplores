alter table public.tours
  add column if not exists destination text not null default 'Uganda',
  add column if not exists hero_slides jsonb not null default '[]'::jsonb,
  add column if not exists itinerary_days jsonb not null default '[]'::jsonb,
  add column if not exists booking_title text,
  add column if not exists booking_description text,
  add column if not exists related_tour_slugs jsonb not null default '[]'::jsonb;

update public.pages
set
  title = 'Tours',
  excerpt = 'Destination-based Uganda tours managed through the CMS.',
  content = jsonb_build_object(
    'heroImage', '/images/boat-ride-girls.jpeg',
    'heroTitle', 'Uganda Tours Built Around Real Destinations',
    'heroSubtitle', 'From waterfalls and gorillas to savannah game drives and Nile adventures, every itinerary is managed from the CMS and reflected directly on the site.',
    'introEyebrow', 'Tailored Itineraries',
    'introTitle', 'Choose the destination that matches the kind of Uganda experience you want.',
    'introDescription', 'Each tour page now combines destination imagery, itinerary highlights, day-by-day planning, and a booking form that visitors can act on immediately.'
  ),
  featured_image_url = '/images/boat-ride-girls.jpeg',
  meta_title = 'Smyle Explores Tours | Uganda Destination Itineraries',
  meta_description = 'Browse destination-based Uganda tours including Sipi Falls, Bwindi and Kibale, Queen Elizabeth, Lake Mburo, and Jinja.',
  meta_image_url = '/images/boat-ride-girls.jpeg',
  published_at = coalesce(published_at, now())
where slug = 'tours';

update public.tours
set status = 'draft'
where slug not in (
  'sipi-falls-3-days-escape',
  'gorilla-and-chimpanzee-safari-5-days',
  'queen-elizabeth-3-days',
  'lake-mburo-3-days',
  'jinja-5-days'
);

insert into public.tours (
  slug,
  title,
  summary,
  description,
  duration,
  difficulty,
  minimum_age,
  group_size,
  starting_price,
  location,
  destination,
  hero_image_url,
  hero_slides,
  highlights,
  itinerary_days,
  included,
  what_to_bring,
  booking_title,
  booking_description,
  related_tour_slugs,
  status,
  meta_title,
  meta_description,
  meta_image_url,
  published_at
)
values
  (
    'sipi-falls-3-days-escape',
    'Sipi Falls 3 Days Escape',
    'A three-day eastern Uganda escape shaped around Sipi''s waterfalls, coffee stories, caves, and soft adventure.',
    '[
      "Spend three days in the Sipi highlands where cool air, layered waterfalls, and coffee culture create one of Uganda''s most photogenic escapes.",
      "This itinerary balances gentle adventure with local connection, giving guests enough time to hike, learn, rest, and absorb the landscape without rushing.",
      "It works well for couples, small groups, and travelers who want Uganda beyond the standard safari circuit."
    ]'::jsonb,
    '3 Days / 2 Nights',
    'Moderate',
    '12+',
    '2-12 guests',
    'From $640 per person',
    'Sipi Falls, Kapchorwa, Uganda',
    'Sipi Falls',
    '/images/about-story-gogolo.jpeg',
    '[
      {"image":"/images/about-story-gogolo.jpeg","title":"Arrival in the foothills","subtitle":"Check into Sipi and settle into the mountain pace with sunset views over the escarpment."},
      {"image":"/images/home-pearl-of-africa.jpeg","title":"Waterfalls and caves","subtitle":"Walk to the three falls, visit caves, and discover the drama of eastern Uganda''s highlands."},
      {"image":"/images/blog-jinja-weekend-getaway.jpeg","title":"Coffee and community","subtitle":"Meet local coffee growers and taste the process from bean to cup before your return."}
    ]'::jsonb,
    '["Waterfall hikes with panoramic viewpoints","Arabica coffee experience with local farmers","Community-led cave and village walks","Cool-climate mountain retreat atmosphere"]'::jsonb,
    '[
      {"dayLabel":"Day 1","title":"Travel to Sipi Falls","description":"Drive east through Mbale into the foothills of Mount Elgon and arrive in time for a relaxed evening.","activities":["Scenic transfer from Kampala or Jinja","Check-in with ridge views","Sunset walk or relaxed lodge evening"],"image":"/images/about-story-gogolo.jpeg"},
      {"dayLabel":"Day 2","title":"Waterfall circuit and coffee tour","description":"Dedicate the day to Sipi''s signature landscapes and the coffee-growing families that define the area.","activities":["Guided hike to the main Sipi Falls","Explore caves and cliff viewpoints","Arabica coffee tour and tasting"],"image":"/images/home-pearl-of-africa.jpeg"},
      {"dayLabel":"Day 3","title":"Morning activity and return","description":"Choose a soft final adventure before heading back with the highlands still fresh in mind.","activities":["Optional abseiling or nature walk","Breakfast with valley views","Return transfer"],"image":"/images/blog-jinja-weekend-getaway.jpeg"}
    ]'::jsonb,
    '["Accommodation for 2 nights","Ground transport","Guide services","Coffee experience","Waterfall hike fees","Daily breakfast"]'::jsonb,
    '["Hiking shoes","Warm layer for cool evenings","Rain jacket","Camera","Reusable water bottle"]'::jsonb,
    'Plan Your Sipi Escape',
    'Share your dates, group size, and any hiking or comfort preferences. We will tailor the Sipi Falls escape around them.',
    '["queen-elizabeth-3-days","lake-mburo-3-days","jinja-5-days"]'::jsonb,
    'published',
    'Sipi Falls 3 Days Escape | Smyle Explores',
    'Explore Sipi Falls with a three-day itinerary featuring waterfalls, coffee, and light adventure in eastern Uganda.',
    '/images/about-story-gogolo.jpeg',
    now()
  ),
  (
    'gorilla-and-chimpanzee-safari-5-days',
    '5-Day Gorilla and Chimpanzee Safari',
    'A primate-focused western Uganda safari connecting chimp trekking in Kibale with gorilla trekking in Bwindi.',
    '[
      "This five-day safari is designed for travelers who want Uganda''s most iconic wildlife encounters in one tightly run journey.",
      "You move from Kibale''s forest primates to Bwindi''s mountain gorillas, with scenic transfers and cultural context woven in.",
      "The pace is active but rewarding, making it ideal for guests prioritizing once-in-a-lifetime wildlife moments."
    ]'::jsonb,
    '5 Days / 4 Nights',
    'Moderate to Active',
    '15+',
    '2-8 guests',
    'From $2,850 per person',
    'Kibale Forest and Bwindi Impenetrable Forest, Uganda',
    'Western Uganda Primates',
    '/images/home-hero-rafting.jpeg',
    '[
      {"image":"/images/home-hero-rafting.jpeg","title":"Kibale forest encounter","subtitle":"Track chimpanzees through one of East Africa''s richest tropical forests."},
      {"image":"/images/boat-ride-girls.jpeg","title":"Bwindi gorilla trekking","subtitle":"Meet a habituated gorilla family in one of the world''s most memorable wildlife experiences."},
      {"image":"/images/blog-top-5-jinja.jpeg","title":"Scenic western Uganda","subtitle":"Travel through crater lakes, tea country, and mountain roads between experiences."}
    ]'::jsonb,
    '["Chimpanzee trekking permit in Kibale","Gorilla trekking permit in Bwindi","Scenic safari drives through western Uganda","Comfort-focused lodge routing with experienced guides"]'::jsonb,
    '[
      {"dayLabel":"Day 1","title":"Transfer to Kibale region","description":"Travel west through tea country and crater lake landscapes toward Kibale.","activities":["Pick-up and safari briefing","Scenic transfer with lunch en route","Lodge check-in near Kibale"],"image":"/images/home-hero-rafting.jpeg"},
      {"dayLabel":"Day 2","title":"Chimpanzee trekking and Bigodi","description":"Head into the forest early, then spend the afternoon exploring a community wetland walk.","activities":["Chimpanzee tracking session","Lunch at the lodge","Bigodi wetland or community walk"],"image":"/images/boat-ride-girls.jpeg"},
      {"dayLabel":"Day 3","title":"Transfer to Bwindi","description":"Cross western Uganda''s rolling landscapes toward the gorilla trekking region.","activities":["Morning departure","Scenic drive via Queen Elizabeth corridor","Arrival and trek briefing"],"image":"/images/blog-top-5-jinja.jpeg"},
      {"dayLabel":"Day 4","title":"Gorilla trekking day","description":"Meet your ranger team and trek for a deeply memorable hour with a habituated gorilla family.","activities":["Early park registration","Guided gorilla trek","Post-trek rest and celebration"],"image":"/images/home-pearl-of-africa.jpeg"},
      {"dayLabel":"Day 5","title":"Return journey","description":"Begin the drive back with scheduled breaks and optional souvenir stops.","activities":["Breakfast at the lodge","Return transfer","Drop-off in Kampala or Entebbe"],"image":"/images/about-story-gogolo.jpeg"}
    ]'::jsonb,
    '["Accommodation for 4 nights","Primate permits","Private transport","English-speaking guide","Daily breakfast and selected meals"]'::jsonb,
    '["Sturdy hiking boots","Long trousers","Rain jacket","Daypack","Passport for permit checks"]'::jsonb,
    'Request Your Primate Safari',
    'Tell us your preferred travel window, permit priorities, and accommodation level. We will shape the safari around availability and pace.',
    '["queen-elizabeth-3-days","lake-mburo-3-days","sipi-falls-3-days-escape"]'::jsonb,
    'published',
    '5-Day Gorilla and Chimpanzee Safari | Smyle Explores',
    'Track chimpanzees in Kibale and gorillas in Bwindi on a five-day Uganda safari managed end to end by Smyle Explores.',
    '/images/home-hero-rafting.jpeg',
    now()
  ),
  (
    'queen-elizabeth-3-days',
    'Queen Elizabeth 3 Days',
    'A compact safari into Queen Elizabeth National Park for game drives, crater landscapes, and the Kazinga Channel.',
    '[
      "Queen Elizabeth National Park delivers one of Uganda''s strongest short safari combinations: open savannah, water wildlife, and big scenic range.",
      "This three-day itinerary is paced for guests who want real safari time without committing to a full week on the road.",
      "Game drives and the Kazinga Channel boat trip anchor the experience, with room for comfortable lodge downtime."
    ]'::jsonb,
    '3 Days / 2 Nights',
    'Easy to Moderate',
    '8+',
    '2-16 guests',
    'From $790 per person',
    'Queen Elizabeth National Park, Uganda',
    'Queen Elizabeth National Park',
    '/images/white-water-rafting.jpeg',
    '[
      {"image":"/images/white-water-rafting.jpeg","title":"Savannah game drives","subtitle":"Search for elephants, buffalo, antelope, and predators across open plains."},
      {"image":"/images/sunset-cruise.jpeg","title":"Kazinga Channel cruise","subtitle":"Watch hippos, crocodiles, and birdlife gather on one of Uganda''s richest waterways."},
      {"image":"/images/blog-hero-tubing-sunset.jpeg","title":"Crater and rift landscapes","subtitle":"Travel through volcanic scenery and broad valley views that define the park."}
    ]'::jsonb,
    '["Classic savannah wildlife viewing","Kazinga Channel boat safari","Comfortable short-format national park itinerary","Strong fit for first-time Uganda safari guests"]'::jsonb,
    '[
      {"dayLabel":"Day 1","title":"Travel to Queen Elizabeth","description":"Drive west through countryside and into the park ecosystem.","activities":["Pick-up and departure","Lunch stop en route","Evening arrival and lodge check-in"],"image":"/images/white-water-rafting.jpeg"},
      {"dayLabel":"Day 2","title":"Game drive and channel cruise","description":"Dedicate the full day to the park''s signature land and water wildlife experiences.","activities":["Morning game drive","Afternoon Kazinga Channel boat trip","Sunset lodge relaxation"],"image":"/images/sunset-cruise.jpeg"},
      {"dayLabel":"Day 3","title":"Final wildlife viewing and return","description":"Catch a final short drive or viewpoint stop before the journey back.","activities":["Optional early game activity","Breakfast and departure","Return transfer"],"image":"/images/blog-hero-tubing-sunset.jpeg"}
    ]'::jsonb,
    '["Accommodation for 2 nights","Park entry fees","Boat safari","Ground transport","Guide services","Daily breakfast"]'::jsonb,
    '["Neutral safari clothing","Binoculars","Sun hat","Camera","Small overnight bag"]'::jsonb,
    'Book the Queen Elizabeth Safari',
    'Share your dates and room preferences. We will quote the right lodge category and safari routing for your group.',
    '["lake-mburo-3-days","gorilla-and-chimpanzee-safari-5-days","sipi-falls-3-days-escape"]'::jsonb,
    'published',
    'Queen Elizabeth 3 Days | Smyle Explores',
    'Experience Queen Elizabeth National Park over three days with game drives and a Kazinga Channel boat safari.',
    '/images/white-water-rafting.jpeg',
    now()
  ),
  (
    'lake-mburo-3-days',
    'Lake Mburo 3 Days',
    'A relaxed three-day safari ideal for wildlife viewing, walking safaris, and a softer introduction to Uganda''s parks.',
    '[
      "Lake Mburo works especially well for guests who want zebra, impala, wetlands, and close-to-nature safari moments without long transfer fatigue.",
      "The park''s smaller scale makes it perfect for walking safaris, boat trips, and a calm lodge rhythm.",
      "This itinerary is popular with couples, families, and travelers pairing wildlife with other Uganda destinations."
    ]'::jsonb,
    '3 Days / 2 Nights',
    'Easy',
    '6+',
    '2-12 guests',
    'From $680 per person',
    'Lake Mburo National Park, Uganda',
    'Lake Mburo National Park',
    '/images/nile-kayaking.jpg',
    '[
      {"image":"/images/nile-kayaking.jpg","title":"Wildlife at a softer pace","subtitle":"See zebra, impala, buffalo, and birds in a park well suited to relaxed safari travel."},
      {"image":"/images/source-of-the-nile-boat-tour.jpg","title":"Boat and walking safari","subtitle":"Combine water-based wildlife viewing with an on-foot perspective uncommon in many parks."},
      {"image":"/images/horseback-riding.jpeg","title":"Comfortable lodge downtime","subtitle":"Stay close to the park and let the landscape set the pace for the trip."}
    ]'::jsonb,
    '["Walking safari opportunity","Boat trip on Lake Mburo","Zebra and impala-rich landscapes","Excellent short safari for mixed-age groups"]'::jsonb,
    '[
      {"dayLabel":"Day 1","title":"Travel to Lake Mburo","description":"Journey to one of Uganda''s most accessible parks and settle into a relaxed safari base.","activities":["Morning departure","Equator stop if routing allows","Evening game drive"],"image":"/images/nile-kayaking.jpg"},
      {"dayLabel":"Day 2","title":"Walking safari and boat trip","description":"See the park from two very different vantage points in one rewarding day.","activities":["Guided walking safari","Rest and lunch at the lodge","Afternoon boat safari"],"image":"/images/source-of-the-nile-boat-tour.jpg"},
      {"dayLabel":"Day 3","title":"Morning drive and return","description":"Catch a final wildlife window before returning east.","activities":["Sunrise game drive","Breakfast and checkout","Return transfer"],"image":"/images/horseback-riding.jpeg"}
    ]'::jsonb,
    '["Accommodation for 2 nights","Park fees","Walking safari","Boat trip","Transport","Daily breakfast"]'::jsonb,
    '["Light neutral clothing","Walking shoes","Hat","Insect repellent","Binoculars"]'::jsonb,
    'Plan Your Lake Mburo Getaway',
    'Send your travel dates and we will build the right Lake Mburo stay with lodging and activity options that fit your pace.',
    '["queen-elizabeth-3-days","jinja-5-days","sipi-falls-3-days-escape"]'::jsonb,
    'published',
    'Lake Mburo 3 Days | Smyle Explores',
    'Discover Lake Mburo over three days with wildlife drives, a walking safari, and a boat trip.',
    '/images/nile-kayaking.jpg',
    now()
  ),
  (
    'jinja-5-days',
    'Jinja 5 Days',
    'A five-day Jinja itinerary that turns the Nile city into a full destination, blending adrenaline, river time, and local culture.',
    '[
      "This itinerary repositions Jinja as a complete destination rather than a single-activity stop.",
      "Across five days, guests can combine river adventure, boat time, village encounters, and slower scenic moments while keeping a comfortable home base.",
      "It is the best choice for travelers who want variety and a deeper stay around Uganda''s adventure capital."
    ]'::jsonb,
    '5 Days / 4 Nights',
    'Flexible',
    '8+',
    '2-14 guests',
    'From $920 per person',
    'Jinja, Uganda',
    'Jinja and the Nile',
    '/images/boat-ride-girls.jpeg',
    '[
      {"image":"/images/boat-ride-girls.jpeg","title":"Nile adventure days","subtitle":"Build your stay around rafting, tubing, kayaking, or jet boating depending on pace and appetite."},
      {"image":"/images/sunset-cruise.jpeg","title":"Source of the Nile and sunset water","subtitle":"Layer in calmer boat experiences that show the softer side of Jinja."},
      {"image":"/images/quad-biking.jpeg","title":"Culture and countryside","subtitle":"Step beyond the river with community visits, horseback riding, or quad biking in the surrounding landscape."}
    ]'::jsonb,
    '["Flexible multi-day Jinja planning","Combination of adventure and cultural moments","Ideal for groups wanting a destination base","Booking form tied directly to the itinerary page"]'::jsonb,
    '[
      {"dayLabel":"Day 1","title":"Arrival and orientation","description":"Arrive in Jinja and settle into the riverside atmosphere before the itinerary begins in full.","activities":["Arrival transfer","Check-in","Evening briefing and relaxed Nile view"],"image":"/images/boat-ride-girls.jpeg"},
      {"dayLabel":"Day 2","title":"Adventure on the Nile","description":"Choose a signature high-energy river activity based on your preferred intensity.","activities":["White-water rafting or tubing","Lunch and recovery time","Optional evening social stop"],"image":"/images/home-hero-rafting.jpeg"},
      {"dayLabel":"Day 3","title":"Source of the Nile and local encounters","description":"Slow the pace with history, water, and local stories around Jinja.","activities":["Source of the Nile boat tour","Craft or market stop","Sunset cruise option"],"image":"/images/sunset-cruise.jpeg"},
      {"dayLabel":"Day 4","title":"Countryside activity day","description":"Take Jinja beyond the river with a land-based experience.","activities":["Quad biking, horseback riding, or ziplining","Community interaction stop","Free evening"],"image":"/images/quad-biking.jpeg"},
      {"dayLabel":"Day 5","title":"Leisure morning and departure","description":"Close the trip with one last gentle river or café moment before departure.","activities":["Breakfast and optional short walk","Checkout","Departure transfer"],"image":"/images/source-of-the-nile-boat-tour.jpg"}
    ]'::jsonb,
    '["Accommodation for 4 nights","Private transfers","Selected activities from itinerary design","Guide coordination","Daily breakfast"]'::jsonb,
    '["Comfortable adventure clothing","Closed shoes and sandals","Swimwear","Light evening layer","Phone or camera"]'::jsonb,
    'Customize Your Jinja Stay',
    'Tell us which Jinja experiences matter most to your group and we will shape the five-day itinerary around them.',
    '["sipi-falls-3-days-escape","lake-mburo-3-days","queen-elizabeth-3-days"]'::jsonb,
    'published',
    'Jinja 5 Days | Smyle Explores',
    'Stay in Jinja for five days with a destination-based itinerary combining river adventure, culture, and tailored booking.',
    '/images/boat-ride-girls.jpeg',
    now()
  )
on conflict (slug) do update
set
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  duration = excluded.duration,
  difficulty = excluded.difficulty,
  minimum_age = excluded.minimum_age,
  group_size = excluded.group_size,
  starting_price = excluded.starting_price,
  location = excluded.location,
  destination = excluded.destination,
  hero_image_url = excluded.hero_image_url,
  hero_slides = excluded.hero_slides,
  highlights = excluded.highlights,
  itinerary_days = excluded.itinerary_days,
  included = excluded.included,
  what_to_bring = excluded.what_to_bring,
  booking_title = excluded.booking_title,
  booking_description = excluded.booking_description,
  related_tour_slugs = excluded.related_tour_slugs,
  status = excluded.status,
  meta_title = excluded.meta_title,
  meta_description = excluded.meta_description,
  meta_image_url = excluded.meta_image_url,
  published_at = excluded.published_at;
