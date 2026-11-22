import { NextResponse } from 'next/server';
import { requireAdmin, adminClientOr503 } from '@/lib/admin-auth';
import { isVariantType } from '@/lib/types';

// Fields an admin may fix on a submission without touching the database
// directly. Anything not listed here is ignored.
const EDITABLE_FIELDS = [
  'character',
  'series',
  'main_series',
  'cosplayer',
  'instagram_url',
  'event',
  'date',
  'photographer',
  'photographer_url',
  'variant_type',
  'variant_label',
  'no_last_name',
] as const;

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { client, error } = adminClientOr503();
  if (error) return error;

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
    } else if (field === 'no_last_name') {
      if (typeof value !== 'boolean') {
        return NextResponse.json(
          { error: 'no_last_name must be true or false.' },
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
    .from('submissions')
    .select('id, status')
    .eq('id', params.id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: 'Could not load the submission.' }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  }

  const { data: updated, error: updateError } = await client
    .from('submissions')
    .update(updates)
    .eq('id', params.id)
    .select('*')
    .maybeSingle();
  if (updateError || !updated) {
    return NextResponse.json({ error: 'Could not update the submission.' }, { status: 500 });
  }
  return NextResponse.json({
    ok: true,
    submissionId: params.id,
    status: updated.status,
    submission: updated,
  });
}
