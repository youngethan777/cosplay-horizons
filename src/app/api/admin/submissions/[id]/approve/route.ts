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

  const { data: submission, error: fetchError } = await client
    .from('submissions')
    .select('*')
    .eq('id', params.id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: 'Could not load the submission.' }, { status: 500 });
  }
  if (!submission) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  }
  if (submission.status === 'approved') {
    return NextResponse.json({
      ok: true,
      note: 'Submission was already approved. No duplicate was inserted.',
      submissionId: submission.id,
    });
  }

  // Build public photo URLs from the stored paths. First photo is the cover.
  const paths: string[] = Array.isArray(submission.photo_paths)
    ? submission.photo_paths.filter((p: unknown): p is string => typeof p === 'string' && p.length > 0)
    : submission.photo_path
      ? [String(submission.photo_path)]
      : [];
  const photoUrls = paths.map(
    (path) => client.storage.from('cosplay-photos').getPublicUrl(path).data.publicUrl,
  );

  // cosplays.id is an integer primary key with no database default in
  // the schema, so assign the next id here.
  const { data: top, error: topError } = await client
    .from('cosplays')
    .select('id')
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (topError) {
    return NextResponse.json({ error: 'Could not assign a cosplay id.' }, { status: 500 });
  }
  const nextId = (top?.id ? Number(top.id) : 0) + 1;

  const { data: inserted, error: insertError } = await client
    .from('cosplays')
    .insert({
      id: nextId,
      character: submission.character,
      main_series: submission.main_series ?? null,
      series: submission.series,
      cosplayer: submission.cosplayer,
      cosplayer_handle: '',
      instagram_url: submission.instagram_url ?? '',
      event: submission.event ?? null,
      date: submission.date ?? null,
      photographer: submission.photographer ?? null,
      photographer_url: submission.photographer_url ?? null,
      photo_url: photoUrls[0] ?? null,
      photo_urls: photoUrls,
      variant_type: submission.variant_type ?? 'traditional',
      variant_label: submission.variant_label ?? null,
      has_photo: photoUrls.length > 0,
      is_favorite: false,
      is_first_cosplay: false,
      notes: null,
      status: 'approved',
    })
    .select('id')
    .single();
  if (insertError) {
    return NextResponse.json({ error: 'Could not publish the cosplay.' }, { status: 500 });
  }

  const { error: updateError } = await client
    .from('submissions')
    .update({ status: 'approved' })
    .eq('id', params.id);
  if (updateError) {
    return NextResponse.json(
      {
        error: 'Cosplay was published, but the submission status could not be updated.',
        cosplayId: inserted?.id ?? nextId,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    submissionId: params.id,
    cosplayId: inserted?.id ?? nextId,
    photoCount: photoUrls.length,
  });
}
