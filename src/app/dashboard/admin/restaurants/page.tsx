import { getMallRestaurants } from '@/actions/admin/restaurants';
import RestaurantsClient from './RestaurantsClient';

export default async function RestaurantsPage() {
  const result = await getMallRestaurants();
  const restaurants = result.success ? result.data : [];

  return <RestaurantsClient initialRestaurants={restaurants as any} />;
}
