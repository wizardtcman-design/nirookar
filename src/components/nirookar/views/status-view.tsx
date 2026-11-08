"use client";

import { CircleCheck, CircleMinus, CircleX, Database } from "lucide-react";

import type { BuildStatus, MatrixPhase } from "@shared/feature-matrix";
import { FEATURE_MATRIX, PHASE1_DONE, PHASE1_EXCLUDED } from "@shared/feature-matrix";

import { SubPageHeader } from "@/components/nirookar/sub-page-header";
import { HonestNotice } from "@/components/nirookar/honest-notice";
import { APP_BUILD, APP_VERSION } from "@/lib/version";

const STATUS_META: Record<BuildStatus, { label: string; className: string }> = {
  done: { label: "ساخته‌شده (فاز ۱)", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  planned: { label: "برنامه‌ریزی‌شده", className: "bg-slate-100 text-slate-600 border-slate-200" },
  backend: { label: "نیازمند Backend", className: "bg-amber-50 text-amber-700 border-amber-200" },
};

const PHASE_BADGE: Record<MatrixPhase, string> = {
  "۱": "bg-brand-teal-light text-brand-teal",
  "۲": "bg-brand-slate-light text-brand-navy",
  "۳": "bg-brand-coral-light text-brand-coral",
  "آینده": "bg-slate-100 text-slate-500",
};

/**
 * صفحه وضعیت توسعه — شفافیت کامل درباره آنچه ساخته شده، نشده و در راه است.
 * داده‌ها زنده از هسته مشترک (packages/shared) خوانده می‌شوند تا مستندات و UI
 * همیشه یک منبع حقیقت داشته باشند.
 */
export function StatusView() {
  return (
    <div className="flex min-h-screen flex-col">
      <SubPageHeader title="وضعیت توسعه" />

      <main className="flex-1 px-4 pb-32 pt-5">
        <div className="mx-auto w-full max-w-sm space-y-4 sm:max-w-2xl lg:max-w-4xl">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="text-base font-extrabold text-brand-navy">وضعیت فعلی محصول</h2>
            <p className="mt-2 text-[13px] leading-7 text-slate-600">
              نیروکار در <span className="font-bold">فاز ۱</span> است: صفحه آغازین و سه مسیر ورود (مشتری، نصاب،
              فروشگاه)، ساختار اولیه پنل مدیریت وب، اپ موبایل Expo و مستندات معماری. هیچ بخشی به سرور متصل نیست
              و هیچ قابلیتی شبیه‌سازی «فعال» نمی‌شود.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="rounded-full bg-brand-slate-light px-3 py-1 font-bold text-brand-navy">
                نسخه پیش‌انتشار {APP_VERSION}
              </span>
              <span className="rounded-full bg-brand-slate-light px-3 py-1 font-bold text-brand-navy">
                بیلد {APP_BUILD}
              </span>
              <span className="rounded-full bg-brand-slate-light px-3 py-1 font-bold text-brand-navy">
                نسخه رسمی 1.0.0 — رزروشده برای اولین انتشار عمومی
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="text-base font-extrabold text-brand-navy">در فاز ۱ ساخته شده است</h2>
            <ul className="mt-3 space-y-2">
              {PHASE1_DONE.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] leading-6 text-slate-600">
                  <CircleCheck className="mt-1 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="text-base font-extrabold text-brand-navy">عمداً در فاز ۱ ساخته نشده است</h2>
            <p className="mt-1 text-[11px] text-slate-500">فعال‌سازی هر مورد نیازمند تأیید مالک پروژه است.</p>
            <ul className="mt-3 space-y-2">
              {PHASE1_EXCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] leading-6 text-slate-600">
                  <CircleMinus className="mt-1 size-4 shrink-0 text-slate-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5">
            <h2 className="text-base font-extrabold text-brand-navy">ماتریس تطبیق امکانات</h2>
            <p className="mt-1 text-[11px] text-slate-500">
              تضمین می‌کند هیچ قابلیتی بین وب و اپ موبایل فراموش نشود — در پایان هر فاز به‌روزرسانی می‌شود.
            </p>
            <div className="scrollbar-thin mt-4 overflow-x-auto">
              <table className="w-full min-w-2xl border-collapse text-right">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-2.5 text-xs font-extrabold text-brand-navy">قابلیت</th>
                    <th className="p-2.5 text-center text-xs font-extrabold text-brand-navy">اپ</th>
                    <th className="p-2.5 text-center text-xs font-extrabold text-brand-navy">وب</th>
                    <th className="p-2.5 text-center text-xs font-extrabold text-brand-navy">فاز</th>
                    <th className="p-2.5 text-center text-xs font-extrabold text-brand-navy">وضعیت</th>
                    <th className="p-2.5 text-center text-xs font-extrabold text-brand-navy">Backend</th>
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_MATRIX.map((row) => (
                    <tr key={row.id} className="border-b border-slate-100 align-top">
                      <td className="p-2.5">
                        <span className="text-[12px] font-bold text-slate-700">{row.feature}</span>
                        {row.note ? <span className="mt-1 block text-[10px] leading-5 text-slate-400">{row.note}</span> : null}
                      </td>
                      <td className="p-2.5 text-center">
                        {row.mobile === "yes" ? (
                          <CircleCheck className="mx-auto size-4 text-emerald-600" aria-label="دارد" />
                        ) : (
                          <CircleX className="mx-auto size-4 text-slate-300" aria-label="ندارد" />
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        {row.web === "yes" ? (
                          <CircleCheck className="mx-auto size-4 text-emerald-600" aria-label="دارد" />
                        ) : (
                          <CircleX className="mx-auto size-4 text-slate-300" aria-label="ندارد" />
                        )}
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${PHASE_BADGE[row.phase]}`}>
                          فاز {row.phase}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${STATUS_META[row.status].className}`}>
                          {STATUS_META[row.status].label}
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        {row.needsBackend ? (
                          <Database className="mx-auto size-4 text-amber-600" aria-label="نیازمند Backend" />
                        ) : (
                          <span className="text-[10px] text-slate-400">سمت کاربر</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <HonestNotice
            title="محدودیت‌های شناخته‌شده"
            body="ناوبری فعلی روی مسیر «/» با hash انجام می‌شود (محدودیت محیط پیش‌نمایش) و در فاز بعد به مسیرهای واقعی Next.js با SEO کامل منتقل می‌شود. اپ موبایل کد کامل است اما ساخت APK روی GitHub Actions انجام می‌شود."
          />
        </div>
      </main>
    </div>
  );
}
