import { LoginForm } from '@/components/auth/LoginForm';

export default function MallAdminLoginPage() {
  return (
    <LoginForm
      title="Mall Admin Login"
      description="Sign in to manage your mall operations"
      expectedRole="MALL_ADMIN"
    />
  );
}
