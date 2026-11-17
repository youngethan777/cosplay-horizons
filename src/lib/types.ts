export type Cosplay = {
  id: number;
  character: string;
  series: string;
  cosplayer: string;
  cosplayerHandle: string;
  instagramUrl: string;
  event: string | null;
  date: string | null;
  photographer: string | null;
  photographerUrl: string | null;
  /** Path under /public, e.g. "/photos/naofumi-iwatani.jpg". Null = placeholder. */
  photoUrl: string | null;
  hasPhoto: boolean;
  isFavorite: boolean;
  isFirstCosplay: boolean;
  notes: string | null;
};

export type Submission = {
  id?: string;
  character: string;
  series: string;
  cosplayer: string;
  instagramUrl: string | null;
  event: string | null;
  date: string | null;
  photographer: string | null;
  photographerUrl: string | null;
  photoFileName: string | null;
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
