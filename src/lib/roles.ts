import { HardHat, Store, UserRound, type LucideIcon } from "lucide-react";

import type { IdentifierType, UserRole } from "@/types/auth";

/**
 * رجیستری نقش‌ها — تنها منبع حقیقت برای نقش‌های اپلیکیشن.
 *
 * توسعه‌پذیری از روز اول: برای افزودن نقش جدید (مانند راننده وانت‌بار، شرکت
 * حمل‌ونقل یا متخصص تعمیرات) فقط یک entry به این رجیستری اضافه می‌شود؛
 * صفحه خانه و فرم‌های ورود به‌صورت خودکار از همین ساختار استفاده می‌کنند.
 */

export type RoleThemeKey = "teal" | "navy" | "coral";

export interface RoleDefinition {
  id: UserRole;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  theme: RoleThemeKey;
  identifierLabel: string;
  identifierPlaceholder: string;
  identifierType: IdentifierType;
  submitLabel: string;
  /** نقش‌های آینده می‌توانند با enabled: false بدون حذف از رجیستری مدیریت شوند */
  enabled: boolean;
}

export const ROLE_REGISTRY: readonly RoleDefinition[] = [
  {
    id: "customer",
    title: "ورود مشتری",
    subtitle: "دسترسی به خدمات و سفارش‌ها",
    icon: UserRound,
    theme: "teal",
    identifierLabel: "ایمیل یا شماره موبایل",
    identifierPlaceholder: "example@email.com | 09xxxxxxxxx",
    identifierType: "email-or-phone",
    submitLabel: "ورود به حساب مشتری",
    enabled: true,
  },
  {
    id: "installer",
    title: "ورود نصاب",
    subtitle: "برای متخصصان و نصابان",
    icon: HardHat,
    theme: "navy",
    identifierLabel: "شماره موبایل",
    identifierPlaceholder: "09xxxxxxxxx",
    identifierType: "phone",
    submitLabel: "ورود به پنل نصاب",
    enabled: true,
  },
  {
    id: "shop",
    title: "ورود فروشگاه",
    subtitle: "مدیریت فروشگاه و محصولات",
    icon: Store,
    theme: "coral",
    identifierLabel: "شماره موبایل",
    identifierPlaceholder: "09xxxxxxxxx",
    identifierType: "phone",
    submitLabel: "ورود به پنل فروشگاه",
    enabled: true,
  },
] as const;

export function getRole(id: UserRole): RoleDefinition {
  const role = ROLE_REGISTRY.find((entry) => entry.id === id);
  if (!role) {
    throw new Error(`نقش ناشناخته: ${id}`);
  }
  return role;
}

/** کلاس‌های Tailwind هر تم نقش — کنترل متمرکز رنگ‌ها بدون پراکندگی در کد */
export interface RoleThemeStyle {
  cardTitle: string;
  iconWrap: string;
  accentBar: string;
  divider: string;
  focusRing: string;
}

export const ROLE_THEME_STYLES: Record<RoleThemeKey, RoleThemeStyle> = {
  teal: {
    cardTitle: "text-brand-teal",
    iconWrap: "bg-brand-teal-light text-brand-teal",
    accentBar: "bg-brand-teal",
    divider: "bg-brand-teal/40",
    focusRing: "hover:ring-brand-teal/30 focus-visible:ring-brand-teal/40",
  },
  navy: {
    cardTitle: "text-brand-navy",
    iconWrap: "bg-brand-slate-light text-brand-navy",
    accentBar: "bg-brand-navy",
    divider: "bg-brand-navy/30",
    focusRing: "hover:ring-brand-navy/25 focus-visible:ring-brand-navy/35",
  },
  coral: {
    cardTitle: "text-brand-coral",
    iconWrap: "bg-brand-coral-light text-brand-coral",
    accentBar: "bg-brand-coral",
    divider: "bg-brand-coral/40",
    focusRing: "hover:ring-brand-coral/30 focus-visible:ring-brand-coral/40",
  },
};
