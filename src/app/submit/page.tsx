import SubmitForm from '@/components/SubmitForm';
export const metadata = { title: 'Submission: Cosplay Horizons' };
export default function SubmitPage() {
  return (
    <>
      <h2>Submission</h2>
      <p style={{ maxWidth: '68ch' }}>
        By submitting a cosplay you are joining a growing community of
        cosplay creatives where we can inspire each other and keep the
        cosplay community growing in its own dedicated space.
      </p>
      <p style={{ maxWidth: '68ch' }}>
        Cosplayers can submit up to five photos per submission. Choose your
        favorite as the cover photo to shine bright on the horizon and tell
        us who deserves all the credit.
      </p>
      <p style={{ maxWidth: '68ch' }}>
        To ensure that only appropriate photos are getting submitted, your
        submission will go through an approval. Thank you for your patience.
      </p>
      <SubmitForm />
    </>
  );
}
