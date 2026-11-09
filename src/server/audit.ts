import { db } from "@/lib/db";

/**
 * نویسنده Audit Log — Append-Only.
 * هیچ تابع ویرایش/حذف برای این ماژول وجود ندارد؛ فقط افزودن و خواندن.
 */

export interface AuditEntryInput {
  actorId?: string | null;
  actorName?: string | null;
  actorRole?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
}

export async function writeAudit(entry: AuditEntryInput): Promise<void> {
  await db.auditLog.create({
    data: {
      actorId: entry.actorId ?? null,
      actorName: entry.actorName ?? null,
      actorRole: entry.actorRole ?? null,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId ?? null,
      details: entry.details ? JSON.stringify(entry.details) : null,
    },
  });
}

export interface AuditEntryView {
  id: string;
  actorName: string | null;
  actorRole: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

/** خواندن آخرین رویدادها — فقط خواندنی، بدون امکان دستکاری */
export async function readRecentAudit(limit = 20): Promise<AuditEntryView[]> {
  const rows = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: Math.min(Math.max(limit, 1), 100),
  });

  return rows.map((row) => ({
    id: row.id,
    actorName: row.actorName,
    actorRole: row.actorRole,
    action: row.action,
    entityType: row.entityType,
    entityId: row.entityId,
    details: row.details ? (JSON.parse(row.details) as Record<string, unknown>) : null,
    createdAt: row.createdAt.toISOString(),
  }));
}
