import { NextResponse } from "next/server";
import {
  isValidIranianPostalCode,
  isValidIranianSheba,
  normalizeDigits,
  validateRequiredText,
} from "@shared/validation";
import { db } from "@/lib/db";
import { writeAudit } from "@/server/audit";
import { getSessionUser } from "@/server/session";

/**
 * PUT /api/profile/documents — ارسال/ویرایش مدارک احراز هویت از پنل شخصی
 * (فاز ۲ گام ۲ — نسخه 0.1.2).
 *
 * نصاب: کد پستی ۱۰ رقمی + آدرس دقیق سکونت + شبا + عکس پروفایل واقعی + کارت ملی.
 * فروشگاه: کد پستی + آدرس دقیق فروشگاه + شبا + لوگو/تصویر سردر + کارت ملی مالک.
 *
 * - اعتبارسنجی کامل سمت سرور (کد پستی استاندارد ایران، شبا mod-97، تصاویر dataURL).
 * - پس از ارسال: وضعیت INCOMPLETE → PENDING_VERIFICATION تا ادمین پس از دریافت
 *   حضوری قرارداد و سفته، آن را ACTIVE کند.
 * - ویرایش مجاز است تا زمانی که پرونده ACTIVE نشده (طبق دستور مالک).
 * - هر ارسال/ویرایش در Audit Log ثبت می‌شود.
 */

const MAX_IMAGE_CHARS = 800_000;

function isImageDataUrl(raw: unknown): raw is string {
  return typeof raw === "string" && raw.startsWith("data:image/") && raw.length <= MAX_IMAGE_CHARS;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizeSheba(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = normalizeDigits(raw).replace(/\s/g, "").toUpperCase();
  return isValidIranianSheba(value) ? value : null;
}

function normalizePostalCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = normalizeDigits(raw).replace(/\D/g, "");
  return isValidIranianPostalCode(value) ? value : null;
}

export async function PUT(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return bad("برای این عملیات باید وارد شوید.", 401);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return bad("درخواست نامعتبر است.");
  }

  // ── اعتبارسنجی فیلدهای مشترک ──
  const postalCode = normalizePostalCode(body.postalCode);
  if (typeof body.postalCode === "string" && normalizeDigits(body.postalCode).replace(/\D/g, "") && !postalCode) {
    return bad("کد پستی معتبر نیست (۱۰ رقم؛ پنج رقم اول بدون ۰ و ۲ طبق استاندارد پستی ایران).");
  }
  if (!postalCode) return bad("کد پستی ۱۰ رقمی الزامی است.");

  const sheba = normalizeSheba(body.sheba);
  if (!sheba) return bad("شماره شبا معتبر نیست (IR + ۲۴ رقم).");

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: { installerProfile: true, shopProfile: true },
  });
  if (!user) return bad("کاربر یافت نشد.", 404);

  // ── نصاب ──
  if (user.role === "installer" && user.installerProfile) {
    const profile = user.installerProfile;
    if (profile.status === "ACTIVE") {
      return bad("پرونده شما فعال است؛ برای تغییر مدارک با پشتیبانی تماس بگیرید.", 409);
    }

    const residenceAddress = typeof body.residenceAddress === "string" ? body.residenceAddress.trim() : "";
    const addressCheck = validateRequiredText(residenceAddress, 10);
    if (!addressCheck.ok) return bad("آدرس دقیق محل سکونت باید کامل وارد شود (محرمانه — فقط برای ادمین).");

    if (!isImageDataUrl(body.photoUrl)) return bad("عکس پروفایل واقعی الزامی است.");
    if (!isImageDataUrl(body.nationalCardUrl)) return bad("تصویر کارت ملی الزامی است.");

    const nextStatus = "PENDING_VERIFICATION";
    const updated = await db.installerProfile.update({
      where: { id: profile.id },
      data: {
        postalCode,
        residenceAddress,
        sheba,
        photoUrl: body.photoUrl,
        nationalCardUrl: body.nationalCardUrl,
        status: nextStatus,
      },
    });

    await writeAudit({
      actorId: user.id,
      actorName: user.displayName,
      actorRole: "installer",
      action: profile.status === "INCOMPLETE" ? "PROFILE_DOCUMENTS_SUBMITTED" : "PROFILE_DOCUMENTS_UPDATED",
      entityType: "InstallerProfile",
      entityId: profile.id,
      details: {
        installer: updated.fullName,
        previousStatus: profile.status,
        newStatus: nextStatus,
        note: "ارسال/ویرایش مدارک احراز هویت از پنل شخصی نصاب",
      },
    });

    return NextResponse.json({ ok: true, status: nextStatus });
  }

  // ── فروشگاه ──
  if (user.role === "shop" && user.shopProfile) {
    const profile = user.shopProfile;
    if (profile.status === "ACTIVE") {
      return bad("پرونده فروشگاه فعال است؛ برای تغییر مدارک با پشتیبانی تماس بگیرید.", 409);
    }

    const address = typeof body.address === "string" ? body.address.trim() : "";
    const addressCheck = validateRequiredText(address, 10);
    if (!addressCheck.ok) return bad("آدرس دقیق فروشگاه باید کامل وارد شود.");

    if (!isImageDataUrl(body.logoUrl)) return bad("لوگو یا تصویر سردر فروشگاه الزامی است.");
    if (!isImageDataUrl(body.nationalCardUrl)) return bad("تصویر کارت ملی مالک الزامی است.");

    const contactPhoneRaw = typeof body.contactPhone === "string" ? body.contactPhone.trim() : "";
    const contactPhone = /^09\d{9}$/.test(normalizeDigits(contactPhoneRaw).replace(/\D/g, ""))
      ? normalizeDigits(contactPhoneRaw).replace(/\D/g, "")
      : profile.contactPhone;

    const nextStatus = "PENDING_VERIFICATION";
    const updated = await db.shopProfile.update({
      where: { id: profile.id },
      data: {
        postalCode,
        address,
        sheba,
        logoUrl: body.logoUrl,
        nationalCardUrl: body.nationalCardUrl,
        contactPhone,
        status: nextStatus,
      },
    });

    await writeAudit({
      actorId: user.id,
      actorName: user.displayName,
      actorRole: "shop",
      action: profile.status === "INCOMPLETE" ? "PROFILE_DOCUMENTS_SUBMITTED" : "PROFILE_DOCUMENTS_UPDATED",
      entityType: "ShopProfile",
      entityId: profile.id,
      details: {
        shop: updated.shopName,
        previousStatus: profile.status,
        newStatus: nextStatus,
        note: "ارسال/ویرایش مدارک احراز هویت از پنل شخصی فروشگاه",
      },
    });

    return NextResponse.json({ ok: true, status: nextStatus });
  }

  return bad("این عملیات فقط برای پرونده نصاب/فروشگاه است.", 403);
}
