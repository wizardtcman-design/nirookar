"use client";

import { BadgeCheck, Sparkles } from "lucide-react";

import { SubPageHeader } from "@/components/nirookar/sub-page-header";
import { ROLE_REGISTRY } from "@/lib/roles";

/** دسته‌بندی‌های آینده بازارگاه — صرفاً اطلاع‌رسانی، بدون قابلیت نمایشی */
const UPCOMING_CATEGORIES = [
  "دکوراسیون داخلی و نصب",
  "نصاب‌ها و متخصصان ساختمان",
  "فروشگاه‌های محصولات ساختمانی",
  "وانت‌بار و حمل‌ونقل",
  "تعمیرات و خدمات منزل",
] as const;

/** صفحه راهنما — توضیح صادقانه وضعیت فعلی و مسیر توسعه */
export function GuideView() {
  return (
    <div className="flex min-h-screen flex-col">
      <SubPageHeader title="راهنما" />

      <main className="flex-1 px-4 pb-32 pt-5">
        <div className="mx-auto w-full max-w-sm space-y-4">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="text-base font-extrabold text-brand-navy">نیروکار چیست؟</h2>
            <p className="mt-2 text-[13px] leading-7 text-slate-600">
              نیروکار یک بازارگاه چندخدمتی برای خدمات فنی، نصب و فروشگاه‌های مرتبط است. در نسخه فعلی (فاز ۱) فقط
              صفحه ورود نقش‌ها فعال است و قابلیت‌های اصلی، مرحله‌به‌مرحله و با تأیید شما اضافه می‌شوند.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="text-base font-extrabold text-brand-navy">مسیرهای فعال فعلی</h2>
            <ul className="mt-3 space-y-2.5">
              {ROLE_REGISTRY.map((role) => (
                <li key={role.id} className="flex items-center gap-2 text-[13px] text-slate-600">
                  <BadgeCheck className="size-4 shrink-0 text-brand-teal" aria-hidden="true" />
                  <span>
                    <span className="font-bold text-brand-navy">{role.title}</span> — {role.subtitle}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="flex items-center gap-1.5 text-base font-extrabold text-brand-navy">
              <Sparkles className="size-4 text-brand-coral" aria-hidden="true" />
              دسته‌بندی‌های آینده
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {UPCOMING_CATEGORIES.map((category) => (
                <span
                  key={category}
                  className="flex items-center gap-1.5 rounded-full bg-brand-slate-light px-3 py-1.5 text-[11px] font-semibold text-slate-600"
                >
                  {category}
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold text-brand-coral shadow-sm">
                    به‌زودی
                  </span>
                </span>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
