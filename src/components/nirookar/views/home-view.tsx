"use client";

import { Bell, CircleQuestionMark, Crown, Info, LayoutDashboard, LineChart, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { DemoToolbar } from "@/components/nirookar/demo-toolbar";
import { Logo } from "@/components/nirookar/logo";
import { RoleCard } from "@/components/nirookar/role-card";
import { useAuth } from "@/hooks/use-auth";
import { navigateToView, type ViewId } from "@/lib/navigation";
import { ROLE_REGISTRY } from "@/lib/roles";
import { APP_BUILD, APP_VERSION } from "@/lib/version";

const NOTIFICATIONS_DISABLED_MESSAGE = "اعلان‌ها در نسخه‌های بعدی فعال می‌شود";

/** نگاشت نقش کاربر عادی به پنل شخصی او */
const PANEL_BY_ROLE: Record<string, ViewId> = {
  customer: "panel-customer",
  installer: "panel-installer",
  shop: "panel-shop",
};

const NAV_LINKS: readonly { view: "guide" | "about" | "status"; label: string; icon: typeof Info }[] = [
  { view: "guide", label: "راهنما", icon: CircleQuestionMark },
  { view: "about", label: "درباره ما", icon: Info },
  { view: "status", label: "وضعیت توسعه", icon: LineChart },
];

/**
 * ناحیه نشست در هدر — نسخه 0.1.3 (طبق دستور مالک):
 * دکمه‌های «پنل من»، «اتاق فرمان» و «خروج» در همه عرض‌ها (حتی موبایل ۳۲۰px)
 * با برچسب متنی واضح و در قالب ردیف‌های چندخطی flex-wrap نمایان‌اند؛
 * هیچ دکمه‌ای مخفی نمی‌شود.
 */
function HeaderSession() {
  const { user, adminRole, loading, logout } = useAuth();

  if (loading) {
    return <span aria-hidden="true" className="h-9 w-20 animate-pulse rounded-xl bg-slate-100" />;
  }

  if (!user) return null;

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5">
      {adminRole ? (
        <a
          href="#/admin"
          aria-label="اتاق فرمان / مدیریت"
          className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-2 text-[12px] font-black text-amber-950 shadow-sm transition-colors hover:bg-amber-500"
        >
          <Crown className="size-4 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">اتاق فرمان</span>
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
        هدر — نسخه 0.1.3 (جراحی ریسپانسیو): یک ناوبری واحد برای همه عرض‌ها.
        در موبایل آیتم‌ها به ردیف‌های تمیز flex-wrap می‌شوند و هیچ لینک یا
        دکمه‌ای مخفی نمی‌شود (بدون hidden sm:/lg:).
      */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-brand-bg/95 shadow-sm backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-2">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <Logo />

            {/* ناوبری — لینک پنل مدیریت عمومی نیست (دستور مالک) */}
            <nav aria-label="ناوبری اصلی" className="flex min-w-0 flex-wrap items-center gap-1.5">
              {NAV_LINKS.map(({ view, label, icon: Icon }) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => navigateToView(view)}
                  className="flex min-h-[40px] items-center gap-1.5 rounded-xl px-2.5 py-2 text-[12.5px] font-bold text-slate-600 transition-colors hover:bg-white hover:text-brand-navy"
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">{label}</span>
                </button>
              ))}
              <HeaderSession />
              <button
                type="button"
                onClick={() => toast.info(NOTIFICATIONS_DISABLED_MESSAGE)}
                aria-label="اعلان‌ها"
                className="flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy"
              >
                <Bell className="size-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 pb-10">
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

        <p className="mt-10 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="size-3.5 text-brand-teal" aria-hidden="true" />
          نسخه پیش‌انتشار {APP_VERSION} — بیلد {APP_BUILD} — اتصال واقعی به پایگاه داده آزمایشی
        </p>
      </main>

      {/* ابزار نمایشی — سوییچر سریع پنل مدیریت (فقط برای تست مالک) */}
      <DemoToolbar />
    </div>
  );
}
