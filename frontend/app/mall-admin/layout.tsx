import { DashboardLayout } from "@/components/shared/dashboard-layout";

export default function MallAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="mall-admin">{children}</DashboardLayout>;
}
