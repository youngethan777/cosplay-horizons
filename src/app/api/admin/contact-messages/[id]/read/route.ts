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

  const { data: message, error: fetchError } = await client
    .from('contact_messages')
    .select('id, status')
    .eq('id', params.id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: 'Could not load the contact message.' }, { status: 500 });
  }
  if (!message) {
    return NextResponse.json({ error: 'Contact message not found.' }, { status: 404 });
  }

  const { error: updateError } = await client
    .from('contact_messages')
    .update({ status: 'read' })
    .eq('id', params.id);
  if (updateError) {
    return NextResponse.json({ error: 'Could not mark the contact message read.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, messageId: params.id, status: 'read' });
}
