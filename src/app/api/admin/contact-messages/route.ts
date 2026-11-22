import { NextResponse } from 'next/server';
import { requireAdmin, adminClientOr503 } from '@/lib/admin-auth';

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  const { client, error } = adminClientOr503();
  if (error) return error;

  const url = new URL(req.url);
  const status = url.searchParams.get('status') || 'new';
  const { data, error: queryError } = await client
    .from('contact_messages')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })
    .limit(100);
  if (queryError) {
    return NextResponse.json({ error: 'Could not list contact messages.' }, { status: 500 });
  }
  return NextResponse.json({ ok: true, status, messages: data ?? [] });
}
