import { db } from "@/lib/db";
import { ADMIN_ROLE_FA, type AdminRole } from "@shared/admin-rbac";
import { DEFAULT_PLATFORM_SETTINGS } from "@shared/platform-settings";
import { hashPassword } from "@/server/password";

/**
 * Seed غیرتکراری سیستم — فقط بار اول اجرا:
 * ۱) ردیف Singleton تنظیمات پویا با مقادیر پیش‌فرض
 * ۲) پنج حساب مدیریتی با شماره‌های Sandbox
 *
 * فاز ۲ گام ۳ (0.1.3) — دستور مالک:
 * - همه حساب‌های پیش‌فرض/آزمایشی (۵ مدیر Sandbox و هر حساب قدیمی بدون رمز)
 *   رمز پیش‌فرض «123456» می‌گیرند تا حتی وقتی otpEnabled خاموش است، بدون
 *   تغییر تنظیمات مستقیماً با موبایل + رمز 123456 قابل ورود و تست باشند.
 * - شماره‌های مدیریتی فقط برای محیط آزمایشی این فاز هستند؛ در استقرار عملیاتی
 *   باید سرویس پیامک واقعی و رمزهای اختصاصی جایگزین شود (ثبت‌شده در ROADMAP).
 */

/** رمز پیش‌فرض حساب‌های آزمایشی/Seed (دستور مالک — نسخه 0.1.3) */
export const SEED_DEFAULT_PASSWORD = "123456";

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

  const seedPasswordHash = hashPassword(SEED_DEFAULT_PASSWORD);

  // ۲) حساب‌های مدیریتی Sandbox — upsert تا تغییر نقش بعدی هم اعمال شود + رمز پیش‌فرض 123456
  for (const admin of ADMIN_SEED) {
    // یکتایی به‌ازای هر نقش: جستجو با ترکیب (phone, role)
    const existing = await db.user.findFirst({ where: { phone: admin.phone, role: admin.role } });
    if (!existing) {
      await db.user.create({
        data: {
          phone: admin.phone,
          role: admin.role,
          displayName: ADMIN_ROLE_FA[admin.role].title,
          passwordHash: seedPasswordHash,
        },
      });
    } else if (existing.passwordHash === null) {
      await db.user.update({
        where: { id: existing.id },
        data: { passwordHash: seedPasswordHash },
      });
    }
  }

  // ۳) هر حساب آزمایشی قدیمی بدون رمز (مثلاً ساخته‌شده با جریان OTP فاز قبل)
  //    هم رمز پیش‌فرض 123456 می‌گیرد تا با خاموش بودن OTP قابل ورود باشد.
  await db.user.updateMany({
    where: { passwordHash: null },
    data: { passwordHash: seedPasswordHash },
  });
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
