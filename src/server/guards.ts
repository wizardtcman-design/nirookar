import { NextResponse } from "next/server";
import { roleHasPermission, type AdminPermission, type AdminRole } from "@shared/admin-rbac";
import { getSessionUser, isAdminRole, type SessionUser } from "@/server/session";

/**
 * گارد دسترسی سمت سرور — پیاده‌سازی واقعی RBAC.
 *
 * این همان کنترل امنیتی واقعی است: مخفی‌کردن منو در رابط کاربری فقط نمایش
 * معماری است و هر مسیر /api/admin/* پیش از هر عملیاتی، نقش کاربر لاگین‌شده
 * را با ماتریس مجوزهای هسته مشترک (packages/shared/admin-rbac) سنجیده و در
 * صورت نداشتن مجوز، پاسخ 401/403 برمی‌گرداند.
 */

export type AdminGuardResult =
  | { ok: true; user: SessionUser; adminRole: AdminRole }
  | { ok: false; response: NextResponse };

export async function requireAdmin(
  permission?: AdminPermission,
): Promise<AdminGuardResult> {
  const user = await getSessionUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "برای این عملیات باید با حساب مدیریتی وارد شوید." },
        { status: 401 },
      ),
    };
  }

  if (!isAdminRole(user.role)) {
    return {
      ok: false,
      response: NextResponse.json(
        { ok: false, error: "دسترسی مدیریتی فقط با نقش‌های مجاز پنل امکان‌پذیر است." },
        { status: 403 },
      ),
    };
  }

  const adminRole = user.role as AdminRole;

  if (permission && !roleHasPermission(adminRole, permission)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          ok: false,
          error: `نقش «${user.displayName}» مجوز «${permission}» را ندارد.`,
        },
        { status: 403 },
      ),
    };
  }

  return { ok: true, user, adminRole };
}
