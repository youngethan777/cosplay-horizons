import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';
import { notifyNewSubmission } from '@/lib/notify';
import { isVariantType } from '@/lib/types';
import type { VariantType } from '@/lib/types';
import { normalizeSocialUrl } from '@/lib/social-url';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_PHOTOS = 5;

export async function POST(req: Request) {
  const form = await req.formData();
  // Multiple photos, first = cover. Accept the legacy single 'photo' too.
  const photos = form
    .getAll('photo')
    .filter((p): p is File => p instanceof File && p.size > 0);
  const character = String(form.get('character') || '').trim();
  // Specific series is optional; fall back to the main series so the
  // NOT NULL series column always has a value.
  const specificSeries = String(form.get('series') || '').trim();
  const mainSeriesRaw = String(form.get('mainSeries') || '').trim();
  const series = specificSeries || mainSeriesRaw;
  const mainSeries = mainSeriesRaw || series;
  const noLastName =
    form.get('noLastName') === 'true' || form.get('noLastName') === 'on';
  const cosplayer = String(form.get('cosplayer') || '').trim();
  const consent = form.get('consent') === 'on' || form.get('consent') === 'true';
  const rawVariant = form.get('variantType');
  const variantType: VariantType = isVariantType(rawVariant)
    ? rawVariant
    : 'traditional';
  const variantLabel =
    variantType === 'other'
      ? String(form.get('variantLabel') || '').trim()
      : null;

  if (photos.length === 0) {
    return NextResponse.json({ error: 'Please upload a photo.' }, { status: 400 });
  }
  if (photos.length > MAX_PHOTOS) {
    return NextResponse.json(
      { error: `You can upload up to ${MAX_PHOTOS} photos.` },
      { status: 400 },
    );
  }
  for (const photo of photos) {
    if (!ALLOWED_TYPES.includes(photo.type)) {
      return NextResponse.json(
        { error: 'Photos must be JPG, PNG, WebP, or GIF.' },
        { status: 400 },
      );
    }
    if (photo.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Each photo must be 8 MB or smaller.' },
        { status: 400 },
      );
    }
  }
  if (!character || !series || !cosplayer) {
    return NextResponse.json({ error: 'Character, a series, and cosplayer are required.' }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: 'Consent is required.' }, { status: 400 });
  }
  if (variantType === 'other' && !variantLabel) {
    return NextResponse.json(
      { error: 'Please name the variant when you choose Other.' },
      { status: 400 },
    );
  }

  const admin = getSupabaseAdminClient();
  if (!admin) {
    // Preview mode: Supabase is not connected yet. Validate fully, but do
    // not pretend the submission was saved. The UI tells Ethan this.
    return NextResponse.json({ ok: true, preview: true });
  }

  const photoPaths: string[] = [];
  const photoFileNames: string[] = [];
  for (const photo of photos) {
    const ext = photo.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `submissions/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = await photo.arrayBuffer();
    const { error: uploadError } = await admin.storage
      .from('cosplay-photos')
      .upload(path, bytes, { contentType: photo.type, upsert: false });
    if (uploadError) {
      return NextResponse.json({ error: 'Could not save the photo. Please try again.' }, { status: 500 });
    }
    photoPaths.push(path);
    photoFileNames.push(photo.name);
  }

  const { error: insertError } = await admin.from('submissions').insert({
    character,
    main_series: mainSeries || null,
    series,
    cosplayer,
    // Credit links are normalized before storing, so a doubled address
    // (a platform base URL stuck in front of a pasted full link) can
    // never be saved. Clean single URLs pass through unchanged.
    instagram_url:
      normalizeSocialUrl(String(form.get('instagramUrl') || '')) || null,
    event: String(form.get('event') || '') || null,
    date: String(form.get('date') || '') || null,
    photographer: String(form.get('photographer') || '') || null,
    photographer_url:
      normalizeSocialUrl(String(form.get('photographerUrl') || '')) || null,
    // Legacy single-photo columns kept in sync with the cover (first photo).
    photo_path: photoPaths[0],
    photo_file_name: photoFileNames[0],
    photo_paths: photoPaths,
    photo_file_names: photoFileNames,
    variant_type: variantType,
    variant_label: variantLabel,
    no_last_name: noLastName,
    consent: true,
    status: 'pending',
  });
  if (insertError) {
    return NextResponse.json({ error: 'Could not save the submission. Please try again.' }, { status: 500 });
  }
  // Owner-side notification only. The helper never throws, so a
  // notification failure cannot fail the submission.
  await notifyNewSubmission({
    character,
    series,
    cosplayer,
    photoCount: photoPaths.length,
    variantType,
    variantLabel,
  });
  return NextResponse.json({ ok: true, photoCount: photoPaths.length });
}
