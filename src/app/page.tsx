import { loadCosplays } from '@/lib/supabase';
import { MAIN_SERIES_LIST, SERIES_LIST, SPECIFIC_SERIES_BY_MAIN } from '@/lib/data';
import { getCoverPhoto } from '@/lib/types';
import Gallery from '@/components/Gallery';
import PhotoMarquee from '@/components/PhotoMarquee';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cosplays = await loadCosplays();
  const seriesList =
    SERIES_LIST.length > 0
      ? SERIES_LIST
      : Array.from(new Set(cosplays.map((c) => c.series))).sort();
  const mainSeriesList =
    MAIN_SERIES_LIST.length > 0
      ? MAIN_SERIES_LIST
      : Array.from(
          new Set(cosplays.map((c) => c.mainSeries ?? c.series)),
        ).sort();
  const marqueePhotos = cosplays
    .filter((c) => c.hasPhoto)
    .map((c) => ({
      src: getCoverPhoto(c) as string,
      alt: `${c.character} cosplay by ${c.cosplayer}`,
    }));

  return (
    <>
      <section className="hero">
        <h2>Find the cosplayer, not the costume shop.</h2>
        <p>
          Cosplay Horizons is a searchable gallery of people who cosplay —
          an endless horizon of different characters and different worlds, as
          far as the eye can see.
        </p>
        <ul className="hero-points">
          <li>
            <strong>Search by character or cosplayer.</strong> Looking for
            one character, one cosplayer, or one series — not a shop selling
            costumes.
          </li>
          <li>
            <strong>Opt-in only.</strong> Cosplayers submit their own photos,
            and every look credits the cosplayer (and photographer, when
            known) with their social links right there.
          </li>
          <li>
            <strong>Easy takedown.</strong> Anyone can ask for a photo to be
            removed — see <a href="/takedown">Takedown request</a>.
          </li>
        </ul>
        <p>
          <a className="cta" href="/submit">
            Submit your cosplay →
          </a>
        </p>
      </section>
      <PhotoMarquee photos={marqueePhotos} />
      <Gallery
        cosplays={cosplays}
        seriesList={seriesList}
        mainSeriesList={mainSeriesList}
        specificSeriesByMain={SPECIFIC_SERIES_BY_MAIN}
      />
    </>
  );
}
