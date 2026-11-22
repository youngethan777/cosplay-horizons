-- Cosplay Horizons, Contact Us messages (Nov 20, 2026)
-- Run this in: Supabase Dashboard, SQL Editor, New query, paste, Run.
-- Messages from the /contact form are stored here for review through
-- the private admin API. Nothing here is public.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  contact text,
  topic text not null default 'Other' check (topic in ('Feedback', 'Problem with the site', 'Question', 'Other')),
  message text not null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

-- Row level security on, with no public policies. Only the
-- service_role key (used by the server API routes) can read or write
-- this table, the same way review actions work for submissions and
-- takedown_requests.
alter table public.contact_messages enable row level security;

create index if not exists contact_messages_status_idx on public.contact_messages (status);
