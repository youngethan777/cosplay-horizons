import Image from 'next/image';
import Link from 'next/link';
import type { Cosplay } from '@/lib/types';

export function CosplayCard({ cosplay }: { cosplay: Cosplay }) {
  return (
    <Link href={`/cosplay/${cosplay.id}`} className="card" aria-label={`${cosplay.character} cosplayed by ${cosplay.cosplayer}`}>
      {cosplay.hasPhoto && cosplay.photoUrl ? (
        <Image
          src={cosplay.photoUrl}
          alt={`${cosplay.character} cosplay by ${cosplay.cosplayer}`}
          width={900}
          height={1200}
          sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 25vw"
          loading="lazy"
        />
      ) : (
        <div className="placeholder" role="img" aria-label={`Placeholder — photo coming soon for ${cosplay.character}`}>
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
          {cosplay.isFavorite && <span className="badge gold">★ Favourite</span>}
          {cosplay.isFirstCosplay && <span className="badge">First cosplay</span>}
          {cosplay.event && <span className="badge">{cosplay.event}</span>}
        </p>
      </div>
    </Link>
  );
}
