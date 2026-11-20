'use client';
import { useRef, useState } from 'react';
import type { VariantType } from '@/lib/types';
import { MAIN_SERIES_LIST, SERIES_LIST } from '@/lib/data';
import { checkCharacterLastName } from '@/lib/known-characters';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 8 * 1024 * 1024;
const MAX_PHOTOS = 5;

type PreviewFile = { file: File; preview: string };

export default function SubmitForm() {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [character, setCharacter] = useState('');
  const [mainSeries, setMainSeries] = useState('');
  const [noLastName, setNoLastName] = useState(false);
  const [variantType, setVariantType] = useState<VariantType>('traditional');
  const [variantLabel, setVariantLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function addFiles(list: FileList | null) {
    if (!list) return;
    setError(null);
    setSuccess(null);
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
    setSuccess(null);
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
    // Rebuild the photo fields in display order (first = cover).
    data.delete('photo');
    for (const { file } of files) data.append('photo', file);
    data.set('variantType', variantType);
    data.set('variantLabel', variantType === 'other' ? variantLabel.trim() : '');
    setBusy(true);
    try {
      const res = await fetch('/api/submissions', { method: 'POST', body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        return;
      }
      setSuccess(
        json.preview
          ? 'Thanks, your submission was received.'
          : 'Thanks, your submission was received and is waiting for review. We will only publish it after checking it.',
      );
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
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      {error && <p className="error" role="alert">{error}</p>}
      {success && <p className="success" role="status">{success}</p>}

      <label>
        Photos, upload from your camera roll or files
        <span className="hint">
          Up to {MAX_PHOTOS} photos, JPG, PNG, WebP, or GIF, up to 8 MB each.
          The first photo is the cover shown in the gallery; you can reorder
          them below. These are the photos we will show, not a link.
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
      <label>Link to your Instagram post or profile
        <span className="hint">Credit only, this link is shown next to your photo so people can find you. It is not used as the photo itself.</span>
        <input name="instagramUrl" type="url" placeholder="https://www.instagram.com/yourhandle" />
      </label>
      <label>Event (optional)<input name="event" placeholder="e.g. Anime Expo 2026" /></label>
      <label>Date (optional)<input name="date" placeholder="e.g. Jul 2026" /></label>
      <label>Photographer name (optional)<input name="photographer" placeholder="Who took the photo?" /></label>
      <label>Photographer social link (optional)<input name="photographerUrl" type="url" placeholder="https://www.instagram.com/photographer" /></label>
      <label className="check"><input type="checkbox" name="consent" required />
        <span>I confirm this is my cosplay and I understand Cosplay Horizons will show it publicly with credit, and will remove it if the cosplayer asks.</span>
      </label>
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send submission'}</button>
      <p className="count">Submissions are reviewed before they appear in the gallery.</p>
    </form>
  );
}
