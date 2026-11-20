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

  const { data: request, error: fetchError } = await client
    .from('takedown_requests')
    .select('id, status')
    .eq('id', params.id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: 'Could not load the removal request.' }, { status: 500 });
  }
  if (!request) {
    return NextResponse.json({ error: 'Removal request not found.' }, { status: 404 });
  }

  const { error: updateError } = await client
    .from('takedown_requests')
    .update({ status: 'declined' })
    .eq('id', params.id);
  if (updateError) {
    return NextResponse.json({ error: 'Could not decline the removal request.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, removalId: params.id, status: 'declined' });
}
