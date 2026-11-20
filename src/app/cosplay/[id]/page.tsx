import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadCosplayById, loadCosplays } from '@/lib/supabase';
import { getCoverPhoto, getPhotoUrls, variantDisplayName } from '@/lib/types';
import PhotoViewer from '@/components/PhotoViewer';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  // With Supabase unset this is the seeded list; with Supabase set the
  // detail pages still render dynamically, so this is best-effort only.
  const list = await loadCosplays();
  return list.map((c) => ({ id: String(c.id) }));
}

export default async function CosplayDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const cosplay = await loadCosplayById(id);
  if (!cosplay) notFound();
  const photos = getPhotoUrls(cosplay);
  const cover = getCoverPhoto(cosplay);

  return (
    <article>
      <p>
        <Link href="/">← Back to gallery</Link>
      </p>
      <div className="detail">
        <div>
          {cosplay.hasPhoto && cover ? (
            <PhotoViewer
              photos={photos}
              alt={`${cosplay.character} cosplay by ${cosplay.cosplayer}`}
            />
          ) : (
            <div
              className="placeholder"
              style={{ borderRadius: 14, border: '1px solid var(--line)' }}
              role="img"
              aria-label={`Placeholder, photo coming soon for ${cosplay.character}`}
            >
              <span className="big" aria-hidden="true">🎭</span>
              <strong>Photo coming soon</strong>
              <span>{cosplay.character}</span>
            </div>
          )}
        </div>
        <div className="meta">
          <h2 style={{ marginTop: 0 }}>{cosplay.character}</h2>
          <p style={{ color: 'var(--muted)' }}>{cosplay.series}</p>
          <p>
            {cosplay.isFavorite && <span className="badge gold">★ Favourite</span>}
            {cosplay.isFirstCosplay && <span className="badge">First cosplay</span>}
            {cosplay.variantType !== 'traditional' && (
              <span className="badge">
                {variantDisplayName(cosplay.variantType, cosplay.variantLabel)}
              </span>
            )}
          </p>
          <dl>
            <dt>Cosplayer</dt>
            <dd>
              {cosplay.cosplayer} · {cosplay.cosplayerHandle}
            </dd>
            <dt>Instagram</dt>
            <dd>
              <a href={cosplay.instagramUrl} target="_blank" rel="noreferrer">
                {cosplay.instagramUrl}
              </a>
            </dd>
            {cosplay.event && (
              <>
                <dt>Event</dt>
                <dd>{cosplay.event}</dd>
              </>
            )}
            {cosplay.date && (
              <>
                <dt>Date</dt>
                <dd>{cosplay.date}</dd>
              </>
            )}
            <dt>Photographer</dt>
            <dd>
              {cosplay.photographer ? (
                cosplay.photographerUrl ? (
                  <a href={cosplay.photographerUrl} target="_blank" rel="noreferrer">
                    {cosplay.photographer}
                  </a>
                ) : (
                  cosplay.photographer
                )
              ) : (
                'Not listed, ask via the cosplayer’s Instagram'
              )}
            </dd>
            {cosplay.notes && (
              <>
                <dt>Notes</dt>
                <dd>{cosplay.notes}</dd>
              </>
            )}
          </dl>
          <a
            className="cta"
            href={cosplay.instagramUrl}
            target="_blank"
            rel="noreferrer"
          >
            See more from {cosplay.cosplayerHandle} on Instagram →
          </a>
          <p style={{ marginTop: 16 }}>
            <Link href={`/remove?cosplayId=${cosplay.id}`}>
              Request removal of this photo
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}
