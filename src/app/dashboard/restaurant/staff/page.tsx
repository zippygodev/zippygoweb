import { getStaff } from '@/actions/restaurant/staff';
import StaffClient from './StaffClient';

export default async function StaffPage() {
  const result = await getStaff();
  const initialStaff = result.success ? result.data : [];

  return <StaffClient initialStaff={initialStaff as any} />;
}
