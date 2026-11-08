import { HardHat, Store, UserRound, type LucideIcon } from "lucide-react";

import { ROLE_CORE_REGISTRY, type RoleCoreData } from "@shared/roles-core";

import type { IdentifierType, UserRole } from "@/types/auth";

/**
 * رجیستری نقش‌های وب — داده نقش‌ها از هسته مشترک (packages/shared) می‌آید و
 * تنها لایه «ظاهر» اختصاصی وب (آیکون و تم رنگی) اینجا اضافه می‌شود.
 *
 * توسعه‌پذیری از روز اول: برای افزودن نقش جدید (مانند راننده وانت‌بار، شرکت
 * حمل‌ونقل یا متخصص تعمیرات) فقط یک entry به رجیستری هسته مشترک اضافه می‌شود؛
 * صفحه خانه و فرم‌های ورود به‌صورت خودکار از همین ساختار استفاده می‌کنند.
 */

export type RoleThemeKey = "teal" | "navy" | "coral";

export interface RoleDefinition extends RoleCoreData {
  icon: LucideIcon;
  theme: RoleThemeKey;
}

const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  customer: UserRound,
  installer: HardHat,
  shop: Store,
};

const ROLE_THEMES: Record<UserRole, RoleThemeKey> = {
  customer: "teal",
  installer: "navy",
  shop: "coral",
};

/** رجیستری نقش‌ها با ظاهر اختصاصی وب — ترتیب و داده از هسته مشترک حفظ می‌شود */
export const ROLE_REGISTRY: readonly RoleDefinition[] = ROLE_CORE_REGISTRY.map((core) => ({
  ...core,
  icon: ROLE_ICONS[core.id],
  theme: ROLE_THEMES[core.id],
}));

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
