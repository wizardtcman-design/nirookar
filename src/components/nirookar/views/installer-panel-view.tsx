"use client";

import {
  BadgeCheck,
  CircleCheck,
  ClipboardList,
  FileCheck2,
  Handshake,
  HardHat,
  House,
  ImageUp,
  Loader2,
  MapPin,
  Pencil,
  ScrollText,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { SPECIALTIES } from "@shared/specialties";
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
import type { InstallerOwnProfile } from "@/types/auth";
import { cn } from "@/lib/utils";

/**
 * پنل شخصی نصاب — فاز ۲ گام ۲ (نسخه 0.1.2).
 *
 * نصاب بلافاصله پس از ثبت‌نام اولیه وارد همین پنل می‌شود. تا زمانی که پرونده
 * ACTIVE نشده، کارت مرحله‌ای «تکمیل احراز هویت و مدارک» بالای داشبورد نمایش
 * داده می‌شود و از همین‌جا کد پستی، آدرس محرمانه، شبا و تصاویر ثبت/ویرایش
 * می‌شوند؛ سپس وضعیت PENDING_VERIFICATION و پس از تأیید حضوری قرارداد و سفته
 * توسط ادمین: ACTIVE.
 */

interface FormErrors {
  [key: string]: string | undefined;
}

export function InstallerPanelView() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<InstallerOwnProfile | null>(null);
  const [status, setStatus] = useState<string>("INCOMPLETE");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await authRepository.getMyProfile();
      if (result.ok && result.role === "installer") {
        setProfile(result.profile);
        setStatus(result.status);
      } else {
        setLoadError("پرونده نصاب برای این حساب یافت نشد.");
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
      <PanelHeader title="پنل نصاب" />

      <main className="flex-1 px-4 pb-12 pt-5 lg:py-8">
        <div className="mx-auto w-full max-w-2xl space-y-5">
          {/* هویت کوتاه */}
          <section className="flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-teal-light text-brand-teal">
              {profile?.photoUrl ? (
                 
                <img src={profile.photoUrl} alt={`عکس ${profile.fullName}`} className="size-14 rounded-2xl object-cover" />
              ) : (
                <HardHat className="size-7" aria-hidden="true" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-black text-brand-navy">
                {profile?.fullName ?? user?.displayName ?? "—"}
              </p>
              <p dir="ltr" className="mt-0.5 flex items-center gap-1 text-right text-[12px] text-slate-500">
                <Smartphone className="size-3.5 shrink-0" aria-hidden="true" />
                {profile?.phone ?? "—"}
              </p>
              {profile ? (
                <p className="mt-0.5 flex items-center gap-1 text-[12px] text-slate-500">
                  <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                  {profile.city}
                </p>
              ) : null}
            </div>
            <ProfileStatusChip status={status} />
          </section>

          {loading ? (
            <div aria-busy="true" aria-label="در حال بارگذاری پرونده" className="flex h-40 items-center justify-center rounded-3xl border border-slate-200/80 bg-white">
              <Loader2 className="size-6 animate-spin text-brand-teal" aria-hidden="true" />
            </div>
          ) : loadError ? (
            <div role="alert" className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">
              {loadError}
            </div>
          ) : profile ? (
            <>
              {/* کارت مرحله‌ای تکمیل احراز هویت — تا ACTIVE بالای داشبورد می‌ماند */}
              {status !== "ACTIVE" ? (
                <VerificationCard profile={profile} status={status} onSubmitted={loadProfile} />
              ) : (
                <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                      <BadgeCheck className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-black text-emerald-900">پرونده شما فعال است</p>
                      <p className="mt-1 text-[12px] leading-6 text-emerald-800">
                        احراز هویت کامل شد و نشان تایید شما فعال است. امکانات عملیاتی سفارش‌ها در گام‌های بعدی اضافه می‌شود.
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* خلاصه پرونده */}
              <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
                <h2 className="flex items-center gap-2 text-[13px] font-black text-brand-navy">
                  <ClipboardList className="size-4 text-brand-teal" aria-hidden="true" />
                  خلاصه پرونده
                </h2>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[11px] font-bold text-slate-500">تخصص‌ها</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {profile.specialties.length ? (
                        profile.specialties.map((key) => (
                          <span key={key} className="rounded-full border border-brand-teal/30 bg-brand-teal-light px-2.5 py-0.5 text-[11px] font-bold text-brand-teal">
                            {SPECIALTIES.find((s) => s.key === key)?.label ?? key}
                          </span>
                        ))
                      ) : (
                        <span className="text-[12px] text-slate-400">—</span>
                      )}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[11px] font-bold text-slate-500">سابقه کار و فروشگاه‌های قبلی</dt>
                    <dd className="mt-1 text-[12px] leading-6 text-slate-700">{profile.workHistory}</dd>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <dt className="text-[11px] font-bold text-slate-500">کد ملی</dt>
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
                body="پس از تأیید مدارک، برای فعال شدن نهایی پرونده باید حضوری به انبار/دفتر مرکزی نیروکار مراجعه کنید، قرارداد را امضا و سفته ضمانت تحویل دهید. امکانات سفارش‌ها بلافاصله پس از فعال شدن پرونده در دسترس قرار می‌گیرد."
              />
            </>
          ) : null}

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

/* ── کارت مرحله‌ای «تکمیل احراز هویت و مدارک» ── */
function VerificationCard({
  profile,
  status,
  onSubmitted,
}: {
  profile: InstallerOwnProfile;
  status: string;
  onSubmitted: () => Promise<void>;
}) {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(status === "INCOMPLETE");
  const [postalCode, setPostalCode] = useState(profile.postalCode ?? "");
  const [address, setAddress] = useState(profile.residenceAddress ?? "");
  const [sheba, setSheba] = useState(profile.sheba ?? "");
  const [photo, setPhoto] = useState<string | null>(profile.photoUrl);
  const [card, setCard] = useState<string | null>(profile.nationalCardUrl);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      postalCode: check(validatePostalCode(postalCode)),
      address: address.trim().length >= 10 ? undefined : "آدرس دقیق محل سکونت را کامل وارد کنید (محرمانه — فقط برای ادمین)",
      sheba: check(validateSheba(sheba)),
      photo: photo ? undefined : "عکس پروفایل واقعی الزامی است",
      card: card ? undefined : "تصویر کارت ملی الزامی است",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const result = await authRepository.submitInstallerDocuments({
        postalCode: normalizeDigits(postalCode).replace(/\D/g, ""),
        residenceAddress: address.trim(),
        sheba: normalizeDigits(sheba).replace(/\s/g, "").toUpperCase(),
        photoUrl: photo as string,
        nationalCardUrl: card as string,
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
                وضعیت: در انتظار تأیید حضوری. پس از مراجعه حضوری، امضای قرارداد و تحویل سفته، ادمین پرونده شما را فعال می‌کند.
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
            { label: "تحویل سفته ضمانت و تأیید مدیر (فعال شدن پرونده)", done: false },
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
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal-light text-brand-teal">
          <ImageUp className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-black text-brand-navy">تکمیل احراز هویت و مدارک</h2>
          <p className="mt-1 text-[12px] leading-6 text-slate-500">
            برای فعال شدن پرونده، موارد زیر را کامل کنید. آدرس سکونت محرمانه است و فقط در پنل مدیریت نگهداری می‌شود.
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
            id="ip-postal"
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
            id="ip-sheba"
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
            hint="برای تسویه‌حساب سفارش‌ها استفاده می‌شود"
          />
        </div>

        <div className="w-full">
          <label htmlFor="ip-address" className="mb-1.5 block text-[13px] font-bold text-brand-navy">
            آدرس دقیق محل سکونت <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="ip-address"
            name="residenceAddress"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            rows={3}
            placeholder="خیابان، کوچه، پلاک، واحد"
            className={cn(
              "w-full rounded-xl border bg-white p-3.5 text-[14px] text-slate-900 outline-none transition-shadow placeholder:text-slate-400",
              errors.address ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15",
            )}
          />
          {errors.address ? <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.address}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUploadField id="ip-photo" label="عکس پروفایل واقعی" required value={photo} onChange={(v) => { setPhoto(v); setErrors((p) => ({ ...p, photo: undefined })); }} error={errors.photo} />
          <ImageUploadField id="ip-card" label="تصویر کارت ملی" required value={card} onChange={(v) => { setCard(v); setErrors((p) => ({ ...p, card: undefined })); }} error={errors.card} />
        </div>

        <PrimaryButton type="submit" disabled={submitting}>
          <span className="flex items-center gap-2">
            <ShieldCheck className="size-5" aria-hidden="true" />
            {submitting ? "در حال ارسال..." : "ثبت و ارسال مدارک"}
          </span>
        </PrimaryButton>

        <p className="flex items-start gap-1.5 text-[11px] leading-5 text-slate-400">
          <Handshake className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          پس از ارسال، وضعیت پرونده به «در انتظار تأیید حضوری» تغییر می‌کند؛ فعال شدن نهایی پس از امضای قرارداد و تحویل سفته در دفتر انجام می‌شود.
        </p>
      </form>
    </section>
  );
}

/* ── ابزار مشترک ── */
function check(validation: FieldValidation): string | undefined {
  return validation.ok ? undefined : validation.message;
}
