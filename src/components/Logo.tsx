import Image from 'next/image';

/**
 * Cosplay Horizons logo: sun-over-horizon symbol with bubble text.
 * The symbol stays as the site mark. A mascot is a later idea, not now.
 */
export default function Logo() {
  return (
    <span className="logo">
      <Image
        src="/logo.svg"
        alt=""
        width={64}
        height={64}
        priority
        aria-hidden="true"
      />
      <span className="logo-word">
        Cosplay <span className="logo-word-emerald">Horizons</span>
      </span>
    </span>
  );
}
