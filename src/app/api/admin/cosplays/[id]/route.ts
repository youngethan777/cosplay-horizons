import { NextResponse } from 'next/server';
import { requireAdmin, adminClientOr503 } from '@/lib/admin-auth';
import { isVariantType } from '@/lib/types';

// Fields an admin may fix on a cosplay without touching the database
// directly. Anything not listed here is ignored.
const EDITABLE_FIELDS = [
  'character',
  'series',
  'main_series',
  'cosplayer',
  'cosplayer_handle',
  'instagram_url',
  'event',
  'date',
  'photographer',
  'photographer_url',
  'variant_type',
  'variant_label',
  'notes',
] as const;

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { client, error } = adminClientOr503();
  if (error) return error;

  const cosplayId = Number(params.id);
  if (!Number.isInteger(cosplayId)) {
    return NextResponse.json({ error: 'Cosplay id must be a number.' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body must be JSON.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Body must be a JSON object.' }, { status: 400 });
  }
  const input = body as Record<string, unknown>;

  const updates: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (!(field in input)) continue;
    const value = input[field];
    if (field === 'variant_type') {
      if (!isVariantType(value)) {
        return NextResponse.json(
          { error: 'variant_type must be traditional, christmas, halloween, or other.' },
          { status: 400 },
        );
      }
      updates[field] = value;
    } else {
      if (value !== null && typeof value !== 'string') {
        return NextResponse.json(
          { error: `${field} must be a string or null.` },
          { status: 400 },
        );
      }
      updates[field] = value;
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No editable fields provided.' },
      { status: 400 },
    );
  }

  const { data: existing, error: fetchError } = await client
    .from('cosplays')
    .select('id, status')
    .eq('id', cosplayId)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: 'Could not load the cosplay.' }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Cosplay not found.' }, { status: 404 });
  }

  const { data: updated, error: updateError } = await client
    .from('cosplays')
    .update(updates)
    .eq('id', cosplayId)
    .select('*')
    .maybeSingle();
  if (updateError || !updated) {
    return NextResponse.json({ error: 'Could not update the cosplay.' }, { status: 500 });
  }
  return NextResponse.json({
    ok: true,
    cosplayId,
    status: updated.status,
    cosplay: updated,
  });
}
