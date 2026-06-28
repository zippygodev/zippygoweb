import { getTables } from '@/actions/admin/tables';
import TablesClient from './TablesClient';

export default async function TablesPage() {
  const result = await getTables();
  const tables = result.success ? result.data : [];

  return <TablesClient initialTables={tables as any} />;
}
