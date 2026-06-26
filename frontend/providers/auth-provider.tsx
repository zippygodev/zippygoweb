"use client";

import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { DASHBOARD_ROUTES } from "@/lib/constants";

const PUBLIC_ROUTES = ["/login", "/register", "/verify-otp"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user, checkAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      if (token) {
        localStorage.setItem("accessToken", token);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }
    }
    checkAuth();
  }, [checkAuth]);

  React.useEffect(() => {
    if (isLoading) return;

    const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
    const isHome = pathname === "/";

    if (isAuthenticated && (isPublic || isHome)) {
      const route = user ? DASHBOARD_ROUTES[user.role] : "/home";
      router.push(route);
    } else if (!isAuthenticated && !isPublic && pathname !== "/") {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
