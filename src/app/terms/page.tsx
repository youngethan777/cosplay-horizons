import { redirect } from 'next/navigation';

export const metadata = { title: 'Privacy & Terms: Cosplay Horizons' };

export default function TermsPage() {
  redirect('/privacy');
}
