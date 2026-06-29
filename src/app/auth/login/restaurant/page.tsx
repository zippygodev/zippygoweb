import { LoginForm } from '@/components/auth/LoginForm';

export default function RestaurantLoginPage() {
  return (
    <LoginForm
      title="Restaurant Login"
      description="Sign in to manage your restaurant"
      expectedRole="RESTAURANT_OWNER"
      showGoogle={false}
      registerLink=""
    />
  );
}
