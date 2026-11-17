import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cosplay Horizons — Find the cosplayer, not the costume shop',
  description:
    'A searchable, Pinterest-style cosplay database. Search by character or cosplayer, with clear credit and social links. An endless horizon of different characters and different worlds.',
  metadataBase: new URL('https://cosplayhorizons.com'),
  openGraph: {
    title: 'Cosplay Horizons',
    description: 'Find the cosplayer, not the costume shop.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <div className="wrap">
            <h1>
              <Link href="/">Cosplay Horizons</Link>
            </h1>
            <nav aria-label="Main">
              <Link href="/">Gallery</Link>
              <Link href="/submit">Submit a cosplay</Link>
              <Link href="/takedown">Takedown request</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site">
          <div className="wrap">
            <span>
              Cosplay Horizons — an endless horizon of different characters and
              different worlds.
            </span>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/takedown">Takedown</Link>
            <span>No ads. No pop-ups. No subscription.</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
