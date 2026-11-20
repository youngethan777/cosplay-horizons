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
    .select('id, status')
    .eq('id', params.id)
    .maybeSingle();
  if (fetchError) {
    return NextResponse.json({ error: 'Could not load the submission.' }, { status: 500 });
  }
  if (!submission) {
    return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
  }

  const { error: updateError } = await client
    .from('submissions')
    .update({ status: 'rejected' })
    .eq('id', params.id);
  if (updateError) {
    return NextResponse.json({ error: 'Could not reject the submission.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, submissionId: params.id, status: 'rejected' });
}
