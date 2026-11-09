"use client";

import { Bell, CircleQuestionMark, Info, LineChart, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/nirookar/logo";
import { RoleCard } from "@/components/nirookar/role-card";
import { navigateToView, type ViewId } from "@/lib/navigation";
import { ROLE_REGISTRY } from "@/lib/roles";
import { APP_BUILD, APP_VERSION } from "@/lib/version";

const NOTIFICATIONS_DISABLED_MESSAGE = "اعلان‌ها در نسخه‌های بعدی فعال می‌شود";

const DESKTOP_LINKS: readonly { view: ViewId; label: string; icon: typeof Info }[] = [
  { view: "guide", label: "راهنما", icon: CircleQuestionMark },
  { view: "about", label: "درباره ما", icon: Info },
  { view: "status", label: "وضعیت توسعه", icon: LineChart },
];

/** صفحه اول اپلیکیشن — خوش‌آمد و انتخاب نقش ورود (مشتری / نصاب / فروشگاه) */
export function HomeView() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-brand-bg/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Logo />

          {/* ناوبری دسکتاپ */}
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
            <a
              href="#/admin"
              className="flex items-center gap-1.5 rounded-xl bg-brand-navy px-3.5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-brand-navy-dark"
            >
              <ShieldAlert className="size-4" aria-hidden="true" />
              پنل مدیریت
            </a>
          </nav>

          <button
            type="button"
            onClick={() => toast.info(NOTIFICATIONS_DISABLED_MESSAGE)}
            aria-label="اعلان‌ها"
            className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
          >
            <Bell className="size-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-5 pb-32">
        <div className="mx-auto mt-6 max-w-sm text-center sm:max-w-lg lg:mt-12 lg:max-w-3xl">
          <h1 className="text-[28px] font-black text-brand-navy sm:text-3xl lg:text-4xl">خوش آمدید</h1>
          <p className="mt-2 text-sm text-slate-500 lg:text-base">لطفاً نقش خود را برای ورود انتخاب کنید</p>
          <p className="mt-3 hidden text-[13px] leading-7 text-slate-500 sm:block">
            نیروکار بازارگاه چندخدمتی خدمات فنی، نصب و فروشگاه‌های مرتبط است. در فاز ۱ فقط ورود نقش‌ها فعال است
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
          نسخه پیش‌انتشار {APP_VERSION} — بیلد {APP_BUILD} — هیچ داده‌ای به سرور ارسال نمی‌شود
        </p>
      </main>
    </div>
  );
}
