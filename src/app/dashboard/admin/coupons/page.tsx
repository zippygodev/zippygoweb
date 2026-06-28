import { getCoupons } from '@/actions/admin/coupons';
import CouponsClient from './CouponsClient';

export default async function CouponsPage() {
  const result = await getCoupons();
  const coupons = result.success ? result.data : [];

  return <CouponsClient initialCoupons={coupons as any} />;
}
