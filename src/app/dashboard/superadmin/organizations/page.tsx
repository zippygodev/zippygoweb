import { getOrganizations } from '@/actions/superadmin/organizations';
import OrganizationsClient from './OrganizationsClient';

export default async function OrganizationsPage() {
  const result = await getOrganizations();
  const organizations = result.success ? result.data : [];

  return <OrganizationsClient initialOrganizations={organizations as any} />;
}
