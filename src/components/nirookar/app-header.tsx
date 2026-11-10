"use client";

import { ArrowRight, Crown, LayoutDashboard, LogOut } from "lucide-react";

import { CompactLogo } from "@/components/nirookar/logo";
import { useAuth } from "@/hooks/use-auth";
import { goBackOrHome, navigateToView, type ViewId } from "@/lib/navigation";

/** نگاشت نقش کاربر عادی به پنل شخصی او */
const PANEL_BY_ROLE: Record<string, ViewId> = {
  customer: "panel-customer",
  installer: "panel-installer",
  shop: "panel-shop",
};

/**
 * ناحیه نشست در هدر صفحه اصلی — «پنل من» / «👑 مدیریت» و «خروج».
 * در همه عرض‌ها (حتی ۳۲۰px) داخل کادر می‌ماند (flex-wrap، بدون هیچ دکمه مخفی).
 */
function HeaderSession() {
  const { user, adminRole, loading, logout } = useAuth();

  if (loading) {
    return <span aria-hidden="true" className="h-9 w-20 animate-pulse rounded-xl bg-slate-100" />;
  }

  if (!user) return null;

  return (
    <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
      {adminRole ? (
        <a
          href="#/admin"
          aria-label="اتاق فرمان / مدیریت"
          className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-[12px] font-black text-amber-950 shadow-sm transition-colors hover:bg-amber-500"
        >
          <Crown className="size-4 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">مدیریت</span>
        </a>
      ) : PANEL_BY_ROLE[user.role] ? (
        <button
          type="button"
          onClick={() => navigateToView(PANEL_BY_ROLE[user.role])}
          className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-brand-teal/30 bg-brand-teal-light px-3 py-2 text-[12px] font-black text-brand-teal transition-colors hover:bg-brand-teal/15"
        >
          <LayoutDashboard className="size-4 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">پنل من</span>
        </button>
      ) : null}
      <span className="min-w-0 max-w-32 truncate rounded-xl bg-brand-slate-light px-2.5 py-2 text-[11.5px] font-bold text-brand-navy">
        {user.displayName}
      </span>
      <button
        type="button"
        onClick={() => void logout()}
        className="flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[12px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
      >
        <LogOut className="size-4 shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap">خروج</span>
      </button>
    </div>
  );
}

interface AppHeaderProps {
  current: ViewId;
}

/**
 * هدر ثابت بالای پوسته اپلیکیشن (App Shell) — نسخه 0.1.3 بیلد 005 (دستور مالک):
 *
 *  - سمت راست: لوگو + نام «نیروکار» — همیشه ثابت، واضح و داخل کادر (shrink-0)
 *    و هرگز با تغییر سایز یا اسکرول از صفحه بیرون نمی‌زند.
 *  - سمت چپ: در «تمام صفحات غیر از خانه» دکمه درشت و خوانای «→ بازگشت» که با
 *    کلیک به صفحه قبلی برمی‌گردد (history.back با fallback به خانه)؛ در صفحه
 *    اصلی فقط دکمه‌های وضعیت کاربر (پنل من / 👑 مدیریت / خروج).
 *
 * هدر بخشی از ستون flex پوسته است (shrink-0)؛ محتوای وسط داخل «main» اسکرول
 * می‌شود و از زیر هدر رد می‌شود — هدر هرگز با اسکرول جابه‌جا نمی‌شود.
 */
export function AppHeader({ current }: AppHeaderProps) {
  const isHome = current === "home";

  return (
    <header className="z-40 flex min-h-14 w-full shrink-0 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b border-slate-200 bg-white px-3 py-1.5 shadow-sm sm:px-4">
      <a href="#/" aria-label="نیروکار — صفحه اصلی" className="shrink-0">
        <CompactLogo />
      </a>

      <div className="flex min-w-0 items-center justify-end gap-1.5">
        {isHome ? (
          <HeaderSession />
        ) : (
          <button
            type="button"
            onClick={goBackOrHome}
            className="flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-xl bg-brand-navy px-3 py-2 text-[12.5px] font-extrabold text-white shadow-sm transition-colors hover:bg-brand-navy/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
          >
            <ArrowRight className="size-4.5" aria-hidden="true" />
            بازگشت
          </button>
        )}
      </div>
    </header>
  );
}
