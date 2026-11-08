"use client";

import { CircleQuestionMark, House, Info, type LucideIcon } from "lucide-react";

import { isTabView, navigateToView, type ViewId } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface TabItem {
  view: Extract<ViewId, "home" | "guide" | "about">;
  label: string;
  icon: LucideIcon;
}

const TABS: readonly TabItem[] = [
  { view: "home", label: "خانه", icon: House },
  { view: "guide", label: "راهنما", icon: CircleQuestionMark },
  { view: "about", label: "درباره ما", icon: Info },
] as const;

/** نوار ناوبری پایین — شناور، با پشتیبانی از safe-area موبایل */
export function BottomNav({ current }: { current: ViewId }) {
  if (!isTabView(current)) return null;

  return (
    <nav
      aria-label="ناوبری اصلی"
      className="fixed inset-x-0 bottom-0 z-40 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2"
    >
      <div className="mx-auto w-full max-w-md px-4 sm:max-w-lg">
        <div className="flex items-stretch justify-around rounded-3xl border border-slate-200/80 bg-white/95 py-2 shadow-lg shadow-slate-900/5 backdrop-blur">
          {TABS.map(({ view, label, icon: Icon }) => {
            const active = current === view;
            return (
              <button
                key={view}
                type="button"
                onClick={() => navigateToView(view)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] min-w-[72px] flex-col items-center justify-center gap-1 rounded-2xl px-3 text-[11px] font-semibold transition-colors",
                  active ? "text-brand-navy" : "text-slate-400 hover:text-slate-600",
                )}
              >
                <Icon
                  className={cn("size-5", active && "fill-brand-navy/10")}
                  strokeWidth={active ? 2.2 : 1.8}
                  aria-hidden="true"
                />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
