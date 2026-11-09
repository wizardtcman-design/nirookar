import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeAudit } from "@/server/audit";
import { requireAdmin } from "@/server/guards";

/**
 * POST /api/admin/shops/[id]/verify — تأیید فروشگاه (وضعیت ACTIVE + Audit Log).
 */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guard = await requireAdmin("shops.manage");
  if (!guard.ok) return guard.response;

  const profile = await db.shopProfile.findUnique({ where: { id } });
  if (!profile) {
    return NextResponse.json({ ok: false, error: "پرونده فروشگاه یافت نشد." }, { status: 404 });
  }

  if (profile.status === "ACTIVE") {
    return NextResponse.json({ ok: false, error: "این فروشگاه قبلاً تأیید شده است." }, { status: 409 });
  }

  const updated = await db.shopProfile.update({
    where: { id },
    data: {
      status: "ACTIVE",
      contractSignedAt: new Date(),
      verifiedByUserId: guard.user.id,
      verifiedByName: guard.user.displayName,
    },
  });

  await writeAudit({
    actorId: guard.user.id,
    actorName: guard.user.displayName,
    actorRole: guard.user.role,
    action: "SHOP_CONTRACT_VERIFIED",
    entityType: "ShopProfile",
    entityId: id,
    details: {
      shop: updated.shopName,
      nationalId: updated.nationalId,
      note: "تأیید فروشگاه — وضعیت به ACTIVE تغییر کرد",
    },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
