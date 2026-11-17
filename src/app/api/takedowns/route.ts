import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  const requesterName = String(body.requesterName || '').trim();
  const contact = String(body.contact || '').trim();
  const reason = String(body.reason || '').trim();
  if (!requesterName || !contact || !reason) {
    return NextResponse.json({ error: 'Name, contact, and reason are required.' }, { status: 400 });
  }
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: true, preview: true });
  }
  const { error } = await admin.from('takedown_requests').insert({
    cosplay_id: body.cosplayId ? Number(body.cosplayId) : null,
    character: body.character ? String(body.character) : null,
    requester_name: requesterName,
    contact,
    reason,
    status: 'open',
  });
  if (error) {
    return NextResponse.json({ error: 'Could not save the request. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
