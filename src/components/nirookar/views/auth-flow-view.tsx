"use client";

import {
  BadgeCheck,
  CircleCheck,
  ClipboardCheck,
  FileText,
  Handshake,
  House,
  LogIn,
  MailCheck,
  ScrollText,
  ShieldCheck,
  Smartphone,
  Store,
  UserRound,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SPECIALTIES } from "@shared/specialties";
import {
  normalizeDigits,
  validateNationalId,
  validateRequiredText,
  validateSheba,
  type FieldValidation,
} from "@shared/validation";

import { AppTextField } from "@/components/nirookar/app-text-field";
import { ImageUploadField } from "@/components/nirookar/image-upload-field";
import { HonestNotice } from "@/components/nirookar/honest-notice";
import { PrimaryButton } from "@/components/nirookar/primary-button";
import { SubPageHeader } from "@/components/nirookar/sub-page-header";
import { useAuth } from "@/hooks/use-auth";
import { navigateToView } from "@/lib/navigation";
import { getRole, ROLE_THEME_STYLES } from "@/lib/roles";
import { authRepository } from "@/services";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/lib/utils";

type UserRole = "customer" | "installer" | "shop";
type FlowStep = "phone" | "otp" | "register" | "pending";

interface PlatformConfig {
  cities: string[];
}

/**
 * جریان واقعی ورود و ثبت‌نام — فاز ۲ گام ۱.
 *
 * ۱) شماره موبایل → ۲) کد تأیید OTP (آزمایشی: 12345) → ۳) کاربر جدید: فرم
 * ثبت‌نام متناسب با نقش / کاربر موجود: ورود به نشست واقعی.
 * نصاب و فروشگاه پس از ثبت‌نام «در انتظار بررسی و تأیید حضوری» هستند.
 */
export function AuthFlowView({ role }: { role: UserRole }) {
  const definition = getRole(role);
  const theme = ROLE_THEME_STYLES[definition.theme];
  const { setUser } = useAuth();

  const [step, setStep] = useState<FlowStep>("phone");
  const [phone, setPhone] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<PlatformConfig | null>(null);

  useEffect(() => {
    fetch("/api/platform/config")
      .then((response) => response.json())
      .then((data: { ok: boolean; cities?: string[] }) => {
        if (data.ok && Array.isArray(data.cities)) setConfig({ cities: data.cities });
      })
      .catch(() => undefined);
  }, []);

  const StepIcon = role === "installer" ? Wrench : role === "shop" ? Store : UserRound;

  // ── گام ۱: دریافت کد ──
  async function handleRequestOtp(event?: React.FormEvent) {
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

  // ── گام ۲: تأیید کد ──
  async function handleVerifyOtp(event: React.FormEvent) {
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
        setStep("register");
        return;
      }
      applyLoginResult(result.user);
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "خطای نامشخص");
    } finally {
      setSubmitting(false);
    }
  }

  // ── پس از ورود یا ثبت‌نام موفق ──
  function applyLoginResult(user: AuthUser) {
    setUser(user);
    if (user.role === "installer" || user.role === "shop") {
      if (user.profileStatus === "PENDING_VERIFICATION") {
        setStep("pending");
        return;
      }
      toast.success(`${user.displayName} عزیز، خوش آمدید!`);
      navigateToView("home");
      return;
    }
    if (user.role === "customer") {
      toast.success(`${user.displayName} عزیز، خوش آمدید!`);
      navigateToView("home");
      return;
    }
    // نقش مدیریتی — دکمه طلایی اتاق فرمان در هدر فعال شده است
    toast.success("به اتاق فرمان نیروکار خوش آمدید");
    navigateToView("admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SubPageHeader title={step === "register" ? `ثبت‌نام ${definition.title.replace("ورود ", "")}` : definition.title} />

      <main className="flex-1 px-4 pb-10 pt-5 lg:py-10">
        <section className="mx-auto w-full max-w-sm sm:max-w-md">
          {/* نشان نقش */}
          <div className="flex flex-col items-center text-center">
            <span className={cn("flex size-16 items-center justify-center rounded-full", theme.iconWrap)}>
              <StepIcon className="size-8" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-xl font-black text-brand-navy">
              {step === "register"
                ? "تکمیل ثبت‌نام"
                : step === "pending"
                  ? "پرونده در انتظار بررسی"
                  : definition.title}
            </h2>
            <p className="mt-1 text-[13px] text-slate-500">{definition.subtitle}</p>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {step === "phone" ? (
              <PhoneStep
                phone={phone}
                onPhoneChange={(value) => {
                  setPhone(value);
                  setError(null);
                }}
                onSubmit={handleRequestOtp}
                submitting={submitting}
                error={error}
              />
            ) : null}

            {step === "otp" ? (
              <OtpStep
                phone={phone}
                devCode={devCode}
                otp={otp}
                onOtpChange={(value) => {
                  setOtp(value);
                  setError(null);
                }}
                onSubmit={handleVerifyOtp}
                onResend={() => {
                  setOtp("");
                  void handleRequestOtp();
                }}
                submitting={submitting}
                error={error}
              />
            ) : null}

            {step === "register" ? (
              <RegisterStep
                role={role}
                phone={phone}
                cities={config?.cities ?? ["تهران"]}
                onDone={applyLoginResult}
              />
            ) : null}

            {step === "pending" ? <PendingStatusScreen /> : null}
          </div>

          {step !== "pending" ? (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="size-4 text-brand-teal" aria-hidden="true" />
              امن و مطمئن | نشست شما با کوکی امن سمت سرور نگهداری می‌شود
            </p>
          ) : null}
        </section>
      </main>
    </div>
  );
}

/* ──────────────────────────────────────────────── */

function PhoneStep({
  phone,
  onPhoneChange,
  onSubmit,
  submitting,
  error,
}: {
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit: (event?: React.FormEvent) => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      <p className="text-[13px] leading-6 text-slate-500">
        شماره موبایل خود را وارد کنید. اگر حساب نداشته باشید، فرم ثبت‌نام به‌صورت خودکار باز می‌شود.
      </p>
      <AppTextField
        id="auth-phone"
        name="phone"
        label="شماره موبایل"
        placeholder="09xxxxxxxxx"
        icon={Smartphone}
        inputMode="tel"
        autoComplete="tel"
        value={phone}
        onChange={onPhoneChange}
        error={error ?? undefined}
      />
      <PrimaryButton type="submit" disabled={submitting}>
        <span className="flex items-center gap-2">
          <MailCheck className="size-5" aria-hidden="true" />
          {submitting ? "در حال ارسال..." : "دریافت کد تأیید"}
        </span>
      </PrimaryButton>
    </form>
  );
}

function OtpStep({
  phone,
  devCode,
  otp,
  onOtpChange,
  onSubmit,
  onResend,
  submitting,
  error,
}: {
  phone: string;
  devCode: string | null;
  otp: string;
  onOtpChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  onResend: () => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      <div role="status" className="flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50 p-3.5">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden="true" />
        <p className="text-xs leading-6 text-sky-900">
          <span className="font-extrabold">حالت آزمایشی (Sandbox): </span>
          پیامک واقعی ارسال نمی‌شود. کد تأیید آزمایشی:{" "}
          <span dir="ltr" className="rounded-md bg-white px-2 py-0.5 font-mono text-[13px] font-black tracking-widest text-sky-700">
            {devCode ?? "12345"}
          </span>
        </p>
      </div>

      <p className="text-[13px] text-slate-500">
        کد تأیید ارسال‌شده به <span dir="ltr" className="font-bold text-brand-navy">{phone}</span> را وارد کنید.
      </p>

      <AppTextField
        id="auth-otp"
        name="otp"
        label="کد تأیید"
        placeholder="-----"
        icon={ClipboardCheck}
        inputMode="numeric"
        autoComplete="one-time-code"
        value={otp}
        onChange={onOtpChange}
        error={error ?? undefined}
      />

      <PrimaryButton type="submit" disabled={submitting}>
        <span className="flex items-center gap-2">
          <LogIn className="size-5" aria-hidden="true" />
          {submitting ? "در حال بررسی..." : "تأیید و ادامه"}
        </span>
      </PrimaryButton>

      <button
        type="button"
        onClick={onResend}
        className="w-full text-center text-[12px] font-semibold text-brand-teal transition-opacity hover:opacity-75"
      >
        ارسال دوباره کد یا تغییر شماره
      </button>
    </form>
  );
}

/* ──────────────────────────────────────────────── */

interface FormErrors {
  [key: string]: string | undefined;
}

function RegisterStep({
  role,
  phone,
  cities,
  onDone,
}: {
  role: UserRole;
  phone: string;
  cities: string[];
  onDone: (user: AuthUser) => void;
}) {
  if (role === "customer") {
    return <CustomerRegisterForm phone={phone} cities={cities} onDone={onDone} />;
  }
  if (role === "installer") {
    return <InstallerRegisterForm phone={phone} cities={cities} onDone={onDone} />;
  }
  return <ShopRegisterForm phone={phone} cities={cities} onDone={onDone} />;
}

/** فیلد select سبک مشترک (شهر) */
function CitySelect({
  id,
  cities,
  value,
  onChange,
  error,
}: {
  id: string;
  cities: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-bold text-brand-navy">
        شهر
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(
          "h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-slate-900 outline-none transition-shadow",
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15",
        )}
      >
        <option value="">انتخاب شهر</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <p className="mt-1 text-[10px] text-slate-400">شهرهای فعال از پنل مدیریت تعیین می‌شود</p>
      {error ? <p role="alert" className="mt-1 text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

/* ── فرم مشتری ── */
function CustomerRegisterForm({
  phone,
  cities,
  onDone,
}: {
  phone: string;
  cities: string[];
  onDone: (user: AuthUser) => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState(cities[0] ?? "");
  const [neighborhood, setNeighborhood] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      firstName: check(validateRequiredText(firstName, 2)),
      lastName: check(validateRequiredText(lastName, 2)),
      city: city ? undefined : "شهر را انتخاب کنید",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const user = await authRepository.register({
        role: "customer",
        phone,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        city,
        neighborhood: neighborhood.trim() || undefined,
        photoUrl: photo,
      });
      onDone(user);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "خطای نامشخص" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <RegisterError errors={errors} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="c-first" name="firstName" label="نام" placeholder="مثلاً سارا" value={firstName} onChange={(v) => setFirstName(v)} error={errors.firstName} autoComplete="given-name" />
        <AppTextField id="c-last" name="lastName" label="نام خانوادگی" placeholder="مثلاً محمدی" value={lastName} onChange={(v) => setLastName(v)} error={errors.lastName} autoComplete="family-name" />
      </div>
      <CitySelect id="c-city" cities={cities} value={city} onChange={setCity} error={errors.city} />
      <AppTextField id="c-neighborhood" name="neighborhood" label="محله (اختیاری)" placeholder="مثلاً سعادت‌آباد" value={neighborhood} onChange={(v) => setNeighborhood(v)} />
      <ImageUploadField id="c-photo" label="عکس پروفایل" value={photo} onChange={setPhoto} error={errors.photo} />
      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? "در حال ثبت..." : "تکمیل ثبت‌نام"}
      </PrimaryButton>
    </form>
  );
}

/* ── فرم نصاب ── */
function InstallerRegisterForm({
  phone,
  cities,
  onDone,
}: {
  phone: string;
  cities: string[];
  onDone: (user: AuthUser) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [city, setCity] = useState(cities[0] ?? "");
  const [residenceAddress, setResidenceAddress] = useState("");
  const [workHistory, setWorkHistory] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [sheba, setSheba] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [card, setCard] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function toggleSpecialty(key: string) {
    setSpecialties((prev) => (prev.includes(key) ? prev.filter((entry) => entry !== key) : [...prev, key]));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      fullName: check(validateRequiredText(fullName, 3)),
      nationalId: check(validateNationalId(nationalId)),
      city: city ? undefined : "شهر را انتخاب کنید",
      residenceAddress: residenceAddress.trim().length >= 10 ? undefined : "آدرس دقیق محل سکونت را کامل وارد کنید (محرمانه — فقط برای ادمین)",
      workHistory: workHistory.trim().length >= 10 ? undefined : "سابقه کار و فروشگاه‌های قبلی را کامل بنویسید",
      specialties: specialties.length ? undefined : "حداقل یک تخصص انتخاب کنید",
      sheba: check(validateSheba(sheba)),
      photo: photo ? undefined : "عکس پروفایل واقعی الزامی است",
      card: card ? undefined : "تصویر کارت ملی الزامی است",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const user = await authRepository.register({
        role: "installer",
        phone,
        fullName: fullName.trim(),
        nationalId: normalizeDigits(nationalId).replace(/\D/g, ""),
        city,
        residenceAddress: residenceAddress.trim(),
        workHistory: workHistory.trim(),
        specialties,
        sheba: normalizeDigits(sheba).replace(/\s/g, "").toUpperCase(),
        photoUrl: photo as string,
        nationalCardUrl: card as string,
      });
      onDone(user);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "خطای نامشخص" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <RegisterError errors={errors} />

      <HonestNotice
        title="ضمانت همکاری"
        body="پس از ثبت‌نام، برای فعال شدن پرونده باید حضوری به انبار/دفتر مرکزی مراجعه کنید، قرارداد را امضا و سفته ضمانت تحویل دهید."
      />

      <AppTextField id="i-name" name="fullName" label="نام و نام خانوادگی" placeholder="مثلاً رضا کریمی" value={fullName} onChange={(v) => setFullName(v)} error={errors.fullName} autoComplete="name" />
      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="i-nid" name="nationalId" label="کد ملی" placeholder="کد ملی ۱۰ رقمی" value={nationalId} onChange={(v) => { setNationalId(v); setErrors((p) => ({ ...p, nationalId: undefined })); }} error={errors.nationalId} inputMode="numeric" />
        <CitySelect id="i-city" cities={cities} value={city} onChange={setCity} error={errors.city} />
      </div>
      <AppTextField id="i-address" name="residenceAddress" label="آدرس دقیق محل سکونت (محرمانه)" placeholder="خیابان، کوچه، پلاک، واحد" value={residenceAddress} onChange={(v) => setResidenceAddress(v)} error={errors.residenceAddress} hint="این آدرس فقط در پنل مدیریت نگهداری می‌شود و به هیچ کاربر دیگری نمایش داده نمی‌شود" />
      <div className="w-full">
        <label htmlFor="i-history" className="mb-1.5 block text-[13px] font-bold text-brand-navy">
          سابقه کار و فروشگاه‌های محل فعالیت قبلی
        </label>
        <textarea
          id="i-history"
          name="workHistory"
          value={workHistory}
          onChange={(event) => setWorkHistory(event.target.value)}
          rows={3}
          placeholder="مثلاً ۵ سال نصب پرده در فروشگاه‌های مرکز شهر؛ همکاری با گالری ..."
          className={cn(
            "w-full rounded-xl border bg-white p-3.5 text-[14px] text-slate-900 outline-none transition-shadow placeholder:text-slate-400",
            errors.workHistory ? "border-red-400 focus:ring-2 focus:ring-red-100" : "border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15",
          )}
        />
        {errors.workHistory ? <p role="alert" className="mt-1 text-xs font-medium text-red-600">{errors.workHistory}</p> : null}
      </div>

      <fieldset>
        <legend className="mb-2 text-[13px] font-bold text-brand-navy">
          تخصص‌ها <span className="text-rose-500">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((specialty) => {
            const active = specialties.includes(specialty.key);
            return (
              <button
                key={specialty.key}
                type="button"
                aria-pressed={active}
                onClick={() => toggleSpecialty(specialty.key)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-[12px] font-bold transition-all",
                  active
                    ? "border-brand-teal bg-brand-teal text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-brand-teal/50",
                )}
              >
                {specialty.label}
              </button>
            );
          })}
        </div>
        {errors.specialties ? <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">{errors.specialties}</p> : null}
      </fieldset>

      <AppTextField id="i-sheba" name="sheba" label="شماره شبا" placeholder="IR______________________" value={sheba} onChange={(v) => setSheba(v)} error={errors.sheba} dir="ltr" hint="برای تسویه‌حساب سفارش‌ها استفاده می‌شود" />
      <ImageUploadField id="i-photo" label="عکس پروفایل واقعی" required value={photo} onChange={setPhoto} error={errors.photo} />
      <ImageUploadField id="i-card" label="تصویر کارت ملی" required value={card} onChange={setCard} error={errors.card} />

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? "در حال ثبت پرونده..." : "ثبت پرونده نصاب"}
      </PrimaryButton>
    </form>
  );
}

/* ── فرم فروشگاه ── */
function ShopRegisterForm({
  phone,
  onDone,
}: {
  phone: string;
  cities: string[];
  onDone: (user: AuthUser) => void;
}) {
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState(phone);
  const [sheba, setSheba] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: FormErrors = {
      shopName: check(validateRequiredText(shopName, 3)),
      ownerName: check(validateRequiredText(ownerName, 3)),
      nationalId: check(validateNationalId(nationalId)),
      address: address.trim().length >= 10 ? undefined : "آدرس دقیق فروشگاه را کامل وارد کنید",
      contactPhone: /^09\d{9}$/.test(normalizeDigits(contactPhone).replace(/\D/g, "")) ? undefined : "شماره تماس معتبر نیست",
      sheba: check(validateSheba(sheba)),
      logo: logo ? undefined : "لوگو یا تصویر سردر فروشگاه الزامی است",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const user = await authRepository.register({
        role: "shop",
        phone,
        shopName: shopName.trim(),
        ownerName: ownerName.trim(),
        nationalId: normalizeDigits(nationalId).replace(/\D/g, ""),
        address: address.trim(),
        contactPhone: normalizeDigits(contactPhone).replace(/\D/g, ""),
        sheba: normalizeDigits(sheba).replace(/\s/g, "").toUpperCase(),
        logoUrl: logo as string,
      });
      onDone(user);
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "خطای نامشخص" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" noValidate onSubmit={handleSubmit}>
      <RegisterError errors={errors} />

      <HonestNotice
        title="همکاری فروشگاه"
        body="پس از ثبت‌نام، پرونده فروشگاه در انتظار بررسی و تأیید پنل مدیریت قرار می‌گیرد؛ سپس غرفه شما فعال می‌شود."
      />

      <AppTextField id="s-name" name="shopName" label="نام فروشگاه" placeholder="مثلاً گالری دکوراسیون مهر" value={shopName} onChange={(v) => setShopName(v)} error={errors.shopName} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="s-owner" name="ownerName" label="نام مالک" placeholder="مثلاً حاج قربان" value={ownerName} onChange={(v) => setOwnerName(v)} error={errors.ownerName} />
        <AppTextField id="s-nid" name="nationalId" label="کد ملی مالک" placeholder="کد ملی ۱۰ رقمی" value={nationalId} onChange={(v) => { setNationalId(v); setErrors((p) => ({ ...p, nationalId: undefined })); }} error={errors.nationalId} inputMode="numeric" />
      </div>
      <AppTextField id="s-address" name="address" label="آدرس دقیق فروشگاه" placeholder="خیابان، بازار، پلاک" value={address} onChange={(v) => setAddress(v)} error={errors.address} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="s-phone" name="contactPhone" label="شماره تماس فروشگاه" placeholder="09xxxxxxxxx" value={contactPhone} onChange={(v) => setContactPhone(v)} error={errors.contactPhone} inputMode="tel" />
        <AppTextField id="s-sheba" name="sheba" label="شماره شبا" placeholder="IR______________________" value={sheba} onChange={(v) => setSheba(v)} error={errors.sheba} />
      </div>
      <ImageUploadField id="s-logo" label="لوگو یا تصویر سردر" required value={logo} onChange={setLogo} error={errors.logo} />

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? "در حال ثبت پرونده..." : "ثبت پرونده فروشگاه"}
      </PrimaryButton>
    </form>
  );
}

/* ── صفحه انتظار نصاب/فروشگاه ── */
function PendingStatusScreen() {
  const steps: readonly { icon: typeof FileText; title: string; body: string; done?: boolean }[] = [
    { icon: ClipboardCheck, title: "ثبت‌نام و بارگذاری مدارک", body: "پرونده شما با موفقیت در سیستم ثبت شد.", done: true },
    { icon: Handshake, title: "مراجعه حضوری و امضای قرارداد", body: "به انبار/دفتر مرکزی نیروکار مراجعه کنید و قرارداد همکاری را امضا نمایید." },
    { icon: ScrollText, title: "تحویل سفته ضمانت و تأیید مدیر", body: "پس از دریافت سفته، مدیر پنل تیک «تأیید قرارداد و دریافت سفته حضوری» را ثبت می‌کند و نشان تایید شما فعال می‌شود." },
  ];

  return (
    <div className="space-y-4">
      <div role="status" className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
        <p className="text-xs leading-6 text-amber-900">
          <span className="font-extrabold">وضعیت پرونده: در انتظار بررسی و تأیید حضوری</span>
          <br />
          پرونده شما ثبت شد و در پنل مدیریت قابل مشاهده است. برای فعال شدن، مراحل زیر کامل شود.
        </p>
      </div>

      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full",
                step.done ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500",
              )}
            >
              {step.done ? <CircleCheck className="size-5" aria-hidden="true" /> : <step.icon className="size-4.5" aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold text-brand-navy">
                {index + 1}. {step.title}
              </p>
              <p className="mt-0.5 text-[12px] leading-5 text-slate-500">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <PrimaryButton type="button" onClick={() => navigateToView("home")}>
        <span className="flex items-center gap-2">
          <House className="size-5" aria-hidden="true" />
          بازگشت به صفحه اصلی
        </span>
      </PrimaryButton>
    </div>
  );
}

/* ── ابزارهای مشترک فرم ── */
function check(validation: FieldValidation): string | undefined {
  return validation.ok ? undefined : validation.message;
}

function RegisterError({ errors }: { errors: FormErrors }) {
  if (!errors.form) return null;
  return (
    <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3.5">
      <p className="text-xs font-bold leading-6 text-rose-800">{errors.form}</p>
    </div>
  );
}
