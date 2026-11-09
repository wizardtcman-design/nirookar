"use client";

import { Lock, LogIn, ShieldCheck, UserRound } from "lucide-react";
import { useState, type FormEvent } from "react";

import type { AdminRole } from "@shared/admin-rbac";
import { ADMIN_ROLE_FA } from "@shared/admin-rbac";

import { AppTextField } from "@/components/nirookar/app-text-field";
import { LogoMark } from "@/components/nirookar/logo";
import { PrimaryButton } from "@/components/nirookar/primary-button";
import { cn } from "@/lib/utils";

interface AdminLoginProps {
  onLogin: (role: AdminRole) => void;
}

const ROLE_IDS = Object.keys(ADMIN_ROLE_FA) as AdminRole[];

/**
 * صفحه ورود پنل مدیریت — فاز ۱.
 *
 * ورود واقعی نیست: کاربر نقش نمایشی را انتخاب می‌کند تا معماری RBAC (فیلتر
 * منوها بر اساس نقش) به‌صورت واقعی دیده شود. احراز هویت واقعی، توکن و
 * کنترل دسترسی سمت سرور در فاز Backend و پس از تأیید مالک پیاده‌سازی می‌شود.
 */
export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [selectedRole, setSelectedRole] = useState<AdminRole>("super_admin");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onLogin(selectedRole);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-navy-dark px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center text-center">
          <LogoMark className="size-14 rounded-2xl text-2xl" />
          <h1 className="mt-3 text-2xl font-black text-white">پنل مدیریت نیروکار</h1>
          <p className="mt-1 text-xs text-slate-400">کنترل مرکزی کاربران، سفارش‌ها، فروشگاه‌ها، مالی و گزارش‌ها</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-3xl bg-brand-navy p-6 shadow-lg shadow-black/30"
        >
          <div role="status" className="flex items-start gap-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
            <p className="text-xs leading-6 text-amber-200">
              <span className="font-extrabold">ورود نمایشی (فاز ۱): </span>
              احراز هویت واقعی، توکن و کنترل دسترسی سمت سرور در فاز Backend فعال می‌شود.
              در این نسخه فقط معماری نقش‌ها و سطوح دسترسی به‌صورت نمایشی بررسی می‌شود.
            </p>
          </div>

          <fieldset className="mt-5">
            <legend className="mb-2 text-[13px] font-bold text-white">انتخاب نقش نمایشی برای بررسی دسترسی‌ها</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROLE_IDS.map((roleId) => {
                const role = ADMIN_ROLE_FA[roleId];
                const active = selectedRole === roleId;
                return (
                  <button
                    key={roleId}
                    type="button"
                    onClick={() => setSelectedRole(roleId)}
                    aria-pressed={active}
                    className={cn(
                      "rounded-xl border p-3 text-right transition-all",
                      active
                        ? "border-brand-teal bg-brand-teal/15 ring-2 ring-brand-teal/40"
                        : "border-white/10 bg-white/5 hover:border-white/25",
                    )}
                  >
                    <span className={cn("block text-[13px] font-extrabold", active ? "text-brand-teal-light" : "text-white")}>
                      {role.title}
                    </span>
                    <span className="mt-1 block text-[11px] leading-5 text-slate-400">{role.description}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-5 space-y-4">
            <AppTextField
              id="admin-username"
              name="username"
              label="نام کاربری"
              placeholder="در فاز Backend فعال می‌شود"
              icon={UserRound}
              value=""
              onChange={() => undefined}
              tone="onDark"
              disabled
            />
            <AppTextField
              id="admin-password"
              name="password"
              label="رمز عبور"
              type="password"
              placeholder="در فاز Backend فعال می‌شود"
              icon={Lock}
              value=""
              onChange={() => undefined}
              tone="onDark"
              disabled
            />
          </div>

          <div className="mt-6">
            <PrimaryButton type="submit">
              <span className="flex items-center gap-2">
                <LogIn className="size-5" aria-hidden="true" />
                ورود نمایشی به پنل مدیریت
              </span>
            </PrimaryButton>
          </div>

          <p className="mt-4 text-center text-[11px] leading-5 text-slate-400">
            پنل مدیریت وب مستقل است و داخل اپ عمومی مشتری، نصاب یا فروشگاه قرار نمی‌گیرد.
          </p>
        </form>
      </div>
    </div>
  );
}
