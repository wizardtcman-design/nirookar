import { db } from "@/lib/db";
import { ADMIN_ROLE_FA, type AdminRole } from "@shared/admin-rbac";
import { DEFAULT_PLATFORM_SETTINGS } from "@shared/platform-settings";

/**
 * Seed غیرتکراری سیستم — فقط بار اول اجرا:
 * ۱) ردیف Singleton تنظیمات پویا با مقادیر پیش‌فرض
 * ۲) پنج حساب مدیریتی با شماره‌های Sandbox برای ورود OTP آزمایشی
 *
 * ⚠️ شماره‌های مدیریتی فقط برای محیط آزمایشی این فاز هستند و ورود همه با کد
 * آزمایشی 12345 انجام می‌شود؛ در استقرار عملیاتی باید حتماً سرویس پیامک واقعی
 * جایگزین شود (ثبت‌شده در ROADMAP).
 */

const ADMIN_SEED: readonly { phone: string; role: AdminRole }[] = [
  { phone: "09120000001", role: "super_admin" },
  { phone: "09120000002", role: "ops_manager" },
  { phone: "09120000003", role: "finance_manager" },
  { phone: "09120000004", role: "support_specialist" },
  { phone: "09120000005", role: "auditor" },
];

export const ADMIN_SEED_ACCOUNTS = ADMIN_SEED.map(({ phone, role }) => ({
  phone,
  role,
  title: ADMIN_ROLE_FA[role].title,
  description: ADMIN_ROLE_FA[role].description,
}));

/** حالت نمایشی (Demo Mode) — برای سوییچر سریع مالک؛ با env قابل خاموش شدن است */
export function isDemoModeEnabled(): boolean {
  return process.env.NIROOKAR_DEMO_MODE !== "false";
}

let seedPromise: Promise<void> | null = null;

async function runSeed(): Promise<void> {
  // ۱) تنظیمات پویا — اگر وجود نداشت با پیش‌فرض ساخته می‌شود
  const settings = await db.platformSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    await db.platformSettings.create({
      data: { id: "singleton", dataJson: JSON.stringify(DEFAULT_PLATFORM_SETTINGS) },
    });
  }

  // ۲) حساب‌های مدیریتی Sandbox — upsert تا تغییر نقش بعدی هم اعمال شود
  for (const admin of ADMIN_SEED) {
    const existing = await db.user.findUnique({ where: { phone: admin.phone } });
    if (!existing) {
      await db.user.create({
        data: {
          phone: admin.phone,
          role: admin.role,
          displayName: ADMIN_ROLE_FA[admin.role].title,
        },
      });
    } else if (existing.role !== admin.role) {
      await db.user.update({ where: { id: existing.id }, data: { role: admin.role } });
    }
  }
}

/** تضمین یک‌باره seed در طول عمر فرآیند — همه مسیرهای API آن را فراخوانی می‌کنند */
export function ensureSeed(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  return seedPromise;
}
