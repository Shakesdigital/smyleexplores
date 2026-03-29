alter table public.tours
  add column if not exists cta_label text,
  add column if not exists cta_href text;

update public.tours
set
  cta_label = coalesce(nullif(cta_label, ''), 'View Itinerary'),
  cta_href = coalesce(nullif(cta_href, ''), '/tours/' || slug)
where coalesce(cta_label, '') = ''
   or coalesce(cta_href, '') = '';
