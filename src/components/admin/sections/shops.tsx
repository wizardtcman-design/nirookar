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
import { DEMO_SHOPS } from "@/lib/admin-demo-data";

/** مدیریت فروشگاه‌ها — اطلاعات، مدارک، عملکرد و وضعیت همکاری (نمایشی) */
export function ShopsSection() {
  return (
    <div className="space-y-5">
      <SectionBanner extra="گردش‌کار تأیید مدارک و احراز صلاحیت فروشگاه‌ها در فاز Backend طراحی می‌شود." />

      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
          <h2 className="text-sm font-extrabold text-brand-navy">فروشگاه‌های همکار</h2>
          <DemoBadge />
        </div>
        <div className="scrollbar-thin max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه</TableHead>
                <TableHead>نام فروشگاه</TableHead>
                <TableHead>حوزه فعالیت</TableHead>
                <TableHead>شهر</TableHead>
                <TableHead>مدارک</TableHead>
                <TableHead>سفارش‌ها</TableHead>
                <TableHead>وضعیت همکاری</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_SHOPS.map((shop) => (
                <TableRow key={shop.id}>
                  <TableCell dir="ltr" className="text-xs text-slate-500">{shop.id}</TableCell>
                  <TableCell className="text-[13px] font-bold text-brand-navy">{shop.name}</TableCell>
                  <TableCell className="text-[13px]">{shop.category}</TableCell>
                  <TableCell className="text-[13px]">{shop.city}</TableCell>
                  <TableCell><StatusChip tone={shop.documentsTone}>{shop.documents}</StatusChip></TableCell>
                  <TableCell className="text-[13px]">{shop.ordersCount}</TableCell>
                  <TableCell><StatusChip tone={shop.statusTone}>{shop.status}</StatusChip></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <p className="text-[11px] leading-6 text-slate-500">
        در فازهای بعد: بررسی مدارک و مجوزها، مدیریت محصولات و خدمات هر فروشگاه، عملکرد و سوابق همکاری.
      </p>
    </div>
  );
}
