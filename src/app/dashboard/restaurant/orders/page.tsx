import { getLiveOrders } from '@/actions/restaurant/orders';
import OrdersClient from './OrdersClient';

export default async function LiveOrdersPage() {
  const result = await getLiveOrders();
  const initialOrders = result.success ? result.data : [];

  return <OrdersClient initialOrders={initialOrders as any} />;
}
