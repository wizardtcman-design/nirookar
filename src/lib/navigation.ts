"use client";

import { useSyncExternalStore } from "react";

/**
 * ناوبری داخلی اپلیکیشن بر پایه hash.
 *
 * طبق معماری این مرحله، کل اپلیکیشن روی مسیر «/» اجرا می‌شود و ناوبری بین
 * نماها با hash انجام می‌شود تا دکمه بازگشت مرورگر و اشتراک‌گذاری لینک نیز
 * درست کار کند؛ در فازهای بعد در صورت نیاز به مسیرهای واقعی، همین قرارداد
 * ViewId به‌سادگی به روتر Next.js نگاشت می‌شود.
 */

export type ViewId =
  | "home"
  | "guide"
  | "about"
  | "status"
  | "login-customer"
  | "login-installer"
  | "login-shop"
  | "panel-customer"
  | "panel-installer"
  | "panel-shop"
  | "admin";

const VIEW_ROUTES: Record<ViewId, string> = {
  home: "#/",
  guide: "#/guide",
  about: "#/about",
  status: "#/status",
  "login-customer": "#/login/customer",
  "login-installer": "#/login/installer",
  "login-shop": "#/login/shop",
  "panel-customer": "#/panel/customer",
  "panel-installer": "#/panel/installer",
  "panel-shop": "#/panel/shop",
  admin: "#/admin",
};

const ROUTE_TO_VIEW = new Map<string, ViewId>(
  Object.entries(VIEW_ROUTES).map(([view, route]) => [route, view as ViewId]),
);

function parseHash(hash: string): ViewId {
  const route = hash === "" || hash === "#" ? "#/" : hash;
  // تمام زیرمسیرهای پنل مدیریت (#/admin/users، #/admin/orders و ...) یک نما هستند
  if (route.startsWith("#/admin")) return "admin";
  return ROUTE_TO_VIEW.get(route) ?? "home";
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getClientSnapshot(): ViewId {
  return parseHash(window.location.hash);
}

function getServerSnapshot(): ViewId {
  return "home";
}

/** هوک ناوبری — نمای فعلی را بر اساس hash آدرس برمی‌گرداند */
export function useAppView(): ViewId {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
}

/** جابه‌جایی بین نماها؛ از تاریخچه مرورگر استفاده می‌کند تا بازگشت کار کند */
export function navigateToView(view: ViewId): void {
  if (typeof window === "undefined") return;
  const target = VIEW_ROUTES[view];
  if (window.location.hash === target) return;
  window.location.hash = target;
}

/** مسیر خام hash (بدون #) — برای زیرمسیرهای پنل مدیریت مانند /admin/users */
export function getHashPath(): string {
  if (typeof window === "undefined") return "/";
  const hash = window.location.hash;
  return hash === "" || hash === "#" ? "/" : hash.slice(1);
}

/** هوک مسیر خام — در پنل مدیریت برای تعیین بخش فعال استفاده می‌شود */
export function useHashPath(): string {
  return useSyncExternalStore(subscribe, getHashPath, () => "/");
}

/** جابه‌جایی به یک بخش پنل مدیریت */
export function navigateToAdminSection(section: string): void {
  if (typeof window === "undefined") return;
  window.location.hash = `#/admin/${section}`;
}

/** نماهایی که نوار ناوبری پایین دارند */
export function isTabView(view: ViewId): boolean {
  return view === "home" || view === "guide" || view === "about";
}
