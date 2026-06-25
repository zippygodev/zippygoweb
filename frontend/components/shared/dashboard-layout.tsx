"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { cn, getInitials } from "@/lib/utils";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
  ChevronLeft,
  Store,
  TicketPercent,
  Star,
  MessageSquare,
  ChevronDown,
  Table2,
  QrCode,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "restaurant" | "mall-admin" | "super-admin";
}

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface SidebarRoleConfig {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  links: SidebarLink[];
}

const sidebarConfig: Record<"restaurant" | "mall-admin" | "super-admin", SidebarRoleConfig> = {
  restaurant: {
    title: "Restaurant Dashboard",
    icon: Store,
    links: [
      { href: "/restaurant/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/restaurant/orders", label: "Live Orders", icon: ShoppingBag, badge: "Live" },
      { href: "/restaurant/menu", label: "Menu", icon: ClipboardList },
      { href: "/restaurant/tables", label: "Tables & QR", icon: Table2 },
      { href: "/restaurant/inventory", label: "Inventory", icon: Package },
      { href: "/restaurant/staff", label: "Staff", icon: Users },
      { href: "/restaurant/reports", label: "Reports", icon: BarChart3 },
      { href: "/restaurant/promotions", label: "Promotions", icon: TicketPercent },
      { href: "/restaurant/reviews", label: "Reviews", icon: Star },
      { href: "/restaurant/settings", label: "Settings", icon: Settings },
    ],
  },
  "mall-admin": {
    title: "Mall Admin",
    icon: Store,
    links: [
      { href: "/mall-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/mall-admin/restaurants", label: "Restaurants", icon: Store },
      { href: "/mall-admin/users", label: "Users", icon: Users },
      { href: "/mall-admin/revenue", label: "Revenue", icon: BarChart3 },
      { href: "/mall-admin/reports", label: "Reports", icon: ClipboardList },
      { href: "/mall-admin/settings", label: "Settings", icon: Settings },
    ],
  },
  "super-admin": {
    title: "Super Admin",
    icon: LayoutDashboard,
    links: [
      { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/super-admin/organizations", label: "Organizations", icon: Store },
      { href: "/super-admin/subscriptions", label: "Subscriptions", icon: ShoppingBag },
      { href: "/super-admin/security", label: "Security", icon: Users },
      { href: "/super-admin/monitoring", label: "Monitoring", icon: BarChart3 },
      { href: "/super-admin/settings", label: "Settings", icon: Settings },
    ],
  },
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const config = sidebarConfig[role];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full flex-col border-r bg-sidebar transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href={`/${role}/dashboard`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600">
              <config.icon className="h-4 w-4 text-white" />
            </div>
            {sidebarOpen && (
              <span className="text-sm font-bold">{config.title}</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-all", !sidebarOpen && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {config.links.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start",
                    pathname === link.href && "bg-sidebar-accent font-medium",
                    !sidebarOpen && "justify-center px-2",
                  )}
                >
                  <link.icon className={cn("h-4 w-4 shrink-0", sidebarOpen && "mr-3")} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{link.label}</span>
                      {link.badge && (
                        <Badge variant="default" className="h-5 px-1.5 text-[10px]">
                          {link.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        {/* User Menu */}
        <div className="border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-sidebar-accent",
                  !sidebarOpen && "justify-center",
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-xs">
                    {user ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="mt-0.5 text-xs text-sidebar-muted">{user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-sidebar-muted" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/home">
                <DropdownMenuItem>Switch to Customer View</DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("flex flex-1 flex-col transition-all", sidebarOpen ? "lg:ml-64" : "lg:ml-16")}>
        {/* Top Bar */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8 dark:bg-black">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold">
              {config.links.find((l) => l.href === pathname)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 hover:bg-muted">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500" />
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 hover:bg-muted"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50/50 p-4 lg:p-8 dark:bg-black/50">
          {children}
        </main>
      </div>
    </div>
  );
}
