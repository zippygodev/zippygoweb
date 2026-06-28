import { getFeatureFlags } from '@/actions/superadmin/settings';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const result = await getFeatureFlags();
  const featureFlags = result.success ? result.data : [];

  return <SettingsClient featureFlags={featureFlags as any} />;
}
