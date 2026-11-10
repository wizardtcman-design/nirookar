"use client";

import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/use-auth";
import { navigateToView } from "@/lib/navigation";

interface PanelHeaderProps {
  title: string;
}

/**
 * سربرگ پنل شخصی کاربر (نصاب/فروشگاه/مشتری) — بیلد 005 (دستور مالک):
 *
 * دکمه‌های «بازگشت» و «صفحه اصلی» که با هدر ثابت پوسته تکرار شده بودند حذف
 * شدند؛ بازگشت همیشه در نوار بالای صفحه در دسترس است. این بخش فقط عنوان پنل
 * و ردیف کاربر (نام + خروج واقعی) را نشان می‌دهد.
 *
 * خروج واقعی: نشست سمت سرور از بین می‌رود و کاربر به خانه برمی‌گردد.
 */
export function PanelHeader({ title }: PanelHeaderProps) {
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    toast.info("از حساب خود خارج شدید");
    navigateToView("home");
  }

  return (
    <div className="mb-4 space-y-3">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-brand-teal" />
        <h1 className="min-w-0 truncate text-xl font-black text-brand-navy sm:text-2xl">{title}</h1>
      </div>

      {user ? (
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3 py-2 shadow-sm">
          <span className="min-w-0 flex-1 truncate text-[12.5px] font-bold text-brand-navy">
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
