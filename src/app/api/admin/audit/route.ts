import { NextResponse } from "next/server";
import { readRecentAudit } from "@/server/audit";
import { requireAdmin } from "@/server/guards";
import { ensureSeed } from "@/server/seed";

/**
 * GET /api/admin/audit — سوابق حساس (Audit Log) — Append-Only و فقط-خواندنی.
 * دسترسی بر اساس مجوز واقعی «audit.view» سمت سرور کنترل می‌شود.
 */
export async function GET(request: Request) {
  await ensureSeed();
  const guard = await requireAdmin("audit.view");
  if (!guard.ok) return guard.response;

  const url = new URL(request.url);
  const limitParam = Number(url.searchParams.get("limit") ?? "50");
  const entries = await readRecentAudit(Number.isFinite(limitParam) ? limitParam : 50);

  return NextResponse.json({ ok: true, entries });
}
