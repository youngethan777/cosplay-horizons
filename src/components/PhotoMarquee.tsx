import Image from 'next/image';

/**
 * Endless gliding photo cycle for the landing section.
 * Uses only the existing real photos (no generated images, no new photos).
 * The list is duplicated so the loop is seamless; the second copy is
 * hidden from screen readers. Pauses on hover (see globals.css) and
 * stops entirely for users who prefer reduced motion.
 */
export default function PhotoMarquee({
  photos,
}: {
  photos: { src: string; alt: string }[];
}) {
  if (photos.length === 0) return null;
  const doubled = [...photos, ...photos];
  return (
    <div
      className="marquee"
      role="img"
      aria-label="A sliding row of cosplay photos from Cosplay Horizons"
    >
      <div className="marquee-track">
        {doubled.map((photo, i) => (
          <Image
            key={`${photo.src}-${i}`}
            src={photo.src}
            alt={i < photos.length ? photo.alt : ''}
            aria-hidden={i >= photos.length}
            width={360}
            height={480}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}
