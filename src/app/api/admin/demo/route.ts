import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeAudit } from "@/server/audit";
import { requireAdmin } from "@/server/guards";
import { ADMIN_SEED_ACCOUNTS, ensureSeed, isDemoModeEnabled } from "@/server/seed";
import { createSession } from "@/server/session";
import type { AdminRole } from "@shared/admin-rbac";

/**
 * ابزار نمایشی (Demo) — طبق دستور مالک حفظ شده است.
 *
 * GET  /api/admin/demo : فهرست حساب‌های مدیریتی Sandbox برای سوییچر سریع
 * POST /api/admin/demo : ورود سریع نمایشی (اتوماتیک OTP Sandbox) برای تست راحت مالک
 *
 * ⚠️ این مسیرها فقط در حالت نمایشی (NIROOKAR_DEMO_MODE != "false") فعال‌اند و
 * برچسب «نمایشی» دارند؛ در استقرار عملیاتی باید غیرفعال شوند.
 */

export async function GET() {
  if (!isDemoModeEnabled()) {
    return NextResponse.json({ ok: false, error: "حالت نمایشی غیرفعال است." }, { status: 404 });
  }
  await ensureSeed();
  return NextResponse.json({ ok: true, demoMode: true, accounts: ADMIN_SEED_ACCOUNTS });
}

export async function POST(request: Request) {
  if (!isDemoModeEnabled()) {
    return NextResponse.json({ ok: false, error: "حالت نمایشی غیرفعال است." }, { status: 404 });
  }
  await ensureSeed();

  let body: { role?: string };
  try {
    body = (await request.json()) as { role?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const account = ADMIN_SEED_ACCOUNTS.find((entry) => entry.role === body.role);
  if (!account) {
    return NextResponse.json({ ok: false, error: "نقش نمایشی نامعتبر است." }, { status: 400 });
  }

  // یکتایی به‌ازای هر نقش (0.1.3): جستجو با ترکیب (phone, role)
  const user = await db.user.findFirst({ where: { phone: account.phone, role: account.role } });
  if (!user) {
    return NextResponse.json({ ok: false, error: "حساب نمایشی یافت نشد." }, { status: 404 });
  }

  await createSession(user.id, user.role);
  await writeAudit({
    actorId: user.id,
    actorName: user.displayName,
    actorRole: user.role,
    action: "DEMO_ADMIN_LOGIN",
    entityType: "User",
    entityId: user.id,
    details: { method: "DEMO_QUICK_SWITCH" },
  });

  return NextResponse.json({
    ok: true,
    demo: true,
    user: { id: user.id, role: user.role, displayName: user.displayName, profileStatus: "ACTIVE" },
  });
}
