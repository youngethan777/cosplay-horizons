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
        <h2>
          Cosplay Horizons: A fan community of cosplayers of fandoms of all
          kinds.
        </h2>
        <p>
          This community is a place where anyone from all fandoms can share
          their favorite cosplays and characters. We strive to be a welcoming
          platform that is solely dedicated to having users present their
          cosplays and express themselves in ways that continue to inspire
          creativity in the community.
        </p>
        <p>
          Our main goal is to make cosplays easily searchable by characters,
          series, or cosplayer, so you are not endlessly looking through
          social media for the right inspiration.
        </p>
        <p>
          Our platform respects creators so it is opt-in only, credit will
          always be given whenever possible, and if you change your mind it
          is a simple process.
        </p>
        <p>
          <a className="cta" href="/submit">
            Make a submission
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
