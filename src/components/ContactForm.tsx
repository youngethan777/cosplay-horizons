'use client';
import { useEffect, useRef, useState } from 'react';

const TOPICS = ['Feedback', 'Problem with the site', 'Question', 'Other'];

export default function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const confirmationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) {
      confirmationRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [done]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      contact: String(data.get('contact') || '').trim(),
      topic: String(data.get('topic') || 'Other'),
      message: String(data.get('message') || '').trim(),
    };
    if (!payload.message) {
      setError('Please write a message.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        return;
      }
      form.reset();
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
        <h2>Message sent</h2>
        <p>Thanks for reaching out. Your message was received.</p>
        <div className="confirmation-actions">
          <button
            type="button"
            className="btn"
            onClick={() => setDone(false)}
          >
            Send another message
          </button>
          <a className="btn secondary" href="/">
            Back to the gallery
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="stack" onSubmit={onSubmit}>
      {error && <p className="error" role="alert">{error}</p>}
      <label>Your name (optional)<input name="name" placeholder="Your name" /></label>
      <label>How can we reach you? (optional)
        <span className="hint">Email or social handle, only if you want a reply.</span>
        <input name="contact" placeholder="you@example.com or @yourhandle" />
      </label>
      <label>Topic
        <select name="topic" defaultValue="Feedback">
          {TOPICS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>Message<textarea name="message" rows={5} required placeholder="Tell us what is on your mind." /></label>
      <button className="btn" type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}
