import { NextResponse } from "next/server";
import { SPECIALTY_KEYS } from "@shared/specialties";
import {
  isValidIranianNationalId,
  isValidMobile,
  normalizeDigits,
  validateRequiredText,
} from "@shared/validation";
import { db } from "@/lib/db";
import { writeAudit } from "@/server/audit";
import { hashPassword } from "@/server/password";
import { ensureSeed } from "@/server/seed";
import { createSession } from "@/server/session";

/**
 * POST /api/auth/register — ثبت‌نام اولیه سه نقش (فاز ۲ گام ۳ — نسخه 0.1.3).
 *
 * جریان طبق دستور مالک:
 *  - ثبت‌نام اولیه = «شماره موبایل + کد ملی (الزامی؛ یکتا به‌ازای هر نقش) +
 *    نام و نام خانوادگی + رمز عبور» + فیلد اختصاصی نقش:
 *      نصاب: تخصص‌ها + سابقه کار قبلی / فروشگاه: نام فروشگاه / مشتری: حداقل داده.
 *  - قانون یکتایی چندنقشی (0.1.3): یک کد ملی/موبایل در هر نقش فقط یک حساب؛
 *    همان شخص در نقش‌های دیگر هم می‌تواند حساب جداگانه داشته باشد.
 *    هشدار ادمین (Audit Log) فقط برای تکرار در «همان نقش» ثبت می‌شود.
 *  - رمز عبور الزامی است مگر وقتی سوئیچ otpEnabled در تنظیمات پنل فعال باشد
 *    (جریان قدیمی OTP — آنجا رمز اختیاری است).
 *  - مدارک (کد پستی، آدرس، شبا، عکس‌ها) دیگر در ثبت‌نام جمع نمی‌شوند؛ از کارت
 *    «تکمیل احراز هویت و مدارک» در پنل شخصی نصاب/فروشگاه ارسال می‌شوند.
 *  - وضعیت اولیه نصاب/فروشگاه: INCOMPLETE → پس از ارسال مدارک: PENDING_VERIFICATION
 *    → پس از تأیید حضوری قرارداد و سفته توسط ادمین: ACTIVE.
 *  - کاربر بلافاصله پس از ثبت‌نام وارد پنل شخصی خود می‌شود (نشست واقعی ایجاد می‌شود).
 */

const MAX_IMAGE_CHARS = 800_000; // حدود ۶۰۰ کیلوبایت dataURL — تصاویر سمت کلاینت فشرده می‌شوند
const MIN_PASSWORD_LENGTH = 6;

type RegisterRole = "customer" | "installer" | "shop";

function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = normalizeDigits(raw).replace(/[\s-]/g, "").trim();
  return isValidMobile(value) ? value : null;
}

function normalizeNationalId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = normalizeDigits(raw).replace(/\D/g, "");
  return isValidIranianNationalId(value) ? value : null;
}

function isImageDataUrl(raw: unknown): raw is string {
  return (
    typeof raw === "string" &&
    raw.startsWith("data:image/") &&
    raw.length <= MAX_IMAGE_CHARS
  );
}

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

async function getPlatformSettings() {
  const { sanitizePlatformSettings } = await import("@shared/platform-settings");
  const settings = await db.platformSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    const { DEFAULT_PLATFORM_SETTINGS } = await import("@shared/platform-settings");
    return DEFAULT_PLATFORM_SETTINGS;
  }
  return sanitizePlatformSettings(JSON.parse(settings.dataJson) as Record<string, unknown>);
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function POST(request: Request) {
  await ensureSeed();

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return bad("درخواست نامعتبر است.");
  }

  const phone = normalizePhone(body.phone);
  if (!phone) return bad("شماره موبایل معتبر نیست.");

  const role = body.role;
  if (role !== "customer" && role !== "installer" && role !== "shop") {
    return bad("نقش ثبت‌نام نامعتبر است.");
  }
  const registerRole = role as RegisterRole;

  // ── قفل موبایل به‌ازای هر نقش: تکرار در «همان نقش» ممنوع؛ نقش‌های دیگر آزاد ──
  const existingPhoneSameRole = await db.user.findFirst({ where: { phone, role: registerRole } });
  if (existingPhoneSameRole) {
    return bad("این شماره قبلاً برای همین نقش ثبت شده است؛ لطفاً وارد شوید.", 409);
  }

  // ── کد ملی: الزامی و یکتا به‌ازای هر نقش (ترکیب nationalId + role) ──
  const nationalId = normalizeNationalId(body.nationalId);
  if (typeof body.nationalId === "string" && normalizeDigits(body.nationalId).replace(/\D/g, "") && !nationalId) {
    return bad("کد ملی معتبر نیست (الگوریتم صحت‌سنجی ایران رد شد).");
  }
  if (!nationalId) return bad("کد ملی الزامی است و باید معتبر باشد.");

  const duplicateUser = await db.user.findFirst({ where: { nationalId, role: registerRole } });
  if (duplicateUser) {
    // هشدار ادمین فقط برای تکرار در «همان نقش» (دستور مالک — نسخه 0.1.3)
    await writeAudit({
      action: "DUPLICATE_NATIONAL_ID_ATTEMPT",
      entityType: "User",
      entityId: duplicateUser.id,
      details: {
        attemptedRole: registerRole,
        existingRole: duplicateUser.role,
        existingName: duplicateUser.displayName,
        scope: "SAME_ROLE",
      },
    });
    return bad("این کد ملی قبلاً در همین نقش ثبت شده است (هر نقش فقط یک حساب).", 409);
  }
  // پرونده‌های قدیمی همان نقش که کد ملی‌شان فقط در جدول پروفایل است
  if (registerRole === "installer") {
    const legacyInstaller = await db.installerProfile.findUnique({ where: { nationalId } });
    if (legacyInstaller) {
      await writeAudit({
        action: "DUPLICATE_NATIONAL_ID_ATTEMPT",
        entityType: "InstallerProfile",
        entityId: legacyInstaller.id,
        details: { attemptedRole: registerRole, note: "مغایرت با پرونده قدیمی فاز قبل", scope: "SAME_ROLE" },
      });
      return bad("این کد ملی قبلاً برای یک پرونده نصاب ثبت شده است.", 409);
    }
  }
  if (registerRole === "shop") {
    const legacyShop = await db.shopProfile.findUnique({ where: { nationalId } });
    if (legacyShop) {
      await writeAudit({
        action: "DUPLICATE_NATIONAL_ID_ATTEMPT",
        entityType: "ShopProfile",
        entityId: legacyShop.id,
        details: { attemptedRole: registerRole, note: "مغایرت با پرونده قدیمی فاز قبل", scope: "SAME_ROLE" },
      });
      return bad("این کد ملی قبلاً برای یک پرونده فروشگاه ثبت شده است.", 409);
    }
  }

  // ── رمز عبور: الزامی در حالت پیش‌فرض (otpEnabled خاموش) ──
  const settings = await getPlatformSettings();
  const password = typeof body.password === "string" ? body.password : "";
  if (password && password.length < MIN_PASSWORD_LENGTH) {
    return bad(`رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد.`);
  }
  if (!password && !settings.otpEnabled) {
    return bad("رمز عبور الزامی است (حداقل ۶ کاراکتر).");
  }

  // ── نام و نام خانوادگی (همه نقش‌ها) ──
  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const firstNameCheck = validateRequiredText(firstName, 2);
  const lastNameCheck = validateRequiredText(lastName, 2);
  if (!firstNameCheck.ok) return bad(`نام: ${firstNameCheck.message}`);
  if (!lastNameCheck.ok) return bad(`نام خانوادگی: ${lastNameCheck.message}`);

  // شهر باید جزو شهرهای فعالِ تعریف‌شده در پنل ادمین باشد (بدون هاردکد شهر)
  const activeCities = settings.cities;
  const city = typeof body.city === "string" ? body.city.trim() : "";
  if (!activeCities.includes(city)) {
    return bad("شهر انتخاب‌شده در حال حاضر فعال نیست. شهرهای فعال از پنل مدیریت تعیین می‌شود.");
  }

  const passwordHash = password ? hashPassword(password) : null;
  const authMethod = passwordHash ? "PASSWORD" : "OTP_SANDBOX";

  // ─────────────────────────────────────────────
  // مشتری — حداقل داده؛ عکس اختیاری
  // ─────────────────────────────────────────────
  if (registerRole === "customer") {
    const neighborhood = typeof body.neighborhood === "string" ? body.neighborhood.trim() : "";
    const photoUrl = body.photoUrl === undefined || body.photoUrl === null ? null : body.photoUrl;
    if (photoUrl !== null && !isImageDataUrl(photoUrl)) {
      return bad("عکس پروفایل معتبر نیست (حجم زیاد یا قالب نامناسب).");
    }

    let user;
    try {
      user = await db.user.create({
        data: {
          phone,
          role: "customer",
          displayName: `${firstName} ${lastName}`.trim(),
          nationalId,
          passwordHash,
          customerProfile: {
            create: { city, neighborhood: neighborhood || null, photoUrl },
          },
        },
        include: { customerProfile: true },
      });
    } catch (createError) {
      // مسابقه همزمانی: قید یکتایی ترکیبی (phone+role / nationalId+role) سمت DB
      if (isUniqueViolation(createError)) {
        return bad("این شماره یا کد ملی قبلاً برای همین نقش ثبت شده است؛ لطفاً وارد شوید.", 409);
      }
      throw createError;
    }

    await writeAudit({
      actorId: user.id,
      actorName: user.displayName,
      actorRole: "customer",
      action: "USER_REGISTERED",
      entityType: "CustomerProfile",
      entityId: user.customerProfile?.id ?? null,
      details: { role: "customer", city, method: authMethod },
    });
    await createSession(user.id, user.role);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, role: "customer", displayName: user.displayName, profileStatus: "ACTIVE" },
    });
  }

  // ─────────────────────────────────────────────
  // نصاب — ثبت‌نام اولیه (هویت + تخصص + سابقه)؛ مدارک از پنل شخصی
  // ─────────────────────────────────────────────
  if (registerRole === "installer") {
    const fullName = `${firstName} ${lastName}`.trim();
    const workHistory = typeof body.workHistory === "string" ? body.workHistory.trim() : "";
    const historyCheck = validateRequiredText(workHistory, 10);
    if (!historyCheck.ok) return bad("سابقه کار و فروشگاه‌های محل فعالیت قبلی باید کامل وارد شود.");

    const rawSpecialties = Array.isArray(body.specialties) ? body.specialties : [];
    const specialties = rawSpecialties
      .map((key) => String(key))
      .filter((key) => SPECIALTY_KEYS.includes(key));
    if (!specialties.length) return bad("حداقل یک تخصص را انتخاب کنید.");

    let user;
    try {
      user = await db.user.create({
        data: {
          phone,
          role: "installer",
          displayName: fullName,
          nationalId,
          passwordHash,
          installerProfile: {
            create: {
              fullName,
              nationalId,
              city,
              workHistory,
              specialties: JSON.stringify(specialties),
              status: "INCOMPLETE",
            },
          },
        },
        include: { installerProfile: true },
      });
    } catch (createError) {
      if (isUniqueViolation(createError)) {
        return bad("این شماره یا کد ملی قبلاً برای نقش نصاب ثبت شده است؛ لطفاً وارد شوید.", 409);
      }
      throw createError;
    }

    await writeAudit({
      actorId: user.id,
      actorName: user.displayName,
      actorRole: "installer",
      action: "USER_REGISTERED",
      entityType: "InstallerProfile",
      entityId: user.installerProfile?.id ?? null,
      details: {
        role: "installer",
        city,
        specialties,
        method: authMethod,
        note: "ثبت‌نام اولیه — مدارک هنوز از پنل شخصی ارسال نشده (INCOMPLETE)",
      },
    });
    await createSession(user.id, user.role);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        role: "installer",
        displayName: user.displayName,
        profileStatus: "INCOMPLETE",
      },
    });
  }

  // ─────────────────────────────────────────────
  // فروشگاه — ثبت‌نام اولیه (نام فروشگاه + هویت مالک)؛ مدارک از پنل شخصی
  // ─────────────────────────────────────────────
  const shopName = typeof body.shopName === "string" ? body.shopName.trim() : "";
  const shopNameCheck = validateRequiredText(shopName, 3);
  if (!shopNameCheck.ok) return bad(`نام فروشگاه: ${shopNameCheck.message}`);
  const ownerName = `${firstName} ${lastName}`.trim();

  let user;
  try {
    user = await db.user.create({
      data: {
        phone,
        role: "shop",
        displayName: shopName,
        nationalId,
        passwordHash,
        shopProfile: {
          create: {
            shopName,
            ownerName,
            nationalId,
            contactPhone: phone,
            status: "INCOMPLETE",
          },
        },
      },
      include: { shopProfile: true },
    });
  } catch (createError) {
    if (isUniqueViolation(createError)) {
      return bad("این شماره یا کد ملی قبلاً برای نقش فروشگاه ثبت شده است؛ لطفاً وارد شوید.", 409);
    }
    throw createError;
  }

  await writeAudit({
    actorId: user.id,
    actorName: user.displayName,
    actorRole: "shop",
    action: "USER_REGISTERED",
    entityType: "ShopProfile",
    entityId: user.shopProfile?.id ?? null,
    details: {
      role: "shop",
      shopName,
      ownerName,
      method: authMethod,
      note: "ثبت‌نام اولیه — مدارک هنوز از پنل شخصی ارسال نشده (INCOMPLETE)",
    },
  });
  await createSession(user.id, user.role);

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      role: "shop",
      displayName: user.displayName,
      profileStatus: "INCOMPLETE",
    },
  });
}
