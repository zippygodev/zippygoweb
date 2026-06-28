import { getAllTickets } from '@/actions/support';
import SupportClient from '../../superadmin/support/SupportClient';

export default async function AdminSupportPage() {
  const result = await getAllTickets();
  const initialTickets = result.success ? result.data : [];

  return <SupportClient initialTickets={initialTickets as any} />;
}
