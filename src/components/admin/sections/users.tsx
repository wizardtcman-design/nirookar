"use client";

import { UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

import { LiveBadge, StatusChip } from "@/components/admin/parts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAdminUsers, type AdminUserRow } from "@/services/admin-api";

const ROLE_FA: Record<string, string> = {
  customer: "مشتری",
  installer: "نصاب",
  shop: "فروشگاه",
};

function statusMeta(status: string): { label: string; tone: "green" | "amber" | "red" | "slate" } {
  if (status === "ACTIVE") return { label: "فعال", tone: "green" };
  if (status === "PENDING_VERIFICATION") return { label: "در انتظار تأیید", tone: "amber" };
  if (status === "REJECTED") return { label: "رد شده", tone: "red" };
  return { label: status, tone: "slate" };
}

function formatJoined(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", { dateStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** مدیریت کاربران — لیست واقعی ثبت‌نام‌شده‌ها از دیتابیس (بدون مدیران) */
export function UsersSection() {
  const [users, setUsers] = useState<AdminUserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminUsers()
      .then((data) => setUsers(data.users))
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">
        {error}
      </div>
    );
  }

  if (!users) {
    return <div aria-busy="true" aria-label="در حال بارگذاری کاربران" className="h-48 animate-pulse rounded-2xl border border-slate-200/80 bg-white" />;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
          <h2 className="text-sm font-extrabold text-brand-navy">کاربران پلتفرم</h2>
          <LiveBadge />
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center">
            <UsersRound className="mx-auto size-10 text-slate-300" aria-hidden="true" />
            <p className="mt-3 text-sm font-extrabold text-brand-navy">هنوز کاربری ثبت‌نام نکرده است</p>
            <p className="mt-1.5 text-[12px] text-slate-500">
              با اولین ثبت‌نام (مشتری، نصاب یا فروشگاه) این جدول به‌صورت زنده به‌روز می‌شود.
            </p>
          </div>
        ) : (
          <div className="scrollbar-thin max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام</TableHead>
                  <TableHead>نقش</TableHead>
                  <TableHead>موبایل</TableHead>
                  <TableHead>شهر</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عضویت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const meta = statusMeta(user.status);
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="text-[13px] font-bold text-brand-navy">{user.displayName}</TableCell>
                      <TableCell className="text-[13px]">{ROLE_FA[user.role] ?? user.role}</TableCell>
                      <TableCell dir="ltr" className="text-left text-xs text-slate-500">{user.phone}</TableCell>
                      <TableCell className="text-[13px]">{user.city ?? "—"}</TableCell>
                      <TableCell><StatusChip tone={meta.tone}>{meta.label}</StatusChip></TableCell>
                      <TableCell className="text-xs text-slate-500">{formatJoined(user.createdAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <p className="text-[11px] leading-6 text-slate-500">
        عملیات‌های بعدی (غیرفعال‌سازی/مسدودسازی) در گام‌های آینده با ثبت سوابق Audit Log و از سمت سرور اضافه می‌شود.
      </p>
    </div>
  );
}
