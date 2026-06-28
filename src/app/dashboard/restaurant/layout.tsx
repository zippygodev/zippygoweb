import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import RestaurantClientLayout from './RestaurantClientLayout';

export default async function RestaurantDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || (session.user?.role !== 'RESTAURANT_OWNER' && session.user?.role !== 'SUPER_ADMIN')) {
    redirect('/auth/login');
  }

  // Get the restaurant information to display in the header
  let restaurantName = 'Unknown Restaurant';
  if (session.user.role === 'RESTAURANT_OWNER') {
    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: session.user.id },
    });
    if (restaurant) {
      restaurantName = restaurant.name;
    }
  } else {
    restaurantName = 'Super Admin Mode';
  }

  return (
    <RestaurantClientLayout restaurantName={restaurantName} userName={session.user.name || 'User'}>
      {children}
    </RestaurantClientLayout>
  );
}
