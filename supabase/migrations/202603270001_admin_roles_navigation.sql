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
  ('home', 'Home', 'Homepage managed through CMS content JSON.', '{"heroImage":"/images/home-hero-rafting.jpeg","heroTitle":"Explore Uganda. Feel Alive.","heroSubtitle":"Curated Nile adventures, authentic local encounters, and premium travel experiences crafted from the heart of Jinja.","introEyebrow":"Pearl of Africa","introTitle":"Travel deeper into Uganda with a team that knows how to make every moment count.","introParagraphs":["Smyle Explores creates unforgettable journeys across Uganda, combining the drama of the Nile with the warmth of local hospitality.","Based in Jinja, we help travelers experience the Pearl of Africa through safe adventures, authentic cultural moments, and carefully handled details that make the trip feel effortless."],"featureImage":"/images/home-pearl-of-africa.jpeg","whyEyebrow":"Why Choose Us","whyTitle":"Adventure with trust, local depth, and exceptional care.","whyDescription":"We design experiences that feel premium without losing the honesty and spirit of Uganda.","toursEyebrow":"Featured Tours","toursTitle":"Signature experiences on and around the Nile.","toursDescription":"A handpicked preview of the adventures guests ask for most.","quoteImage":"/images/home-quote-feature.jpeg","quoteText":"\"Uganda is not just a destination; it is a feeling of wild beauty, warm people, and rivers that carry stories.\"","testimonialsEyebrow":"Testimonials","testimonialsTitle":"What travelers remember most.","testimonialsDescription":"Guest stories managed from the CMS.","ctaEyebrow":"Start Planning","ctaTitle":"Ready for your Uganda story?","ctaDescription":"Speak with Smyle Explores for tailored recommendations, group ideas, or a personalized travel quote."}'::jsonb, 'published', '/images/home-hero-rafting.jpeg', 'Smyle Explores | Explore Uganda. Feel Alive.', 'Explore Uganda with curated Nile adventures, authentic local encounters, and premium travel experiences crafted from Jinja.', '/images/logo-edited.png', now()),
  ('about', 'About', 'About page managed through CMS content JSON.', '{"heroImage":"/images/about-hero-tubing.jpeg","heroTitle":"About Smyle Explores","heroSubtitle":"A travel company rooted in Jinja, built around safe adventure, authentic encounters, and the living beauty of Uganda.","storyEyebrow":"Our Story","storyTitle":"Born in Jinja. Built to help travelers feel Uganda, not just see it.","storyImage":"/images/about-story-gogolo.jpeg","missionEyebrow":"Mission","missionQuote":"To create unforgettable travel experiences across Uganda by delivering safe, exciting, and authentic adventures.","valuesEyebrow":"Values","valuesTitle":"What we protect in every trip we design.","ctaTitle":"Ready to Explore Uganda?"}'::jsonb, 'published', '/images/about-hero-tubing.jpeg', 'About Smyle Explores', 'Learn how Smyle Explores designs safe, authentic, and memorable travel experiences rooted in Jinja, Uganda.', '/images/about-hero-tubing.jpeg', now()),
  ('tours', 'Tours', 'Tours index page managed through CMS content JSON.', '{"heroImage":"/images/boat-ride-girls.jpeg","heroTitle":"Our Tours","heroSubtitle":"Adventure Awaits on the Banks of the Nile","introEyebrow":"Adventure Capital","introTitle":"Jinja is Uganda''s gateway to river adventure, local culture, and unforgettable landscapes.","introDescription":"Located on the shores of Lake Victoria at the source of the world''s longest river, Jinja blends high-energy activities with relaxed beauty and meaningful local experiences."}'::jsonb, 'published', '/images/boat-ride-girls.jpeg', 'Smyle Explores Tours', 'Browse adventure experiences in and around Jinja, from rafting and bungee jumping to sunset cruises and tubing.', '/images/boat-ride-girls.jpeg', now()),
  ('blog', 'Blog', 'Blog index page managed through CMS content JSON.', '{"heroImage":"/images/blog-hero-tubing-sunset.jpeg","heroTitle":"Stories from the Pearl of Africa","heroSubtitle":"Travel notes, practical advice, and inspiration from Smyle Explores.","introEyebrow":"Journal","introTitle":"Fresh inspiration for your next Uganda journey.","introDescription":"These entries are managed from the CMS with category tags, dates, excerpts, and publishing status."}'::jsonb, 'published', '/images/blog-hero-tubing-sunset.jpeg', 'Smyle Explores Journal', 'Read Smyle Explores stories, travel notes, and practical advice for planning your Uganda journey.', '/images/blog-hero-tubing-sunset.jpeg', now()),
  ('contact', 'Contact', 'Contact page managed through CMS content JSON.', '{"heroImage":"/images/boat-ride-girls.jpeg","heroTitle":"Get in Touch","heroSubtitle":"Tell us what kind of Uganda experience you''re looking for and we''ll help shape the journey.","introEyebrow":"Contact Us","introTitle":"Plan your adventure with a local team that knows Jinja well.","quoteEyebrow":"Request a Quote","quoteTitle":"Share your dates and travel ideas."}'::jsonb, 'published', '/images/boat-ride-girls.jpeg', 'Contact Smyle Explores', 'Get in touch with Smyle Explores to plan a Uganda adventure, request a quote, or ask travel questions.', '/images/boat-ride-girls.jpeg', now())
on conflict (slug) do nothing;

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
