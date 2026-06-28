import { LoginForm } from '@/components/auth/LoginForm';

export default function CustomerLoginPage() {
  return (
    <LoginForm
      title="Welcome back, Customer"
      description="Sign in to order your favourite food"
      expectedRole="CUSTOMER"
    />
  );
}
