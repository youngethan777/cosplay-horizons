export type VariantType = 'traditional' | 'christmas' | 'halloween' | 'other';

export const VARIANT_TYPES: VariantType[] = [
  'traditional',
  'christmas',
  'halloween',
  'other',
];

export function isVariantType(value: unknown): value is VariantType {
  return (
    typeof value === 'string' &&
    (VARIANT_TYPES as string[]).includes(value)
  );
}

/** Human-readable label for a variant. `other` uses the custom label. */
export function variantDisplayName(
  variantType: VariantType,
  variantLabel: string | null,
): string {
  switch (variantType) {
    case 'christmas':
      return 'Christmas variant';
    case 'halloween':
      return 'Halloween variant';
    case 'other':
      return variantLabel ? `${variantLabel} variant` : 'Variant';
    case 'traditional':
    default:
      return 'Traditional';
  }
}

export type Cosplay = {
  id: number;
  character: string;
  /** Wide category, e.g. "Trails" — series is the specific series. */
  mainSeries: string | null;
  /** Specific series, e.g. "Trails in the Sky". */
  series: string;
  cosplayer: string;
  cosplayerHandle: string;
  instagramUrl: string;
  event: string | null;
  date: string | null;
  photographer: string | null;
  photographerUrl: string | null;
  /** Cover photo — kept for backward compatibility. Always photoUrls[0]. */
  photoUrl: string | null;
  /** All photos, first = cover. Backfilled from photoUrl when absent. */
  photoUrls: string[];
  hasPhoto: boolean;
  /** Variant of the look; 'traditional' is the default (12 of the 13 seeded entries; id 3 is the Cupsleeve variant). */
  variantType: VariantType;
  /** Custom variant name, only used when variantType is 'other'. */
  variantLabel: string | null;
  isFavorite: boolean;
  isFirstCosplay: boolean;
  notes: string | null;
};

/** Cover photo: first of photoUrls, falling back to the legacy photoUrl. */
export function getCoverPhoto(cosplay: Cosplay): string | null {
  return cosplay.photoUrls?.[0] ?? cosplay.photoUrl ?? null;
}

/** All photos for a look, in display order (cover first). */
export function getPhotoUrls(cosplay: Cosplay): string[] {
  if (cosplay.photoUrls && cosplay.photoUrls.length > 0)
    return cosplay.photoUrls;
  return cosplay.photoUrl ? [cosplay.photoUrl] : [];
}

export type Submission = {
  id?: string;
  character: string;
  /** Wide category, e.g. "Trails" (optional on submit). */
  mainSeries: string | null;
  /** Specific series, e.g. "Trails in the Sky". */
  series: string;
  cosplayer: string;
  instagramUrl: string | null;
  event: string | null;
  date: string | null;
  photographer: string | null;
  photographerUrl: string | null;
  /** Cover photo path in storage (first of photoPaths) — legacy field. */
  photoPath?: string | null;
  /** All uploaded photo paths in storage, first = cover. */
  photoPaths: string[];
  photoFileName: string | null;
  /** File names matching photoPaths, in the same order. */
  photoFileNames: string[];
  variantType: VariantType;
  variantLabel: string | null;
  /** Submitter confirmed this character has no last name. */
  noLastName?: boolean;
  consent: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
};

export type TakedownRequest = {
  id?: string;
  cosplayId: number | null;
  character: string | null;
  requesterName: string;
  contact: string;
  reason: string;
  status: 'open' | 'actioned' | 'declined';
  createdAt?: string;
};
