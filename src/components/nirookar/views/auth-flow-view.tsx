"use client";

import {
  ClipboardCheck,
  KeyRound,
  Loader2,
  LogIn,
  MailCheck,
  ShieldCheck,
  Smartphone,
  Store,
  UserRound,
  UserPlus,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SPECIALTIES } from "@shared/specialties";
import {
  normalizeDigits,
  validateNationalId,
  validatePassword,
  validateRequiredText,
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
type FlowStep = "login" | "phone" | "otp" | "register";

interface PlatformConfig {
  cities: string[];
  otpEnabled: boolean;
}

/**
 * جریان واقعی ورود و ثبت‌نام — فاز ۲ گام ۲ (نسخه 0.1.2) — دو حالته.
 *
 * حالت پیش‌فرض (otpEnabled خاموش در پنل مدیریت):
 *   ورود = شماره موبایل + رمز عبور / ثبت‌نام = موبایل + کد ملی یکتا + نام + رمز
 *   عبور + فیلد اختصاصی نقش (نصاب: تخصص و سابقه / فروشگاه: نام فروشگاه).
 *   کاربر بلافاصله وارد پنل شخصی خود می‌شود؛ مدارک نصاب/فروشگاه بعداً از کارت
 *   «تکمیل احراز هویت و مدارک» همان پنل ارسال می‌شود.
 *
 * حالت otpEnabled روشن: جریان کد تأیید (Sandbox فعلی تا اتصال سرویس پیامک واقعی).
 */
export function AuthFlowView({ role }: { role: UserRole }) {
  const definition = getRole(role);
  const theme = ROLE_THEME_STYLES[definition.theme];
  const { setUser } = useAuth();

  const [step, setStep] = useState<FlowStep>("login");
  const [config, setConfig] = useState<PlatformConfig | null>(null);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/platform/config")
      .then((response) => response.json())
      .then((data: { ok: boolean; cities?: string[]; otpEnabled?: boolean }) => {
        if (data.ok) {
          setConfig({
            cities: Array.isArray(data.cities) ? data.cities : ["تهران"],
            otpEnabled: Boolean(data.otpEnabled),
          });
        }
      })
      .catch(() => undefined);
  }, []);

  const StepIcon = role === "installer" ? Wrench : role === "shop" ? Store : UserRound;
  const otpEnabled = config?.otpEnabled ?? false;
  const resolvedStep: FlowStep | null = config === null ? null : otpEnabled && step === "login" ? "phone" : step;

  // ── ورود با رمز عبور (حالت پیش‌فرض) ──
  async function handlePasswordLogin(event: React.FormEvent) {
    event.preventDefault();
    const value = normalizeDigits(phone).replace(/[\s-]/g, "").trim();
    if (!/^09\d{9}$/.test(value)) {
      setError("شماره موبایل معتبر نیست (مثال: 09123456789)");
      return;
    }
    if (!password) {
      setError("رمز عبور را وارد کنید");
      return;
    }
    setPhone(value);
    setSubmitting(true);
    setError(null);
    try {
      const user = await authRepository.loginWithPassword(value, password);
      applyLoginResult(user);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "خطای نامشخص");
    } finally {
      setSubmitting(false);
    }
  }

  // ── گام ۱ OTP: دریافت کد ──
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

  // ── گام ۲ OTP: تأیید کد ──
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

  // ── پس از ورود یا ثبت‌نام موفق → ورود بلافاصله به پنل شخصی ──
  function applyLoginResult(user: AuthUser) {
    setUser(user);
    if (user.role === "installer") {
      toast.success(`${user.displayName} عزیز، خوش آمدید!`);
      navigateToView("panel-installer");
      return;
    }
    if (user.role === "shop") {
      toast.success(`${user.displayName} عزیز، خوش آمدید!`);
      navigateToView("panel-shop");
      return;
    }
    if (user.role === "customer") {
      toast.success(`${user.displayName} عزیز، خوش آمدید!`);
      navigateToView("panel-customer");
      return;
    }
    // نقش مدیریتی — دکمه طلایی اتاق فرمان در هدر فعال شده است
    toast.success("به اتاق فرمان نیروکار خوش آمدید");
    navigateToView("admin");
  }

  const headingByStep: Record<FlowStep, string> = {
    login: definition.title,
    phone: definition.title,
    otp: definition.title,
    register: `ثبت‌نام ${definition.title.replace("ورود ", "")}`,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SubPageHeader title={resolvedStep === "register" ? headingByStep.register : definition.title} />

      <main className="flex-1 px-4 pb-10 pt-5 lg:py-10">
        <section className="mx-auto w-full max-w-sm sm:max-w-md">
          {/* نشان نقش */}
          <div className="flex flex-col items-center text-center">
            <span className={cn("flex size-16 items-center justify-center rounded-full", theme.iconWrap)}>
              <StepIcon className="size-8" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 className="mt-3 text-xl font-black text-brand-navy">
              {resolvedStep === null ? definition.title : headingByStep[resolvedStep]}
            </h2>
            <p className="mt-1 text-[13px] text-slate-500">{definition.subtitle}</p>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            {resolvedStep === null ? (
              <div aria-busy="true" aria-label="در حال بارگذاری فرم ورود" className="flex h-24 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-brand-teal" aria-hidden="true" />
              </div>
            ) : null}

            {resolvedStep === "login" ? (
              <LoginPasswordStep
                phone={phone}
                password={password}
                revealed={revealed}
                onPhoneChange={(value) => {
                  setPhone(value);
                  setError(null);
                }}
                onPasswordChange={(value) => {
                  setPassword(value);
                  setError(null);
                }}
                onToggleReveal={() => setRevealed((v) => !v)}
                onSubmit={handlePasswordLogin}
                onGoRegister={() => {
                  setError(null);
                  setStep("register");
                }}
                submitting={submitting}
                error={error}
              />
            ) : null}

            {resolvedStep === "phone" ? (
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

            {resolvedStep === "otp" ? (
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

            {resolvedStep === "register" ? (
              <RegisterStep
                role={role}
                phone={phone}
                cities={config?.cities ?? ["تهران"]}
                passwordMode={!otpEnabled}
                onDone={applyLoginResult}
              />
            ) : null}
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="size-4 text-brand-teal" aria-hidden="true" />
            امن و مطمئن | نشست شما با کوکی امن سمت سرور نگهداری می‌شود
          </p>
        </section>
      </main>
    </div>
  );
}

/* ──────────────────────────────────────────────── */

/** گام ورود با رمز عبور — حالت پیش‌فرض (otpEnabled خاموش) */
function LoginPasswordStep({
  phone,
  password,
  revealed,
  onPhoneChange,
  onPasswordChange,
  onToggleReveal,
  onSubmit,
  onGoRegister,
  submitting,
  error,
}: {
  phone: string;
  password: string;
  revealed: boolean;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onToggleReveal: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onGoRegister: () => void;
  submitting: boolean;
  error: string | null;
}) {
  return (
    <form className="space-y-4" noValidate onSubmit={onSubmit}>
      {error ? (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3.5">
          <p className="text-xs font-bold leading-6 text-rose-800">{error}</p>
        </div>
      ) : null}
      <p className="text-[13px] leading-6 text-slate-500">
        با شماره موبایل و رمز عبور خود وارد شوید. اگر حساب ندارید، همین پایین ثبت‌نام کنید.
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
      />
      <AppTextField
        id="auth-password"
        name="password"
        label="رمز عبور"
        type="password"
        placeholder="••••••••"
        icon={KeyRound}
        autoComplete="current-password"
        value={password}
        onChange={onPasswordChange}
        onToggleReveal={onToggleReveal}
        revealed={revealed}
      />
      <PrimaryButton type="submit" disabled={submitting}>
        <span className="flex items-center gap-2">
          <LogIn className="size-5" aria-hidden="true" />
          {submitting ? "در حال ورود..." : "ورود به حساب"}
        </span>
      </PrimaryButton>

      <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-center">
        <p className="text-[12px] text-slate-500">حساب ندارید؟</p>
        <button
          type="button"
          onClick={onGoRegister}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg py-1 text-[13px] font-extrabold text-brand-teal transition-opacity hover:opacity-75"
        >
          <UserPlus className="size-4" aria-hidden="true" />
          ثبت‌نام کنید (موبایل + کد ملی + رمز عبور)
        </button>
      </div>
    </form>
  );
}

/** گام دریافت کد — فقط وقتی otpEnabled در پنل مدیریت روشن است */
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

/** گام کد تأیید — فقط وقتی otpEnabled روشن است */
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
  passwordMode,
  onDone,
}: {
  role: UserRole;
  phone: string;
  cities: string[];
  passwordMode: boolean;
  onDone: (user: AuthUser) => void;
}) {
  if (role === "customer") {
    return <CustomerRegisterForm phone={phone} cities={cities} passwordMode={passwordMode} onDone={onDone} />;
  }
  if (role === "installer") {
    return <InstallerRegisterForm phone={phone} cities={cities} passwordMode={passwordMode} onDone={onDone} />;
  }
  return <ShopRegisterForm phone={phone} cities={cities} passwordMode={passwordMode} onDone={onDone} />;
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

/* ── فیلد موبایل مشترک فرم ثبت‌نام ── */
function PhoneField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <AppTextField
      id="reg-phone"
      name="phone"
      label="شماره موبایل"
      placeholder="09xxxxxxxxx"
      icon={Smartphone}
      inputMode="tel"
      autoComplete="tel"
      value={value}
      onChange={onChange}
      error={error}
    />
  );
}

/* ── فیلد رمز عبور مشترک فرم ثبت‌نام ── */
function PasswordField({
  id,
  value,
  onChange,
  error,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [revealed, setRevealed] = useState(false);
  return (
    <AppTextField
      id={id}
      name={id}
      label="رمز عبور"
      type="password"
      placeholder="حداقل ۶ کاراکتر"
      icon={KeyRound}
      autoComplete="new-password"
      value={value}
      onChange={onChange}
      onToggleReveal={() => setRevealed((v) => !v)}
      revealed={revealed}
      error={error}
      hint="این رمز برای ورودهای بعدی استفاده می‌شود"
    />
  );
}

/* ── فرم مشتری ── */
function CustomerRegisterForm({
  phone,
  cities,
  passwordMode,
  onDone,
}: {
  phone: string;
  cities: string[];
  passwordMode: boolean;
  onDone: (user: AuthUser) => void;
}) {
  const [phoneField, setPhoneField] = useState(phone);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState(cities[0] ?? "");
  const [neighborhood, setNeighborhood] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const phoneNormalized = normalizeDigits(phoneField).replace(/[\s-]/g, "").trim();
    const nextErrors: FormErrors = {
      phone: /^09\d{9}$/.test(phoneNormalized) ? undefined : "شماره موبایل معتبر نیست (مثال: 09123456789)",
      firstName: check(validateRequiredText(firstName, 2)),
      lastName: check(validateRequiredText(lastName, 2)),
      nationalId: check(validateNationalId(nationalId)),
      password: passwordMode ? check(validatePassword(password)) : undefined,
      city: city ? undefined : "شهر را انتخاب کنید",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const user = await authRepository.register({
        role: "customer",
        phone: phoneNormalized,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nationalId: normalizeDigits(nationalId).replace(/\D/g, ""),
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
      <PhoneField value={phoneField} onChange={(v) => { setPhoneField(v); setErrors((p) => ({ ...p, phone: undefined })); }} error={errors.phone} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="c-first" name="firstName" label="نام" placeholder="مثلاً سارا" value={firstName} onChange={(v) => setFirstName(v)} error={errors.firstName} autoComplete="given-name" />
        <AppTextField id="c-last" name="lastName" label="نام خانوادگی" placeholder="مثلاً محمدی" value={lastName} onChange={(v) => setLastName(v)} error={errors.lastName} autoComplete="family-name" />
      </div>
      <AppTextField
        id="c-nid"
        name="nationalId"
        label="کد ملی (الزامی و یکتا)"
        placeholder="کد ملی ۱۰ رقمی"
        value={nationalId}
        onChange={(v) => {
          setNationalId(v);
          setErrors((p) => ({ ...p, nationalId: undefined }));
        }}
        error={errors.nationalId}
        inputMode="numeric"
        hint="هر کد ملی فقط یک حساب در نیروکار می‌سازد"
      />
      {passwordMode ? (
        <PasswordField id="c-password" value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })); }} error={errors.password} />
      ) : null}
      <CitySelect id="c-city" cities={cities} value={city} onChange={setCity} error={errors.city} />
      <AppTextField id="c-neighborhood" name="neighborhood" label="محله (اختیاری)" placeholder="مثلاً سعادت‌آباد" value={neighborhood} onChange={(v) => setNeighborhood(v)} />
      <ImageUploadField id="c-photo" label="عکس پروفایل" value={photo} onChange={setPhoto} error={errors.photo} />
      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? "در حال ثبت..." : "ثبت‌نام و ورود به پنل"}
      </PrimaryButton>
    </form>
  );
}

/* ── فرم نصاب — ثبت‌نام اولیه؛ مدارک از پنل شخصی ارسال می‌شود ── */
function InstallerRegisterForm({
  phone,
  cities,
  passwordMode,
  onDone,
}: {
  phone: string;
  cities: string[];
  passwordMode: boolean;
  onDone: (user: AuthUser) => void;
}) {
  const [phoneField, setPhoneField] = useState(phone);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState(cities[0] ?? "");
  const [workHistory, setWorkHistory] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function toggleSpecialty(key: string) {
    setSpecialties((prev) => (prev.includes(key) ? prev.filter((entry) => entry !== key) : [...prev, key]));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const phoneNormalized = normalizeDigits(phoneField).replace(/[\s-]/g, "").trim();
    const nextErrors: FormErrors = {
      phone: /^09\d{9}$/.test(phoneNormalized) ? undefined : "شماره موبایل معتبر نیست (مثال: 09123456789)",
      firstName: check(validateRequiredText(firstName, 2)),
      lastName: check(validateRequiredText(lastName, 2)),
      nationalId: check(validateNationalId(nationalId)),
      password: passwordMode ? check(validatePassword(password)) : undefined,
      city: city ? undefined : "شهر را انتخاب کنید",
      workHistory: workHistory.trim().length >= 10 ? undefined : "سابقه کار و فروشگاه‌های قبلی را کامل بنویسید",
      specialties: specialties.length ? undefined : "حداقل یک تخصص انتخاب کنید",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const user = await authRepository.register({
        role: "installer",
        phone: phoneNormalized,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nationalId: normalizeDigits(nationalId).replace(/\D/g, ""),
        city,
        workHistory: workHistory.trim(),
        specialties,
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
        title="ثبت‌نام دومرحله‌ای"
        body="اول با هویت ثبت‌نام کنید و وارد پنل نصاب شوید؛ مدارک (کد پستی، آدرس، شبا و عکس‌ها) را از کارت «تکمیل احراز هویت و مدارک» در همان پنل ارسال می‌کنید. فعال شدن نهایی با مراجعه حضوری، امضای قرارداد و سفته ضمانت است."
      />

      <PhoneField value={phoneField} onChange={(v) => { setPhoneField(v); setErrors((p) => ({ ...p, phone: undefined })); }} error={errors.phone} />

      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="i-first" name="firstName" label="نام" placeholder="مثلاً رضا" value={firstName} onChange={(v) => setFirstName(v)} error={errors.firstName} autoComplete="given-name" />
        <AppTextField id="i-last" name="lastName" label="نام خانوادگی" placeholder="مثلاً کریمی" value={lastName} onChange={(v) => setLastName(v)} error={errors.lastName} autoComplete="family-name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="i-nid" name="nationalId" label="کد ملی (الزامی و یکتا)" placeholder="کد ملی ۱۰ رقمی" value={nationalId} onChange={(v) => { setNationalId(v); setErrors((p) => ({ ...p, nationalId: undefined })); }} error={errors.nationalId} inputMode="numeric" />
        <CitySelect id="i-city" cities={cities} value={city} onChange={setCity} error={errors.city} />
      </div>
      {passwordMode ? (
        <PasswordField id="i-password" value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })); }} error={errors.password} />
      ) : null}

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

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? "در حال ثبت..." : "ثبت‌نام و ورود به پنل نصاب"}
      </PrimaryButton>
    </form>
  );
}

/* ── فرم فروشگاه — ثبت‌نام اولیه؛ مدارک از پنل شخصی ارسال می‌شود ── */
function ShopRegisterForm({
  phone,
  cities,
  passwordMode,
  onDone,
}: {
  phone: string;
  cities: string[];
  passwordMode: boolean;
  onDone: (user: AuthUser) => void;
}) {
  const [phoneField, setPhoneField] = useState(phone);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState(cities[0] ?? "");
  const [shopName, setShopName] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const phoneNormalized = normalizeDigits(phoneField).replace(/[\s-]/g, "").trim();
    const nextErrors: FormErrors = {
      phone: /^09\d{9}$/.test(phoneNormalized) ? undefined : "شماره موبایل معتبر نیست (مثال: 09123456789)",
      firstName: check(validateRequiredText(firstName, 2)),
      lastName: check(validateRequiredText(lastName, 2)),
      nationalId: check(validateNationalId(nationalId)),
      password: passwordMode ? check(validatePassword(password)) : undefined,
      city: city ? undefined : "شهر را انتخاب کنید",
      shopName: check(validateRequiredText(shopName, 3)),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const user = await authRepository.register({
        role: "shop",
        phone: phoneNormalized,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        nationalId: normalizeDigits(nationalId).replace(/\D/g, ""),
        city,
        shopName: shopName.trim(),
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
        title="ثبت‌نام دومرحله‌ای"
        body="اول فروشگاه را ثبت کنید و وارد پنل فروشگاه شوید؛ مدارک (کد پستی، آدرس، شبا، لوگو و کارت ملی مالک) را از کارت «تکمیل احراز هویت و مدارک» در همان پنل ارسال می‌کنید."
      />

      <PhoneField value={phoneField} onChange={(v) => { setPhoneField(v); setErrors((p) => ({ ...p, phone: undefined })); }} error={errors.phone} />

      <AppTextField id="s-name" name="shopName" label="نام فروشگاه" placeholder="مثلاً گالری دکوراسیون مهر" value={shopName} onChange={(v) => setShopName(v)} error={errors.shopName} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="s-first" name="firstName" label="نام مالک" placeholder="مثلاً حاج قربان" value={firstName} onChange={(v) => setFirstName(v)} error={errors.firstName} autoComplete="given-name" />
        <AppTextField id="s-last" name="lastName" label="نام خانوادگی مالک" placeholder="مثلاً رضایی" value={lastName} onChange={(v) => setLastName(v)} error={errors.lastName} autoComplete="family-name" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <AppTextField id="s-nid" name="nationalId" label="کد ملی مالک (الزامی و یکتا)" placeholder="کد ملی ۱۰ رقمی" value={nationalId} onChange={(v) => { setNationalId(v); setErrors((p) => ({ ...p, nationalId: undefined })); }} error={errors.nationalId} inputMode="numeric" />
        <CitySelect id="s-city" cities={cities} value={city} onChange={setCity} error={errors.city} />
      </div>
      {passwordMode ? (
        <PasswordField id="s-password" value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: undefined })); }} error={errors.password} />
      ) : null}

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? "در حال ثبت..." : "ثبت‌نام و ورود به پنل فروشگاه"}
      </PrimaryButton>
    </form>
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
