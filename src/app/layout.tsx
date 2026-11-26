import type { Metadata } from 'next';
import Link from 'next/link';
import { Baloo_2 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Logo from '@/components/Logo';
import './globals.css';

const bubbleFont = Baloo_2({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-bubble',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cosplay Horizons: Find the cosplayer, not the costume shop',
  description:
    'A fan community of cosplayers of fandoms of all kinds. Search by character, series, or cosplayer, with clear credit and social links. An endless horizon of different characters and different worlds.',
  metadataBase: new URL('https://www.cosplayhorizons.com'),
  icons: { icon: '/logo.svg' },
  openGraph: {
    title: 'Cosplay Horizons',
    description: 'Find the cosplayer, not the costume shop.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={bubbleFont.variable}>
      <body>
        <header className="site">
          <div className="banner">
            <h1>
              <Link href="/" aria-label="Cosplay Horizons, home">
                <Logo />
              </Link>
            </h1>
          </div>
          <nav className="main-nav" aria-label="Main">
            <div className="nav-wrap">
              <Link href="/">Gallery</Link>
              <Link href="/submit">Submission</Link>
              <Link href="/remove">Remove</Link>
              <Link href="/contact">Contact</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site">
          <div className="wrap">
            <span>
              Cosplay Horizons, an endless horizon of different characters and
              different worlds.
            </span>
            <Link href="/privacy">Privacy &amp; Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
