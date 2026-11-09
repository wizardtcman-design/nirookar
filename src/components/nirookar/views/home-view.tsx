"use client";

import { Bell, CircleQuestionMark, Crown, Info, LineChart, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { DemoToolbar } from "@/components/nirookar/demo-toolbar";
import { Logo } from "@/components/nirookar/logo";
import { RoleCard } from "@/components/nirookar/role-card";
import { useAuth } from "@/hooks/use-auth";
import { navigateToView } from "@/lib/navigation";
import { ROLE_REGISTRY } from "@/lib/roles";
import { APP_BUILD, APP_VERSION } from "@/lib/version";

const NOTIFICATIONS_DISABLED_MESSAGE = "اعلان‌ها در نسخه‌های بعدی فعال می‌شود";

const DESKTOP_LINKS: readonly { view: "guide" | "about" | "status"; label: string; icon: typeof Info }[] = [
  { view: "guide", label: "راهنما", icon: CircleQuestionMark },
  { view: "about", label: "درباره ما", icon: Info },
  { view: "status", label: "وضعیت توسعه", icon: LineChart },
];

/** ناحیه نشست در هدر — نام کاربر، خروج و دکمه طلایی «اتاق فرمان» فقط برای مدیران */
function HeaderSession() {
  const { user, adminRole, loading, logout } = useAuth();

  if (loading) {
    return <span aria-hidden="true" className="hidden h-9 w-24 animate-pulse rounded-xl bg-slate-100 lg:block" />;
  }

  if (!user) return null;

  return (
    <div className="hidden items-center gap-2 lg:flex">
      {adminRole ? (
        <a
          href="#/admin"
          className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3.5 py-2 text-[13px] font-black text-amber-950 shadow-sm transition-colors hover:bg-amber-500"
        >
          <Crown className="size-4" aria-hidden="true" />
          اتاق فرمان / مدیریت
        </a>
      ) : null}
      <span className="max-w-36 truncate rounded-xl bg-brand-slate-light px-3 py-2 text-[12px] font-bold text-brand-navy">
        {user.displayName}
      </span>
      <button
        type="button"
        onClick={() => void logout()}
        aria-label="خروج از حساب"
        className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy"
      >
        <LogOut className="size-4.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/** صفحه اول اپلیکیشن — خوش‌آمد و انتخاب نقش ورود (مشتری / نصاب / فروشگاه) */
export function HomeView() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-brand-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Logo />

          {/* ناوبری دسکتاپ — لینک پنل مدیریت عمومی نیست (دستور مالک) */}
          <nav aria-label="ناوبری اصلی" className="hidden items-center gap-1 lg:flex">
            {DESKTOP_LINKS.map(({ view, label, icon: Icon }) => (
              <button
                key={view}
                type="button"
                onClick={() => navigateToView(view)}
                className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-bold text-slate-600 transition-colors hover:bg-white hover:text-brand-navy"
              >
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </button>
            ))}
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-slate-200" />
            <HeaderSession />
          </nav>

          {/* نشست در موبایل: فقط دکمه طلایی مدیر */}
          <div className="flex items-center gap-2 lg:hidden">
            <MobileSession />
            <button
              type="button"
              onClick={() => toast.info(NOTIFICATIONS_DISABLED_MESSAGE)}
              aria-label="اعلان‌ها"
              className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy"
            >
              <Bell className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-5 pb-32">
        <div className="mx-auto mt-6 max-w-sm text-center sm:max-w-lg lg:mt-12 lg:max-w-3xl">
          <h1 className="text-[28px] font-black text-brand-navy sm:text-3xl lg:text-4xl">خوش آمدید</h1>
          <p className="mt-2 text-sm text-slate-500 lg:text-base">لطفاً نقش خود را برای ورود انتخاب کنید</p>
          <p className="mt-3 hidden text-[13px] leading-7 text-slate-500 sm:block">
            نیروکار بازارگاه چندخدمتی خدمات فنی، نصب و فروشگاه‌های مرتبط است. ورود با کد تأیید (OTP) انجام می‌شود
            و قابلیت‌های اصلی مرحله‌به‌مرحله و با تأیید مالک پروژه اضافه می‌شوند.
          </p>
        </div>

        {/* کارت‌های نقش: موبایل ستونی (مانند قبل)، دسکتاپ سه‌ستونه */}
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

function MobileSession() {
  const { user, adminRole, loading, logout } = useAuth();

  if (loading || !user) return null;

  return (
    <div className="flex items-center gap-1.5">
      {adminRole ? (
        <a
          href="#/admin"
          aria-label="اتاق فرمان / مدیریت"
          className="flex size-10 items-center justify-center rounded-xl bg-amber-400 text-amber-950 shadow-sm transition-colors hover:bg-amber-500"
        >
          <Crown className="size-5" aria-hidden="true" />
        </a>
      ) : null}
      <button
        type="button"
        onClick={() => void logout()}
        aria-label="خروج از حساب"
        className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy"
      >
        <LogOut className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
