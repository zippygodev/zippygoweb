import { getRestaurantSettings } from '@/actions/restaurant/settings';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const result = await getRestaurantSettings();
  const initialSettings = result.success ? result.data : {};

  return <SettingsClient initialSettings={initialSettings} />;
}
