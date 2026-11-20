import Image from 'next/image';
import Link from 'next/link';
import type { Cosplay } from '@/lib/types';
import { getCoverPhoto, getPhotoUrls, variantDisplayName } from '@/lib/types';

export function CosplayCard({ cosplay }: { cosplay: Cosplay }) {
  const cover = getCoverPhoto(cosplay);
  const photos = getPhotoUrls(cosplay);
  return (
    <Link href={`/cosplay/${cosplay.id}`} className="card" aria-label={`${cosplay.character} cosplayed by ${cosplay.cosplayer}`}>
      {cosplay.hasPhoto && cover ? (
        <div className="card-photo">
          <Image
            src={cover}
            alt={`${cosplay.character} cosplay by ${cosplay.cosplayer}`}
            width={900}
            height={1200}
            sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 25vw"
            loading="lazy"
          />
          {photos.length > 1 && (
            <span className="photo-count" aria-label={`${photos.length} photos`}>
              {photos.length} photos
            </span>
          )}
        </div>
      ) : (
        <div className="placeholder" role="img" aria-label={`Placeholder, photo coming soon for ${cosplay.character}`}>
          <span className="big" aria-hidden="true">🎭</span>
          <strong>Photo coming soon</strong>
          <span>{cosplay.character}</span>
        </div>
      )}
      <div className="body">
        <h3>{cosplay.character}</h3>
        <p className="series">{cosplay.series}</p>
        <p className="who">
          {cosplay.cosplayer} · {cosplay.cosplayerHandle}
        </p>
        <p>
          {cosplay.variantType !== 'traditional' && (
            <span className="badge">
              {variantDisplayName(cosplay.variantType, cosplay.variantLabel)}
            </span>
          )}
          {cosplay.event && <span className="badge">{cosplay.event}</span>}
        </p>
      </div>
    </Link>
  );
}
