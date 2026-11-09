"use client";

import { Crown, FlaskConical, LogIn, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";

import type { AdminRole } from "@shared/admin-rbac";
import { normalizeDigits } from "@shared/validation";

import { useAuth } from "@/hooks/use-auth";
import { AppTextField } from "@/components/nirookar/app-text-field";
import { LogoMark } from "@/components/nirookar/logo";
import { PrimaryButton } from "@/components/nirookar/primary-button";
import { authRepository } from "@/services";
import { cn } from "@/lib/utils";

interface DemoAccount {
  phone: string;
  role: AdminRole;
  title: string;
  description: string;
}

/**
 * صفحه ورود پنل مدیریت — فاز ۲ گام ۱: ورود واقعی با OTP (کد آزمایشی 12345).
 *
 * هر مدیر با شماره موبایل خودش وارد می‌شود؛ اگر شماره دسترسی مدیریتی نداشته
 * باشد، پیام صادقانه نمایش داده می‌شود. سوییچر سریع نمایشی (طبق دستور مالک)
 * برای تست راحت نقش‌ها حفظ شده است.
 */
export function AdminLogin() {
  const { setUser } = useAuth();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);

  useEffect(() => {
    fetch("/api/admin/demo")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { ok: boolean; accounts?: DemoAccount[] } | null) => {
        if (data?.ok && Array.isArray(data.accounts)) setDemoAccounts(data.accounts);
      })
      .catch(() => undefined);
  }, []);

  async function handleRequestCode(event?: FormEvent) {
    event?.preventDefault();
    const value = normalizeDigits(phone).replace(/[\s-]/g, "").trim();
    if (!/^09\d{9}$/.test(value)) {
      setError("شماره موبایل معتبر نیست (مثال: 09123456789)");
      return;
    }
    setPhone(value);
    setSubmitting(true);
    setError(null);
    try {
      const result = await authRepository.requestOtp(value);
      setDevCode(result.devCode);
      setStep("otp");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "خطای نامشخص");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(event: FormEvent) {
    event.preventDefault();
    const code = normalizeDigits(otp).replace(/\D/g, "");
    if (!code) {
      setError("کد تأیید را وارد کنید");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await authRepository.verifyOtp(phone, code);
      if (result.isNew) {
        setError("این شماره در سیستم ثبت نشده است؛ دسترسی مدیریتی فقط با حساب‌های تعریف‌شده امکان‌پذیر است.");
        return;
      }
      const role = result.user.role;
      if (!["super_admin", "ops_manager", "finance_manager", "support_specialist", "auditor"].includes(role)) {
        setError(`حساب «${result.user.displayName}» دسترسی مدیریتی ندارد. این پنل فقط برای مدیران پلتفرم است.`);
        return;
      }
      setUser(result.user);
      toast.success("ورود موفق به پنل مدیریت");
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "خطای نامشخص");
    } finally {
      setSubmitting(false);
    }
  }

  async function demoLogin(role: AdminRole) {
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        user?: { id: string; role: AdminRole; displayName: string; profileStatus: "ACTIVE" };
        error?: string;
      };
      if (!data.ok || !data.user) {
        setError(data.error ?? "ورود نمایشی ناموفق بود");
        return;
      }
      setUser(data.user);
      toast.info(`ورود نمایشی به عنوان «${data.user.displayName}»`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy-dark px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="size-14 rounded-2xl text-2xl" />
          <h1 className="mt-3 text-2xl font-black text-white">پنل مدیریت نیروکار</h1>
          <p className="mt-1 text-xs text-slate-400">کنترل مرکزی کاربران، فروشگاه‌ها، نصاب‌ها، مالی و گزارش‌ها</p>
        </div>

        <form
          onSubmit={step === "phone" ? handleRequestCode : handleVerify}
          noValidate
          className="rounded-3xl bg-brand-navy p-6 shadow-lg shadow-black/30"
        >
          <div role="status" className="flex items-start gap-2.5 rounded-xl border border-sky-400/30 bg-sky-400/10 p-3.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sky-300" aria-hidden="true" />
            <p className="text-xs leading-6 text-sky-200">
              <span className="font-extrabold">ورود امن با کد تأیید: </span>
              دسترسی فقط برای نقش‌های مدیریتی تعریف‌شده باز می‌شود و هر عملیات حساس در Audit Log ثبت می‌گردد.
              {devCode ? (
                <>
                  {" "}
                  <span className="font-extrabold">کد آزمایشی (Sandbox):</span>{" "}
                  <span dir="ltr" className="rounded-md bg-black/30 px-2 py-0.5 font-mono text-[13px] font-black tracking-widest text-sky-300">
                    {devCode}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          {step === "phone" ? (
            <div className="mt-5 space-y-4">
              <AppTextField
                id="admin-phone"
                name="phone"
                label="شماره موبایل مدیر"
                placeholder="09xxxxxxxxx"
                icon={Smartphone}
                inputMode="tel"
                autoComplete="tel"
                tone="onDark"
                value={phone}
                onChange={(value) => {
                  setPhone(value);
                  setError(null);
                }}
                error={error ?? undefined}
              />
              <PrimaryButton type="submit" disabled={submitting}>
                <span className="flex items-center gap-2">
                  <LogIn className="size-5" aria-hidden="true" />
                  {submitting ? "در حال ارسال..." : "دریافت کد تأیید"}
                </span>
              </PrimaryButton>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              <AppTextField
                id="admin-otp"
                name="otp"
                label="کد تأیید"
                placeholder="-----"
                inputMode="numeric"
                autoComplete="one-time-code"
                tone="onDark"
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setError(null);
                }}
                error={error ?? undefined}
              />
              <PrimaryButton type="submit" disabled={submitting}>
                <span className="flex items-center gap-2">
                  <LogIn className="size-5" aria-hidden="true" />
                  {submitting ? "در حال بررسی..." : "ورود به پنل مدیریت"}
                </span>
              </PrimaryButton>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setError(null);
                }}
                className="w-full text-center text-[12px] font-semibold text-slate-300 transition-opacity hover:opacity-75"
              >
                اصلاح شماره موبایل یا ارسال دوباره کد
              </button>
            </div>
          )}

          {demoAccounts.length > 0 ? (
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center gap-1.5">
                <FlaskConical className="size-3.5 text-amber-300" aria-hidden="true" />
                <p className="text-[11px] font-bold text-amber-200">سوییچر سریع نمایشی (برای تست راحت مالک)</p>
              </div>
              <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.role}
                    type="button"
                    disabled={submitting}
                    onClick={() => void demoLogin(account.role)}
                    className={cn(
                      "rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-right text-[11px] font-bold text-slate-200 transition-colors hover:border-amber-300/50 hover:bg-amber-400/10",
                      submitting && "opacity-60",
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <Crown className="size-3 text-amber-400" aria-hidden="true" />
                      {account.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
            پنل مدیریت وب مستقل است و داخل اپ عمومی مشتری، نصاب یا فروشگاه قرار نمی‌گیرد.
          </p>
        </form>
      </div>
    </div>
  );
}
