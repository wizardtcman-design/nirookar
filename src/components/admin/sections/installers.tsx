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
import { DEMO_INSTALLERS } from "@/lib/admin-demo-data";

/** مدیریت نصاب‌ها — اطلاعات، مهارت‌ها، سوابق و امتیاز (نمایشی) */
export function InstallersSection() {
  return (
    <div className="space-y-5">
      <SectionBanner extra="بررسی مدارک فنی، تخصص‌ها و سوابق کاری نصاب‌ها در فاز Backend فعال می‌شود." />

      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
          <h2 className="text-sm font-extrabold text-brand-navy">نصاب‌های پلتفرم</h2>
          <DemoBadge />
        </div>
        <div className="scrollbar-thin max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه</TableHead>
                <TableHead>نام</TableHead>
                <TableHead>تخصص‌ها</TableHead>
                <TableHead>شهر</TableHead>
                <TableHead>سفارش‌های موفق</TableHead>
                <TableHead>امتیاز</TableHead>
                <TableHead>وضعیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_INSTALLERS.map((installer) => (
                <TableRow key={installer.id}>
                  <TableCell dir="ltr" className="text-xs text-slate-500">{installer.id}</TableCell>
                  <TableCell className="text-[13px] font-bold text-brand-navy">{installer.name}</TableCell>
                  <TableCell className="text-[13px]">{installer.skills}</TableCell>
                  <TableCell className="text-[13px]">{installer.city}</TableCell>
                  <TableCell className="text-[13px]">{installer.ordersDone}</TableCell>
                  <TableCell className="text-[13px] font-bold text-brand-teal">{installer.rating}</TableCell>
                  <TableCell><StatusChip tone={installer.statusTone}>{installer.status}</StatusChip></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <p className="text-[11px] leading-6 text-slate-500">
        در فازهای بعد: سفارش‌های دریافتی هر نصاب، امتیاز و عملکرد واقعی، تخلفات و شکایات ثبت‌شده علیه او.
      </p>
    </div>
  );
}
