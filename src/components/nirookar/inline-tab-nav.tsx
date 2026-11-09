"use client";

import { CircleQuestionMark, House, Info, LineChart, type LucideIcon } from "lucide-react";

import { navigateToView, type ViewId } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface TabItem {
  view: ViewId;
  label: string;
  icon: LucideIcon;
}

const TABS: readonly TabItem[] = [
  { view: "home", label: "خانه", icon: House },
  { view: "guide", label: "راهنما", icon: CircleQuestionMark },
  { view: "status", label: "وضعیت توسعه", icon: LineChart },
  { view: "about", label: "درباره ما", icon: Info },
] as const;

interface InlineTabNavProps {
  /** نمای جاری برای هایلایت تب فعال — در صفحات داخلی (ورود/پنل/ادمین) ارسال نشود */
  current?: ViewId;
  className?: string;
}

/**
 * نوار ناوبری درون‌کارتی — نسخه 0.1.3 (طبق دستور مالک).
 *
 * برخلاف نوار ثابت پایین (fixed به window)، این نوار بخشی از جریان سند و
 * «داخل کادر/کارت اصلی برنامه» است؛ بنابراین در قاب پیش‌نمایش موبایل هم
 * هر ۴ دکمه دقیقاً داخل کادر سفید برنامه دیده می‌شوند:
 *
 *   🏠 خانه | 📖 راهنما | 📊 وضعیت توسعه | ℹ️ درباره ما
 *
 * چیدمان grid-cols-4 با gap-1، بدون سرریز افقی حتی در ۳۲۰px
 * (min-w-0 + truncate روی هر تب) و ارتفاع لمسی ≥ ۴۸px.
 * در انتهای محتوای صفحه اصلی (بالای متن نسخه) و در فوتر تمام صفحات داخلی
 * قرار می‌گیرد.
 */
export function InlineTabNav({ current, className }: InlineTabNavProps) {
  return (
    <nav
      aria-label="ناوبری درون‌کارتی"
      className={cn(
        "w-full max-w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-sm backdrop-blur",
        className,
      )}
    >
      <div className="grid w-full grid-cols-4 gap-1">
        {TABS.map(({ view, label, icon: Icon }) => {
          const active = current === view;
          return (
            <button
              key={view}
              type="button"
              onClick={() => navigateToView(view)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[48px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10.5px] font-bold transition-colors",
                active
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-slate-500 hover:bg-brand-slate-light hover:text-brand-navy",
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
              <span className="w-full truncate text-center leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
