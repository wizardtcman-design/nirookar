"use client";

import { Database, Info, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { DemoStatusTone } from "@/lib/admin-demo-data";

/**
 * اجزای مشترک پنل مدیریت.
 *
 * اصل شفافیت: هر داده نمایشی با «DemoBadge» مشخص می‌شود و هر بخش متصل به
 * دیتابیس با «LiveBadge»؛ هر بخش غیرعملیاتی با «SectionBanner» وضعیت واقعی
 * خود را اعلام می‌کند.
 */

/** نشان «داده نمایشی» — روی هر عدد/جدول نمایشی قرار می‌گیرد */
export function DemoBadge({ className, label = "داده نمایشی" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800",
        className,
      )}
    >
      {label}
    </span>
  );
}

/** نشان «متصل به دیتابیس» — برای بخش‌هایی که داده واقعی نشان می‌دهند */
export function LiveBadge({ className, label = "متصل به دیتابیس" }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800",
        className,
      )}
    >
      <Database className="size-3" aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * بنر بالای هر بخش پنل — وضعیت صادقانه بخش.
 * - حالت پیش‌فرض (کهربایی): بخش نمایشی است و به Backend آینده وابسته است.
 * - حالت live (سبز): بخش به دیتابیس واقعی متصل است و عملیات سمت سرور اجرا می‌شود.
 */
export function SectionBanner({ extra, live = false }: { extra?: string; live?: boolean }) {
  if (live) {
    return (
      <div role="status" className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5">
        <Info className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
        <p className="text-xs leading-6 text-emerald-900">
          این بخش <span className="font-extrabold">به دیتابیس واقعی متصل</span> است؛ عملیات آن سمت سرور با کنترل
          دسترسی نقش‌محور (RBAC) اجرا می‌شود و همهٔ رویدادها در Audit Log ثبت می‌شوند.
          {extra ? ` ${extra}` : ""}
        </p>
      </div>
    );
  }
  return (
    <div role="status" className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
      <Info className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
      <p className="text-xs leading-6 text-amber-900">
        این بخش در فاز ۱ فقط <span className="font-extrabold">طراحی اولیه و ساختار</span> است؛ به سرور متصل نیست و
        تمام داده‌ها نمایشی هستند. کنترل دسترسی واقعی در فاز Backend سمت سرور اجرا می‌شود.
        {extra ? ` ${extra}` : ""}
      </p>
    </div>
  );
}

/** کارت آماری داشبورد */
export function StatCard({
  icon: Icon,
  label,
  value,
  iconClass,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  iconClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500">{label}</span>
        <span className={cn("flex size-9 items-center justify-center rounded-xl bg-brand-slate-light text-brand-navy", iconClass)}>
          <Icon className="size-4.5" strokeWidth={1.9} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <span className="text-xl font-black text-brand-navy">{value}</span>
        <DemoBadge />
      </div>
    </div>
  );
}

const TONE_CLASSES: Record<DemoStatusTone, string> = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-rose-50 text-rose-700 border-rose-200",
  slate: "bg-slate-100 text-slate-600 border-slate-200",
  teal: "bg-brand-teal-light text-brand-teal border-brand-teal/30",
};

/** چیپ وضعیت — فعال/غیرفعال/در بررسی و ... */
export function StatusChip({ tone, children }: { tone: DemoStatusTone; children: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap", TONE_CLASSES[tone])}>
      {children}
    </span>
  );
}
