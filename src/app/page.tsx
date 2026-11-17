import { loadCosplays } from '@/lib/supabase';
import { SERIES_LIST } from '@/lib/data';
import Gallery from '@/components/Gallery';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cosplays = await loadCosplays();
  const seriesList =
    SERIES_LIST.length > 0
      ? SERIES_LIST
      : Array.from(new Set(cosplays.map((c) => c.series))).sort();

  return (
    <>
      <section className="hero">
        <h2>Find the cosplayer, not the costume shop.</h2>
        <p>
          Cosplay Horizons is a searchable gallery of people who cosplay —
          an endless horizon of different characters and different worlds, as
          far as the eye can see. Search by character or by cosplayer, and
          every look credits the cosplayer (and photographer, when known)
          with their social links right there.
        </p>
        <p>
          Everything here is opt-in. Cosplayers submit their own photos, and
          anyone can ask for a photo to be removed — see{' '}
          <a href="/takedown">Takedown request</a>.
        </p>
      </section>
      <Gallery cosplays={cosplays} seriesList={seriesList} />
    </>
  );
}
