import { getUsers } from '@/actions/superadmin/users';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const result = await getUsers();
  const users = result.success ? result.data : [];

  return <UsersClient initialUsers={users as any} />;
}
