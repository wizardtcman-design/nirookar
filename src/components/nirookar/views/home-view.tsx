"use client";

import { ShieldCheck } from "lucide-react";

import { DemoToolbar } from "@/components/nirookar/demo-toolbar";
import { RoleCard } from "@/components/nirookar/role-card";
import { navigateToView } from "@/lib/navigation";
import { ROLE_REGISTRY } from "@/lib/roles";
import { APP_BUILD, APP_BUILD_NOTE, APP_VERSION } from "@/lib/version";

/**
 * صفحه اول اپلیکیشن — خوش‌آمد و انتخاب نقش ورود (مشتری / نصاب / فروشگاه).
 *
 * بیلد 005: هدر و نوار ناوبری به «پوسته اپلیکیشن» (App Shell در page.tsx)
 * منتقل شدند؛ این نما فقط محتوای صفحه است و داخل main اسکرول‌شونده رندر
 * می‌شود. نوار درون‌کارتی تکراری (InlineTabNav) طبق دستور مالک حذف شد.
 */
export function HomeView() {
  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-lg lg:max-w-3xl">
      <div className="mt-4 text-center lg:mt-8">
        <h1 className="text-[28px] font-black text-brand-navy sm:text-3xl lg:text-4xl">خوش آمدید</h1>
        <p className="mt-2 text-sm text-slate-500 lg:text-base">لطفاً نقش خود را برای ورود انتخاب کنید</p>
        <p className="mt-3 text-[13px] leading-7 text-slate-500">
          نیروکار بازارگاه چندخدمتی خدمات فنی، نصب و فروشگاه‌های مرتبط است. ورود با شماره موبایل و رمز عبور انجام
          می‌شود (یا کد تأیید در صورت فعال بودن از پنل مدیریت) و قابلیت‌های اصلی مرحله‌به‌مرحله و با تأیید مالک
          پروژه اضافه می‌شوند.
        </p>
      </div>

      {/* کارت‌های نقش: موبایل ستونی، دسکتاپ سه‌ستونه */}
      <div className="mt-8 grid w-full gap-4 lg:mt-10 lg:grid-cols-3 lg:gap-6">
        {ROLE_REGISTRY.map((role) => (
          <RoleCard key={role.id} role={role} onClick={() => navigateToView(`login-${role.id}`)} />
        ))}
      </div>

      <p className="mt-10 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="size-3.5 text-brand-teal" aria-hidden="true" />
        نسخه پیش‌انتشار {APP_VERSION} — بیلد {APP_BUILD} ({APP_BUILD_NOTE})
      </p>

      {/* ابزار نمایشی — سوییچر سریع پنل مدیریت (فقط برای تست مالک) */}
      <DemoToolbar />
    </div>
  );
}
