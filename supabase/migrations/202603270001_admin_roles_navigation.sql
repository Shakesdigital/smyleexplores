create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, role_id)
);

create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  order_column integer not null default 0,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

drop trigger if exists set_navigation_items_updated_at on public.navigation_items;
create trigger set_navigation_items_updated_at
before update on public.navigation_items
for each row execute procedure public.set_updated_at();

insert into public.roles (name)
values ('Super Admin'), ('Admin'), ('Editor'), ('Viewer')
on conflict (name) do nothing;

insert into public.navigation_items (label, href, order_column, status)
values
  ('Home', '/', 1, 'published'),
  ('About Us', '/about', 2, 'published'),
  ('Our Tours', '/tours', 3, 'published'),
  ('Blog', '/blog', 4, 'published'),
  ('Contact Us', '/contact', 5, 'published')
on conflict do nothing;

insert into public.settings (group_key, key, value, is_public)
values
  ('general', 'site_name', '"Smyle Explores"'::jsonb, true),
  ('general', 'tagline', '"Explore Uganda. Feel Alive."'::jsonb, true),
  ('general', 'mission', '"To create unforgettable travel experiences across Uganda by delivering safe, exciting, and authentic adventures that allow clients to explore the beauty, culture, and hidden gems of the Pearl of Africa while creating lasting memories and genuine connections."'::jsonb, true),
  ('contact', 'email', '"info@smyleexplores.com"'::jsonb, true),
  ('contact', 'phone', '"+256 759 211 663"'::jsonb, true),
  ('contact', 'whatsapp_url', '"https://wa.me/256759211663"'::jsonb, true),
  ('contact', 'address', '"Jinja, Uganda"'::jsonb, true),
  ('contact', 'office_hours', '["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM", "Sunday: By prior booking only"]'::jsonb, true),
  ('branding', 'instagram_url', '"#"'::jsonb, true),
  ('branding', 'facebook_url', '"#"'::jsonb, true),
  ('branding', 'logo_url', '"/images/logo-edited.png"'::jsonb, true),
  ('branding', 'primary_color', '"#D56017"'::jsonb, true),
  ('branding', 'secondary_color', '"#12372A"'::jsonb, true),
  ('seo', 'seo_default_title', '"Smyle Explores | Explore Uganda. Feel Alive."'::jsonb, true),
  ('seo', 'seo_default_description', '"Explore Uganda with Smyle Explores through curated Nile adventures, authentic local encounters, and premium travel experiences crafted from Jinja."'::jsonb, true),
  ('seo', 'seo_default_image', '"/images/logo-edited.png"'::jsonb, true)
on conflict (key) do nothing;

insert into public.pages (slug, title, excerpt, content, status, featured_image_url, meta_title, meta_description, meta_image_url, published_at)
values
  ('home', 'Home', 'Homepage managed through CMS content JSON.', '{"heroImage":"/images/home-hero-rafting.jpeg","heroTitle":"Explore Uganda. Feel Alive.","heroSubtitle":"Destination-led Uganda tours with waterfall escapes, wildlife safaris, primate journeys, and immersive stays in Jinja.","introEyebrow":"Pearl of Africa","introTitle":"Travel deeper into Uganda with itineraries designed around the places that make the country unforgettable.","introParagraphs":["Smyle Explores creates unforgettable journeys across Uganda, combining strong destination planning with the warmth of local hospitality.","From Sipi Falls and Bwindi to Queen Elizabeth, Lake Mburo, and Jinja, every itinerary is built to feel clear, personal, and easy to act on."],"featureImage":"/images/home-pearl-of-africa.jpeg","whyEyebrow":"Why Choose Us","whyTitle":"Destination planning with trust, local depth, and exceptional care.","whyDescription":"We design Uganda experiences that feel premium without losing the honesty and spirit of the places themselves.","whyChooseUsItems":[{"title":"Destination-Led Planning","description":"Every itinerary is built around a real Uganda destination, with pacing, lodging, and activities shaped to fit that place.","icon":"map"},{"title":"Trusted Local Handling","description":"We work with experienced guides, drivers, and community partners so every trip feels smooth, safe, and grounded.","icon":"shield"},{"title":"Flexible Experiences","description":"From primate safaris to waterfall escapes and Nile adventures, the CMS can now manage the exact experience your guests want to book.","icon":"spark"}],"toursEyebrow":"Featured Tours","toursTitle":"Signature Uganda itineraries.","toursDescription":"A handpicked preview of destination-based tours guests can browse, compare, and book from the CMS-driven frontend.","quoteImage":"/images/home-quote-feature.jpeg","quoteText":"\"Uganda is not just a destination; it is a feeling of wild beauty, warm people, and journeys that stay with you long after the road ends.\"","testimonialsEyebrow":"Testimonials","testimonialsTitle":"What travelers remember most.","testimonialsDescription":"Guest stories managed from the CMS.","ctaEyebrow":"Start Planning","ctaTitle":"Ready for your Uganda story?","ctaDescription":"Speak with Smyle Explores for tailored recommendations, group ideas, or a personalized travel quote."}'::jsonb, 'published', '/images/home-hero-rafting.jpeg', 'Smyle Explores | Explore Uganda. Feel Alive.', 'Explore Uganda with destination-led tours, authentic local encounters, and premium travel experiences managed through the CMS.', '/images/logo-edited.png', now()),
  ('about', 'About', 'About page managed through CMS content JSON.', '{"heroImage":"/images/about-hero-tubing.jpeg","heroTitle":"About Smyle Explores","heroSubtitle":"A travel company rooted in Uganda, built around safe adventure, authentic encounters, and the living beauty of the Pearl of Africa.","storyEyebrow":"Our Story","storyTitle":"Born in Jinja. Built to help travelers feel Uganda, not just see it.","storyImage":"/images/about-story-gogolo.jpeg","storyParagraphs":["Smyle Explores was created to help travelers experience Uganda with confidence, wonder, and genuine local connection. Based in Jinja, we design journeys that balance adventure with comfort and authenticity.","Our team works with trusted local operators and community partners to create experiences that feel both elevated and grounded. Every itinerary is shaped around what makes the Pearl of Africa so magnetic: dramatic landscapes, generous hospitality, and stories worth hearing firsthand.","Whether you are chasing gorillas in Bwindi, waterfalls in Sipi, or a longer stay in Jinja, we believe travel should leave you feeling more alive than when you arrived."],"missionEyebrow":"Mission","missionQuote":"To create unforgettable travel experiences across Uganda by delivering safe, exciting, and authentic adventures.","valuesEyebrow":"Values","valuesTitle":"What we protect in every trip we design.","ctaTitle":"Ready to Explore Uganda?"}'::jsonb, 'published', '/images/about-hero-tubing.jpeg', 'About Smyle Explores', 'Learn how Smyle Explores designs safe, authentic, and memorable travel experiences across Uganda.', '/images/about-hero-tubing.jpeg', now()),
  ('tours', 'Tours', 'Tours index page managed through CMS content JSON.', '{"heroImage":"/images/boat-ride-girls.jpeg","heroTitle":"Uganda Tours Built Around Real Destinations","heroSubtitle":"From waterfalls and gorillas to classic safaris and longer Nile stays, each itinerary is managed in the CMS and reflected directly on the frontend.","introEyebrow":"Tailored Itineraries","introTitle":"Choose the Uganda destination that matches your pace, interests, and travel goals.","introDescription":"Each landing page combines hero slides, short trip context, day-by-day itinerary details, and a booking form so visitors can move from browsing to planning without friction."}'::jsonb, 'published', '/images/boat-ride-girls.jpeg', 'Smyle Explores Tours', 'Browse destination-based Uganda itineraries including Sipi Falls, Bwindi and Kibale, Queen Elizabeth, Lake Mburo, and Jinja.', '/images/boat-ride-girls.jpeg', now()),
  ('blog', 'Blog', 'Blog index page managed through CMS content JSON.', '{"heroImage":"/images/blog-hero-tubing-sunset.jpeg","heroTitle":"Stories from the Pearl of Africa","heroSubtitle":"Travel notes, practical advice, and inspiration from Smyle Explores.","introEyebrow":"Journal","introTitle":"Fresh inspiration for your next Uganda journey.","introDescription":"These entries are managed from the CMS with category tags, dates, excerpts, and publishing status."}'::jsonb, 'published', '/images/blog-hero-tubing-sunset.jpeg', 'Smyle Explores Journal', 'Read Smyle Explores stories, travel notes, and practical advice for planning your Uganda journey.', '/images/blog-hero-tubing-sunset.jpeg', now()),
  ('contact', 'Contact', 'Contact page managed through CMS content JSON.', '{"heroImage":"/images/boat-ride-girls.jpeg","heroTitle":"Get in Touch","heroSubtitle":"Tell us what kind of Uganda experience you''re looking for and we''ll help shape the journey.","introEyebrow":"Contact Us","introTitle":"Plan your adventure with a local team that knows Jinja well.","quoteEyebrow":"Request a Quote","quoteTitle":"Share your dates and travel ideas."}'::jsonb, 'published', '/images/boat-ride-girls.jpeg', 'Contact Smyle Explores', 'Get in touch with Smyle Explores to plan a Uganda adventure, request a quote, or ask travel questions.', '/images/boat-ride-girls.jpeg', now())
on conflict (slug) do nothing;

insert into public.testimonials (name, title, quote, featured, order_column)
values
  ('Amelia R.', 'Adventure Traveler, Nairobi', 'The rafting day was seamless, thrilling, and incredibly well organized. Smyle Explores made Uganda feel both exciting and deeply personal.', true, 1),
  ('Daniel K.', 'Family Traveler, Kampala', 'Our sunset cruise and village walk were perfect for the whole family. The guides were warm, knowledgeable, and genuinely proud of their home.', true, 2),
  ('Sophie M.', 'Couples Getaway, London', 'Every touch felt premium without being stiff. It was authentic, beautiful, and the easiest trip we planned in East Africa.', true, 3)
on conflict do nothing;

insert into public.company_values (title, description, icon, order_column)
values
  ('Safety', 'Professional operators, clear standards, and responsible planning guide every itinerary.', 'shield', 1),
  ('Authenticity', 'We lead travelers into the real rhythm of Uganda through local stories, food, and community.', 'leaf', 2),
  ('Adventure', 'We balance exhilarating experiences with comfort and confidence for every type of explorer.', 'mountain', 3),
  ('Community', 'Our experiences are designed to create value for local guides, partners, and neighborhoods.', 'people', 4)
on conflict do nothing;

create or replace function public.has_cms_role(role_names text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = auth.uid()
      and r.name = any(role_names)
  );
$$;

alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.navigation_items enable row level security;

drop policy if exists "public can read navigation items" on public.navigation_items;
create policy "public can read navigation items"
on public.navigation_items
for select
using (status = 'published');

drop policy if exists "admins manage navigation items" on public.navigation_items;
create policy "admins manage navigation items"
on public.navigation_items
for all
using (public.has_cms_role(array['Super Admin', 'Admin']))
with check (public.has_cms_role(array['Super Admin', 'Admin']));

drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile"
on public.profiles
for select
using (auth.uid() = id or public.has_cms_role(array['Super Admin', 'Admin']));

drop policy if exists "users can update own profile" on public.profiles;
create policy "users can update own profile"
on public.profiles
for update
using (auth.uid() = id or public.has_cms_role(array['Super Admin', 'Admin']))
with check (auth.uid() = id or public.has_cms_role(array['Super Admin', 'Admin']));

drop policy if exists "admins read roles" on public.roles;
create policy "admins read roles"
on public.roles
for select
using (public.has_cms_role(array['Super Admin', 'Admin']));

drop policy if exists "admins manage user roles" on public.user_roles;
create policy "admins manage user roles"
on public.user_roles
for all
using (public.has_cms_role(array['Super Admin', 'Admin']))
with check (public.has_cms_role(array['Super Admin', 'Admin']));
