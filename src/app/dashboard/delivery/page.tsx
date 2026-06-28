import { getAvailableOrders, getMyActiveOrders } from '@/actions/delivery/orders';
import DeliveryClient from './DeliveryClient';

export default async function DeliveryPage() {
  const availableOrdersRes = await getAvailableOrders();
  const activeOrdersRes = await getMyActiveOrders();
  
  const initialAvailableOrders = availableOrdersRes.success ? availableOrdersRes.data : [];
  const initialActiveOrders = activeOrdersRes.success ? activeOrdersRes.data : [];

  return (
    <DeliveryClient 
      initialAvailableOrders={initialAvailableOrders as any} 
      initialActiveOrders={initialActiveOrders as any} 
    />
  );
}
