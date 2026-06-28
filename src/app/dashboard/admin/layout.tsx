import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminClientLayout from './AdminClientLayout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/login');
  }

  // The role can be MALL_ADMIN. If we want SUPER_ADMIN to also access it, we can allow it here.
  // We'll allow MALL_ADMIN and SUPER_ADMIN.
  if (session.user?.role !== 'MALL_ADMIN' && session.user?.role !== 'SUPER_ADMIN') {
    redirect('/dashboard');
  }

  return (
    <AdminClientLayout>
      {children}
    </AdminClientLayout>
  );
}
