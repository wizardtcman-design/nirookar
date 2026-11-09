"use client";

import { CircleQuestionMark, House, Info, LineChart, type LucideIcon } from "lucide-react";

import { isTabView, navigateToView, type ViewId } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface TabItem {
  view: Extract<ViewId, "home" | "guide" | "about" | "status">;
  label: string;
  icon: LucideIcon;
}

const TABS: readonly TabItem[] = [
  { view: "home", label: "خانه", icon: House },
  { view: "guide", label: "راهنما", icon: CircleQuestionMark },
  { view: "status", label: "وضعیت", icon: LineChart },
  { view: "about", label: "درباره ما", icon: Info },
] as const;

/**
 * نوار ناوبری پایین — نسخه 0.1.3 (بازسازی طبق دستور مالک).
 *
 * چیدمان Grid مساوی تمام‌عرض و چسبیده به لبه پایین صفحه:
 * - در باریک‌ترین عرض (حتی ۳۲۰px) هر چهار دکمه دقیقاً داخل کادر می‌مانند و
 *   هرگز از عرض صفحه بیرون نمی‌زنند (بدون max-width و بدون pill شناور).
 * - هر تب min-w-0 + truncate دارد تا متن هرگز سرریز افقی نسازد.
 * - ارتفاع لمسی هر تب ≥ ۵۲px (استاندارد دسترسی‌پذیری موبایل).
 * - نسخه 0.1.3: چون لینک‌های ناوبری از هدر بالا حذف شدند (دستور مالک)، این
 *   نوار اکنون در همه عرض‌ها (شامل دسکتاپ) نمایش داده می‌شود؛ روی نمایشگر
 *   بزرگ ستون‌ها به مرکز محدود می‌شوند تا ظاهر تمیز بماند.
 */
export function BottomNav({ current }: { current: ViewId }) {
  if (!isTabView(current)) return null;

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-full border-t border-slate-200 bg-white/95 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid w-full max-w-full grid-cols-4 sm:max-w-2xl sm:border-x sm:border-slate-200">
        {TABS.map(({ view, label, icon: Icon }) => {
          const active = current === view;
          return (
            <button
              key={view}
              type="button"
              onClick={() => navigateToView(view)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[52px] min-w-0 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] font-bold transition-colors",
                active ? "text-brand-navy" : "text-slate-400 hover:text-slate-600",
              )}
            >
              <Icon
                className={cn("size-5 shrink-0", active && "fill-brand-navy/10")}
                strokeWidth={active ? 2.2 : 1.8}
                aria-hidden="true"
              />
              <span className="w-full truncate text-center leading-none">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
