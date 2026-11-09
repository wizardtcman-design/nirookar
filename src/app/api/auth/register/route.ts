import { NextResponse } from "next/server";
import { SPECIALTY_KEYS } from "@shared/specialties";
import {
  isValidIranianNationalId,
  isValidIranianSheba,
  isValidMobile,
  normalizeDigits,
  validateRequiredText,
} from "@shared/validation";
import { db } from "@/lib/db";
import { writeAudit } from "@/server/audit";
import { ensureSeed } from "@/server/seed";
import { createSession } from "@/server/session";

/**
 * POST /api/auth/register — ثبت‌نام واقعی سه نقش (فاز ۲ گام ۱).
 *
 * اعتبارسنجی کامل سمت سرور (الگوریتم کد ملی، شبا، تخصص‌ها، شهر فعال) +
 * جلوگیری از ثبت تکراری کد ملی + هشدار ادمین در Audit Log.
 * وضعیت اولیه نصاب و فروشگاه: PENDING_VERIFICATION (بررسی حضوری قرارداد و سفته).
 */

const MAX_IMAGE_CHARS = 800_000; // حدود ۶۰۰ کیلوبایت dataURL — تصاویر سمت کلاینت فشرده می‌شوند

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

function normalizeSheba(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = normalizeDigits(raw).replace(/\s/g, "").toUpperCase();
  return isValidIranianSheba(value) ? value : null;
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

async function getActiveCities(): Promise<string[]> {
  const settings = await db.platformSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) return [];
  const parsed = JSON.parse(settings.dataJson) as { cities?: string[] };
  return parsed.cities ?? [];
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

  const existing = await db.user.findUnique({ where: { phone } });
  if (existing) {
    return bad("این شماره قبلاً ثبت شده است؛ لطفاً وارد شوید.", 409);
  }

  // شهر باید جزو شهرهای فعالِ تعریف‌شده در پنل ادمین باشد (بدون هاردکد شهر)
  const activeCities = await getActiveCities();
  const city = typeof body.city === "string" ? body.city.trim() : "";
  if (registerRole !== "shop" && !activeCities.includes(city)) {
    return bad("شهر انتخاب‌شده در حال حاضر فعال نیست. شهرهای فعال از پنل مدیریت تعیین می‌شود.");
  }

  // ─────────────────────────────────────────────
  // مشتری — حداقل داده، عکس اختیاری
  // ─────────────────────────────────────────────
  if (registerRole === "customer") {
    const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
    const firstNameCheck = validateRequiredText(firstName, 2);
    const lastNameCheck = validateRequiredText(lastName, 2);
    if (!firstNameCheck.ok) return bad(`نام: ${firstNameCheck.message}`);
    if (!lastNameCheck.ok) return bad(`نام خانوادگی: ${lastNameCheck.message}`);

    const neighborhood = typeof body.neighborhood === "string" ? body.neighborhood.trim() : "";
    const photoUrl = body.photoUrl === undefined || body.photoUrl === null ? null : body.photoUrl;
    if (photoUrl !== null && !isImageDataUrl(photoUrl)) {
      return bad("عکس پروفایل معتبر نیست (حجم زیاد یا قالب نامناسب).");
    }

    const user = await db.user.create({
      data: {
        phone,
        role: "customer",
        displayName: `${firstName} ${lastName}`.trim(),
        customerProfile: {
          create: { city, neighborhood: neighborhood || null, photoUrl },
        },
      },
      include: { customerProfile: true },
    });

    await writeAudit({
      actorId: user.id,
      actorName: user.displayName,
      actorRole: "customer",
      action: "USER_REGISTERED",
      entityType: "CustomerProfile",
      entityId: user.customerProfile?.id ?? null,
      details: { role: "customer", city },
    });
    await createSession(user.id, user.role);

    return NextResponse.json({
      ok: true,
      user: { id: user.id, role: "customer", displayName: user.displayName, profileStatus: "ACTIVE" },
    });
  }

  // ─────────────────────────────────────────────
  // نصاب — پرونده کامل + کد ملی Unique
  // ─────────────────────────────────────────────
  if (registerRole === "installer") {
    const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
    const nationalId = normalizeNationalId(body.nationalId);
    const residenceAddress = typeof body.residenceAddress === "string" ? body.residenceAddress.trim() : "";
    const workHistory = typeof body.workHistory === "string" ? body.workHistory.trim() : "";
    const sheba = normalizeSheba(body.sheba);

    const nameCheck = validateRequiredText(fullName, 3);
    if (!nameCheck.ok) return bad(`نام و نام خانوادگی: ${nameCheck.message}`);
    if (typeof body.nationalId === "string" && normalizeDigits(body.nationalId).replace(/\D/g, "") && !nationalId) {
      return bad("کد ملی معتبر نیست (الگوریتم صحت‌سنجی ایران رد شد).");
    }
    if (!nationalId) return bad("کد ملی معتبر نیست.");
    const addressCheck = validateRequiredText(residenceAddress, 10);
    if (!addressCheck.ok) return bad("آدرس دقیق محل سکونت باید کامل وارد شود (محرمانه — فقط برای ادمین).");
    const historyCheck = validateRequiredText(workHistory, 10);
    if (!historyCheck.ok) return bad("سابقه کار و فروشگاه‌های محل فعالیت قبلی باید کامل وارد شود.");
    if (!sheba) return bad("شماره شبا معتبر نیست.");

    const rawSpecialties = Array.isArray(body.specialties) ? body.specialties : [];
    const specialties = rawSpecialties
      .map((key) => String(key))
      .filter((key) => SPECIALTY_KEYS.includes(key));
    if (!specialties.length) return bad("حداقل یک تخصص را انتخاب کنید.");

    if (!isImageDataUrl(body.photoUrl)) return bad("عکس پروفایل واقعی الزامی است.");
    if (!isImageDataUrl(body.nationalCardUrl)) return bad("تصویر کارت ملی الزامی است.");

    // قفل کد ملی: هر کد ملی فقط یک پروفایل نصاب (حتی با شماره موبایل دیگر)
    const duplicate = await db.installerProfile.findUnique({ where: { nationalId } });
    if (duplicate) {
      await writeAudit({
        action: "DUPLICATE_NATIONAL_ID_ATTEMPT",
        entityType: "InstallerProfile",
        entityId: duplicate.id,
        details: { attemptedRole: "installer", existingProfile: duplicate.fullName },
      });
      return bad("این کد ملی قبلاً برای یک پروفایل نصاب ثبت شده است.", 409);
    }

    const user = await db.user.create({
      data: {
        phone,
        role: "installer",
        displayName: fullName,
        installerProfile: {
          create: {
            fullName,
            nationalId,
            city,
            residenceAddress,
            workHistory,
            specialties: JSON.stringify(specialties),
            sheba,
            photoUrl: body.photoUrl,
            nationalCardUrl: body.nationalCardUrl,
            status: "PENDING_VERIFICATION",
          },
        },
      },
      include: { installerProfile: true },
    });

    await writeAudit({
      actorId: user.id,
      actorName: user.displayName,
      actorRole: "installer",
      action: "USER_REGISTERED",
      entityType: "InstallerProfile",
      entityId: user.installerProfile?.id ?? null,
      details: { role: "installer", city, specialties },
    });
    await createSession(user.id, user.role);

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        role: "installer",
        displayName: user.displayName,
        profileStatus: "PENDING_VERIFICATION",
      },
    });
  }

  // ─────────────────────────────────────────────
  // فروشگاه — پرونده کامل + کد ملی Unique
  // ─────────────────────────────────────────────
  const shopName = typeof body.shopName === "string" ? body.shopName.trim() : "";
  const ownerName = typeof body.ownerName === "string" ? body.ownerName.trim() : "";
  const nationalId = normalizeNationalId(body.nationalId);
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const contactPhone = normalizePhone(body.contactPhone) ?? phone;
  const sheba = normalizeSheba(body.sheba);

  const shopNameCheck = validateRequiredText(shopName, 3);
  if (!shopNameCheck.ok) return bad(`نام فروشگاه: ${shopNameCheck.message}`);
  const ownerCheck = validateRequiredText(ownerName, 3);
  if (!ownerCheck.ok) return bad(`نام مالک: ${ownerCheck.message}`);
  if (typeof body.nationalId === "string" && normalizeDigits(body.nationalId).replace(/\D/g, "") && !nationalId) {
    return bad("کد ملی معتبر نیست (الگوریتم صحت‌سنجی ایران رد شد).");
  }
  if (!nationalId) return bad("کد ملی معتبر نیست.");
  const addressCheck = validateRequiredText(address, 10);
  if (!addressCheck.ok) return bad("آدرس دقیق فروشگاه باید کامل وارد شود.");
  if (!sheba) return bad("شماره شبا معتبر نیست.");
  if (!isImageDataUrl(body.logoUrl)) return bad("لوگو یا تصویر سردر فروشگاه الزامی است.");

  const duplicate = await db.shopProfile.findUnique({ where: { nationalId } });
  if (duplicate) {
    await writeAudit({
      action: "DUPLICATE_NATIONAL_ID_ATTEMPT",
      entityType: "ShopProfile",
      entityId: duplicate.id,
      details: { attemptedRole: "shop", existingProfile: duplicate.shopName },
    });
    return bad("این کد ملی قبلاً برای یک فروشگاه ثبت شده است.", 409);
  }

  const user = await db.user.create({
    data: {
      phone,
      role: "shop",
      displayName: shopName,
      shopProfile: {
        create: {
          shopName,
          ownerName,
          nationalId,
          address,
          contactPhone,
          sheba,
          logoUrl: body.logoUrl,
          status: "PENDING_VERIFICATION",
        },
      },
    },
    include: { shopProfile: true },
  });

  await writeAudit({
    actorId: user.id,
    actorName: user.displayName,
    actorRole: "shop",
    action: "USER_REGISTERED",
    entityType: "ShopProfile",
    entityId: user.shopProfile?.id ?? null,
    details: { role: "shop", shopName, ownerName },
  });
  await createSession(user.id, user.role);

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      role: "shop",
      displayName: user.displayName,
      profileStatus: "PENDING_VERIFICATION",
    },
  });
}
