import { getMyTickets } from '@/actions/support';
import CustomerSupportClient from './CustomerSupportClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | ZippyGo',
  description: 'Customer support and help center',
};

export default async function CustomerSupportPage() {
  const result = await getMyTickets();
  const initialTickets = result.success ? result.data : [];

  return <CustomerSupportClient initialTickets={initialTickets as any} />;
}
