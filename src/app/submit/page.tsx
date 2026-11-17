import SubmitForm from '@/components/SubmitForm';
export const metadata = { title: 'Submit a cosplay — Cosplay Horizons' };
export default function SubmitPage() {
  return (
    <>
      <h2>Submit a cosplay</h2>
      <p style={{ maxWidth: '68ch' }}>
        This is how Cosplay Horizons grows: cosplayers submit their own
        photos. Upload a photo from your camera roll, tell us who it is,
        and we will review it before it appears in the gallery. No account
        needed, no subscription, no ads.
      </p>
      <SubmitForm />
    </>
  );
}
