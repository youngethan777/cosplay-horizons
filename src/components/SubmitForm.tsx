'use client';
import { useEffect, useRef, useState } from 'react';
import type { VariantType } from '@/lib/types';
import { MAIN_SERIES_LIST, SERIES_LIST } from '@/lib/data';
import { checkCharacterLastName } from '@/lib/known-characters';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_PHOTOS = 5;
const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.8;
const SMALL_BYTES = 1024 * 1024;
// Keep the whole submission comfortably under the server request size
// limit (roughly 4.5 MB). If the resized photos still add up to more
// than this, they are resized again at lower quality.
const TOTAL_MAX_BYTES = 4 * 1024 * 1024;

// Resize and re-encode a photo in the browser before it is sent, so large
// phone photos stay well under the server request size limit. The preview
// thumbnails still use the original files. Anything that cannot be decoded
// here (for example HEIC in a browser without HEIC support) is sent
// unchanged so the server validation message applies. GIF files are sent
// unchanged so animation is not lost. PNG transparency is flattened onto
// a white background by the JPEG export.
async function compressPhoto(
  file: File,
  maxDimension: number = MAX_DIMENSION,
  quality: number = JPEG_QUALITY,
): Promise<File> {
  if (file.type === 'image/gif') return file;
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('decode failed'));
      img.src = url;
    });
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    if (!width || !height) return file;
    const longest = Math.max(width, height);
    if (
      file.type === 'image/jpeg' &&
      file.size < SMALL_BYTES &&
      longest <= maxDimension
    ) {
      return file;
    }
    const scale = Math.min(1, maxDimension / longest);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality),
    );
    if (!blob) return file;
    const base = file.name.replace(/\.[^.]+$/, '') || 'photo';
    return new File([blob], `${base}.jpg`, {
      type: 'image/jpeg',
      lastModified: file.lastModified,
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Resize every selected photo, then check the combined size. Five detailed
// photos can still add up past the server request limit, so if the total is
// over TOTAL_MAX_BYTES the set is resized again at lower quality, and once
// more at a smaller size if needed. Pass-through files (GIFs and small
// JPEGs) count toward the total but are never re-encoded.
async function compressAll(files: File[]): Promise<File[]> {
  const totalSize = (arr: File[]) => arr.reduce((sum, f) => sum + f.size, 0);
  const first = await Promise.all(files.map((f) => compressPhoto(f)));
  if (totalSize(first) <= TOTAL_MAX_BYTES) return first;
  const second = await Promise.all(
    files.map((f) => compressPhoto(f, MAX_DIMENSION, 0.65)),
  );
  if (totalSize(second) <= TOTAL_MAX_BYTES) return second;
  return Promise.all(files.map((f) => compressPhoto(f, 1024, 0.6)));
}

type PreviewFile = { file: File; preview: string };

type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'x'
  | 'youtube'
  | 'facebook'
  | 'bluesky'
  | 'other';

const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'x', label: 'X' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'bluesky', label: 'Bluesky' },
  { value: 'other', label: 'Other' },
];

// Build a full credit link from a platform and a handle the user typed.
// The user never has to type https://www. For Other, the field holds a
// full link, and https:// is added when it is missing.
function buildSocialUrl(platform: SocialPlatform, raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  if (platform === 'other') {
    return /^https?:\/\//i.test(value) ? value : `https://${value}`;
  }
  const handle = value.replace(/^@+/, '').replace(/\s+/g, '');
  if (!handle) return '';
  switch (platform) {
    case 'instagram':
      return `https://www.instagram.com/${handle}`;
    case 'tiktok':
      return `https://www.tiktok.com/@${handle}`;
    case 'x':
      return `https://x.com/${handle}`;
    case 'youtube':
      return `https://www.youtube.com/@${handle}`;
    case 'facebook':
      return `https://www.facebook.com/${handle}`;
    case 'bluesky':
      return `https://bsky.app/profile/${handle}`;
  }
}

// Short display form for the live preview, without the protocol prefix.
function displaySocialUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/i, '');
}

export default function SubmitForm() {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [character, setCharacter] = useState('');
  const [mainSeries, setMainSeries] = useState('');
  const [noLastName, setNoLastName] = useState(false);
  const [variantType, setVariantType] = useState<VariantType>('traditional');
  const [variantLabel, setVariantLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [cosplayerPlatform, setCosplayerPlatform] =
    useState<SocialPlatform>('instagram');
  const [cosplayerHandle, setCosplayerHandle] = useState('');
  const [photographerPlatform, setPhotographerPlatform] =
    useState<SocialPlatform>('instagram');
  const [photographerHandle, setPhotographerHandle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) {
      confirmationRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [done]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setError(null);
    const incoming = Array.from(list);
    const valid: PreviewFile[] = [];
    for (const f of incoming) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        setError(`"${f.name}" is not an accepted type. Please use JPG, PNG, WebP, or GIF photos.`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        setError(`"${f.name}" is over 8 MB. Please choose a smaller photo.`);
        continue;
      }
      valid.push({ file: f, preview: URL.createObjectURL(f) });
    }
    setFiles((prev) => {
      const merged = [...prev, ...valid];
      if (merged.length > MAX_PHOTOS) {
        setError(`You can upload up to ${MAX_PHOTOS} photos. Only the first ${MAX_PHOTOS} were kept.`);
        return merged.slice(0, MAX_PHOTOS);
      }
      return merged;
    });
  }

  const lastNameCheck = checkCharacterLastName(character);
  const showLastNameSuggestion =
    lastNameCheck.kind === 'suggest' && !noLastName;
  const showUnknownSingleNote =
    lastNameCheck.kind === 'unknown-single' && !noLastName;

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files);
    // Allow re-selecting the same file after removing it.
    e.target.value = '';
  }

  function removeAt(i: number) {
    setFiles((prev) => {
      URL.revokeObjectURL(prev[i].preview);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function move(i: number, dir: -1 | 1) {
    setFiles((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  }

  function makeCover(i: number) {
    setFiles((prev) => {
      if (i === 0) return prev;
      const next = [...prev];
      const [item] = next.splice(i, 1);
      next.unshift(item);
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    if (files.length === 0) {
      setError('Please upload at least one photo of your cosplay.');
      return;
    }
    if (!data.get('consent')) {
      setError('Please tick the confirmation box to submit.');
      return;
    }
    if (variantType === 'other' && !variantLabel.trim()) {
      setError('Please name the variant (for example, “Beach” or “Formal”).');
      return;
    }
    if (!character.trim()) {
      setError('Please enter the character name.');
      return;
    }
    data.set('character', character.trim());
    data.set('mainSeries', mainSeries.trim());
    data.set('noLastName', noLastName ? 'true' : 'false');
    data.set('variantType', variantType);
    data.set('variantLabel', variantType === 'other' ? variantLabel.trim() : '');
    data.set('instagramUrl', buildSocialUrl(cosplayerPlatform, cosplayerHandle));
    data.set(
      'photographerUrl',
      buildSocialUrl(photographerPlatform, photographerHandle),
    );
    setBusy(true);
    try {
      // Rebuild the photo fields in display order (first = cover), resizing
      // the photos first so the request stays under the server size limit.
      data.delete('photo');
      const compressed = await compressAll(files.map(({ file }) => file));
      for (const file of compressed) {
        data.append('photo', file);
      }
      const res = await fetch('/api/submissions', { method: 'POST', body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 413) {
          setError('Those photos are too large to send together. Please try fewer photos, or smaller ones.');
        } else {
          setError(json.error || 'Something went wrong. Please try again.');
        }
        return;
      }
      form.reset();
      setFiles((prev) => {
        prev.forEach((p) => URL.revokeObjectURL(p.preview));
        return [];
      });
      setVariantType('traditional');
      setVariantLabel('');
      setCharacter('');
      setMainSeries('');
      setNoLastName(false);
      setCosplayerPlatform('instagram');
      setCosplayerHandle('');
      setPhotographerPlatform('instagram');
      setPhotographerHandle('');
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="confirmation" role="status" ref={confirmationRef}>
        <h2>You did it</h2>
        <p>
          Thanks, your submission was received and is waiting for review. We
          will only publish it after checking it.
        </p>
        <div className="confirmation-actions">
          <button
            type="button"
            className="btn"
            onClick={() => setDone(false)}
          >
            Submit another cosplay
          </button>
          <a className="btn secondary" href="/">
            Back to the gallery
          </a>
        </div>
      </div>
    );
  }

  const cosplayerUrl = buildSocialUrl(cosplayerPlatform, cosplayerHandle);
  const photographerUrl = buildSocialUrl(
    photographerPlatform,
    photographerHandle,
  );

  return (
    <form className="stack" onSubmit={onSubmit}>
      {error && <p className="error" role="alert">{error}</p>}

      <label>
        Photos, upload from your camera roll or files
        <span className="hint">
          Up to {MAX_PHOTOS} photos, JPG, PNG, WebP, or GIF. Photos are
          resized automatically before they are sent. The first
          photo is the cover shown in the gallery; you can reorder them
          below. These are the photos we will show, not a link.
        </span>
        <input
          ref={inputRef}
          type="file"
          name="photo"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={onFileChange}
          required={files.length === 0}
        />
      </label>

      {files.length > 0 && (
        <div className="preview-list" aria-label="Photos to submit">
          {files.map((item, i) => (
            <div className="preview-item" key={`${item.file.name}-${i}`}>
              <img src={item.preview} alt={`Preview ${i + 1}: ${item.file.name}`} />
              <div className="meta">
                <p>
                  {i === 0 && <span className="cover-tag">Cover</span>}{' '}
                  {item.file.name}
                </p>
                <p className="count">{Math.round(item.file.size / 1024)} KB</p>
              </div>
              <div className="actions">
                {i > 0 && (
                  <button type="button" className="btn secondary" onClick={() => move(i, -1)}>
                    ↑ Move up
                  </button>
                )}
                {i < files.length - 1 && (
                  <button type="button" className="btn secondary" onClick={() => move(i, 1)}>
                    ↓ Move down
                  </button>
                )}
                {i !== 0 && (
                  <button type="button" className="btn secondary" onClick={() => makeCover(i)}>
                    Make cover
                  </button>
                )}
                <button type="button" className="btn secondary" onClick={() => removeAt(i)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          {files.length < MAX_PHOTOS && (
            <button
              type="button"
              className="btn secondary"
              onClick={() => inputRef.current?.click()}
            >
              Add another photo ({files.length} of {MAX_PHOTOS})
            </button>
          )}
        </div>
      )}

      <fieldset className="variant">
        <legend>Variant</legend>
        {(
          [
            ['traditional', 'Traditional, the usual look for this character'],
            ['christmas', 'Christmas variant'],
            ['halloween', 'Halloween variant'],
            ['other', 'Other variant'],
          ] as const
        ).map(([value, label]) => (
          <label key={value}>
            <input
              type="radio"
              name="variantType"
              value={value}
              checked={variantType === value}
              onChange={() => setVariantType(value)}
            />
            <span>{label}</span>
          </label>
        ))}
        {variantType === 'other' && (
          <label>
            Variant name
            <span className="hint">For example: Beach, Formal, Winter.</span>
            <input
              name="variantLabel"
              value={variantLabel}
              onChange={(e) => setVariantLabel(e.target.value)}
              placeholder="e.g. Beach"
              required
            />
          </label>
        )}
      </fieldset>

      <label>Character
        <input
          name="character"
          required
          placeholder="e.g. Agate Crosner"
          value={character}
          onChange={(e) => {
            setCharacter(e.target.value);
            setNoLastName(false);
          }}
        />
      </label>
      {showLastNameSuggestion && lastNameCheck.kind === 'suggest' && (
        <p className="warning" role="status">
          Did you mean {lastNameCheck.fullName}?{' '}
          <button
            type="button"
            className="btn secondary"
            onClick={() => setCharacter(lastNameCheck.fullName)}
          >
            Use {lastNameCheck.fullName}
          </button>{' '}
          <button
            type="button"
            className="btn secondary"
            onClick={() => setNoLastName(true)}
          >
            This character has no last name
          </button>
        </p>
      )}
      {noLastName && (
        <p className="count" role="status">
          Noted, this character has no last name.
        </p>
      )}
      {showUnknownSingleNote && (
        <p className="count" role="status">
          If this character has a last name, please add it, you can still
          submit with just a first name.
        </p>
      )}
      <label>Main series
        <span className="hint">The wide category, e.g. Trails or Fire Emblem. Pick from the list or type a new one.</span>
        <input
          name="mainSeries"
          list="main-series-suggestions"
          placeholder="e.g. Trails"
          value={mainSeries}
          onChange={(e) => setMainSeries(e.target.value)}
        />
        <datalist id="main-series-suggestions">
          {MAIN_SERIES_LIST.map((m) => (
            <option key={m} value={m} />
          ))}
        </datalist>
      </label>
      <label>Specific series
        <span className="hint">Optional, the specific series, e.g. Fire Emblem Three Houses.</span>
        <input name="series" list="specific-series-suggestions" placeholder="e.g. Fire Emblem Three Houses" />
        <datalist id="specific-series-suggestions">
          {SERIES_LIST.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </label>
      <label>Cosplayer display name
        <span className="hint">This is the name shown publicly with your photo. Use your cosplay name, not your real name, if you prefer. For example, Camel Cosplays or XXX Cosplays.</span>
        <input name="cosplayer" required placeholder="e.g. Camel Cosplays" />
      </label>
      <label>Your social link (optional)
        <span className="hint">This is the credit link for you, the cosplayer. It is shown next to your photo so people can find you. Pick your platform and type just your handle. No need to type the full link.</span>
        <select
          name="cosplayerPlatform"
          value={cosplayerPlatform}
          onChange={(e) => setCosplayerPlatform(e.target.value as SocialPlatform)}
        >
          {SOCIAL_PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        {cosplayerPlatform === 'other' ? (
          <input
            name="cosplayerHandle"
            value={cosplayerHandle}
            onChange={(e) => setCosplayerHandle(e.target.value)}
            placeholder="example.com/yourpage"
            aria-label="Full link"
          />
        ) : (
          <input
            name="cosplayerHandle"
            value={cosplayerHandle}
            onChange={(e) => setCosplayerHandle(e.target.value)}
            placeholder="@yourhandle"
            aria-label="Your handle"
          />
        )}
        {cosplayerPlatform === 'other' && (
          <span className="hint">Full link, for example example.com/yourpage. We will add https:// for you if it is missing.</span>
        )}
        {cosplayerUrl && (
          <span className="hint">This will link to {displaySocialUrl(cosplayerUrl)}</span>
        )}
      </label>
      <label>Event (optional)<input name="event" placeholder="e.g. Anime Expo 2026" /></label>
      <label>Date (optional)<input name="date" placeholder="e.g. Jul 2026" /></label>
      <label>Photographer name (optional)<input name="photographer" placeholder="Who took the photo?" /></label>
      <label>Photographer social link (optional)
        <span className="hint">This is the credit link for the photographer. Pick their platform and type just their handle. No need to type the full link.</span>
        <select
          name="photographerPlatform"
          value={photographerPlatform}
          onChange={(e) => setPhotographerPlatform(e.target.value as SocialPlatform)}
        >
          {SOCIAL_PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        {photographerPlatform === 'other' ? (
          <input
            name="photographerHandle"
            value={photographerHandle}
            onChange={(e) => setPhotographerHandle(e.target.value)}
            placeholder="example.com/theirpage"
            aria-label="Full link"
          />
        ) : (
          <input
            name="photographerHandle"
            value={photographerHandle}
            onChange={(e) => setPhotographerHandle(e.target.value)}
            placeholder="@theirhandle"
            aria-label="Photographer handle"
          />
        )}
        {photographerPlatform === 'other' && (
          <span className="hint">Full link, for example example.com/theirpage. We will add https:// for you if it is missing.</span>
        )}
        {photographerUrl && (
          <span className="hint">This will link to {displaySocialUrl(photographerUrl)}</span>
        )}
      </label>
      <label className="check"><input type="checkbox" name="consent" required />
        <span>I confirm this is my cosplay and I understand Cosplay Horizons will show it publicly with credit, and will remove it if the cosplayer asks.</span>
      </label>
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send submission'}</button>
      <p className="count">Submissions are reviewed before they appear in the gallery.</p>
    </form>
  );
}
