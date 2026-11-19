import type { Cosplay } from './types';

/**
 * Seeded v1 data — the 13 looks from Ethan's prototype, frozen Nov 16, 2026.
 *
 * PHOTO MAPPING — verified, do not change without Ethan's say-so.
 * A previous mis-identification was caught by audit, so this is explicit:
 *   Naofumi Iwatani = green cape + Legendary Shield (NOT Leon)
 *   Neptune (RWBY)  = blue hair, red jacket, trident (NOT Ryusui)
 *   Ray Cro Glamor  = green hood, bow
 *   Kamen Rider Wizard, Link, Izaya Orihara as named.
 * The other 7 entries have NO real photo yet and keep a clearly labelled
 * placeholder. Never generate a photo/face for a real person.
 */
export const SEEDED_COSPLAYS: Cosplay[] = [
  {
    id: 1,
    character: 'Leon Strohl',
    series: 'Metaphor: ReFantazio',
    mainSeries: 'Metaphor: ReFantazio',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: 'Metaphor concert',
    date: 'Oct 14, 2026',
    photographer: null,
    photographerUrl: null,
    photoUrl: null,
    photoUrls: [],
    hasPhoto: false,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 2,
    character: 'Leon Strohl',
    series: 'Metaphor: ReFantazio',
    mainSeries: 'Metaphor: ReFantazio',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: 'Anime Expo 2026',
    date: '2026',
    photographer: null,
    photographerUrl: null,
    photoUrl: null,
    photoUrls: [],
    hasPhoto: false,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 3,
    character: 'Agate Crosner',
    series: 'Trails in the Sky',
    mainSeries: 'Trails',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: 'Trails cupsleeve event',
    date: 'Sep 20, 2026',
    photographer: null,
    photographerUrl: null,
    photoUrl: null,
    photoUrls: [],
    hasPhoto: false,
    variantType: 'other',
    variantLabel: 'Cupsleeve',
    isFavorite: true,
    isFirstCosplay: false,
    notes: "Ethan's favourite cosplay so far.",
  },
  {
    id: 4,
    character: 'Agate Crosner',
    series: 'Trails in the Sky',
    mainSeries: 'Trails',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: 'Anime Expo 2026',
    date: '2026',
    photographer: null,
    photographerUrl: null,
    photoUrl: null,
    photoUrls: [],
    hasPhoto: false,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 5,
    character: 'Akihiko Sanada',
    series: 'Persona 3',
    mainSeries: 'Persona',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: 'Anime Expo 2026',
    date: '2026',
    photographer: null,
    photographerUrl: null,
    photoUrl: null,
    photoUrls: [],
    hasPhoto: false,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 6,
    character: 'Ryusui Nanami',
    series: 'Dr. Stone',
    mainSeries: 'Dr. Stone',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: 'Anime Expo 2026',
    date: '2026',
    photographer: null,
    photographerUrl: null,
    photoUrl: null,
    photoUrls: [],
    hasPhoto: false,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 7,
    character: 'Naofumi Iwatani',
    series: 'The Rising of the Shield Hero',
    mainSeries: 'The Rising of the Shield Hero',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: null,
    date: null,
    photographer: null,
    photographerUrl: null,
    photoUrl: '/photos/naofumi-iwatani.jpg',
    photoUrls: ['/photos/naofumi-iwatani.jpg'],
    hasPhoto: true,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 8,
    character: 'Neptune',
    series: 'RWBY',
    mainSeries: 'RWBY',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: null,
    date: null,
    photographer: null,
    photographerUrl: null,
    photoUrl: '/photos/neptune-rwby.jpg',
    photoUrls: ['/photos/neptune-rwby.jpg'],
    hasPhoto: true,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: 'Neptune Vasilias.',
  },
  {
    id: 9,
    character: 'Satoshi Isshiki',
    series: 'Food Wars!',
    mainSeries: 'Food Wars!',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: null,
    date: null,
    photographer: null,
    photographerUrl: null,
    photoUrl: null,
    photoUrls: [],
    hasPhoto: false,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 10,
    character: 'Ray Cro Glamor',
    series: 'D&D original',
    mainSeries: 'Dungeons & Dragons',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: null,
    date: null,
    photographer: null,
    photographerUrl: null,
    photoUrl: '/photos/ray-cro-glamor.jpg',
    photoUrls: ['/photos/ray-cro-glamor.jpg'],
    hasPhoto: true,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: 'Original character — generic rogue / archer based on Ethan’s D&D character.',
  },
  {
    id: 11,
    character: 'Kamen Rider Wizard',
    series: 'Kamen Rider Wizard',
    mainSeries: 'Kamen Rider',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: null,
    date: null,
    photographer: null,
    photographerUrl: null,
    photoUrl: '/photos/kamen-rider-wizard.jpg',
    photoUrls: ['/photos/kamen-rider-wizard.jpg'],
    hasPhoto: true,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 12,
    character: 'Link',
    series: 'The Legend of Zelda',
    mainSeries: 'The Legend of Zelda',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: null,
    date: null,
    photographer: null,
    photographerUrl: null,
    photoUrl: '/photos/link-zelda.jpg',
    photoUrls: ['/photos/link-zelda.jpg'],
    hasPhoto: true,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: false,
    notes: null,
  },
  {
    id: 13,
    character: 'Izaya Orihara',
    series: 'Durarara!!',
    mainSeries: 'Durarara!!',
    cosplayer: 'Ethan Young',
    cosplayerHandle: '@camelcosplays',
    instagramUrl: 'https://www.instagram.com/camelcosplays',
    event: 'Anime Expo 2016',
    date: '2016',
    photographer: null,
    photographerUrl: null,
    photoUrl: '/photos/izaya-orihara.jpg',
    photoUrls: ['/photos/izaya-orihara.jpg'],
    hasPhoto: true,
    variantType: 'traditional',
    variantLabel: null,
    isFavorite: false,
    isFirstCosplay: true,
    notes: "Ethan's first cosplay.",
  },
];

export const SERIES_LIST: string[] = Array.from(
  new Set(SEEDED_COSPLAYS.map((c) => c.series)),
).sort();

/** Wide categories, e.g. "Trails" — each groups one or more specific series. */
export const MAIN_SERIES_LIST: string[] = Array.from(
  new Set(SEEDED_COSPLAYS.map((c) => c.mainSeries).filter((m): m is string => Boolean(m))),
).sort();

/** Specific series grouped under each main series. */
export const SPECIFIC_SERIES_BY_MAIN: Record<string, string[]> = (() => {
  const map: Record<string, string[]> = {};
  for (const c of SEEDED_COSPLAYS) {
    const main = c.mainSeries ?? c.series;
    if (!map[main]) map[main] = [];
    if (!map[main].includes(c.series)) map[main].push(c.series);
  }
  for (const k of Object.keys(map)) map[k].sort();
  return map;
})();

/**
 * Series filters are plain text boxes (Ethan, Nov 18): partial,
 * case-insensitive match, so "Trail" matches "Trails" and "Sky"
 * matches "Trails in the Sky". Empty text means no filter.
 */
export function filterByMainSeries(list: Cosplay[], mainSeries: string): Cosplay[] {
  const q = mainSeries.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) =>
    (c.mainSeries ?? c.series).toLowerCase().includes(q),
  );
}

export function filterBySpecificSeries(list: Cosplay[], specificSeries: string): Cosplay[] {
  const q = specificSeries.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) => c.series.toLowerCase().includes(q));
}

/** Case-insensitive search by character OR cosplayer. */
export function searchCosplays(list: Cosplay[], query: string): Cosplay[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (c) =>
      c.character.toLowerCase().includes(q) ||
      c.cosplayer.toLowerCase().includes(q) ||
      c.cosplayerHandle.toLowerCase().includes(q) ||
      c.series.toLowerCase().includes(q) ||
      (c.mainSeries ?? '').toLowerCase().includes(q),
  );
}

export function filterBySeries(list: Cosplay[], series: string): Cosplay[] {
  if (!series || series === 'All series') return list;
  return list.filter((c) => c.series === series);
}

export type VariantFilter =
  | 'All looks'
  | 'Traditional only'
  | 'Christmas'
  | 'Halloween'
  | 'Other';

export const VARIANT_FILTERS: VariantFilter[] = [
  'All looks',
  'Traditional only',
  'Christmas',
  'Halloween',
  'Other',
];

/**
 * Filter by variant. "Traditional only" hides every non-traditional
 * variant (Christmas, Halloween, Other); the other options show only
 * that variant type.
 */
export function filterByVariant(list: Cosplay[], variant: VariantFilter): Cosplay[] {
  switch (variant) {
    case 'Traditional only':
      return list.filter((c) => c.variantType === 'traditional');
    case 'Christmas':
      return list.filter((c) => c.variantType === 'christmas');
    case 'Halloween':
      return list.filter((c) => c.variantType === 'halloween');
    case 'Other':
      return list.filter((c) => c.variantType === 'other');
    case 'All looks':
    default:
      return list;
  }
}
