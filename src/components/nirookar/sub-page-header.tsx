"use client";

import { ArrowRight } from "lucide-react";

import { navigateToView } from "@/lib/navigation";

interface SubPageHeaderProps {
  title: string;
  /** در صورت عدم ارسال، بازگشت به خانه انجام می‌شود */
  onBack?: () => void;
}

/** سربرگ صفحات داخلی — دکمه بازگشت سمت چپ مطابق طرح مرجع (فلش راست = بازگشت در RTL) */
export function SubPageHeader({ title, onBack }: SubPageHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <button
        type="button"
        onClick={onBack ?? (() => navigateToView("home"))}
        aria-label="بازگشت به صفحه قبل"
        className="absolute left-3 flex size-10 items-center justify-center rounded-xl text-brand-navy transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
      >
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
      <h1 className="text-base font-extrabold text-brand-navy sm:text-lg">{title}</h1>
    </header>
  );
}
