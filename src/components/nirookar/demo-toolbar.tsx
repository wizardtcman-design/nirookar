"use client";

import { Crown, FlaskConical, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { AdminRole } from "@shared/admin-rbac";

import { useAuth } from "@/hooks/use-auth";
import { navigateToView } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface DemoAccount {
  phone: string;
  role: AdminRole;
  title: string;
  description: string;
}

/**
 * نوار ابزار نمایشی (Demo) — طبق دستور مالک حفظ شده تا تست پنل مدیریت راحت باشد.
 * سوییچر سریع با ورود خودکار OTP آزمایشی به حساب‌های Sandbox ادمین کار می‌کند.
 * فقط وقتی حالت نمایشی سرور فعال باشد بارگذاری می‌شود (در استقرار عملیاتی ۴۰۴ می‌دهد).
 */
export function DemoToolbar() {
  const { setUser } = useAuth();
  const [accounts, setAccounts] = useState<DemoAccount[] | null>(null);
  const [open, setOpen] = useState(false);
  const [busyRole, setBusyRole] = useState<AdminRole | null>(null);

  useEffect(() => {
    fetch("/api/admin/demo")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { ok: boolean; accounts?: DemoAccount[] } | null) => {
        if (data?.ok && Array.isArray(data.accounts)) setAccounts(data.accounts);
      })
      .catch(() => undefined);
  }, []);

  if (!accounts || accounts.length === 0) return null;

  async function quickLogin(role: AdminRole) {
    setBusyRole(role);
    try {
      const response = await fetch("/api/admin/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = (await response.json()) as { ok: boolean; user?: { id: string; role: AdminRole; displayName: string; profileStatus: "ACTIVE" }; error?: string };
      if (!data.ok || !data.user) {
        toast.error(data.error ?? "ورود نمایشی ناموفق بود");
        return;
      }
      setUser(data.user);
      toast.info(`ورود نمایشی به عنوان «${data.user.displayName}»`);
      navigateToView("admin");
    } finally {
      setBusyRole(null);
    }
  }

  return (
    // موقعیت: بالای نوار ناوبری پایین موبایل (بدون تداخل)؛ در دسکتاپ پایین-چپ
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] left-3 z-40 lg:bottom-6">

      {open ? (
        <div className="mb-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[12px] font-extrabold text-brand-navy">سوییچر سریع پنل مدیریت</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="بستن ابزار نمایشی"
              className="flex size-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1 text-[10px] leading-4 text-amber-700">نمایشی — فقط برای تست راحت مالک پروژه</p>
          <div className="mt-2 space-y-1.5">
            {accounts.map((account) => (
              <button
                key={account.role}
                type="button"
                disabled={busyRole !== null}
                onClick={() => void quickLogin(account.role)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-right transition-colors hover:border-amber-300 hover:bg-amber-50",
                  busyRole === account.role && "opacity-60",
                )}
              >
                <span className="text-[12px] font-bold text-slate-700">{account.title}</span>
                <Crown className="size-3.5 text-amber-500" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="ابزار نمایشی"
        className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/95 text-slate-400 shadow-md backdrop-blur transition-colors hover:border-amber-300 hover:text-amber-500"
      >
        <FlaskConical className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}
