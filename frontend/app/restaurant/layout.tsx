import { DashboardLayout } from "@/components/shared/dashboard-layout";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="restaurant">{children}</DashboardLayout>;
}
