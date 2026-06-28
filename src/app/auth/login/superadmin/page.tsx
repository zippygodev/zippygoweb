import { LoginForm } from '@/components/auth/LoginForm';

export default function SuperAdminLoginPage() {
  return (
    <LoginForm
      title="Super Admin Login"
      description="Sign in to the central dashboard"
      expectedRole="SUPER_ADMIN"
    />
  );
}
