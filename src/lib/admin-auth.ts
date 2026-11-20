import { createHash, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

// Server-only helpers for the private admin API under /api/admin/.
// The secret comes from the COSPLAY_ADMIN_SECRET env var. It is never
// logged, never returned, and never sent to the browser.

function digest(value: string): Buffer {
  return createHash('sha256').update(value, 'utf8').digest();
}

function secretsMatch(provided: string, expected: string): boolean {
  // Hash both sides first so the comparison is constant time and does
  // not leak the length of the real secret.
  return timingSafeEqual(digest(provided), digest(expected));
}

function providedSecret(req: Request): string | null {
  const header = req.headers.get('x-admin-secret');
  if (header && header.trim()) return header.trim();
  const auth = req.headers.get('authorization');
  if (auth) {
    const match = /^Bearer\s+(.+)$/i.exec(auth.trim());
    if (match && match[1].trim()) return match[1].trim();
  }
  return null;
}

/**
 * Check the admin secret on a request.
 * Returns a NextResponse to send back when the request must stop, or
 * null when the request is authorized.
 * Fails closed: no secret configured means 503, wrong secret means 401.
 */
export function requireAdmin(req: Request): NextResponse | null {
  const expected = process.env.COSPLAY_ADMIN_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: 'Admin API is not configured.' },
      { status: 503 },
    );
  }
  const provided = providedSecret(req);
  if (!provided || !secretsMatch(provided, expected)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  return null;
}

/**
 * Get the Supabase admin client, or a 503 response when Supabase is
 * not configured. Admin routes must never pretend success.
 */
export function adminClientOr503():
  | { client: SupabaseClient; error: null }
  | { client: null; error: NextResponse } {
  const client = getSupabaseAdminClient();
  if (!client) {
    return {
      client: null,
      error: NextResponse.json(
        { error: 'Supabase admin client is not configured.' },
        { status: 503 },
      ),
    };
  }
  return { client, error: null };
}
