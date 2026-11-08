"use client";

import { CircleQuestionMark, Lock, LogIn, Mail, ShieldCheck, SprayCan, UserCheck, House, Wrench, UserPlus } from "lucide-react";

import { AppTextField } from "@/components/nirookar/app-text-field";
import { HonestNotice } from "@/components/nirookar/honest-notice";
import { PrimaryButton } from "@/components/nirookar/primary-button";
import { SubPageHeader } from "@/components/nirookar/sub-page-header";
import {
  HONEST_NOTICE_BODY,
  HONEST_NOTICE_TITLE,
  showComingSoon,
  useLoginForm,
} from "@/hooks/use-login-form";
import { getRole } from "@/lib/roles";

/** تصویر تزئینی خطی (خانه و ابزار) مطابق سبک طرح مرجع */
function CustomerIllustration() {
  return (
    <div
      aria-hidden="true"
      className="mt-6 flex items-center justify-center gap-4 border-t border-dashed border-slate-200 pt-5"
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-brand-teal-light/60 text-brand-teal">
        <SprayCan className="size-5" strokeWidth={1.8} />
      </span>
      <span className="flex size-14 items-center justify-center rounded-full bg-brand-slate-light text-brand-navy">
        <House className="size-7" strokeWidth={1.6} />
      </span>
      <span className="flex size-11 items-center justify-center rounded-full bg-brand-coral-light text-brand-coral">
        <Wrench className="size-5" strokeWidth={1.8} />
      </span>
    </div>
  );
}

/** صفحه ورود مشتری — مطابق طرح مرجع با کارت سفید و دکمه سبز */
export function CustomerLoginView() {
  const role = getRole("customer");
  const form = useLoginForm("customer", role.identifierType);

  return (
    <div className="flex min-h-screen flex-col">
      <SubPageHeader title={role.title} />

      <main className="flex-1 px-4 pb-8 pt-5">
        <section className="mx-auto w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <span className="flex size-20 items-center justify-center rounded-full bg-brand-slate-light text-brand-navy">
              <UserCheck className="size-10" strokeWidth={1.6} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-2xl font-black text-brand-navy">خوش آمدید</h2>
            <p className="mt-1.5 text-[13px] text-slate-500">برای ورود لطفاً اطلاعات خود را وارد کنید.</p>
          </div>

          <form className="mt-6 space-y-4" noValidate onSubmit={form.handleSubmit}>
            <AppTextField
              id="customer-identifier"
              name="identifier"
              label={role.identifierLabel}
              placeholder={role.identifierPlaceholder}
              icon={Mail}
              inputMode="email"
              autoComplete="username"
              value={form.identifier}
              onChange={form.setIdentifier}
              error={form.errors.identifier}
            />
            <AppTextField
              id="customer-password"
              name="password"
              label="رمز عبور"
              type="password"
              placeholder="رمز عبور خود را وارد کنید"
              icon={Lock}
              onToggleReveal={form.toggleShowPassword}
              revealed={form.showPassword}
              autoComplete="current-password"
              value={form.password}
              onChange={form.setPassword}
              error={form.errors.password}
            />

            {form.notice === "info" ? <HonestNotice title={HONEST_NOTICE_TITLE} body={HONEST_NOTICE_BODY} /> : null}

            <PrimaryButton type="submit" disabled={form.submitting}>
              <span className="flex items-center gap-2">
                <LogIn className="size-5" aria-hidden="true" />
                {role.submitLabel}
              </span>
            </PrimaryButton>
          </form>

          <div className="mt-5 flex items-center justify-between text-[13px] font-semibold">
            <button
              type="button"
              onClick={showComingSoon}
              className="flex items-center gap-1.5 text-brand-teal transition-opacity hover:opacity-75"
            >
              <UserPlus className="size-4" aria-hidden="true" />
              ثبت‌نام مشتری جدید
            </button>
            <button
              type="button"
              onClick={showComingSoon}
              className="flex items-center gap-1.5 text-brand-teal transition-opacity hover:opacity-75"
            >
              <CircleQuestionMark className="size-4" aria-hidden="true" />
              فراموشی رمز عبور
            </button>
          </div>

          <CustomerIllustration />
        </section>
      </main>

      <footer className="mt-auto pb-[calc(env(safe-area-inset-bottom)+1rem)] pt-4">
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="size-4 text-brand-teal" aria-hidden="true" />
          امن و مطمئن | حریم خصوصی شما برای ما مهم است
        </p>
      </footer>
    </div>
  );
}
