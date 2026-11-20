import { NextResponse } from 'next/server';
import { requireAdmin, adminClientOr503 } from '@/lib/admin-auth';

export async function POST(
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

  const { data: cosplay, error: fetchError } = await client
    .from('cosplays')
    .select('id, status')
    .eq('id', cosplayId)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: 'Could not load the cosplay.' }, { status: 500 });
  }
  if (!cosplay) {
    return NextResponse.json({ error: 'Cosplay not found.' }, { status: 404 });
  }

  const { error: updateError } = await client
    .from('cosplays')
    .update({ status: 'approved' })
    .eq('id', cosplayId);
  if (updateError) {
    return NextResponse.json({ error: 'Could not restore the cosplay.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, cosplayId, status: 'approved' });
}
