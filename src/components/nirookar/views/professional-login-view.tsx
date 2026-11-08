"use client";

import {
  ArrowLeft,
  CircleQuestionMark,
  Headset,
  Lock,
  Phone,
  ShieldCheck,
  Smartphone,
  Store,
  Wrench,
} from "lucide-react";
import { useEffect, useRef } from "react";

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
import { cn } from "@/lib/utils";

type ProfessionalRole = "installer" | "shop";
type CardVariant = "dark" | "light";

interface RoleLoginFormProps {
  roleId: ProfessionalRole;
  variant: CardVariant;
  focused: boolean;
}

/** فرم ورود یک نقش حرفه‌ای — کارت تیره برای نصاب و کارت روشن برای فروشگاه */
function RoleLoginForm({ roleId, variant, focused }: RoleLoginFormProps) {
  const role = getRole(roleId);
  const form = useLoginForm(roleId, role.identifierType);
  const dark = variant === "dark";
  const Icon = roleId === "installer" ? Wrench : Store;

  return (
    <section
      aria-labelledby={`${roleId}-login-title`}
      className={cn(
        "rounded-3xl p-5",
        dark
          ? "bg-brand-navy text-white shadow-lg shadow-brand-navy/20"
          : "border-2 border-brand-coral/30 bg-white shadow-sm",
        focused && (dark ? "ring-4 ring-brand-teal/30" : "ring-4 ring-brand-coral/25"),
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id={`${roleId}-login-title`} className={cn("text-xl font-black", dark ? "text-white" : "text-brand-coral")}>
            {role.title}
          </h2>
          <p className={cn("mt-1 text-xs", dark ? "text-slate-300" : "text-slate-500")}>{role.subtitle}</p>
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-full border-2",
            dark ? "border-brand-teal/70 text-brand-teal-light" : "border-brand-coral/60 text-brand-coral",
          )}
        >
          <Icon className="size-7" strokeWidth={1.8} />
        </span>
      </div>

      <div aria-hidden="true" className={cn("relative my-4 h-px", dark ? "bg-white/15" : "bg-slate-200")}>
        <span
          className={cn(
            "absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
            dark ? "bg-brand-teal" : "bg-brand-coral",
          )}
        />
      </div>

      <form className="space-y-4" noValidate onSubmit={form.handleSubmit}>
        <AppTextField
          id={`${roleId}-identifier`}
          name="identifier"
          tone={dark ? "onDark" : "light"}
          label={role.identifierLabel}
          placeholder={role.identifierPlaceholder}
          icon={Phone}
          inputMode="tel"
          autoComplete="tel"
          value={form.identifier}
          onChange={form.setIdentifier}
          error={form.errors.identifier}
        />
        <AppTextField
          id={`${roleId}-password`}
          name="password"
          tone={dark ? "onDark" : "light"}
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

        <div className="relative">
          <PrimaryButton type="submit" variant={roleId === "installer" ? "teal" : "coral"} disabled={form.submitting}>
            {role.submitLabel}
          </PrimaryButton>
          <ArrowLeft
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white"
          />
        </div>
      </form>

      <button
        type="button"
        onClick={showComingSoon}
        className={cn(
          "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg py-1 text-xs font-semibold transition-opacity hover:opacity-75",
          dark ? "text-slate-300" : "text-slate-500",
        )}
      >
        <CircleQuestionMark className="size-4" aria-hidden="true" />
        رمز عبور خود را فراموش کردید؟
      </button>
    </section>
  );
}

const FEATURE_CHIPS = [
  { icon: Headset, title: "پشتیبانی تخصصی", sub: "همراه شما در هر زمان", color: "text-brand-teal" },
  { icon: Smartphone, title: "طراحی حرفه‌ای", sub: "تجربه کاری بهتر", color: "text-brand-teal" },
  { icon: ShieldCheck, title: "امن و مطمئن", sub: "ارتباط امن با سرور", color: "text-emerald-600" },
] as const;

/**
 * صفحه ورود نقش‌های حرفه‌ای (نصاب + فروشگاه) مطابق طرح مرجع.
 * با ورود از کارت نقش مشخص در صفحه خانه، همان کارت به‌صورت خودکار هایلایت و
 * اسکرول می‌شود؛ اما هر دو فرم در دسترس‌اند.
 */
export function ProfessionalLoginView({ focus }: { focus: ProfessionalRole }) {
  const installerRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = focus === "installer" ? installerRef.current : shopRef.current;
    target?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [focus]);

  return (
    <div className="flex min-h-screen flex-col">
      <SubPageHeader title="به اپلیکیشن خوش آمدید" />

      <main className="flex-1 px-4 pb-10 pt-6">
        <p className="text-center text-sm text-slate-500">لطفاً نوع ورود خود را انتخاب کنید</p>

        {/* موبایل: ستونی (طراحی قبلی) — دسکتاپ: دو فرم کنار هم */}
        <div className="mx-auto mt-5 grid w-full max-w-sm gap-0 lg:max-w-5xl lg:grid-cols-2 lg:items-start lg:gap-8">
          <div ref={installerRef} className="scroll-mt-20">
            <RoleLoginForm roleId="installer" variant="dark" focused={focus === "installer"} />
          </div>

          <div aria-hidden="true" className="relative z-10 -my-5 flex justify-center lg:hidden">
            <span className="flex size-12 items-center justify-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-400 shadow-md">
              /
            </span>
          </div>

          <div ref={shopRef} className="scroll-mt-20">
            <RoleLoginForm roleId="shop" variant="light" focused={focus === "shop"} />
          </div>
        </div>

        <div className="mx-auto mt-9 grid w-full max-w-sm grid-cols-3 divide-x divide-slate-200 rounded-2xl border border-slate-200/70 bg-white/70 py-3.5 lg:max-w-5xl">
          {FEATURE_CHIPS.map(({ icon: Icon, title, sub, color }) => (
            <div key={title} className="flex flex-col items-center gap-1 px-2 text-center">
              <Icon className={cn("size-5", color)} strokeWidth={1.9} aria-hidden="true" />
              <span className="text-[11px] font-bold text-brand-navy">{title}</span>
              <span className="text-[10px] text-slate-400">{sub}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
