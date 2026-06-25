"use client";

import { create } from "zustand";
import { api } from "@/lib/api";
import type { Role } from "@/lib/constants";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: Role;
  restaurantId?: string;
  organizationId?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithPhone: (phone: string, otp: string) => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", data.accessToken);
    set({ user: data.user, isAuthenticated: true });
  },

  loginWithGoogle: async () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  },

  loginWithPhone: async (phone, otp) => {
    const { data } = await api.post("/auth/phone-login", { phone, otp });
    localStorage.setItem("accessToken", data.accessToken);
    set({ user: data.user, isAuthenticated: true });
  },

  sendOTP: async (phone) => {
    await api.post("/auth/send-otp", { phone });
  },

  register: async (registerData) => {
    const { data } = await api.post("/auth/register", registerData);
    localStorage.setItem("accessToken", data.accessToken);
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("accessToken");
    set({ user: null, isAuthenticated: false });
    window.location.href = "/login";
  },

  checkAuth: async () => {
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));
