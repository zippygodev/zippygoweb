import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import SuperAdminClientLayout from './ClientLayout';
import { type ReactNode } from 'react';

export default async function SuperAdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  // Protect the superadmin route
  if (!session || !session.user || session.user.role !== 'SUPER_ADMIN') {
    // If not super admin, redirect to home or login
    redirect('/auth/login');
  }

  return <SuperAdminClientLayout>{children}</SuperAdminClientLayout>;
}
