import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { notifyNewRemoval } from '@/lib/notify';

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
  const cosplayId = body.cosplayId ? Number(body.cosplayId) : null;
  const character = body.character ? String(body.character) : null;
  const { error } = await admin.from('takedown_requests').insert({
    cosplay_id: cosplayId,
    character,
    requester_name: requesterName,
    contact,
    reason,
    status: 'open',
  });
  if (error) {
    return NextResponse.json({ error: 'Could not save the request. Please try again.' }, { status: 500 });
  }
  // Optional auto-hide, off by default. When AUTO_HIDE_ON_REMOVAL is
  // exactly "true", hide the cosplay right away so the person asking
  // is protected fast. Hide is reversible, nothing is deleted.
  if (process.env.AUTO_HIDE_ON_REMOVAL === 'true' && cosplayId) {
    const { error: hideError } = await admin
      .from('cosplays')
      .update({ status: 'hidden' })
      .eq('id', cosplayId);
    if (hideError) {
      console.error('takedowns: auto-hide failed for cosplay', cosplayId);
    }
  }
  // Owner-side notification only. The helper never throws.
  await notifyNewRemoval({ character, cosplayId, reason });
  return NextResponse.json({ ok: true });
}
