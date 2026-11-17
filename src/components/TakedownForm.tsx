'use client';
import { useState } from 'react';
import type { Cosplay } from '@/lib/types';
export default function TakedownForm({ cosplay }: { cosplay: Cosplay | null }) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(null); setSuccess(null);
    const data = new FormData(e.currentTarget);
    const payload = {
      cosplayId: cosplay ? cosplay.id : (data.get('cosplayId') ? Number(data.get('cosplayId')) : null),
      character: cosplay ? cosplay.character : String(data.get('character') || ''),
      requesterName: String(data.get('requesterName') || ''),
      contact: String(data.get('contact') || ''),
      reason: String(data.get('reason') || ''),
    };
    if (!payload.requesterName || !payload.contact || !payload.reason) { setError('Please fill in your name, a way to contact you, and the reason.'); return; }
    setBusy(true);
    try {
      const res = await fetch('/api/takedowns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(json.error || 'Something went wrong. Please try again.'); return; }
      setSuccess(json.preview ? 'Request received in preview mode. It is not saved to a database yet: connect Supabase (see README) to save takedown requests. In the live site, we promise to act within 48 hours.' : 'Request received. We will act within 48 hours and contact you at the address you gave us.');
      (e.target as HTMLFormElement).reset();
    } catch { setError('Something went wrong. Please try again.'); } finally { setBusy(false); }
  }
  return (
    <form className="stack" onSubmit={onSubmit}>
      {error && <p className="error" role="alert">{error}</p>}
      {success && <p className="success" role="status">{success}</p>}
      {cosplay ? (
        <p><strong>Photo:</strong> {cosplay.character} — {cosplay.series}, cosplayed by {cosplay.cosplayer} ({cosplay.cosplayerHandle})</p>
      ) : (
        <label>Which photo is this about?
          <span className="hint">If you came from a gallery entry, this is filled in for you.</span>
          <input name="character" placeholder="Character name, e.g. Agate Crosner" />
        </label>
      )}
      <label>Your name<input name="requesterName" required placeholder="Your name" /></label>
      <label>How can we contact you?
        <span className="hint">Email or Instagram handle — we will only use it about this request.</span>
        <input name="contact" required placeholder="you@example.com or @yourhandle" />
      </label>
      <label>Reason for removal<textarea name="reason" rows={4} required placeholder="e.g. This is a photo of me and I would like it removed." /></label>
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send takedown request'}</button>
      <p className="count">We promise to act within 48 hours. You do not need an account, and you do not need to give a legal reason — “please remove it” is enough.</p>
    </form>
  );
}
