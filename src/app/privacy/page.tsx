export const metadata = { title: 'Privacy — Cosplay Horizons' };
export default function PrivacyPage() {
  return (
    <article className="prose">
      <h2>Privacy</h2>
      <p><em>Short version: we collect as little as possible, we show only what cosplayers submit with permission, and we remove photos when asked.</em></p>
      <h3>What we collect</h3>
      <ul>
        <li><strong>Submissions:</strong> the photo, character, series, cosplayer name, Instagram link, event/date, and photographer credit you send us — so we can credit you and show the look.</li>
        <li><strong>Takedown requests:</strong> your name, contact, and reason — only to handle that request.</li>
        <li><strong>Visits:</strong> basic, anonymous hosting analytics (pages viewed, approximate region). No advertising trackers, no pop-ups, no selling data.</li>
      </ul>
      <h3>What we do not do</h3>
      <p>We do not scrape Instagram or any other site. We do not sell or share your personal information. We do not run ads that track you across the web in v1.</p>
      <h3>Photos</h3>
      <p>Photos are published only with the cosplayer’s permission (opt-in). If you are in a photo and want it removed, use the <a href="/takedown">takedown form</a> — we act within 48 hours.</p>
      <h3>Contact</h3>
      <p>Use the takedown form for removal requests. For anything else, contact the cosplayer via their linked Instagram.</p>
      <p><em>This is a plain-language summary for a small community site, not legal advice. If the site grows, get it reviewed by a lawyer.</em></p>
    </article>
  );
}
