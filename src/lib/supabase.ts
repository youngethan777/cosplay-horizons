import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Cosplay } from './types';
import { SEEDED_COSPLAYS } from './data';

export const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

/** Browser / server client (anon key only — safe to expose). */
export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  return createClient(url, anonKey);
}

/** Server-only client. Never import this into a client component. */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function rowToCosplay(row: Record<string, unknown>): Cosplay {
  return {
    id: Number(row.id),
    character: String(row.character ?? ''),
    series: String(row.series ?? ''),
    cosplayer: String(row.cosplayer ?? ''),
    cosplayerHandle: String(row.cosplayer_handle ?? ''),
    instagramUrl: String(row.instagram_url ?? ''),
    event: (row.event as string | null) ?? null,
    date: (row.date as string | null) ?? null,
    photographer: (row.photographer as string | null) ?? null,
    photographerUrl: (row.photographer_url as string | null) ?? null,
    photoUrl: (row.photo_url as string | null) ?? null,
    hasPhoto: Boolean(row.has_photo),
    isFavorite: Boolean(row.is_favorite),
    isFirstCosplay: Boolean(row.is_first_cosplay),
    notes: (row.notes as string | null) ?? null,
  };
}

/**
 * Load approved cosplays. Uses Supabase when configured, otherwise falls
 * back to the seeded local data — so Ethan can preview the site before
 * connecting Supabase, and the site never breaks if Supabase is down.
 */
export async function loadCosplays(): Promise<Cosplay[]> {
  const client = getSupabaseClient();
  if (!client) return SEEDED_COSPLAYS;
  const { data, error } = await client
    .from('cosplays')
    .select('*')
    .eq('status', 'approved')
    .order('id', { ascending: true });
  if (error || !data || data.length === 0) return SEEDED_COSPLAYS;
  return data.map(rowToCosplay);
}

export async function loadCosplayById(id: number): Promise<Cosplay | null> {
  const list = await loadCosplays();
  return list.find((c) => c.id === id) ?? null;
}
