import { DashboardLayout } from "@/components/shared/dashboard-layout";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="super-admin">{children}</DashboardLayout>;
}
