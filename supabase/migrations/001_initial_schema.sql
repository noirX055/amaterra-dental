-- ============================================================
-- Amaterra Dental Clinic — Initial Database Schema
-- ============================================================

-- 1. APPOINTMENTS
-- Stores booking requests from the website (BookingModal + FindUsBlock)
create table if not exists public.appointments (
  id            uuid primary key default gen_random_uuid(),
  first_name    text not null,
  last_name     text not null,
  phone         text not null,
  email         text,
  preferred_date date not null,
  preferred_time text,
  status        text not null default 'pending'
                  check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes         text,
  lang          text not null default 'ru'
                  check (lang in ('ru', 'ro', 'en')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.appointments is 'Booking requests submitted through the website.';

-- 2. SERVICES
-- Master list of dental services (powers the Specializations & Our Services blocks)
create table if not exists public.services (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title_ru      text not null,
  title_ro      text not null,
  title_en      text not null,
  description_ru text,
  description_ro text,
  description_en text,
  image_url     text,
  price_from    numeric(10,2),
  is_featured   boolean not null default false,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.services is 'Dental services offered by the clinic, with multilingual content.';

-- 3. REVIEWS
-- Patient testimonials shown on the website
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  patient_name  text not null,
  patient_role  text,
  avatar_url    text,
  text_ru       text not null,
  text_ro       text,
  text_en       text,
  rating        smallint not null default 5
                  check (rating between 1 and 5),
  is_published  boolean not null default false,
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

comment on table public.reviews is 'Patient reviews and testimonials.';

-- 4. BLOG POSTS (Latest Insights)
-- Articles for the "Latest Insights" section
create table if not exists public.blog_posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title_ru      text not null,
  title_ro      text,
  title_en      text,
  body_ru       text not null,
  body_ro       text,
  body_en       text,
  excerpt_ru    text,
  excerpt_ro    text,
  excerpt_en    text,
  cover_image   text,
  is_published  boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.blog_posts is 'Blog articles for the Latest Insights section.';

-- 5. CONTACT MESSAGES
-- General enquiries from the Find Us block
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  message       text,
  preferred_date date,
  preferred_time text,
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

comment on table public.contact_messages is 'Contact form submissions from the website.';

-- ============================================================
-- Row Level Security (RLS) — enable on all tables
-- ============================================================

alter table public.appointments    enable row level security;
alter table public.services        enable row level security;
alter table public.reviews         enable row level security;
alter table public.blog_posts      enable row level security;
alter table public.contact_messages enable row level security;

-- Public read access for published content
create policy "Anyone can read services"
  on public.services for select
  using (true);

create policy "Anyone can read published reviews"
  on public.reviews for select
  using (is_published = true);

create policy "Anyone can read published blog posts"
  on public.blog_posts for select
  using (is_published = true);

-- Public insert for appointments and contact messages (website visitors)
create policy "Anyone can create appointments"
  on public.appointments for insert
  with check (true);

create policy "Anyone can submit contact messages"
  on public.contact_messages for insert
  with check (true);

-- ============================================================
-- Indexes for common queries
-- ============================================================

create index if not exists idx_appointments_status     on public.appointments (status);
create index if not exists idx_appointments_created_at on public.appointments (created_at desc);
create index if not exists idx_services_sort           on public.services (sort_order);
create index if not exists idx_services_featured       on public.services (is_featured) where is_featured = true;
create index if not exists idx_reviews_published       on public.reviews (sort_order) where is_published = true;
create index if not exists idx_blog_posts_published    on public.blog_posts (published_at desc) where is_published = true;

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.appointments
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.services
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.blog_posts
  for each row execute function public.handle_updated_at();
