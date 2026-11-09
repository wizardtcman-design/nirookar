import { NextResponse } from "next/server";
import { isValidMobile, normalizeDigits } from "@shared/validation";
import { db } from "@/lib/db";
import { writeAudit } from "@/server/audit";
import { ensureSeed } from "@/server/seed";
import { createSession, destroySession, getSessionUser } from "@/server/session";

/**
 * API احراز هویت واقعی — فاز ۲ گام ۱ (OTP Sandbox).
 *
 * POST با body.action:
 *  - request : دریافت کد تأیید (در این نسخه Sandbox با کد ثابت آزمایشی)
 *  - verify  : تأیید کد → ورود کاربر موجود یا اعلام «کاربر جدید»
 *
 * ⚠️ کد تأیید در این نسخه ثابت و آزمایشی است (12345) و به هیچ سرویس پیامکی
 * وصل نیست. ساختار OtpCode عمداً آماده اتصال سرویس واقعی است تا در فاز بعد
 * فقط «تولید و ارسال کد» عوض شود و بقیه جریان دست‌نخورده بماند.
 */

const OTP_TTL_SECONDS = 120;
const SANDBOX_OTP_CODE = "12345";

function normalizePhone(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const value = normalizeDigits(raw).replace(/[\s-]/g, "").trim();
  return isValidMobile(value) ? value : null;
}

function maskPhone(phone: string): string {
  return phone.length === 11 ? `${phone.slice(0, 4)}***${phone.slice(7)}` : phone;
}

function profileStatusOf(user: {
  role: string;
  installerProfile?: { status: string } | null;
  shopProfile?: { status: string } | null;
}): string {
  if (user.role === "installer") return user.installerProfile?.status ?? "PENDING_VERIFICATION";
  if (user.role === "shop") return user.shopProfile?.status ?? "PENDING_VERIFICATION";
  return "ACTIVE";
}

/** POST /api/auth — جریان OTP */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "درخواست نامعتبر است." }, { status: 400 });
  }

  const action = body.action;

  // ── ۱) درخواست کد تأیید ──
  if (action === "request") {
    const phone = normalizePhone(body.phone);
    if (!phone) {
      return NextResponse.json({ ok: false, error: "شماره موبایل معتبر نیست." }, { status: 400 });
    }
    await ensureSeed();

    // جلوگیری از ارسال‌های پیاپی: کدهای قبلیِ مصرف‌نشده باطل می‌شوند
    await db.otpCode.updateMany({ where: { phone, consumed: false }, data: { consumed: true } });
    await db.otpCode.create({
      data: {
        phone,
        code: SANDBOX_OTP_CODE,
        purpose: "LOGIN",
        expiresAt: new Date(Date.now() + OTP_TTL_SECONDS * 1000),
      },
    });

    return NextResponse.json({
      ok: true,
      sandbox: true,
      devCode: SANDBOX_OTP_CODE,
      expiresInSec: OTP_TTL_SECONDS,
      hint: "حالت آزمایشی (Sandbox): پیامک واقعی ارسال نمی‌شود و کد آزمایشی بالای فرم نمایش داده می‌شود.",
    });
  }

  // ── ۲) تأیید کد — ورود یا اعلام نیاز به ثبت‌نام ──
  if (action === "verify") {
    const phone = normalizePhone(body.phone);
    const code = typeof body.code === "string" ? normalizeDigits(body.code).replace(/\D/g, "") : "";
    if (!phone || !code) {
      return NextResponse.json({ ok: false, error: "شماره یا کد تأیید نامعتبر است." }, { status: 400 });
    }
    await ensureSeed();

    const otp = await db.otpCode.findFirst({
      where: { phone, consumed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });

    if (!otp || otp.code !== code) {
      return NextResponse.json(
        { ok: false, error: "کد تأیید اشتباه یا منقضی شده است. دوباره تلاش کنید." },
        { status: 401 },
      );
    }
    await db.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

    const user = await db.user.findUnique({
      where: { phone },
      include: {
        installerProfile: { select: { status: true } },
        shopProfile: { select: { status: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ ok: true, isNew: true, phone });
    }

    await createSession(user.id, user.role);
    await writeAudit({
      actorId: user.id,
      actorName: user.displayName,
      actorRole: user.role,
      action: "USER_LOGIN",
      entityType: "User",
      entityId: user.id,
      details: { phone: maskPhone(user.phone), method: "OTP_SANDBOX" },
    });

    return NextResponse.json({
      ok: true,
      isNew: false,
      user: {
        id: user.id,
        role: user.role,
        displayName: user.displayName,
        profileStatus: profileStatusOf(user),
      },
    });
  }

  return NextResponse.json({ ok: false, error: "عملیات ناشناخته است." }, { status: 400 });
}

/** GET /api/auth — اطلاعات کاربر لاگین‌شده (برای بوت‌استرپ نشست UI) */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ ok: true, user: null });
  }

  const profile = await db.user.findUnique({
    where: { id: user.id },
    include: {
      installerProfile: { select: { status: true } },
      shopProfile: { select: { status: true } },
    },
  });

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      role: user.role,
      displayName: user.displayName,
      profileStatus: profile ? profileStatusOf(profile) : "ACTIVE",
    },
  });
}

/** DELETE /api/auth — خروج از حساب */
export async function DELETE() {
  const user = await getSessionUser();
  if (user) {
    await writeAudit({
      actorId: user.id,
      actorName: user.displayName,
      actorRole: user.role,
      action: "USER_LOGOUT",
      entityType: "User",
      entityId: user.id,
    });
  }
  await destroySession();
  return NextResponse.json({ ok: true });
}
