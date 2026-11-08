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
  | "login-customer"
  | "login-installer"
  | "login-shop";

const VIEW_ROUTES: Record<ViewId, string> = {
  home: "#/",
  guide: "#/guide",
  about: "#/about",
  "login-customer": "#/login/customer",
  "login-installer": "#/login/installer",
  "login-shop": "#/login/shop",
};

const ROUTE_TO_VIEW = new Map<string, ViewId>(
  Object.entries(VIEW_ROUTES).map(([view, route]) => [route, view as ViewId]),
);

function parseHash(hash: string): ViewId {
  const route = hash === "" || hash === "#" ? "#/" : hash;
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

/** نماهایی که نوار ناوبری پایین دارند */
export function isTabView(view: ViewId): boolean {
  return view === "home" || view === "guide" || view === "about";
}
