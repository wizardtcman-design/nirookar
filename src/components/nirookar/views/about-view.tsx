"use client";

import { Info } from "lucide-react";

import { LogoMark } from "@/components/nirookar/logo";
import { InlineTabNav } from "@/components/nirookar/inline-tab-nav";
import { SubPageHeader } from "@/components/nirookar/sub-page-header";
import { APP_BUILD, APP_PHASE_LABEL, APP_PLATFORMS, APP_VERSION, OFFICIAL_FIRST_VERSION } from "@/lib/version";

const ABOUT_ROWS = [
  { label: "نسخه محصول (پیش‌انتشار)", value: APP_VERSION, ltr: true },
  { label: "شماره Build", value: APP_BUILD, ltr: true },
  { label: "نسخه رسمی (رزروشده)", value: OFFICIAL_FIRST_VERSION, ltr: true },
  { label: "فاز جاری", value: APP_PHASE_LABEL, ltr: false },
  { label: "پلتفرم‌ها", value: APP_PLATFORMS, ltr: false },
] as const;

/** صفحه درباره ما — شفاف درباره وضعیت نسخه و مسیر توسعه */
export function AboutView() {
  return (
    <div className="flex min-h-screen flex-col">
      <SubPageHeader title="درباره ما" />

      <main className="flex-1 px-4 pb-32 pt-6">
        <div className="mx-auto w-full max-w-sm space-y-4 sm:max-w-xl lg:max-w-3xl">
          <section className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white p-6 text-center">
            <LogoMark className="size-16 rounded-3xl text-2xl" />
            <h2 className="mt-3 text-xl font-black text-brand-navy">نیروکار</h2>
            <p className="mt-1 text-xs text-slate-500">بازار خدمات فنی و نصب</p>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <p className="text-[13px] leading-7 text-slate-600">
              نیروکار با رویکرد ماژولار و توسعه‌پذیر ساخته می‌شود تا در آینده نقش‌ها و دسته‌بندی‌های خدمات جدید،
              بدون بازنویسی ساختار اصلی به آن اضافه شوند. این نسخه، نسخه اولیه محصول است و هنوز به سرور متصل نیست.
            </p>
          </section>

          <section className="divide-y divide-slate-100 rounded-2xl border border-slate-200/80 bg-white">
            {ABOUT_ROWS.map(({ label, value, ltr }) => (
              <div key={label} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-[13px] font-bold text-brand-navy">{label}</span>
                <span className="text-[13px] text-slate-600" dir={ltr ? "ltr" : undefined}>
                  {value}
                </span>
              </div>
            ))}
          </section>

          <p className="flex items-center justify-center gap-1.5 pb-2 text-[11px] text-slate-400">
            <Info className="size-3.5" aria-hidden="true" />
            این صفحه بخشی از نسخه اولیه (فاز ۱) است.
          </p>

          {/* نوار ناوبری درون‌کارتی — فوتر صفحه (دستور مالک: همیشه داخل کادر برنامه) */}
          <InlineTabNav current="about" className="mt-4" />
        </div>
      </main>
    </div>
  );
}
