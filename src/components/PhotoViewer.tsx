'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function PhotoViewer({
  photos,
  alt,
}: {
  photos: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  if (photos.length === 0) return null;
  const total = photos.length;
  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <div className="viewer">
      <div className="viewer-main">
        <Image
          src={photos[index]}
          alt={total > 1 ? `${alt} — photo ${index + 1} of ${total}` : alt}
          width={900}
          height={1200}
          priority
        />
        {total > 1 && (
          <>
            <button
              type="button"
              className="viewer-arrow viewer-prev"
              onClick={prev}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              className="viewer-arrow viewer-next"
              onClick={next}
              aria-label="Next photo"
            >
              ›
            </button>
            <span className="viewer-counter" aria-live="polite">
              {index + 1} of {total}
            </span>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="viewer-thumbs" role="group" aria-label="Photos">
          {photos.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              className="viewer-thumb"
              aria-pressed={i === index}
              aria-label={`Photo ${i + 1} of ${total}`}
              onClick={() => setIndex(i)}
            >
              <Image
                src={src}
                alt=""
                width={180}
                height={240}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
