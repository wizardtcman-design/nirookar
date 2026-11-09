import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { writeAudit } from "@/server/audit";
import { requireAdmin } from "@/server/guards";

/**
 * POST /api/admin/installers/[id]/verify — ثبت «تأیید قرارداد و دریافت سفته حضوری».
 *
 * این عملیات مدل رسمی ضمانت نصاب است: مراجعه حضوری نصاب به انبار/دفتر مرکزی،
 * امضای قرارداد فیزیکی و تحویل سفته؛ مدیر با تیک تأیید، وضعیت پرونده را به
 * ACTIVE تغییر می‌دهد و عملیات در Audit Log ثبت می‌شود (Append-Only).
 */

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const guard = await requireAdmin("installers.manage");
  if (!guard.ok) return guard.response;

  const profile = await db.installerProfile.findUnique({ where: { id } });
  if (!profile) {
    return NextResponse.json({ ok: false, error: "پرونده نصاب یافت نشد." }, { status: 404 });
  }

  if (profile.status === "ACTIVE") {
    return NextResponse.json(
      { ok: false, error: "این نصاب قبلاً تأیید شده است." },
      { status: 409 },
    );
  }

  const updated = await db.installerProfile.update({
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
    action: "INSTALLER_CONTRACT_VERIFIED",
    entityType: "InstallerProfile",
    entityId: id,
    details: {
      installer: updated.fullName,
      nationalId: updated.nationalId,
      note: "تأیید قرارداد و دریافت سفته حضوری — وضعیت به ACTIVE تغییر کرد",
    },
  });

  return NextResponse.json({ ok: true, status: updated.status });
}
