'use client';
import { useState } from 'react';
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_BYTES = 8 * 1024 * 1024;
export default function SubmitForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setError(null); setSuccess(null);
    if (!f) { setFile(null); setPreview(null); return; }
    if (!ALLOWED_TYPES.includes(f.type)) { setError('That file type is not accepted. Please use a JPG, PNG, WebP, or GIF photo.'); setFile(null); setPreview(null); return; }
    if (f.size > MAX_BYTES) { setError('That photo is over 8 MB. Please choose a smaller photo.'); setFile(null); setPreview(null); return; }
    setFile(f); setPreview(URL.createObjectURL(f));
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setSuccess(null);
    const form = e.currentTarget; const data = new FormData(form);
    if (!file) { setError('Please upload a photo of your cosplay.'); return; }
    if (!data.get('consent')) { setError('Please tick the consent box — we only publish photos with the cosplayer’s permission.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/submissions', { method: 'POST', body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(json.error || 'Something went wrong. Please try again.'); return; }
      setSuccess(json.preview ? 'Thanks — your submission was received in preview mode. It is not saved to a database yet: connect Supabase (see README) to save submissions for review.' : 'Thanks — your submission was received and is waiting for review. We will only publish it after checking it.');
      form.reset(); setFile(null); setPreview(null);
    } catch { setError('Something went wrong. Please try again.'); } finally { setBusy(false); }
  }
  return (
    <form className="stack" onSubmit={onSubmit}>
      {error && <p className="error" role="alert">{error}</p>}
      {success && <p className="success" role="status">{success}</p>}
      <label>Photo — upload from your camera roll or files
        <span className="hint">JPG, PNG, WebP, or GIF, up to 8 MB. This is the photo we will show — not a link.</span>
        <input type="file" name="photo" accept="image/jpeg,image/png,image/webp,image/gif" onChange={onFileChange} required />
      </label>
      {preview && (<div className="preview">
        <img src={preview} alt="Preview of your uploaded cosplay photo" />
        <p className="count">{file?.name} · {file ? Math.round(file.size / 1024) : 0} KB</p>
        <button type="button" className="btn secondary" onClick={() => { setFile(null); setPreview(null); }}>Remove photo</button>
      </div>)}
      <label>Character<input name="character" required placeholder="e.g. Agate Crosner" /></label>
      <label>Series<input name="series" required placeholder="e.g. Trails in the Sky" /></label>
      <label>Cosplayer name<input name="cosplayer" required placeholder="Your name, as you want it credited" /></label>
      <label>Link to your Instagram post or profile
        <span className="hint">Credit only — this link is shown next to your photo so people can find you. It is not used as the photo itself.</span>
        <input name="instagramUrl" type="url" placeholder="https://www.instagram.com/yourhandle" />
      </label>
      <label>Event (optional)<input name="event" placeholder="e.g. Anime Expo 2026" /></label>
      <label>Date (optional)<input name="date" placeholder="e.g. Jul 2026" /></label>
      <label>Photographer name (optional)<input name="photographer" placeholder="Who took the photo?" /></label>
      <label>Photographer social link (optional)<input name="photographerUrl" type="url" placeholder="https://www.instagram.com/photographer" /></label>
      <label className="check"><input type="checkbox" name="consent" required />
        <span>I confirm this is my cosplay (or I have the cosplayer’s permission to submit it), and I understand Cosplay Horizons will show it publicly with credit, and will remove it if the cosplayer asks.</span>
      </label>
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Submit my cosplay'}</button>
      <p className="count">Submissions are reviewed before they appear in the gallery. No account is needed.</p>
    </form>
  );
}
