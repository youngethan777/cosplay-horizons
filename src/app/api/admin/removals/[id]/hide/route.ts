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
    .select('*')
    .eq('id', params.id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: 'Could not load the removal request.' }, { status: 500 });
  }
  if (!request) {
    return NextResponse.json({ error: 'Removal request not found.' }, { status: 404 });
  }

  let hiddenCosplayId: number | null = null;
  if (request.cosplay_id) {
    hiddenCosplayId = Number(request.cosplay_id);
    const { error: hideError } = await client
      .from('cosplays')
      .update({ status: 'hidden' })
      .eq('id', hiddenCosplayId);
    if (hideError) {
      return NextResponse.json({ error: 'Could not hide the cosplay.' }, { status: 500 });
    }
  }

  const { error: updateError } = await client
    .from('takedown_requests')
    .update({ status: 'actioned' })
    .eq('id', params.id);
  if (updateError) {
    return NextResponse.json(
      { error: 'Cosplay was hidden, but the request status could not be updated.', hiddenCosplayId },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    removalId: params.id,
    status: 'actioned',
    hiddenCosplayId,
  });
}
