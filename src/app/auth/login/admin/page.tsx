import { LoginForm } from '@/components/auth/LoginForm';

export default function AdminLoginPage() {
  return (
    <LoginForm
      title="Admin Login"
      description="Sign in to the admin dashboard"
      expectedRole="MALL_ADMIN"
    />
  );
}
