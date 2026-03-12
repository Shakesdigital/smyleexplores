create extension if not exists "pgcrypto";

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  group_key text not null,
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  status text not null default 'published',
  featured_image_url text,
  meta_title text,
  meta_description text,
  meta_image_url text,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  name text not null,
  status text not null default 'active',
  config jsonb not null default '{}'::jsonb,
  region text default 'main',
  order_column integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.modulables (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  modulable_type text not null,
  modulable_id uuid not null,
  region text default 'main',
  order_column integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  description jsonb not null default '[]'::jsonb,
  duration text not null,
  difficulty text not null,
  minimum_age text not null,
  group_size text,
  starting_price text not null,
  location text not null default 'Jinja, Uganda',
  hero_image_url text,
  highlights jsonb not null default '[]'::jsonb,
  included jsonb not null default '[]'::jsonb,
  what_to_bring jsonb not null default '[]'::jsonb,
  status text not null default 'published',
  meta_title text,
  meta_description text,
  meta_image_url text,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  content jsonb not null default '{}'::jsonb,
  category text,
  featured_image_url text,
  status text not null default 'published',
  meta_title text,
  meta_description text,
  meta_image_url text,
  published_at timestamptz default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  title text,
  quote text not null,
  featured boolean not null default false,
  order_column integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo_url text,
  order_column integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  order_column integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  travel_date date not null,
  guests text not null,
  preferred_tour text,
  special_requests text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.settings enable row level security;
alter table public.pages enable row level security;
alter table public.modules enable row level security;
alter table public.modulables enable row level security;
alter table public.tours enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.team_members enable row level security;
alter table public.company_values enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.quote_requests enable row level security;

drop policy if exists "public can read public settings" on public.settings;
create policy "public can read public settings" on public.settings for select using (is_public = true);
drop policy if exists "public can read published pages" on public.pages;
create policy "public can read published pages" on public.pages for select using (status = 'published');
drop policy if exists "public can read active modules" on public.modules;
create policy "public can read active modules" on public.modules for select using (status = 'active');
drop policy if exists "public can read published tours" on public.tours;
create policy "public can read published tours" on public.tours for select using (status = 'published');
drop policy if exists "public can read published blog posts" on public.blog_posts;
create policy "public can read published blog posts" on public.blog_posts for select using (status = 'published');
drop policy if exists "public can read testimonials" on public.testimonials;
create policy "public can read testimonials" on public.testimonials for select using (true);
drop policy if exists "public can read team members" on public.team_members;
create policy "public can read team members" on public.team_members for select using (true);
drop policy if exists "public can read company values" on public.company_values;
create policy "public can read company values" on public.company_values for select using (true);
drop policy if exists "public can create contact submissions" on public.contact_submissions;
create policy "public can create contact submissions" on public.contact_submissions for insert with check (true);
drop policy if exists "public can create quote requests" on public.quote_requests;
create policy "public can create quote requests" on public.quote_requests for insert with check (true);
