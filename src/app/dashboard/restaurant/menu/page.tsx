import { getCategories, getProducts } from '@/actions/restaurant/menu';
import MenuClient from './MenuClient';

export default async function MenuPage() {
  const [categoriesRes, productsRes] = await Promise.all([
    getCategories(),
    getProducts()
  ]);

  const categories = categoriesRes.success ? categoriesRes.data : [];
  const products = productsRes.success ? productsRes.data : [];

  return <MenuClient initialCategories={categories as any} initialProducts={products as any} />;
}
