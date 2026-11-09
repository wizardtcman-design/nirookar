import { NextResponse } from "next/server";
import { sanitizePlatformSettings, type PlatformSettings } from "@shared/platform-settings";
import { db } from "@/lib/db";
import { writeAudit } from "@/server/audit";
import { requireAdmin } from "@/server/guards";
import { ensureSeed } from "@/server/seed";

/**
 * تنظیمات پویا — قانون «صفر درصد هاردکد».
 * GET: خواندن تنظیمات فعلی (مجوز settings.view)
 * PUT: ذخیره تنظیمات جدید با پاک‌سازی کامل + ثبت تغییرات در Audit Log (مجوز settings.manage)
 */

async function readSettings(): Promise<PlatformSettings> {
  const row = await db.platformSettings.findUnique({ where: { id: "singleton" } });
  if (!row) {
    const { DEFAULT_PLATFORM_SETTINGS } = await import("@shared/platform-settings");
    return DEFAULT_PLATFORM_SETTINGS;
  }
  return sanitizePlatformSettings(JSON.parse(row.dataJson) as Partial<PlatformSettings>);
}

export async function GET() {
  await ensureSeed();
  const guard = await requireAdmin("settings.view");
  if (!guard.ok) return guard.response;

  const settings = await readSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request: Request) {
  await ensureSeed();
  const guard = await requireAdmin("settings.manage");
  if (!guard.ok) return guard.response;

  let body: Partial<PlatformSettings>;
  try {
    body = (await request.json()) as Partial<PlatformSettings>;
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const previous = await readSettings();
  const next = sanitizePlatformSettings(body);

  await db.platformSettings.upsert({
    where: { id: "singleton" },
    update: { dataJson: JSON.stringify(next) },
    create: { id: "singleton", dataJson: JSON.stringify(next) },
  });

  // ثبت فیلدهای تغییرکرده در Audit Log — فقط در صورت تغییر واقعی
  const changedFields: Record<string, { from: unknown; to: unknown }> = {};
  for (const key of Object.keys(next) as (keyof PlatformSettings)[]) {
    const before = JSON.stringify(previous[key]);
    const after = JSON.stringify(next[key]);
    if (before !== after) {
      changedFields[key] = { from: previous[key], to: next[key] };
    }
  }

  if (Object.keys(changedFields).length > 0) {
    await writeAudit({
      actorId: guard.user.id,
      actorName: guard.user.displayName,
      actorRole: guard.user.role,
      action: "SETTINGS_UPDATED",
      entityType: "PlatformSettings",
      entityId: "singleton",
      details: { changedFields },
    });
  }

  return NextResponse.json({ ok: true, settings: next, changedCount: Object.keys(changedFields).length });
}
