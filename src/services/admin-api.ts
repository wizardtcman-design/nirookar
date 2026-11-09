"use client";

import type { PlatformSettings } from "@shared/platform-settings";

import type { AuditEntryView } from "@/server/audit";

/**
 * کلاینت تایپ‌شده API مدیریت — همه درخواست‌ها با کوکی نشست ارسال می‌شوند و
 * کنترل دسترسی واقعی سمت سرور انجام می‌گیرد (گارد requireAdmin).
 */

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { credentials: "same-origin" });
  const data = (await response.json().catch(() => null)) as (T & { ok?: boolean; error?: string }) | null;
  if (!response.ok || !data || data.ok === false) {
    const message = data && typeof data.error === "string" ? data.error : "خطای ارتباط با سرور";
    throw new Error(message);
  }
  return data;
}

async function sendJson<T>(url: string, method: "POST" | "PUT", body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = (await response.json().catch(() => null)) as (T & { ok?: boolean; error?: string }) | null;
  if (!response.ok || !data || data.ok === false) {
    const message = data && typeof data.error === "string" ? data.error : "خطای ارتباط با سرور";
    throw new Error(message);
  }
  return data;
}

/* ── داشبورد ── */
export interface AdminOverview {
  stats: {
    users: number;
    customers: number;
    installersPending: number;
    installersActive: number;
    installersIncomplete: number;
    shopsPending: number;
    shopsActive: number;
    shopsIncomplete: number;
    orders: number;
  };
  recentAudit: AuditEntryView[];
}

export function fetchAdminOverview(): Promise<AdminOverview> {
  return getJson<AdminOverview>("/api/admin/overview");
}

/* ── کاربران ── */
export interface AdminUserRow {
  id: string;
  displayName: string;
  role: string;
  phone: string;
  city: string | null;
  status: string;
  createdAt: string;
}

export function fetchAdminUsers(): Promise<{ users: AdminUserRow[] }> {
  return getJson<{ users: AdminUserRow[] }>("/api/admin/users");
}

/* ── نصاب‌ها ── */
export interface AdminInstallerRow {
  id: string;
  userId: string;
  displayName: string;
  phone: string;
  fullName: string;
  nationalId: string;
  city: string;
  postalCode: string | null;
  residenceAddress: string | null;
  workHistory: string;
  specialties: string[];
  sheba: string | null;
  photoUrl: string | null;
  nationalCardUrl: string | null;
  status: string;
  contractSignedAt: string | null;
  verifiedByName: string | null;
  createdAt: string;
}

export function fetchAdminInstallers(): Promise<{ installers: AdminInstallerRow[] }> {
  return getJson<{ installers: AdminInstallerRow[] }>("/api/admin/installers");
}

export function verifyInstaller(id: string): Promise<{ status: string }> {
  return sendJson<{ status: string }>(`/api/admin/installers/${id}/verify`, "POST");
}

/* ── فروشگاه‌ها ── */
export interface AdminShopRow {
  id: string;
  userId: string;
  shopName: string;
  ownerName: string;
  nationalId: string;
  postalCode: string | null;
  address: string | null;
  contactPhone: string;
  sheba: string | null;
  logoUrl: string | null;
  nationalCardUrl: string | null;
  status: string;
  contractSignedAt: string | null;
  verifiedByName: string | null;
  createdAt: string;
}

export function fetchAdminShops(): Promise<{ shops: AdminShopRow[] }> {
  return getJson<{ shops: AdminShopRow[] }>("/api/admin/shops");
}

export function verifyShop(id: string): Promise<{ status: string }> {
  return sendJson<{ status: string }>(`/api/admin/shops/${id}/verify`, "POST");
}

/* ── تنظیمات پویا ── */
export function fetchAdminSettings(): Promise<{ settings: PlatformSettings }> {
  return getJson<{ settings: PlatformSettings }>("/api/admin/settings");
}

export function updateAdminSettings(
  settings: Partial<PlatformSettings>,
): Promise<{ settings: PlatformSettings; changedCount: number }> {
  return sendJson<{ settings: PlatformSettings; changedCount: number }>("/api/admin/settings", "PUT", settings);
}

/* ── Audit Log ── */
export function fetchAdminAudit(limit = 50): Promise<{ entries: AuditEntryView[] }> {
  return getJson<{ entries: AuditEntryView[] }>(`/api/admin/audit?limit=${limit}`);
}
