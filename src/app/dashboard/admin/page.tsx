import { getAdminDashboardMetrics } from '@/actions/admin/dashboard';
import AdminDashboardClient from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const result = await getAdminDashboardMetrics();
  const metrics = result.success ? result.data : null;

  return <AdminDashboardClient metrics={metrics} />;
}
