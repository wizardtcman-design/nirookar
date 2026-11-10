"use client";

import {
  BadgeCheck,
  CircleCheck,
  ClipboardList,
  FileCheck2,
  Handshake,
  House,
  ImageUp,
  Loader2,
  MapPin,
  Pencil,
  ScrollText,
  ShieldCheck,
  Smartphone,
  Store,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import {
  normalizeDigits,
  validatePostalCode,
  validateRequiredText,
  validateSheba,
  type FieldValidation,
} from "@shared/validation";

import { PanelHeader, ProfileStatusChip } from "@/components/nirookar/panel-header";
import { AppTextField } from "@/components/nirookar/app-text-field";
import { HonestNotice } from "@/components/nirookar/honest-notice";
import { ImageUploadField } from "@/components/nirookar/image-upload-field";
import { PrimaryButton } from "@/components/nirookar/primary-button";
import { useAuth } from "@/hooks/use-auth";
import { navigateToView } from "@/lib/navigation";
import { authRepository } from "@/services";
import type { ShopOwnProfile } from "@/types/auth";
import { cn } from "@/lib/utils";

/**
 * پنل شخصی فروشگاه/همکار — فاز ۲ گام ۲ (نسخه 0.1.2).
 *
 * فروشگاه بلافاصله پس از ثبت‌نام اولیه وارد همین پنل می‌شود. کارت مرحله‌ای
 * «تکمیل احراز هویت و مدارک» تا ACTIVE بالای داشبورد می‌ماند: کد پستی، آدرس
 * دقیق فروشگاه، شبا، لوگو/تصویر سردر و کارت ملی مالک از همین‌جا ارسال می‌شود.
 */

interface FormErrors {
  [key: string]: string | undefined;
}

export function ShopPanelView() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ShopOwnProfile | null>(null);
  const [status, setStatus] = useState<string>("INCOMPLETE");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await authRepository.getMyProfile();
      if (result.ok && result.role === "shop") {
        setProfile(result.profile);
        setStatus(result.status);
      } else {
        setLoadError("پرونده فروشگاه برای این حساب یافت نشد.");
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
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <PanelHeader title="پنل فروشگاه" />
          {/* هویت کوتاه — نسخه 0.1.3: چیپ وضعیت در موبایل زیر اطلاعات می‌رود (بدون فشردگی) */}
          <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-coral/10 text-brand-coral">
                  {profile?.logoUrl ? (
                    
                    <img src={profile.logoUrl} alt={`لوگوی ${profile.shopName}`} className="size-14 rounded-2xl object-cover" />
                  ) : (
                    <Store className="size-7" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-black text-brand-navy">
                    {profile?.shopName ?? user?.displayName ?? "—"}
                  </p>
                  <p className="mt-0.5 text-[12px] text-slate-500">مالک: {profile?.ownerName ?? "—"}</p>
                  <p dir="ltr" className="mt-0.5 flex items-center gap-1 text-right text-[12px] text-slate-500">
                    <Smartphone className="size-3.5 shrink-0" aria-hidden="true" />
                    {profile?.phone ?? "—"}
                  </p>
                </div>
              </div>
              <div className="shrink-0 self-start sm:self-center">
                <ProfileStatusChip status={status} />
              </div>
            </div>
          </section>

          {loading ? (
            <div aria-busy="true" aria-label="در حال بارگذاری پرونده" className="flex h-40 items-center justify-center rounded-3xl border border-slate-200/80 bg-white">
              <Loader2 className="size-6 animate-spin text-brand-coral" aria-hidden="true" />
            </div>
          ) : loadError ? (
            <div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">
              {loadError}
            </div>
          ) : profile ? (
            <>
              {status !== "ACTIVE" ? (
                <ShopVerificationCard profile={profile} status={status} onSubmitted={loadProfile} />
              ) : (
                <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <BadgeCheck className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-emerald-900">پرونده فروشگاه فعال است</p>
                      <p className="mt-1 text-[12px] leading-6 text-emerald-800">
                        احراز هویت کامل شد. غرفه فروشگاه و امکانات عملیاتی در گام‌های بعدی فعال می‌شود.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-[13px] font-black text-brand-navy">
                  <ClipboardList className="size-4 text-brand-coral" aria-hidden="true" />
                  خلاصه پرونده
                </h2>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[11px] font-bold text-slate-500">کد ملی مالک</dt>
                    <dd dir="ltr" className="mt-1 text-right text-[12px] font-bold text-slate-700">{profile.nationalId}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[11px] font-bold text-slate-500">وضعیت مدارک</dt>
                    <dd className="mt-1 text-[12px] font-bold text-slate-700">
                      {status === "INCOMPLETE" ? "هنوز ارسال نشده" : status === "ACTIVE" ? "تأیید شده" : "ارسال شده — در انتظار تأیید حضوری"}
                    </dd>
                  </div>
                </dl>
              </section>

              <HonestNotice
                title="قدم بعدی چیست؟"
                body="پس از تأیید مدارک، برای فعال شدن غرفه باید حضوری قرارداد همکاری را امضا کنید و سفته ضمانت تحویل دهید. غرفه و محصولات فروشگاه بلافاصله پس از فعال شدن پرونده در دسترس قرار می‌گیرد."
              />
            </>
          ) : null}

          <PrimaryButton
            type="button"
            variant="coral"
            className="bg-slate-100 text-brand-navy hover:bg-slate-200"
            onClick={() => navigateToView("home")}
          >
            <span className="flex items-center gap-2">
              <House className="size-5" aria-hidden="true" />
              بازگشت به صفحه اصلی
            </span>
          </PrimaryButton>
    </div>
  );
}

/* ── کارت مرحله‌ای «تکمیل احراز هویت و مدارک» فروشگاه ── */
function ShopVerificationCard({
  profile,
  status,
  onSubmitted,
}: {
  profile: ShopOwnProfile;
  status: string;
  onSubmitted: () => Promise<void>;
}) {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(status === "INCOMPLETE");
  const [postalCode, setPostalCode] = useState(profile.postalCode ?? "");
  const [address, setAddress] = useState(profile.address ?? "");
  const [sheba, setSheba] = useState(profile.sheba ?? "");
  const [contactPhone, setContactPhone] = useState(profile.contactPhone);
  const [logo, setLogo] = useState<string | null>(profile.logoUrl);
  const [card, setCard] = useState<string | null>(profile.nationalCardUrl);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      postalCode: check(validatePostalCode(postalCode)),
      address: address.trim().length >= 10 ? undefined : "آدرس دقیق فروشگاه را کامل وارد کنید",
      sheba: check(validateSheba(sheba)),
      contactPhone: /^09\d{9}$/.test(normalizeDigits(contactPhone).replace(/\D/g, "")) ? undefined : "شماره تماس معتبر نیست",
      logo: logo ? undefined : "لوگو یا تصویر سردر فروشگاه الزامی است",
      card: card ? undefined : "تصویر کارت ملی مالک الزامی است",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const result = await authRepository.submitShopDocuments({
        postalCode: normalizeDigits(postalCode).replace(/\D/g, ""),
        address: address.trim(),
        sheba: normalizeDigits(sheba).replace(/\s/g, "").toUpperCase(),
        logoUrl: logo as string,
        nationalCardUrl: card as string,
        contactPhone: normalizeDigits(contactPhone).replace(/\D/g, ""),
      });
      if (result.status === "PENDING_VERIFICATION") {
        if (user) setUser({ ...user, profileStatus: "PENDING_VERIFICATION" });
        toast.success("مدارک ثبت شد — پرونده در انتظار تأیید حضوری است");
      }
      setEditing(false);
      await onSubmitted();
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "خطای نامشخص" });
    } finally {
      setSubmitting(false);
    }
  }

  if (!editing) {
    return (
      <section className="rounded-3xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <FileCheck2 className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-black text-amber-900">مدارک شما ثبت شده است</p>
              <p className="mt-1 text-[12px] leading-6 text-amber-800">
                وضعیت: در انتظار تأیید حضوری. پس از مراجعه حضوری، امضای قرارداد و تحویل سفته، ادمین غرفه فروشگاه شما را فعال می‌کند.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-2 text-[12px] font-bold text-amber-800 transition-colors hover:bg-amber-100"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            ویرایش مدارک
          </button>
        </div>

        <ol className="mt-4 space-y-2.5">
          {[
            { label: "ارسال مدارک از پنل شخصی", done: true },
            { label: "مراجعه حضوری و امضای قرارداد در دفتر نیروکار", done: false },
            { label: "تحویل سفته ضمانت و تأیید مدیر (فعال شدن غرفه)", done: false },
          ].map((step) => (
            <li key={step.label} className="flex items-center gap-2.5 text-[12px] font-bold text-amber-900">
              <CircleCheck className={cn("size-4 shrink-0", step.done ? "text-emerald-600" : "text-amber-400")} aria-hidden="true" />
              {step.label}
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-coral/10 text-brand-coral">
          <ImageUp className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-black text-brand-navy">تکمیل احراز هویت و مدارک فروشگاه</h2>
          <p className="mt-1 text-[12px] leading-6 text-slate-500">
            برای فعال شدن غرفه، موارد زیر را کامل کنید. اطلاعات فروشگاه فقط در پنل مدیریت نگهداری می‌شود.
          </p>
        </div>
      </div>

      <form className="mt-4 space-y-4" noValidate onSubmit={handleSubmit}>
        {errors.form ? (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3.5">
            <p className="text-xs font-bold leading-6 text-rose-800">{errors.form}</p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <AppTextField
            id="sp-postal"
            name="postalCode"
            label="کد پستی ۱۰ رقمی"
            placeholder="مثلاً 1454773111"
            value={postalCode}
            onChange={(v) => {
              setPostalCode(v);
              setErrors((p) => ({ ...p, postalCode: undefined }));
            }}
            error={errors.postalCode}
            inputMode="numeric"
            hint="طبق استاندارد پستی ایران؛ پنج رقم اول بدون ۰ و ۲"
          />
          <AppTextField
            id="sp-phone"
            name="contactPhone"
            label="شماره تماس فروشگاه"
            placeholder="09xxxxxxxxx"
            value={contactPhone}
            onChange={(v) => {
              setContactPhone(v);
              setErrors((p) => ({ ...p, contactPhone: undefined }));
            }}
            error={errors.contactPhone}
            inputMode="tel"
          />
        </div>

        <div className="w-full">
          <label htmlFor="sp-address" className="mb-1.5 block text-[13px] font-bold text-brand-navy">
            آدرس دقیق فروشگاه <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="sp-address"
            name="address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            rows={3}
            placeholder="خیابان، بازار، پلاک، واحد"
            className={cn(
              "w-full rounded-xl border bg-white p-3.5 text-[14px] text-slate-900 outline-none transition-shadow placeholder:text-slate-400",
              errors.address ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-brand-coral focus:ring-2 focus:ring-brand-coral/15",
            )}
          />
          {errors.address ? <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.address}</p> : null}
        </div>

        <AppTextField
          id="sp-sheba"
          name="sheba"
          label="شماره شبا (IBAN)"
          placeholder="IR______________________"
          value={sheba}
          onChange={(v) => {
            setSheba(v);
            setErrors((p) => ({ ...p, sheba: undefined }));
          }}
          error={errors.sheba}
          dir="ltr"
          hint="برای تسویه‌حساب فروش‌ها استفاده می‌شود"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploadField id="sp-logo" label="لوگو یا تصویر سردر" required value={logo} onChange={(v) => { setLogo(v); setErrors((p) => ({ ...p, logo: undefined })); }} error={errors.logo} />
          <ImageUploadField id="sp-card" label="تصویر کارت ملی مالک" required value={card} onChange={(v) => { setCard(v); setErrors((p) => ({ ...p, card: undefined })); }} error={errors.card} />
        </div>

        <PrimaryButton type="submit" variant="coral" disabled={submitting}>
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-5" aria-hidden="true" />
            {submitting ? "در حال ارسال..." : "ثبت و ارسال مدارک"}
          </span>
        </PrimaryButton>

        <p className="flex items-start gap-1.5 text-[11px] leading-5 text-slate-400">
          <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          پس از ارسال، وضعیت پرونده به «در انتظار تأیید حضوری» تغییر می‌کند؛ فعال شدن غرفه پس از امضای قرارداد و تحویل سفته در دفتر انجام می‌شود.
        </p>
      </form>
    </section>
  );
}

/* ── ابزار مشترک ── */
function check(validation: FieldValidation): string | undefined {
  return validation.ok ? undefined : validation.message;
}
