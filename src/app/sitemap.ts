import { loadCosplays } from '@/lib/supabase';

export default async function sitemap() {
  const base = 'https://cosplayhorizons.com';
  const cosplays = await loadCosplays();
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/submit`, lastModified: new Date() },
    { url: `${base}/takedown`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    { url: `${base}/terms`, lastModified: new Date() },
    ...cosplays.map((c) => ({
      url: `${base}/cosplay/${c.id}`,
      lastModified: new Date(),
    })),
  ];
}
