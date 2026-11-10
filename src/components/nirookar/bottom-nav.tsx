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
  { view: "status", label: "وضعیت", icon: LineChart },
  { view: "about", label: "درباره ما", icon: Info },
] as const;

/**
 * نوار ناوبری پایین — تنها نوار ناوبری کل اپلیکیشن (بیلد 005 — دستور مالک).
 *
 * طبق دستور صریح مالک:
 *  - در «تمام نماها» (موبایل و دسکتاپ و همه صفحات شامل ورود، پنل‌ها و مدیریت)
 *    کاملاً به پایین صفحه چسبیده و ثابت است (fixed + z-50) و با اسکرول جابه‌جا
 *    نمی‌شود.
 *  - محتوای صفحات داخل «main» اسکرول می‌شود و از پشت/زیر این نوار رد می‌شود؛
 *    padding پایین main (pb-32) تضمین می‌کند آخرین خط متن هرگز پشت نوار پنهان
 *    نماند.
 *  - چیدمان Grid مساوی ۴ ستونه: حتی در ۳۲۰px هر چهار دکمه دقیقاً داخل کادر
 *    می‌مانند (min-w-0 + truncate) و ارتفاع لمسی هر تب ۶۴px است.
 *  - در تمام پروژه فقط همین «یک» نوار ناوبری وجود دارد (InlineTabNav حذف شد).
 */
export function BottomNav({ current }: { current: ViewId }) {
  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed bottom-0 left-0 right-0 z-50 w-full max-w-full border-t border-slate-200 bg-white/95 shadow-[0_-4px_16px_rgba(15,23,42,0.1)] backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto grid w-full max-w-md grid-cols-4 px-1">
        {TABS.map(({ view, label, icon: Icon }) => {
          const active = current === view;
          return (
            <button
              key={view}
              type="button"
              onClick={() => navigateToView(view)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[11px] font-bold transition-colors",
                active
                  ? "bg-brand-slate-light text-brand-navy"
                  : "text-slate-400 hover:bg-slate-50 hover:text-slate-600",
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
