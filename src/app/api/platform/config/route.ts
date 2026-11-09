import { NextResponse } from "next/server";
import { sanitizePlatformSettings, type PlatformSettings } from "@shared/platform-settings";
import { db } from "@/lib/db";
import { ensureSeed } from "@/server/seed";

/**
 * GET /api/platform/config — پیکربندی عمومی پلتفرم (بدون نیاز به ورود).
 * شامل شهرهای فعال (تعریف‌شده در پنل ادمین) و تنظیمات نمایشی عمومی.
 * هیچ داده محرمانه‌ای (کمیسیون‌ها و ...) از این مسیر خارج نمی‌شود.
 */
export async function GET() {
  await ensureSeed();

  const row = await db.platformSettings.findUnique({ where: { id: "singleton" } });
  const settings: PlatformSettings = row
    ? sanitizePlatformSettings(JSON.parse(row.dataJson) as Partial<PlatformSettings>)
    : (await import("@shared/platform-settings")).DEFAULT_PLATFORM_SETTINGS;

  return NextResponse.json({
    ok: true,
    cities: settings.cities,
    bnplEnabled: settings.bnplEnabled,
    bnplInstallments: settings.bnplInstallments,
    bnplLabel: settings.bnplLabel,
    pricingMethodsEnabled: settings.pricingMethodsEnabled,
    videoMaxSeconds: settings.videoMaxSeconds,
  });
}
