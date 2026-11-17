import TakedownForm from '@/components/TakedownForm';
import { loadCosplayById } from '@/lib/supabase';
export const metadata = { title: 'Takedown request — Cosplay Horizons' };
export const dynamic = 'force-dynamic';
export default async function TakedownPage({ searchParams }: { searchParams: { cosplayId?: string } }) {
  const id = searchParams.cosplayId ? Number(searchParams.cosplayId) : NaN;
  const cosplay = Number.isFinite(id) ? await loadCosplayById(id) : null;
  return (
    <>
      <h2>Takedown request</h2>
      <p style={{ maxWidth: '68ch' }}>
        Want a photo removed? No problem. Fill in this form and we will act
        within 48 hours. You do not need an account, and you do not need to
        give a legal reason — “please remove it” is enough. If you are the
        cosplayer in the photo, we will remove it. If you are asking on
        someone else’s behalf, tell us in the reason box.
      </p>
      <TakedownForm cosplay={cosplay} />
    </>
  );
}
