import Image from 'next/image';

/**
 * Cosplay Horizons logo (v1.1, Nov 18 2026) — a simple wordmark with a
 * sun-over-horizon mark in the site colours (sky blue / turquoise and
 * emerald green). This is a logo, NOT a mascot — the mascot is a later
 * idea. No face, no character.
 */
export default function Logo() {
  return (
    <span className="logo">
      <Image
        src="/logo.svg"
        alt=""
        width={40}
        height={40}
        priority
        aria-hidden="true"
      />
      <span className="logo-word">
        Cosplay <span className="logo-word-emerald">Horizons</span>
      </span>
    </span>
  );
}
