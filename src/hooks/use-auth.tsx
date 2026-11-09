"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import type { AdminRole } from "@shared/admin-rbac";

import { authRepository } from "@/services";
import type { AuthUser } from "@/types/auth";

/**
 * وضعیت نشست کاربر — منبع یگانه سمت کلاینت.
 *
 * نشست واقعی با کوکی httpOnly است؛ این context فقط پروفایل سبک را نگه می‌دارد
 * تا هدر صفحه (دکمه طلایی اتاق فرمان برای مدیران) و مسیرهای ورود از آن استفاده کنند.
 */

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** نقش مدیریتی در صورت داشتن دسترسی پنل */
  adminRole: AdminRole | null;
  refresh: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ADMIN_ROLE_IDS: readonly string[] = [
  "super_admin",
  "ops_manager",
  "finance_manager",
  "support_specialist",
  "auditor",
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const current = await authRepository.me();
      setUserState(current);
    } catch {
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await authRepository.logout().catch(() => undefined);
    setUserState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      adminRole: user && ADMIN_ROLE_IDS.includes(user.role) ? (user.role as AdminRole) : null,
      refresh,
      setUser,
      logout,
    }),
    [user, loading, refresh, setUser, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth باید داخل AuthProvider استفاده شود");
  }
  return context;
}
