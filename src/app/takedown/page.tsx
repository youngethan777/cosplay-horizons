import TakedownForm from '@/components/TakedownForm';
import { loadCosplayById } from '@/lib/supabase';
export const metadata = { title: 'Removal: Cosplay Horizons' };
export const dynamic = 'force-dynamic';
export default async function TakedownPage({ searchParams }: { searchParams: { cosplayId?: string } }) {
  const id = searchParams.cosplayId ? Number(searchParams.cosplayId) : NaN;
  const cosplay = Number.isFinite(id) ? await loadCosplayById(id) : null;
  return (
    <>
      <h2>Removal</h2>
      <p style={{ maxWidth: '68ch' }}>
        Want a photo removed? No problem. Fill in this form and we aim to
        act as soon as we can, usually within 48 hours. You do not need to
        give a legal reason, “please remove it” is enough. If you are the
        cosplayer in the photo, we will remove it. If you are asking on
        someone else’s behalf, tell us in the reason box.
      </p>
      <TakedownForm cosplay={cosplay} />
    </>
  );
}
