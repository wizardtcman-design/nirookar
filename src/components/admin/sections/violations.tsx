"use client";

import { DemoBadge, SectionBanner, StatusChip } from "@/components/admin/parts";
import { DEMO_VIOLATIONS } from "@/lib/admin-demo-data";

/** شکایات و تخلفات — نمونه طراحی جریان رسیدگی (کاملاً نمایشی) */
export function ViolationsSection() {
  return (
    <div className="space-y-5">
      <SectionBanner extra="سیستم عملیاتی رسیدگی به شکایت و جبران خسارت، بدون بررسی و تأیید مالک ساخته نمی‌شود." />

      <div className="grid gap-4 lg:grid-cols-2">
        {DEMO_VIOLATIONS.map((violation) => (
          <article key={violation.id} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-extrabold text-brand-navy">{violation.title}</h2>
              <StatusChip tone={violation.statusTone}>{violation.status}</StatusChip>
            </div>
            <p className="mt-2 text-[11px] text-slate-400" dir="ltr">
              {violation.id}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-slate-400">شاکی</dt>
                <dd className="mt-0.5 font-bold text-brand-navy">{violation.complainant}</dd>
              </div>
              <div>
                <dt className="text-slate-400">خوانده</dt>
                <dd className="mt-0.5 font-bold text-brand-navy">{violation.respondent}</dd>
              </div>
              <div>
                <dt className="text-slate-400">مبلغ ادعا</dt>
                <dd className="mt-0.5 font-bold text-brand-navy">{violation.amount}</dd>
              </div>
            </dl>
            <p className="mt-3 rounded-xl bg-slate-50 p-3 text-[11px] leading-6 text-slate-600">{violation.summary}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-brand-navy">چارچوب رسیدگی (طراحی آینده)</h2>
          <DemoBadge label="طراحی — غیرعملیاتی" />
        </div>
        <ol className="mt-3 list-decimal space-y-1.5 pr-5 text-xs leading-6 text-slate-600">
          <li>ثبت و مستندسازی شکایت همراه با مدارک و شواهد</li>
          <li>بررسی مسئولیت طرفین بر اساس قراردادها و تعهدات</li>
          <li>اولویت با رسیدگی منصفانه و جبران خسارت مشتری</li>
          <li>تعیین سازوکار جبران و ضمانت اجرای متناسب (جریمه یا محدودیت)</li>
          <li>بررسی امکان بیمه یا ضمانت معتبر — چک یا سفته به‌تنهایی تضمین کافی نیست</li>
          <li>هر سازوکار حقوقی/مالی نهایی فقط پس از بررسی و تأیید مالک پروژه</li>
        </ol>
      </div>
    </div>
  );
}
