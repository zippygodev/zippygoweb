import { getDeliveryPartners } from '@/actions/admin/delivery';
import DeliveryClient from './DeliveryClient';

export default async function DeliveryPartnersPage() {
  const result = await getDeliveryPartners();
  const partners = result.success ? result.data : [];

  return <DeliveryClient initialPartners={partners as any} />;
}
