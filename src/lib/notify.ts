// Server-only notification helper for new submissions and removal
// requests. Notifications go to the site owner side only, never to
// submitters. This helper never throws, so a notification failure can
// never fail a submission or a removal request.
//
// Setup, pick one:
//   Resend email: set RESEND_API_KEY and NOTIFY_EMAIL_FROM. Mail goes
//     to NOTIFY_EMAIL_TO, or to cosplayhorizons@muse.ai when unset.
//   Webhook: set NOTIFY_WEBHOOK_URL and the same summary is POSTed
//     there as JSON.
// With neither set, this helper does nothing.

export type SubmissionNotice = {
  character: string;
  series: string;
  cosplayer: string;
  photoCount: number;
  variantType?: string;
  variantLabel?: string | null;
};

export type RemovalNotice = {
  character: string | null;
  cosplayId: number | null;
  reason: string;
};

export type ContactNotice = {
  name: string;
  contact: string;
  topic: string;
  message: string;
};

async function sendNotice(subject: string, text: string, payload: unknown): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_EMAIL_FROM;
  const to = process.env.NOTIFY_EMAIL_TO || 'cosplayhorizons@muse.ai';
  const webhookUrl = process.env.NOTIFY_WEBHOOK_URL;

  try {
    if (resendKey && from) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to: [to], subject, text }),
      });
      if (!res.ok) {
        console.error('notify: Resend request failed with status', res.status);
      }
      return;
    }
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        console.error('notify: webhook request failed with status', res.status);
      }
    }
  } catch (err) {
    // Server-side log only. Never throw, never block the caller.
    console.error('notify: notification failed', err instanceof Error ? err.message : 'unknown error');
  }
}

export async function notifyNewSubmission(notice: SubmissionNotice): Promise<void> {
  const variant = notice.variantLabel
    ? `${notice.variantType || 'other'} (${notice.variantLabel})`
    : notice.variantType || 'traditional';
  const text = [
    'A new cosplay submission is waiting for review on Cosplay Horizons.',
    '',
    `Character: ${notice.character}`,
    `Series: ${notice.series}`,
    `Cosplayer display name: ${notice.cosplayer}`,
    `Photos: ${notice.photoCount}`,
    `Variant: ${variant}`,
    '',
    'Review it through the private admin API or the Supabase dashboard.',
  ].join('\n');
  await sendNotice(
    `New Cosplay Horizons submission: ${notice.character}`,
    text,
    { type: 'submission', ...notice },
  );
}

export async function notifyNewContactMessage(notice: ContactNotice): Promise<void> {
  const text = [
    'A new contact message came in on Cosplay Horizons.',
    '',
    `Topic: ${notice.topic}`,
    `Name: ${notice.name || 'not given'}`,
    `Reach them at: ${notice.contact || 'not given'}`,
    `Message: ${notice.message}`,
    '',
    'Read it through the private admin API or the Supabase dashboard.',
  ].join('\n');
  await sendNotice(
    `New Cosplay Horizons contact message: ${notice.topic}`,
    text,
    { type: 'contact', ...notice },
  );
}

export async function notifyNewRemoval(notice: RemovalNotice): Promise<void> {
  const target = notice.cosplayId
    ? `cosplay id ${notice.cosplayId}`
    : 'no cosplay id given';
  const text = [
    'A new removal request came in on Cosplay Horizons.',
    '',
    `Character: ${notice.character || 'not given'}`,
    `Target: ${target}`,
    `Reason: ${notice.reason}`,
    '',
    'Review it through the private admin API or the Supabase dashboard.',
  ].join('\n');
  await sendNotice(
    'New Cosplay Horizons removal request',
    text,
    { type: 'removal', ...notice },
  );
}
