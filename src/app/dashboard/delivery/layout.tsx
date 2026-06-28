import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import DeliveryClientLayout from './DeliveryClientLayout';
import { prisma } from '@/lib/prisma';

export default async function DeliveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protect layout
  if (!session) {
    redirect('/auth/delivery-login');
  }

  if (session.user?.role !== 'DELIVERY_PARTNER' && session.user?.role !== 'SUPER_ADMIN') {
    redirect('/unauthorized');
  }

  // Fetch delivery partner data
  let deliveryPartner = null;
  if (session.user.role === 'DELIVERY_PARTNER') {
    deliveryPartner = await prisma.deliveryPartner.findUnique({
      where: { userId: session.user.id },
      include: {
        user: true,
      }
    });
  } else {
    // Super admin fallback (for testing)
    deliveryPartner = await prisma.deliveryPartner.findFirst({
      include: {
        user: true,
      }
    });
  }

  if (!deliveryPartner && session.user.role === 'DELIVERY_PARTNER') {
    // Create delivery partner profile if it doesn't exist
    deliveryPartner = await prisma.deliveryPartner.create({
      data: {
        userId: session.user.id,
      },
      include: {
        user: true,
      }
    });
  }

  return (
    <DeliveryClientLayout initialDeliveryPartner={deliveryPartner as any}>
      {children}
    </DeliveryClientLayout>
  );
}
