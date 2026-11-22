import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { notifyNewContactMessage } from '@/lib/notify';

const TOPICS = ['Feedback', 'Problem with the site', 'Question', 'Other'];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  const name = String(body.name || '').trim();
  const contact = String(body.contact || '').trim();
  const rawTopic = String(body.topic || '').trim();
  const topic = TOPICS.includes(rawTopic) ? rawTopic : 'Other';
  const message = String(body.message || '').trim();
  if (!message) {
    return NextResponse.json({ error: 'A message is required.' }, { status: 400 });
  }
  const admin = getSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ ok: true, preview: true });
  }
  const { error } = await admin.from('contact_messages').insert({
    name: name || null,
    contact: contact || null,
    topic,
    message,
    status: 'new',
  });
  if (error) {
    return NextResponse.json({ error: 'Could not save the message. Please try again.' }, { status: 500 });
  }
  // Owner-side notification only. The helper never throws.
  await notifyNewContactMessage({ name, contact, topic, message });
  return NextResponse.json({ ok: true });
}
