"use client";

import { ClipboardList, HardHat, Store, UsersRound } from "lucide-react";

import { DemoBadge, SectionBanner, StatCard } from "@/components/admin/parts";

const OVERVIEW_STATS = [
  { id: "users", label: "کاربران ثبت‌نام‌شده", value: "۱٬۲۴۸", icon: UsersRound },
  { id: "orders", label: "سفارش‌های فعال", value: "۳۲", icon: ClipboardList },
  { id: "shops", label: "فروشگاه‌های همکار", value: "۱۷", icon: Store },
  { id: "installers", label: "نصاب‌های فعال", value: "۴۱", icon: HardHat },
] as const;

const RECENT_EVENTS = [
  { id: 1, text: "سفارش ORD-1001 به وضعیت «در حال انجام» تغییر کرد", time: "۱۰ دقیقه پیش" },
  { id: 2, text: "فروشگاه جدید «پرده هلال» مدارک خود را بارگذاری کرد", time: "۱ ساعت پیش" },
  { id: 3, text: "شکایت VIO-501 ثبت شد و در نوبت رسیدگی قرار گرفت", time: "۳ ساعت پیش" },
  { id: 4, text: "نصاب جدید علی نادری تایید صلاحیت شد", time: "دیروز" },
  { id: 5, text: "تسویه‌حساب ماهانه فروشگاه «گالری دکوراسیون مهر» انجام شد", time: "دیروز" },
] as const;

/** داشبورد — نمای کلی با داده‌های نمایشی */
export function OverviewSection() {
  return (
    <div className="space-y-5">
      <SectionBanner extra="در فاز Backend، آمار واقعی و زنده از پایگاه داده خوانده می‌شود." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {OVERVIEW_STATS.map((stat) => (
          <StatCard key={stat.id} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-brand-navy">آخرین رویدادهای پلتفرم</h2>
          <DemoBadge />
        </div>
        <ul className="mt-4 divide-y divide-slate-100">
          {RECENT_EVENTS.map((event) => (
            <li key={event.id} className="flex items-start justify-between gap-3 py-3">
              <span className="text-[13px] leading-6 text-slate-700">{event.text}</span>
              <span className="shrink-0 text-[11px] text-slate-400">{event.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
