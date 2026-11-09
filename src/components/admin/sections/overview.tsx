"use client";

import { ClipboardList, HardHat, Store, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";

import { DemoBadge, LiveBadge, StatCard } from "@/components/admin/parts";
import {
  fetchAdminOverview,
  type AdminOverview as AdminOverviewData,
} from "@/services/admin-api";

const AUDIT_ACTION_FA: Record<string, string> = {
  USER_REGISTERED: "ثبت‌نام کاربر جدید",
  USER_LOGIN: "ورود کاربر",
  USER_LOGOUT: "خروج کاربر",
  INSTALLER_CONTRACT_VERIFIED: "تأیید قرارداد و سفته نصاب",
  SHOP_CONTRACT_VERIFIED: "تأیید فروشگاه",
  DUPLICATE_NATIONAL_ID_ATTEMPT: "⚠️ تلاش برای ثبت کد ملی تکراری",
  SETTINGS_UPDATED: "به‌روزرسانی تنظیمات پلتفرم",
  DEMO_ADMIN_LOGIN: "ورود نمایشی مدیر",
};

function formatAuditTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** داشبورد — آمار واقعی زنده از دیتابیس + جریان واقعی Audit Log */
export function OverviewSection() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOverview()
      .then(setData)
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true" aria-label="در حال بارگذاری آمار">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-24 animate-pulse rounded-2xl border border-slate-200/80 bg-white" />
        ))}
      </div>
    );
  }

  const { stats, recentAudit } = data;

  const LIVE_STATS = [
    { id: "users", label: "کاربران ثبت‌نام‌شده", value: String(stats.users), icon: UsersRound },
    { id: "installers-active", label: "نصاب‌های فعال", value: String(stats.installersActive), icon: HardHat },
    { id: "shops-active", label: "فروشگاه‌های فعال", value: String(stats.shopsActive), icon: Store },
    { id: "orders", label: "سفارش‌ها (گام بعدی فاز ۲)", value: "۰", icon: ClipboardList },
  ];

  const PENDING_ALERTS = [
    { label: "نصاب در انتظار تأیید حضوری (قرارداد و سفته)", value: stats.installersPending },
    { label: "نصاب ناقص (مدارک ارسال نشده)", value: stats.installersIncomplete },
    { label: "فروشگاه در انتظار تأیید", value: stats.shopsPending },
    { label: "فروشگاه ناقص (مدارک ارسال نشده)", value: stats.shopsIncomplete },
    { label: "مشتری ثبت‌نام‌شده", value: stats.customers },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {LIVE_STATS.map((stat) => (
          <StatCard key={stat.id} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-brand-navy">وضعیت پرونده‌ها</h2>
          <LiveBadge />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
          {PENDING_ALERTS.map((alert) => (
            <div key={alert.label} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <p className="text-xl font-black text-brand-navy">{String(alert.value)}</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">{alert.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-brand-navy">آخرین رویدادهای واقعی سیستم (Audit Log)</h2>
          <LiveBadge />
        </div>
        {recentAudit.length === 0 ? (
          <p className="mt-4 rounded-xl bg-slate-50 p-4 text-[13px] text-slate-500">
            هنوز رویدادی ثبت نشده است. با اولین ورود یا ثبت‌نام، رویدادها اینجا زنده نمایش داده می‌شوند.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recentAudit.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slate-700">
                    {AUDIT_ACTION_FA[entry.action] ?? entry.action}
                    {entry.actorName ? (
                      <span className="font-normal text-slate-500"> — {entry.actorName}</span>
                    ) : null}
                  </p>
                  {entry.details && typeof entry.details.note === "string" ? (
                    <p className="mt-0.5 text-[11px] text-slate-400">{entry.details.note}</p>
                  ) : null}
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">{formatAuditTime(entry.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
          <DemoBadge label="Append-Only" />
          سوابق حساس فقط افزودنی هستند؛ هیچ مسیر ویرایش یا حذفی برای آن‌ها وجود ندارد.
        </p>
      </section>
    </div>
  );
}
