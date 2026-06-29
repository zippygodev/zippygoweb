import { LoginForm } from '@/components/auth/LoginForm';

export default function DeliveryLoginPage() {
  return (
    <LoginForm
      title="Delivery Partner Login"
      description="Sign in to start delivering"
      expectedRole="DELIVERY_PARTNER"
      showGoogle={false}
      registerLink=""
    />
  );
}
