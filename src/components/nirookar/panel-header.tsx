"use client";

import { ArrowRight, LogOut } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { navigateToView } from "@/lib/navigation";

interface PanelHeaderProps {
  title: string;
  /** در صورت عدم ارسال، بازگشت به خانه انجام می‌شود */
  onBack?: () => void;
}

/**
 * سربرگ پنل شخصی کاربر (نصاب/فروشگاه/مشتری) — دکمه بازگشت + نام کاربر + خروج.
 * خروج واقعی: نشست سمت سرور از بین می‌رود و کاربر به خانه برمی‌گردد.
 */
export function PanelHeader({ title, onBack }: PanelHeaderProps) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    toast.info("از حساب خود خارج شدید");
    navigateToView("home");
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-slate-200/70 bg-white/90 px-3 backdrop-blur">
      <button
        type="button"
        onClick={onBack ?? (() => navigateToView("home"))}
        aria-label="بازگشت به صفحه قبل"
        className="absolute left-3 flex size-10 items-center justify-center rounded-xl text-brand-navy transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
      >
        <ArrowRight className="size-5" aria-hidden="true" />
      </button>
      <h1 className="text-base font-extrabold text-brand-navy sm:text-lg">{title}</h1>
      <div className="absolute right-3 flex items-center gap-1.5">
        {user ? (
          <span className="hidden max-w-32 truncate rounded-lg bg-brand-slate-light px-2.5 py-1.5 text-[11px] font-bold text-brand-navy sm:block">
            {user.displayName}
          </span>
        ) : null}
        <button
          type="button"
          onClick={() => void handleLogout()}
          aria-label="خروج از حساب"
          className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy"
        >
          <LogOut className="size-4.5" aria-hidden="true" />
        </button>
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
