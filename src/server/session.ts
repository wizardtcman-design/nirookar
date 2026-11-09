import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { AdminRole } from "@shared/admin-rbac";

/**
 * مدیریت نشست — کوکی httpOnly با توکن تصادفی ۳۲ بایتی.
 * هیچ رمز یا توکنی در localStorage یا کد سمت کلاینت ذخیره نمی‌شود.
 */

export const SESSION_COOKIE = "nirookar_session";
const SESSION_TTL_DAYS = 14;

export interface SessionUser {
  id: string;
  phone: string;
  role: string;
  displayName: string;
  /** نقش مدیریتی در صورت داشتن دسترسی ادمین */
  adminRole: AdminRole | null;
  createdAt: Date;
}

export const ADMIN_ROLES: readonly string[] = [
  "super_admin",
  "ops_manager",
  "finance_manager",
  "support_specialist",
  "auditor",
];

export function isAdminRole(role: string): role is AdminRole {
  return ADMIN_ROLES.includes(role);
}

export async function createSession(userId: string, role: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await db.session.create({ data: { token, userId, role, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

/** خواندن کاربر لاگین‌شده از کوکی — در هر مسیر محافظت‌شده استفاده می‌شود */
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt.getTime() < Date.now()) {
    await db.session.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }

  return {
    id: session.user.id,
    phone: session.user.phone,
    role: session.user.role,
    displayName: session.user.displayName,
    adminRole: isAdminRole(session.user.role) ? (session.user.role as AdminRole) : null,
    createdAt: session.user.createdAt,
  };
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.deleteMany({ where: { token } }).catch(() => undefined);
  }
  cookieStore.delete(SESSION_COOKIE);
}
