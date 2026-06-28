import { getMalls } from '@/actions/superadmin/malls';
import { getOrganizations } from '@/actions/superadmin/organizations';
import MallsClient from './MallsClient';

export default async function MallsPage() {
  const [mallsResult, orgsResult] = await Promise.all([
    getMalls(),
    getOrganizations(),
  ]);

  const malls = mallsResult.success ? mallsResult.data : [];
  const organizations = orgsResult.success ? orgsResult.data : [];

  return <MallsClient initialMalls={malls as any} organizations={organizations as any} />;
}
