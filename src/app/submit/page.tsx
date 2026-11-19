import SubmitForm from '@/components/SubmitForm';
export const metadata = { title: 'Submit a cosplay — Cosplay Horizons' };
export default function SubmitPage() {
  return (
    <>
      <h2>Submit a cosplay</h2>
      <p style={{ maxWidth: '68ch' }}>
        This is how Cosplay Horizons grows: cosplayers submit their own
        photos. Upload up to 5 photos from your camera roll, pick a cover
        photo, tell us who it is, and we will review it before it appears
        in the gallery. No account needed, no subscription, no ads.
      </p>
      <SubmitForm />
    </>
  );
}
