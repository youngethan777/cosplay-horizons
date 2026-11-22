// Helpers for social credit links.
//
// The submission form asks for a handle, but people often paste a full
// profile link instead. These helpers pull just the handle out of
// whatever was typed, so a pasted link can never produce a doubled
// address like instagram.com/https://www.instagram.com/handle.

// Path segments that are not handles themselves. For example a Bluesky
// profile link looks like bsky.app/profile/name.bsky.social, so the
// handle is the segment after "profile".
const PATH_PREFIXES = ['profile', 'channel', 'c', 'user'];

// Pull just the handle out of whatever the user typed into a handle
// field. Accepts a bare handle, an @handle, a full profile URL, or a
// domain without a scheme, and returns the handle with no @, no
// trailing slash, and no query string or fragment.
export function extractHandle(raw: string): string {
  let value = raw.trim();
  if (!value) return '';
  const schemeIndex = value.indexOf('://');
  if (schemeIndex !== -1) {
    // Full URL pasted into the handle field. Keep only the path part.
    value = value.slice(schemeIndex + 3).split('/').slice(1).join('/');
  } else if (/^[^\s/]+\.[^\s/]+\//.test(value)) {
    // Domain without a scheme, like instagram.com/handle.
    value = value.split('/').slice(1).join('/');
  }
  // Drop any query string or fragment.
  value = value.split(/[?#]/)[0];
  const segments = value.split('/').filter(Boolean);
  let handle = segments[0] || '';
  if (PATH_PREFIXES.includes(handle.toLowerCase()) && segments[1]) {
    handle = segments[1];
  }
  return handle.replace(/^@+/, '').replace(/\s+/g, '');
}

// Server side safety net for stored credit links. If a value contains
// more than one scheme, it is a doubled address: a platform base URL
// stuck in front of another full URL. Take the inner URL, pull out its
// handle, and rebuild one clean link for that platform. A value that
// is already a single clean URL is returned unchanged.
export function normalizeSocialUrl(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  const schemeCount = (value.match(/:\/\//g) || []).length;
  if (schemeCount <= 1) return value;
  const lastScheme = value.lastIndexOf('://');
  const schemeStart = Math.max(
    value.lastIndexOf('https://', lastScheme),
    value.lastIndexOf('http://', lastScheme),
  );
  const inner = schemeStart >= 0 ? value.slice(schemeStart) : value;
  const handle = extractHandle(inner);
  if (!handle) return inner;
  const host = inner
    .replace(/^https?:\/\//i, '')
    .split('/')[0]
    .toLowerCase();
  if (host.endsWith('instagram.com')) {
    return `https://www.instagram.com/${handle}`;
  }
  if (host.endsWith('tiktok.com')) {
    return `https://www.tiktok.com/@${handle}`;
  }
  if (host.endsWith('x.com') || host.endsWith('twitter.com')) {
    return `https://x.com/${handle}`;
  }
  if (host.endsWith('youtube.com')) {
    return `https://www.youtube.com/@${handle}`;
  }
  if (host.endsWith('facebook.com')) {
    return `https://www.facebook.com/${handle}`;
  }
  if (host.endsWith('bsky.app')) {
    return `https://bsky.app/profile/${handle}`;
  }
  // Unknown platform: the inner URL on its own is still one clean link.
  return inner;
}
