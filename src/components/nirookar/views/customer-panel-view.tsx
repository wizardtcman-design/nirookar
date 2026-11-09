"use client";

import { House, Loader2, MapPin, PackageOpen, Smartphone, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { PanelHeader } from "@/components/nirookar/panel-header";
import { HonestNotice } from "@/components/nirookar/honest-notice";
import { PrimaryButton } from "@/components/nirookar/primary-button";
import { navigateToView } from "@/lib/navigation";
import { authRepository } from "@/services";
import type { CustomerOwnProfile } from "@/types/auth";

/**
 * پنل شخصی مشتری — فاز ۲ گام ۲ (نسخه 0.1.2).
 *
 * مشتری پس از ثبت‌نام/ورود بلافاصله وارد همین پنل می‌شود. در این گام فقط
 * حساب کاربری واقعی نمایش داده می‌شود؛ سفارش‌ها و درخواست خدمات در گام‌های
 * بعدی به همین پنل اضافه می‌شوند (اعلام صادقانه، بدون داده جعلی).
 */
export function CustomerPanelView() {
  const [profile, setProfile] = useState<CustomerOwnProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await authRepository.getMyProfile();
      if (result.ok && result.role === "customer") {
        setProfile(result.profile);
      } else {
        setLoadError("حساب مشتری برای این نشست یافت نشد.");
      }
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "خطا در خواندن پروفایل");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return (
    <div className="flex min-h-screen flex-col">
      <PanelHeader title="پنل مشتری" />

      <main className="flex-1 px-4 pb-12 pt-5 lg:py-8">
        <div className="mx-auto w-full max-w-2xl space-y-5">
          {/* حساب کاربری */}
          <section className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-teal-light text-brand-teal">
              {profile?.photoUrl ? (
                 
                <img src={profile.photoUrl} alt={`عکس ${profile.displayName}`} className="size-14 rounded-2xl object-cover" />
              ) : (
                <UserRound className="size-7" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-black text-brand-navy">{profile?.displayName ?? "—"}</p>
              <p dir="ltr" className="mt-0.5 flex items-center gap-1 text-right text-[12px] text-slate-500">
                <Smartphone className="size-3.5 shrink-0" aria-hidden="true" />
                {profile?.phone ?? "—"}
              </p>
              {profile ? (
                <p className="mt-0.5 flex items-center gap-1 text-[12px] text-slate-500">
                  <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                  {profile.city}
                  {profile.neighborhood ? ` — ${profile.neighborhood}` : ""}
                </p>
              ) : null}
            </div>
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700">
              حساب فعال
            </span>
          </section>

          {loading ? (
            <div aria-busy="true" aria-label="در حال بارگذاری حساب" className="flex h-40 items-center justify-center rounded-3xl border border-slate-200/80 bg-white">
              <Loader2 className="size-6 animate-spin text-brand-teal" aria-hidden="true" />
            </div>
          ) : loadError ? (
            <div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">
              {loadError}
            </div>
          ) : (
            <section className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
              <PackageOpen className="mx-auto size-10 text-slate-300" aria-hidden="true" />
              <h2 className="mt-3 text-sm font-black text-brand-navy">سفارش‌ها به‌زودی در همین پنل</h2>
              <p className="mx-auto mt-2 max-w-md text-[12px] leading-6 text-slate-500">
                ثبت درخواست نصب، سه روش قیمت‌گذاری و پیگیری سفارش در گام‌های بعدی (طبق نقشه راه تأییدشده مالک) به این پنل اضافه می‌شود.
              </p>
            </section>
          )}

          <HonestNotice
            title="وضعیت سامانه"
            body="احراز هویت واقعی شما کامل است. سیستم سفارش‌گیری هنوز فعال نشده و به‌محض تأیید مالک در گام بعدی، از همین پنل در دسترس قرار می‌گیرد."
          />

          <PrimaryButton type="button" className="bg-slate-100 text-brand-navy hover:bg-slate-200" onClick={() => navigateToView("home")}>
            <span className="flex items-center gap-2">
              <House className="size-5" aria-hidden="true" />
              بازگشت به صفحه اصلی
            </span>
          </PrimaryButton>
        </div>
      </main>
    </div>
  );
}
