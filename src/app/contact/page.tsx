import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
export const metadata = { title: 'Contact Us: Cosplay Horizons' };
export default function ContactPage() {
  return (
    <>
      <h2>Contact Us</h2>
      <p style={{ maxWidth: '68ch' }}>
        Have feedback, a problem with the site, or a question? Send us a
        message here.
      </p>
      <p style={{ maxWidth: '68ch' }}>
        We read every message. If you want a reply, leave a way to reach
        you in the form below.
      </p>
      <p style={{ maxWidth: '68ch' }}>
        If you want a photo removed, please use the{' '}
        <Link href="/remove">removal page</Link> instead. That form goes
        straight to the right place.
      </p>
      <ContactForm />
    </>
  );
}
