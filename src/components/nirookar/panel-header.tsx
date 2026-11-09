"use client";

import { ArrowRight, House, LogOut } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { navigateToView } from "@/lib/navigation";

interface PanelHeaderProps {
  title: string;
  /** در صورت عدم ارسال، بازگشت به خانه انجام می‌شود */
  onBack?: () => void;
}

/**
 * سربرگ پنل شخصی کاربر (نصاب/فروشگاه/مشتری) — نسخه 0.1.3 (طبق دستور مالک):
 *
 * چیدمان دو ردیفی تمیز که در هر عرضی (حتی ۳۲۰px) همه دکمه‌ها نمایان‌اند:
 *  - ردیف ۱: «→ بازگشت» + عنوان + «🏠 صفحه اصلی»
 *  - ردیف ۲: نام کاربر + «خروج»
 *
 * خروج واقعی: نشست سمت سرور از بین می‌رود و کاربر به خانه برمی‌گردد.
 * هیچ دکمه‌ای در موبایل مخفی نمی‌شود (بدون کلاس‌های hidden sm:/md:).
 */
export function PanelHeader({ title, onBack }: PanelHeaderProps) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    toast.info("از حساب خود خارج شدید");
    navigateToView("home");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto w-full max-w-4xl px-3 py-2">
        <div className="flex items-center gap-2">
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

        {user ? (
          <div className="mt-2 flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate rounded-lg bg-brand-slate-light px-2.5 py-1.5 text-[11px] font-bold text-brand-navy">
              {user.displayName}
            </span>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11.5px] font-extrabold text-rose-600 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
            >
              <LogOut className="size-4" aria-hidden="true" />
              خروج
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

/** چیپ وضعیت پرونده در پنل شخصی */
export function ProfileStatusChip({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    INCOMPLETE: { label: "ناقص — مدارک ارسال نشده", className: "border-rose-200 bg-rose-50 text-rose-700" },
    PENDING_VERIFICATION: { label: "در انتظار تأیید حضوری", className: "border-amber-200 bg-amber-50 text-amber-700" },
    ACTIVE: { label: "فعال و تأیید شده", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
    REJECTED: { label: "رد شده", className: "border-rose-200 bg-rose-50 text-rose-700" },
  };
  const entry = map[status] ?? map.INCOMPLETE;
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${entry.className}`}>
      {entry.label}
    </span>
  );
}
