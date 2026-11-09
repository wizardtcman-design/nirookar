import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/guards";
import { ensureSeed } from "@/server/seed";

/**
 * GET /api/admin/installers — پرونده کامل نصاب‌ها از دیتابیس.
 * شامل فیلدهای محرمانه (آدرس سکونت، کد ملی) که فقط با مجوز سمت سرور
 * «installers.view» قابل دسترسی هستند.
 */

export interface AdminInstallerRow {
  id: string;
  userId: string;
  displayName: string;
  phone: string;
  fullName: string;
  nationalId: string;
  city: string;
  postalCode: string | null;
  residenceAddress: string | null;
  workHistory: string;
  specialties: string[];
  sheba: string | null;
  photoUrl: string | null;
  nationalCardUrl: string | null;
  status: string;
  contractSignedAt: string | null;
  verifiedByName: string | null;
  createdAt: string;
}

export async function GET() {
  await ensureSeed();
  const guard = await requireAdmin("installers.view");
  if (!guard.ok) return guard.response;

  const profiles = await db.installerProfile.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { displayName: true, phone: true } } },
  });

  const rows: AdminInstallerRow[] = profiles.map((profile) => ({
    id: profile.id,
    userId: profile.userId,
    displayName: profile.user.displayName,
    phone: profile.user.phone,
    fullName: profile.fullName,
    nationalId: profile.nationalId,
    city: profile.city,
    postalCode: profile.postalCode,
    residenceAddress: profile.residenceAddress,
    workHistory: profile.workHistory,
    specialties: safeParseSpecialties(profile.specialties),
    sheba: profile.sheba,
    photoUrl: profile.photoUrl,
    nationalCardUrl: profile.nationalCardUrl,
    status: profile.status,
    contractSignedAt: profile.contractSignedAt?.toISOString() ?? null,
    verifiedByName: profile.verifiedByName,
    createdAt: profile.createdAt.toISOString(),
  }));

  return NextResponse.json({ ok: true, installers: rows });
}

function safeParseSpecialties(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}
