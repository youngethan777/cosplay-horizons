import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  const form = await req.formData();
  const photo = form.get('photo');
  const character = String(form.get('character') || '').trim();
  const series = String(form.get('series') || '').trim();
  const cosplayer = String(form.get('cosplayer') || '').trim();
  const consent = form.get('consent') === 'on' || form.get('consent') === 'true';

  if (!photo || !(photo instanceof File)) {
    return NextResponse.json({ error: 'Please upload a photo.' }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(photo.type)) {
    return NextResponse.json({ error: 'Photo must be JPG, PNG, WebP, or GIF.' }, { status: 400 });
  }
  if (photo.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Photo must be 8 MB or smaller.' }, { status: 400 });
  }
  if (!character || !series || !cosplayer) {
    return NextResponse.json({ error: 'Character, series, and cosplayer are required.' }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: 'Consent is required.' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    // Preview mode: Supabase is not connected yet. Validate fully, but do
    // not pretend the submission was saved. The UI tells Ethan this.
    return NextResponse.json({ ok: true, preview: true });
  }

  const ext = photo.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `submissions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const bytes = await photo.arrayBuffer();
  const { error: uploadError } = await admin.storage
    .from('cosplay-photos')
    .upload(path, bytes, { contentType: photo.type, upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: 'Could not save the photo. Please try again.' }, { status: 500 });
  }

  const { error: insertError } = await admin.from('submissions').insert({
    character,
    series,
    cosplayer,
    instagram_url: String(form.get('instagramUrl') || '') || null,
    event: String(form.get('event') || '') || null,
    date: String(form.get('date') || '') || null,
    photographer: String(form.get('photographer') || '') || null,
    photographer_url: String(form.get('photographerUrl') || '') || null,
    photo_path: path,
    photo_file_name: photo.name,
    consent: true,
    status: 'pending',
  });
  if (insertError) {
    return NextResponse.json({ error: 'Could not save the submission. Please try again.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
