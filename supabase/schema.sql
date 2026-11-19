-- Cosplay Horizons — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- Then run supabase/seed.sql in the same way.
-- Then create the storage bucket (see bottom of this file).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- cosplays
create table if not exists public.cosplays (
  id integer primary key,
  character text not null,
  -- v1.1 follow-up: wide category, e.g. 'Trails'; series is the specific series.
  main_series text,
  series text not null,
  cosplayer text not null,
  cosplayer_handle text not null default '',
  instagram_url text not null default '',
  event text,
  date text,
  photographer text,
  photographer_url text,
  photo_url text,
  -- v1.1: all photos, first = cover. photo_url is kept as the cover.
  photo_urls text[] not null default '{}',
  variant_type text not null default 'traditional' check (variant_type in ('traditional', 'christmas', 'halloween', 'other')),
  variant_label text,
  has_photo boolean not null default false,
  is_favorite boolean not null default false,
  is_first_cosplay boolean not null default false,
  notes text,
  status text not null default 'approved' check (status in ('approved', 'pending', 'hidden')),
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------- submissions
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  character text not null,
  main_series text,
  series text not null,
  cosplayer text not null,
  instagram_url text,
  event text,
  date text,
  photographer text,
  photographer_url text,
  photo_path text,
  photo_file_name text,
  -- v1.1: all uploaded photos, first = cover; names in the same order.
  photo_paths text[] not null default '{}',
  photo_file_names text[] not null default '{}',
  variant_type text not null default 'traditional' check (variant_type in ('traditional', 'christmas', 'halloween', 'other')),
  variant_label text,
  -- v1.1 follow-up: submitter confirmed the character has no last name.
  no_last_name boolean not null default false,
  consent boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

-- -------------------------------------------------------- takedown_requests
create table if not exists public.takedown_requests (
  id uuid primary key default gen_random_uuid(),
  cosplay_id integer references public.cosplays(id) on delete set null,
  character text,
  requester_name text not null,
  contact text not null,
  reason text not null,
  status text not null default 'open' check (status in ('open', 'actioned', 'declined')),
  created_at timestamptz not null default now()
);

-- --------------------------------------------------------------------- RLS
alter table public.cosplays enable row level security;
alter table public.submissions enable row level security;
alter table public.takedown_requests enable row level security;

-- Anyone can read APPROVED cosplays. Nothing else is public.
drop policy if exists "Public can read approved cosplays" on public.cosplays;
create policy "Public can read approved cosplays"
  on public.cosplays for select
  using (status = 'approved');

-- Anyone can submit a cosplay or a takedown request (insert only).
-- They cannot read, update, or delete other people's submissions/requests.
drop policy if exists "Anyone can insert submissions" on public.submissions;
create policy "Anyone can insert submissions"
  on public.submissions for insert
  with check (true);

drop policy if exists "Anyone can insert takedown requests" on public.takedown_requests;
create policy "Anyone can insert takedown requests"
  on public.takedown_requests for insert
  with check (true);

-- The service_role key (used only by the server API routes) bypasses RLS,
-- so Ethan can review/approve submissions in the Supabase dashboard
-- (Table Editor) without extra policies. Do NOT put the service_role key
-- in the browser or in NEXT_PUBLIC_* variables.

-- ------------------------------------------------------------------ indexes
create index if not exists cosplays_character_idx on public.cosplays (lower(character));
create index if not exists cosplays_cosplayer_idx on public.cosplays (lower(cosplayer));
create index if not exists cosplays_series_idx on public.cosplays (series);
create index if not exists cosplays_main_series_idx on public.cosplays (main_series);
create index if not exists cosplays_variant_type_idx on public.cosplays (variant_type);
create index if not exists submissions_variant_type_idx on public.submissions (variant_type);
create index if not exists submissions_status_idx on public.submissions (status);
create index if not exists takedowns_status_idx on public.takedown_requests (status);

-- ------------------------------------------------------------------- storage
-- Create the bucket in the Dashboard (Storage → New bucket):
--   Name: cosplay-photos
--   Public bucket: ON  (photos are meant to be viewed publicly)
--   File size limit: 8 MB
--   Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
-- Or run this in SQL (bucket creation via SQL needs the storage schema):
--   insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
--   values ('cosplay-photos', 'cosplay-photos', true, 8388608,
--           array['image/jpeg','image/png','image/webp','image/gif'])
--   on conflict (id) do nothing;
-- Storage policies (public read, upload only via the server API route
-- which uses the service_role key and bypasses storage RLS):
--   In Storage → Policies for cosplay-photos, add:
--   SELECT: true (public read)
--   INSERT / UPDATE / DELETE: only service_role (leave no anon policy)
