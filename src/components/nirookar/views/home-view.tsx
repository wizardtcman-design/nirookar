"use client";

import { Crown, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";

import { DemoToolbar } from "@/components/nirookar/demo-toolbar";
import { InlineTabNav } from "@/components/nirookar/inline-tab-nav";
import { CompactLogo } from "@/components/nirookar/logo";
import { RoleCard } from "@/components/nirookar/role-card";
import { useAuth } from "@/hooks/use-auth";
import { navigateToView, type ViewId } from "@/lib/navigation";
import { ROLE_REGISTRY } from "@/lib/roles";
import { APP_BUILD, APP_BUILD_NOTE, APP_VERSION } from "@/lib/version";

/** نگاشت نقش کاربر عادی به پنل شخصی او */
const PANEL_BY_ROLE: Record<string, ViewId> = {
  customer: "panel-customer",
  installer: "panel-installer",
  shop: "panel-shop",
};

/**
 * ناحیه نشست در هدر — نسخه 0.1.3 (طبق دستور مالک):
 * فقط «پنل من» / «👑 مدیریت» و «خروج» با برچسب متنی واضح؛
 * در همه عرض‌ها (حتی ۳۲۰px) داخل کادر می‌مانند (flex-wrap).
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

/** صفحه اول اپلیکیشن — خوش‌آمد و انتخاب نقش ورود (مشتری / نصاب / فروشگاه) */
export function HomeView() {
  return (
    <div className="flex min-h-screen flex-col">
      {/*
        هدر — نسخه 0.1.3 (طبق دستور مالک): لینک‌های راهنما/درباره ما/وضعیت و
        زنگوله به‌طور کامل حذف شدند (تکراری با نوار پایین و عامل بیرون‌زدگی در
        قاب موبایل). در هدر فقط لوگوی فشرده و دکمه‌های وضعیت کاربر است.
      */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-brand-bg/95 shadow-sm backdrop-blur">
        <div className="flex w-full max-w-full items-center justify-between gap-2 overflow-hidden px-3 py-2">
          <CompactLogo />
          <HeaderSession />
        </div>
      </header>

      {/* pb-20: نوار درون‌کارتی و متن نسخه همیشه بالای نوار ثابت پایین می‌مانند */}
      <main className="flex-1 px-5 pb-20">
        <div className="mx-auto mt-6 max-w-sm text-center sm:max-w-lg lg:mt-12 lg:max-w-3xl">
          <h1 className="text-[28px] font-black text-brand-navy sm:text-3xl lg:text-4xl">خوش آمدید</h1>
          <p className="mt-2 text-sm text-slate-500 lg:text-base">لطفاً نقش خود را برای ورود انتخاب کنید</p>
          <p className="mt-3 text-[13px] leading-7 text-slate-500">
            نیروکار بازارگاه چندخدمتی خدمات فنی، نصب و فروشگاه‌های مرتبط است. ورود با شماره موبایل و رمز عبور انجام
            می‌شود (یا کد تأیید در صورت فعال بودن از پنل مدیریت) و قابلیت‌های اصلی مرحله‌به‌مرحله و با تأیید مالک
            پروژه اضافه می‌شوند.
          </p>
        </div>

        {/* کارت‌های نقش: موبایل ستونی، دسکتاپ سه‌ستونه */}
        <div className="mx-auto mt-8 grid w-full max-w-sm gap-4 sm:max-w-lg lg:mt-10 lg:max-w-5xl lg:grid-cols-3 lg:gap-6">
          {ROLE_REGISTRY.map((role) => (
            <RoleCard key={role.id} role={role} onClick={() => navigateToView(`login-${role.id}`)} />
          ))}
        </div>

        {/*
          نوار ناوبری درون‌کارتی — نسخه 0.1.3 (دستور مالک):
          علاوه بر نوار ثابت پایین، هر ۴ دکمه ناوبری مستقیماً داخل کارت اصلی و
          بالای متن نسخه قرار می‌گیرد تا در قاب پیش‌نمایش موبایل هم بدون اسکرول
          بیرون از کادر دیده شوند.
        */}
        <InlineTabNav current="home" className="mx-auto mt-10 max-w-sm sm:max-w-lg lg:max-w-3xl" />

        <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="size-3.5 text-brand-teal" aria-hidden="true" />
          نسخه پیش‌انتشار {APP_VERSION} — بیلد {APP_BUILD} ({APP_BUILD_NOTE})
        </p>
      </main>

      {/* ابزار نمایشی — سوییچر سریع پنل مدیریت (فقط برای تست مالک) */}
      <DemoToolbar />
    </div>
  );
}
