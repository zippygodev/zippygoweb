import { getAllTickets } from '@/actions/support';
import SupportClient from './SupportClient';

export default async function SupportPage() {
  const result = await getAllTickets();
  const initialTickets = result.success ? result.data : [];

  return <SupportClient initialTickets={initialTickets as any} />;
}
