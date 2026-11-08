"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DemoBadge, SectionBanner, StatusChip } from "@/components/admin/parts";
import { DEMO_USERS } from "@/lib/admin-demo-data";

/** مدیریت کاربران — جدول نمایشی مشتریان، نصاب‌ها، فروشگاه‌ها و حساب‌های محدودشده */
export function UsersSection() {
  return (
    <div className="space-y-5">
      <SectionBanner extra="عملیات‌های واقعی (فعال/غیرفعال/مسدودسازی) به Backend آینده وابسته است." />

      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
          <h2 className="text-sm font-extrabold text-brand-navy">کاربران پلتفرم</h2>
          <DemoBadge />
        </div>
        <div className="scrollbar-thin max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>نقش</TableHead>
                <TableHead>شهر</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عضویت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_USERS.map((user) => (
                <TableRow key={user.id}>
                  <TableCell dir="ltr" className="text-xs text-slate-500">{user.id}</TableCell>
                  <TableCell className="text-[13px] font-bold text-brand-navy">{user.name}</TableCell>
                  <TableCell className="text-[13px]">{user.role}</TableCell>
                  <TableCell className="text-[13px]">{user.city}</TableCell>
                  <TableCell><StatusChip tone={user.statusTone}>{user.status}</StatusChip></TableCell>
                  <TableCell className="text-xs text-slate-500">{user.joinedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <p className="text-[11px] leading-6 text-slate-500">
        طبق معماری، غیرفعال‌سازی و مسدودسازی حساب‌ها باید با ثبت سوابق (Audit Log) و از سمت سرور انجام شود تا
        قابل پیگیری و غیرقابل دستکاری باشد.
      </p>
    </div>
  );
}
