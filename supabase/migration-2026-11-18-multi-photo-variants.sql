-- Cosplay Horizons — v1.1 migration: multi-photo uploads + variant tags
-- + v1.1 follow-up (Nov 18 2026): main_series, Agate id 3 Cupsleeve variant,
-- and submissions.no_last_name.
-- Run this in Supabase Dashboard → SQL Editor → New query → paste → Run,
-- BEFORE the next redeploy (the v1.1 code writes the new columns).
-- Do NOT run it against a fresh database: supabase/schema.sql already
-- includes these columns. This is only for the existing live project,
-- created from the v1 schema on Nov 16, 2026.
-- Safe to re-run: every ADD COLUMN uses IF NOT EXISTS, backfills only
-- touch rows where the new column is still NULL, and indexes use
-- IF NOT EXISTS.

-- ---------------------------------------------------------------- cosplays
alter table public.cosplays
  add column if not exists photo_urls text[] not null default '{}';

alter table public.cosplays
  add column if not exists variant_type text
    not null default 'traditional'
    check (variant_type in ('traditional', 'christmas', 'halloween', 'other'));

alter table public.cosplays
  add column if not exists variant_label text;

-- v1.1 follow-up: wide category; series stays the specific series.
alter table public.cosplays
  add column if not exists main_series text;

-- Backfill: cover photo becomes the single entry in photo_urls.
update public.cosplays
  set photo_urls = array[photo_url]
  where photo_url is not null
    and (photo_urls is null or photo_urls = '{}');

-- Any row still without a variant becomes traditional (all 13 v1 rows).
update public.cosplays
  set variant_type = 'traditional'
  where variant_type is null;

-- v1.1 follow-up: backfill main_series from the specific series.
-- Single-entry series keep main = specific.
update public.cosplays
  set main_series = case series
    when 'Trails in the Sky' then 'Trails'
    when 'Persona 3' then 'Persona'
    when 'D&D original' then 'Dungeons & Dragons'
    when 'Kamen Rider Wizard' then 'Kamen Rider'
    else series
  end
  where main_series is null;

-- CORRECTION (Ethan, Nov 18 2026): id 3, Agate Crosner at the Trails
-- cupsleeve event (Sep 20, 2026), is a variant, not traditional.
-- Id 4 (Agate, Anime Expo) stays traditional.
update public.cosplays
  set variant_type = 'other', variant_label = 'Cupsleeve'
  where id = 3;

-- ------------------------------------------------------------- submissions
alter table public.submissions
  add column if not exists photo_paths text[] not null default '{}';

alter table public.submissions
  add column if not exists photo_file_names text[] not null default '{}';

alter table public.submissions
  add column if not exists variant_type text
    not null default 'traditional'
    check (variant_type in ('traditional', 'christmas', 'halloween', 'other'));

alter table public.submissions
  add column if not exists variant_label text;

alter table public.submissions
  add column if not exists main_series text;

alter table public.submissions
  add column if not exists no_last_name boolean not null default false;

-- Backfill: the single uploaded photo becomes the single entry.
update public.submissions
  set photo_paths = array[photo_path]
  where photo_path is not null
    and (photo_paths is null or photo_paths = '{}');

update public.submissions
  set photo_file_names = array[photo_file_name]
  where photo_file_name is not null
    and (photo_file_names is null or photo_file_names = '{}');

update public.submissions
  set variant_type = 'traditional'
  where variant_type is null;

update public.submissions
  set main_series = case series
    when 'Trails in the Sky' then 'Trails'
    when 'Persona 3' then 'Persona'
    when 'D&D original' then 'Dungeons & Dragons'
    when 'Kamen Rider Wizard' then 'Kamen Rider'
    else series
  end
  where main_series is null;

-- ------------------------------------------------------------------ indexes
create index if not exists cosplays_variant_type_idx
  on public.cosplays (variant_type);

create index if not exists submissions_variant_type_idx
  on public.submissions (variant_type);

create index if not exists cosplays_main_series_idx
  on public.cosplays (main_series);

-- ------------------------------------------------------------------- verify
-- Expect: 13 rows in cosplays — 12 traditional + 1 other (id 3, Agate
-- Crosner, variant_label 'Cupsleeve') — and the 6 rows with a photo_url
-- each have photo_urls with exactly 1 entry. Main series: Trails = 2.
--   select count(*) from public.cosplays;
--   select variant_type, count(*) from public.cosplays group by variant_type;
--   select id, character, main_series, series, variant_type, variant_label
--     from public.cosplays order by id;
