"use client";

import { Eye, Paperclip } from "lucide-react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DemoBadge, SectionBanner, StatusChip } from "@/components/admin/parts";
import { DEMO_ORDERS, DEMO_ORDER_TIMELINE } from "@/lib/admin-demo-data";

/**
 * مدیریت سفارش‌ها — جدول سفارش‌ها + نمونه طراحی «تاریخچه تغییر وضعیت».
 * این تاریخچه پایه «پیگیری زنده سفارش» (فاز ۲) است: هر تغییر وضعیت باید شامل
 * وضعیت قبلی/جدید، شخص، زمان، توضیح و مستندات باشد و بدون ثبت سوابق قابل
 * دستکاری نباشد.
 */
export function OrdersSection() {
  const [selectedId, setSelectedId] = useState<string | null>("ORD-1001");
  const timeline = selectedId ? DEMO_ORDER_TIMELINE[selectedId] : undefined;
  const selectedOrder = DEMO_ORDERS.find((order) => order.id === selectedId);

  return (
    <div className="space-y-5">
      <SectionBanner extra="ثبت و مدیریت واقعی سفارش‌ها به Backend آینده وابسته است." />

      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
          <h2 className="text-sm font-extrabold text-brand-navy">سفارش‌ها</h2>
          <DemoBadge />
        </div>
        <div className="scrollbar-thin max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه</TableHead>
                <TableHead>مشتری</TableHead>
                <TableHead>خدمت</TableHead>
                <TableHead>مجری</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>مبلغ</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead className="sr-only">جزئیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_ORDERS.map((order) => (
                <TableRow key={order.id}>
                  <TableCell dir="ltr" className="text-xs text-slate-500">{order.id}</TableCell>
                  <TableCell className="text-[13px]">{order.customer}</TableCell>
                  <TableCell className="text-[13px] font-bold text-brand-navy">{order.service}</TableCell>
                  <TableCell className="text-[13px]">
                    {order.provider}
                    <span className="mr-1 text-[10px] text-slate-400">({order.providerType})</span>
                  </TableCell>
                  <TableCell><StatusChip tone={order.statusTone}>{order.status}</StatusChip></TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{order.amount}</TableCell>
                  <TableCell className="text-xs text-slate-500">{order.date}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedId(order.id === selectedId ? null : order.id)}
                      className="h-8 gap-1.5 px-2 text-xs"
                      aria-label={`مشاهده تاریخچه سفارش ${order.id}`}
                    >
                      <Eye className="size-3.5" aria-hidden="true" />
                      تاریخچه
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {selectedOrder && timeline ? (
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold text-brand-navy">
              تاریخچه تغییر وضعیت — سفارش <span dir="ltr">{selectedOrder.id}</span>
            </h2>
            <DemoBadge />
          </div>

          <ol className="mt-4 space-y-4 border-r-2 border-slate-100 pr-5">
            {timeline.map((event, index) => (
              <li key={index} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -right-[27px] top-1 size-3.5 rounded-full border-2 border-white bg-brand-teal shadow"
                />
                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                    {event.fromStatus}
                  </span>
                  <span aria-hidden="true" className="text-slate-400">←</span>
                  <span className="rounded-full bg-brand-teal-light px-2 py-0.5 text-[11px] font-bold text-brand-teal">
                    {event.toStatus}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-600">
                  <span className="font-bold text-brand-navy">{event.actor}</span>
                  <span className="mx-1 text-slate-400">({event.actorRole})</span>
                  — {event.date} ساعت {event.time}
                </p>
                <p className="mt-1 text-xs leading-6 text-slate-500">{event.note}</p>
                {event.attachment ? (
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-brand-teal">
                    <Paperclip className="size-3.5" aria-hidden="true" />
                    {event.attachment}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>

          <p className="mt-4 rounded-xl bg-slate-50 p-3 text-[11px] leading-6 text-slate-500">
            طراحی مرجع فاز ۲: تاریخچه فقط-الحاقی (Append-Only) در سمت سرور ذخیره می‌شود تا سوابق قابل دستکاری
            نباشد و مسئول هر تغییر همیشه قابل شناسایی باشد.
          </p>
        </section>
      ) : null}
    </div>
  );
}
