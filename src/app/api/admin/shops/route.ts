import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/server/guards";
import { ensureSeed } from "@/server/seed";

/**
 * GET /api/admin/shops — پرونده فروشگاه‌ها از دیتابیس (واقعی، برچسب‌خورده).
 */

export interface AdminShopRow {
  id: string;
  userId: string;
  shopName: string;
  ownerName: string;
  nationalId: string;
  postalCode: string | null;
  address: string | null;
  contactPhone: string;
  sheba: string | null;
  logoUrl: string | null;
  nationalCardUrl: string | null;
  status: string;
  contractSignedAt: string | null;
  verifiedByName: string | null;
  createdAt: string;
}

export async function GET() {
  await ensureSeed();
  const guard = await requireAdmin("shops.view");
  if (!guard.ok) return guard.response;

  const profiles = await db.shopProfile.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const rows: AdminShopRow[] = profiles.map((profile) => ({
    id: profile.id,
    userId: profile.userId,
    shopName: profile.shopName,
    ownerName: profile.ownerName,
    nationalId: profile.nationalId,
    postalCode: profile.postalCode,
    address: profile.address,
    contactPhone: profile.contactPhone,
    sheba: profile.sheba,
    logoUrl: profile.logoUrl,
    nationalCardUrl: profile.nationalCardUrl,
    status: profile.status,
    contractSignedAt: profile.contractSignedAt?.toISOString() ?? null,
    verifiedByName: profile.verifiedByName,
    createdAt: profile.createdAt.toISOString(),
  }));

  return NextResponse.json({ ok: true, shops: rows });
}
