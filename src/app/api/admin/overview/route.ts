import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readRecentAudit } from "@/server/audit";
import { requireAdmin } from "@/server/guards";
import { ensureSeed } from "@/server/seed";
import { ADMIN_ROLES } from "@/server/session";

/**
 * GET /api/admin/overview — آمار واقعی داشبورد از دیتابیس (بدون داده نمایشی).
 * شمارنده سفارش صفر است چون سیستم سفارش در گام بعدی فاز ۲ ساخته می‌شود.
 */
export async function GET() {
  await ensureSeed();
  const guard = await requireAdmin("dashboard.view");
  if (!guard.ok) return guard.response;

  const [totalUsers, customers, installersPending, installersActive, installersIncomplete, shopsPending, shopsActive, shopsIncomplete, recentAudit] =
    await Promise.all([
      db.user.count({ where: { role: { notIn: [...ADMIN_ROLES] } } }),
      db.user.count({ where: { role: "customer" } }),
      db.installerProfile.count({ where: { status: "PENDING_VERIFICATION" } }),
      db.installerProfile.count({ where: { status: "ACTIVE" } }),
      db.installerProfile.count({ where: { status: "INCOMPLETE" } }),
      db.shopProfile.count({ where: { status: "PENDING_VERIFICATION" } }),
      db.shopProfile.count({ where: { status: "ACTIVE" } }),
      db.shopProfile.count({ where: { status: "INCOMPLETE" } }),
      readRecentAudit(8),
    ]);

  return NextResponse.json({
    ok: true,
    stats: {
      users: totalUsers,
      customers,
      installersPending,
      installersActive,
      installersIncomplete,
      shopsPending,
      shopsActive,
      shopsIncomplete,
      orders: 0,
    },
    recentAudit,
  });
}
