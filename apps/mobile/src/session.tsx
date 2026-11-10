import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { AdminRole } from "@shared/admin-rbac";

/**
 * نشست و حساب‌های آزمایشی (Sandbox) اپ موبایل — بیلد 006 همگام با گام ۳ وب.
 *
 * اپ موبایل در این فاز سرور مستقل ندارد؛ ورود/ثبت‌نام به‌صورت کامل سمت کلاینت
 * شبیه‌سازی می‌شود تا تجربه واقعی (انتخاب نقش، اعتبارسنجی، پنل اختصاصی) روی
 * APK قابل تست باشد. شماره‌ها و رمز پیش‌فرض «123456» دقیقاً با seed وب یکی است.
 *
 * ⚠️ اصل شفافیت: هیچ موفقیتی جعلی نمایش داده نمی‌شود؛ هرجا اتصال سرور لازم
 * است، برچسب «نمایشی» صادقانه درج شده است.
 */

/** نقش‌های دارای پنل — سه نقش اصلی + نقش‌های مدیریتی */
export type AppRole = "customer" | "installer" | "shop" | AdminRole;

export const MAIN_ROLES: readonly ("customer" | "installer" | "shop")[] = ["customer", "installer", "shop"];

/** نقش مدیریتی است؟ (فقط نمایش پنل مدیریت نمایشی) */
export function isAdminRole(role: AppRole): role is AdminRole {
  return ["super_admin", "ops_manager", "finance_manager", "support_specialist", "auditor"].includes(role);
}

export const MAIN_ROLE_LABELS: Record<"customer" | "installer" | "shop", string> = {
  customer: "مشتری",
  installer: "نصاب",
  shop: "فروشگاه",
};

export interface SessionUser {
  phone: string;
  role: AppRole;
  displayName: string;
  nationalId?: string;
  /** رمز — فقط برای حساب‌های ثبت‌نام‌شده در نشست نگه‌داری می‌شود */
  password?: string;
  /** فیلدهای اختصاصی نقش */
  specialtyKeys?: string[];
  experience?: string;
  shopName?: string;
}

export interface SandboxAccount {
  phone: string;
  password: string;
  role: AppRole;
  displayName: string;
  nationalId: string;
  /** شرح کوتاه برای دکمه ورود سریع */
  hint: string;
}

/**
 * رجیستری حساب‌های آماده تست — هماهنگ با seed وب (src/server/seed.ts).
 * همه با رمز پیش‌فرض 123456 (دستور مالک — نسخه 0.1.3).
 */
export const SANDBOX_PASSWORD = "123456";

export const SANDBOX_ACCOUNTS: readonly SandboxAccount[] = [
  {
    phone: "09120000010",
    password: SANDBOX_PASSWORD,
    role: "customer",
    displayName: "سارا محمدی",
    nationalId: "0012345679",
    hint: "مشتری — دریافت خدمات",
  },
  {
    phone: "09120000020",
    password: SANDBOX_PASSWORD,
    role: "installer",
    displayName: "رضا کریمی",
    nationalId: "3456789122",
    hint: "نصاب — کابینت و کمد دیواری",
  },
  {
    phone: "09120000030",
    password: SANDBOX_PASSWORD,
    role: "shop",
    displayName: "فروشگاه آریا دکور",
    nationalId: "4567891236",
    hint: "فروشگاه — مدیریت غرفه",
  },
  {
    phone: "09120000001",
    password: SANDBOX_PASSWORD,
    role: "super_admin",
    displayName: "مدیر کل",
    nationalId: "5678912348",
    hint: "مدیر کل — دسترسی کامل",
  },
  {
    phone: "09120000002",
    password: SANDBOX_PASSWORD,
    role: "ops_manager",
    displayName: "مدیر عملیات",
    nationalId: "6789123458",
    hint: "مدیر عملیات — کاربران و سفارش‌ها",
  },
  {
    phone: "09120000003",
    password: SANDBOX_PASSWORD,
    role: "finance_manager",
    displayName: "مدیر مالی",
    nationalId: "7891234566",
    hint: "مدیر مالی — درآمد و تسویه",
  },
  {
    phone: "09120000004",
    password: SANDBOX_PASSWORD,
    role: "support_specialist",
    displayName: "کارشناس پشتیبانی",
    nationalId: "8912345672",
    hint: "پشتیبانی — پیگیری شکایات",
  },
  {
    phone: "09120000005",
    password: SANDBOX_PASSWORD,
    role: "auditor",
    displayName: "بازرس / حسابرس",
    nationalId: "9123456787",
    hint: "بازرس — دسترسی فقط-خواندن",
  },
] as const;

/** عنوان فارسی نقش‌های مدیریتی (هماهنگ با admin-rbac) */
const ADMIN_ROLE_TITLES: Record<AdminRole, string> = {
  super_admin: "مدیر کل",
  ops_manager: "مدیر عملیات",
  finance_manager: "مدیر مالی",
  support_specialist: "کارشناس پشتیبانی",
  auditor: "بازرس / حسابرس",
};

export function getRoleTitle(role: AppRole): string {
  if (isAdminRole(role)) return ADMIN_ROLE_TITLES[role];
  return MAIN_ROLE_LABELS[role];
}

export interface RegisteredUser extends SessionUser {
  /** برچسب منبع حساب — نمایشی / Sandbox */
  source: "sandbox" | "registered";
}

interface SessionContextValue {
  user: RegisteredUser | null;
  /** حساب‌های ثبت‌نام‌شده در طول نشست — برای ورود مجدد و قانون یکتایی */
  registeredUsers: RegisteredUser[];
  /** کدملی‌های ثبت‌شده به‌ازای هر نقش — برای قانون یکتایی ثبت‌نام */
  usedNationalIds: Record<string, string[]>;
  login: (user: SessionUser, source?: "sandbox" | "registered") => void;
  register: (user: SessionUser) => void;
  isNationalIdTaken: (role: AppRole, nationalId: string) => boolean;
  logout: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RegisteredUser | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [usedNationalIds, setUsedNationalIds] = useState<Record<string, string[]>>(() => ({
    // کدملی حساب‌های Sandbox از ابتدا اشغال است تا قانون یکتایی واقعی تست شود
    customer: ["0012345679"],
    installer: ["3456789122"],
    shop: ["4567891236"],
  }));

  const login = useCallback((next: SessionUser, source: "sandbox" | "registered" = "sandbox") => {
    setUser({ ...next, source });
  }, []);

  const register = useCallback((next: SessionUser) => {
    const created: RegisteredUser = { ...next, source: "registered" };
    setUser(created);
    setRegisteredUsers((prev) => [...prev, created]);
    const listKey = next.role;
    setUsedNationalIds((prev) => ({
      ...prev,
      [listKey]: [...(prev[listKey] ?? []), next.nationalId ?? ""],
    }));
  }, []);

  const isNationalIdTaken = useCallback(
    (role: AppRole, nationalId: string) => {
      const list = usedNationalIds[role] ?? [];
      return list.includes(nationalId);
    },
    [usedNationalIds],
  );

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo<SessionContextValue>(
    () => ({ user, registeredUsers, usedNationalIds, login, register, isNationalIdTaken, logout }),
    [user, registeredUsers, usedNationalIds, login, register, isNationalIdTaken, logout],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession باید داخل SessionProvider استفاده شود");
  }
  return context;
}

/** یافتن حساب Sandbox با شماره موبایل */
export function findSandboxAccount(phone: string): SandboxAccount | undefined {
  const normalized = phone.replace(/\D/g, "");
  return SANDBOX_ACCOUNTS.find((account) => account.phone === normalized);
}
