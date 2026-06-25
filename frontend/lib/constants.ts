export const APP_NAME = "FoodCourtOS";
export const APP_DESCRIPTION = "Enterprise AI Smart Food Court Operating System";

export const ROLES = {
  CUSTOMER: "customer",
  RESTAURANT_OWNER: "restaurant_owner",
  RESTAURANT_MANAGER: "restaurant_manager",
  KITCHEN_STAFF: "kitchen_staff",
  MALL_ADMIN: "mall_admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const DASHBOARD_ROUTES: Record<Role, string> = {
  [ROLES.CUSTOMER]: "/home",
  [ROLES.RESTAURANT_OWNER]: "/restaurant/dashboard",
  [ROLES.RESTAURANT_MANAGER]: "/restaurant/dashboard",
  [ROLES.KITCHEN_STAFF]: "/restaurant/orders",
  [ROLES.MALL_ADMIN]: "/mall-admin/dashboard",
  [ROLES.SUPER_ADMIN]: "/super-admin/dashboard",
};

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;
