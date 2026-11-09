import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionUser } from "@/server/session";

/**
 * GET /api/profile — پروفایل کامل کاربر لاگین‌شده (فقط خودش).
 *
 * نصاب/فروشگاه: داده‌های پرونده خودش (از جمله مدارک ارسال‌شده) برای پر بودن
 * کارت «تکمیل احراز هویت و مدارک» در پنل شخصی.
 * مشتری: داده‌های سبک حساب.
 * داده دیگر کاربران هرگز از این مسیر برنمی‌گردد.
 */
export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ ok: false, error: "برای این عملیات باید وارد شوید." }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    include: {
      installerProfile: true,
      shopProfile: true,
      customerProfile: true,
    },
  });
  if (!user) {
    return NextResponse.json({ ok: false, error: "کاربر یافت نشد." }, { status: 404 });
  }

  if (user.role === "installer" && user.installerProfile) {
    const p = user.installerProfile;
    let specialties: string[] = [];
    try {
      const parsed: unknown = JSON.parse(p.specialties);
      if (Array.isArray(parsed)) specialties = parsed.map(String);
    } catch {
      specialties = [];
    }
    return NextResponse.json({
      ok: true,
      role: "installer",
      status: p.status,
      profile: {
        fullName: p.fullName,
        phone: user.phone,
        nationalId: p.nationalId,
        city: p.city,
        workHistory: p.workHistory,
        specialties,
        postalCode: p.postalCode,
        residenceAddress: p.residenceAddress,
        sheba: p.sheba,
        photoUrl: p.photoUrl,
        nationalCardUrl: p.nationalCardUrl,
      },
      verifiedByName: p.verifiedByName,
    });
  }

  if (user.role === "shop" && user.shopProfile) {
    const p = user.shopProfile;
    return NextResponse.json({
      ok: true,
      role: "shop",
      status: p.status,
      profile: {
        shopName: p.shopName,
        ownerName: p.ownerName,
        phone: user.phone,
        nationalId: p.nationalId,
        contactPhone: p.contactPhone,
        postalCode: p.postalCode,
        address: p.address,
        sheba: p.sheba,
        logoUrl: p.logoUrl,
        nationalCardUrl: p.nationalCardUrl,
      },
      verifiedByName: p.verifiedByName,
    });
  }

  if (user.role === "customer" && user.customerProfile) {
    const p = user.customerProfile;
    return NextResponse.json({
      ok: true,
      role: "customer",
      status: "ACTIVE",
      profile: {
        displayName: user.displayName,
        phone: user.phone,
        city: p.city,
        neighborhood: p.neighborhood,
        photoUrl: p.photoUrl,
      },
    });
  }

  // نقش‌های مدیریتی — پروفایل شخصی ندارند
  return NextResponse.json({
    ok: true,
    role: user.role,
    status: "ACTIVE",
    profile: { displayName: user.displayName, phone: user.phone },
  });
}
