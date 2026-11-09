"use client";

import { ArrowRight, House } from "lucide-react";

import { navigateToView } from "@/lib/navigation";

interface SubPageHeaderProps {
  title: string;
  /** در صورت عدم ارسال، بازگشت به خانه انجام می‌شود */
  onBack?: () => void;
}

/**
 * سربرگ صفحات داخلی — نسخه 0.1.3 (طبق دستور مالک):
 *
 * همیشه و در هر عرضی (حتی ۳۲۰px) دو دکمه کاملاً نمایان دارد:
 *  ۱) «→ بازگشت» بزرگ و واضح (فلش راست = بازگشت در RTL)
 *  ۲) «🏠 صفحه اصلی»
 *
 * هیچ دکمه‌ای در موبایل مخفی نمی‌شود؛ عنوان وسط با truncate فضا را مدیریت
 * می‌کند و هر دو دکمه ارتفاع لمسی ≥ ۴۴px دارند.
 */
export function SubPageHeader({ title, onBack }: SubPageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl items-center gap-2 px-3 py-2">
        <button
          type="button"
          onClick={onBack ?? (() => navigateToView("home"))}
          className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl bg-brand-navy px-3 py-2 text-[12.5px] font-extrabold text-white transition-colors hover:bg-brand-navy/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
        >
          <ArrowRight className="size-4.5" aria-hidden="true" />
          بازگشت
        </button>

        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-extrabold text-brand-navy sm:text-base">
          {title}
        </h1>

        <button
          type="button"
          onClick={() => navigateToView("home")}
          aria-label="بازگشت به صفحه اصلی"
          className="flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] font-bold text-brand-navy transition-colors hover:bg-brand-slate-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
        >
          <House className="size-4.5" aria-hidden="true" />
          <span className="truncate">صفحه اصلی</span>
        </button>
      </div>
    </header>
  );
}
