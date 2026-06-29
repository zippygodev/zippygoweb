import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  switch (session.user.role) {
    case 'RESTAURANT_OWNER':
      redirect('/dashboard/restaurant');
    case 'DELIVERY_PARTNER':
      redirect('/dashboard/delivery');
    case 'MALL_ADMIN':
      redirect('/dashboard/admin');
    case 'SUPER_ADMIN':
      redirect('/dashboard/superadmin');
    default:
      redirect('/customer');
  }
}
