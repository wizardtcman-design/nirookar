import { NextResponse } from "next/server";
import { ADMIN_ROLES } from "@/server/session";

import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/guards";
import { ensureSeed } from "@/server/seed";

/**
 * GET /api/admin/users — لیست واقعی کاربران ثبت‌نام‌شده (بدون مدیران).
 * جایگزین داده‌های نمایشی فاز ۱ — حالا هر ثبت‌نام بلافاصله اینجا دیده می‌شود.
 */

export interface AdminUserRow {
  id: string;
  displayName: string;
  role: string;
  phone: string;
  city: string | null;
  status: string;
  createdAt: string;
}

export async function GET() {
  await ensureSeed();
  const guard = await requireAdmin("users.view");
  if (!guard.ok) return guard.response;

  const where: Prisma.UserWhereInput = { role: { notIn: [...ADMIN_ROLES] } };
  const users = await db.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      customerProfile: { select: { city: true } },
      installerProfile: { select: { city: true, status: true } },
      shopProfile: { select: { shopName: true, status: true } },
    },
  });

  const rows: AdminUserRow[] = users.map((user) => ({
    id: user.id,
    displayName: user.displayName,
    role: user.role,
    phone: user.phone,
    city: user.customerProfile?.city ?? user.installerProfile?.city ?? null,
    status:
      user.role === "installer"
        ? (user.installerProfile?.status ?? "PENDING_VERIFICATION")
        : user.role === "shop"
          ? (user.shopProfile?.status ?? "PENDING_VERIFICATION")
          : "ACTIVE",
    createdAt: user.createdAt.toISOString(),
  }));

  return NextResponse.json({ ok: true, users: rows });
}
