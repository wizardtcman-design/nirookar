import { useCallback, useMemo, useState } from "react";

import { SPECIALTIES } from "@shared/specialties";
import {
  normalizeDigits,
  validateNationalId,
  validatePassword,
  validateRequiredText,
  type FieldValidation,
} from "@shared/validation";

import { findSandboxAccount, useSession, type AppRole, type SessionUser } from "./session";

/**
 * منطق فرم‌های احراز هویت موبایل — بیلد 006 همگام با گام ۳ وب.
 *
 * دو حالته (طبق دستور مالک):
 *  - «ورود»: شماره موبایل + رمز عبور (حساب‌های Sandbox با رمز پیش‌فرض 123456)
 *  - «ثبت‌نام مستقیم (بدون پیامک)»: موبایل + کد ملی ۱۰ رقمی (اعتبارسنجی ریاضی
 *    و یکتا به‌ازای هر نقش) + نام و نام خانوادگی + رمز عبور + فیلد اختصاصی نقش
 *    (نصاب: تخصص و سابقه / فروشگاه: نام فروشگاه)
 *
 * پس از موفقیت، کاربر بلافاصله به پنل اختصاصی نقش هدایت می‌شود.
 */

export type AuthTab = "login" | "register";

export interface AuthFormErrors {
  phone?: string;
  password?: string;
  nationalId?: string;
  firstName?: string;
  lastName?: string;
  shopName?: string;
  experience?: string;
  specialty?: string;
  form?: string;
}

function normalizePhone(raw: string): string {
  return normalizeDigits(raw).replace(/[\s-]/g, "").trim();
}

function isValidPhone(raw: string): boolean {
  return /^09\d{9}$/.test(normalizePhone(raw));
}

/** اعتبارسنجی ثبت‌نام مشترک + فیلد اختصاصی نقش */
export function validateRegisterFields(
  role: "customer" | "installer" | "shop",
  fields: {
    firstName: string;
    lastName: string;
    nationalId: string;
    shopName: string;
    experience: string;
    specialtyKeys: string[];
  },
): AuthFormErrors {
  const errors: AuthFormErrors = {};

  const firstNameCheck: FieldValidation = validateRequiredText(fields.firstName, 2);
  if (!firstNameCheck.ok) errors.firstName = firstNameCheck.message;

  const lastNameCheck: FieldValidation = validateRequiredText(fields.lastName, 2);
  if (!lastNameCheck.ok) errors.lastName = lastNameCheck.message;

  if (role === "shop") {
    const shopNameCheck: FieldValidation = validateRequiredText(fields.shopName, 3);
    if (!shopNameCheck.ok) errors.shopName = shopNameCheck.message;
  }

  if (role === "installer") {
    const experienceCheck: FieldValidation = validateRequiredText(fields.experience, 1);
    if (!experienceCheck.ok) errors.experience = experienceCheck.message;
    if (fields.specialtyKeys.length === 0) {
      errors.specialty = "حداقل یک تخصص را انتخاب کنید";
    }
  }

  return errors;
}

export interface AuthFormApi {
  /* ورود */
  phone: string;
  password: string;
  setPhone: (value: string) => void;
  setPassword: (value: string) => void;
  handleLogin: () => void;

  /* ثبت‌نام مستقیم */
  registerStep: "form" | "password";
  firstName: string;
  lastName: string;
  nationalId: string;
  shopName: string;
  experience: string;
  regPassword: string;
  specialtyKeys: string[];
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  setNationalId: (value: string) => void;
  setShopName: (value: string) => void;
  setExperience: (value: string) => void;
  setRegPassword: (value: string) => void;
  toggleSpecialty: (key: string) => void;
  handleRegister: () => void;

  /* مشترک */
  errors: AuthFormErrors;
  notice: { title: string; body: string } | null;
  clearErrors: () => void;
}

export function useAuthForm(
  role: AppRole,
  onSuccess: (user: SessionUser) => void,
): AuthFormApi {
  const { login, register, registeredUsers, isNationalIdTaken } = useSession();

  const [phone, setPhoneState] = useState("");
  const [password, setPasswordState] = useState("");
  const [registerStep, setRegisterStep] = useState<"form" | "password">("form");
  const [firstName, setFirstNameState] = useState("");
  const [lastName, setLastNameState] = useState("");
  const [nationalId, setNationalIdState] = useState("");
  const [shopName, setShopNameState] = useState("");
  const [experience, setExperienceState] = useState("");
  const [regPassword, setRegPasswordState] = useState("");
  const [specialtyKeys, setSpecialtyKeys] = useState<string[]>([]);
  const [errors, setErrors] = useState<AuthFormErrors>({});
  const [notice, setNotice] = useState<{ title: string; body: string } | null>(null);

  const clearErrors = useCallback(() => setErrors({}), []);

  const resetAll = useCallback(() => {
    setErrors({});
    setNotice(null);
  }, []);

  /* ── ورود ── */
  const setPhone = useCallback((value: string) => {
    setPhoneState(value);
    setErrors((prev) => ({ ...prev, phone: undefined, form: undefined }));
    setNotice(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
    setNotice(null);
  }, []);

  const handleLogin = useCallback(() => {
    resetAll();
    if (!isValidPhone(phone)) {
      setErrors({ phone: "شماره موبایل معتبر نیست (مثال: 09123456789)" });
      return;
    }
    const normalized = normalizePhone(phone);
    const passwordCheck: FieldValidation = validatePassword(password);
    if (!passwordCheck.ok) {
      setErrors({ password: passwordCheck.message });
      return;
    }

    // ۱) حساب Sandbox آماده؟
    const sandbox = findSandboxAccount(normalized);
    if (sandbox && sandbox.role === role) {
      if (sandbox.password !== password) {
        setErrors({ password: "رمز عبور نادرست است" });
        return;
      }
      login({
        phone: sandbox.phone,
        role: sandbox.role,
        displayName: sandbox.displayName,
        nationalId: sandbox.nationalId,
      });
      onSuccess({
        phone: sandbox.phone,
        role: sandbox.role,
        displayName: sandbox.displayName,
        nationalId: sandbox.nationalId,
      });
      return;
    }

    // ۲) حساب ثبت‌نام‌شده در همین نشست؟
    const registered = registeredUsers.find((entry) => entry.phone === normalized && entry.role === role);
    if (registered) {
      if (registered.password !== password) {
        setErrors({ password: "رمز عبور نادرست است" });
        return;
      }
      login({ ...registered, role: registered.role }, "registered");
      onSuccess({ ...registered, role: registered.role });
      return;
    }

    // ۳) حساب Sandbox با نقش دیگر؟ — پیام صادقانه
    if (sandbox && sandbox.role !== role) {
      setErrors({
        form: `این شماره در نقش «${sandbox.displayName}» ثبت شده است. نقش فعال فرم را از تب بالای فرم تغییر دهید یا با نقش درست وارد شوید.`,
      });
      return;
    }

    setErrors({
      form: "حسابی با این شماره در نقش انتخابی یافت نشد. با تب «ثبت‌نام مستقیم» حساب خود را بسازید یا از ورود سریع Sandbox استفاده کنید.",
    });
  }, [phone, password, role, registeredUsers, login, onSuccess, resetAll]);

  /* ── ثبت‌نام مستقیم ── */
  const setNationalId = useCallback((value: string) => {
    setNationalIdState(value);
    setErrors((prev) => ({ ...prev, nationalId: undefined, form: undefined }));
    setNotice(null);
  }, []);

  const setFirstName = useCallback((value: string) => {
    setFirstNameState(value);
    setErrors((prev) => ({ ...prev, firstName: undefined }));
  }, []);

  const setLastName = useCallback((value: string) => {
    setLastNameState(value);
    setErrors((prev) => ({ ...prev, lastName: undefined }));
  }, []);

  const setShopName = useCallback((value: string) => {
    setShopNameState(value);
    setErrors((prev) => ({ ...prev, shopName: undefined }));
  }, []);

  const setExperience = useCallback((value: string) => {
    setExperienceState(value);
    setErrors((prev) => ({ ...prev, experience: undefined }));
  }, []);

  const setRegPassword = useCallback((value: string) => {
    setRegPasswordState(value);
    setErrors((prev) => ({ ...prev, password: undefined }));
  }, []);

  const toggleSpecialty = useCallback((key: string) => {
    setSpecialtyKeys((prev) => (prev.includes(key) ? prev.filter((entry) => entry !== key) : [...prev, key]));
    setErrors((prev) => ({ ...prev, specialty: undefined }));
  }, []);

  const isInstaller = role === "installer";
  const isShop = role === "shop";
  const isRegisterRole = isInstaller || isShop;

  const handleRegister = useCallback(() => {
    resetAll();

    if (!isValidPhone(phone)) {
      setErrors({ phone: "شماره موبایل معتبر نیست (مثال: 09123456789)" });
      return;
    }
    const normalized = normalizePhone(phone);

    // فیلد رمز — گام دوم فرم ثبت‌نام
    const passwordCheck: FieldValidation = validatePassword(regPassword);
    if (!passwordCheck.ok) {
      setErrors({ password: passwordCheck.message });
      return;
    }

    const fieldErrors = validateRegisterFields(isInstaller ? "installer" : isShop ? "shop" : "customer", {
      firstName,
      lastName,
      nationalId,
      shopName,
      experience,
      specialtyKeys,
    });
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    // اعتبارسنجی ریاضی کد ملی — پیام صادقانه مطابق هسته مشترک
    const nationalIdCheck: FieldValidation = validateNationalId(nationalId);
    if (!nationalIdCheck.ok) {
      setErrors({ nationalId: nationalIdCheck.message });
      return;
    }

    const normalizedNationalId = nationalId.replace(/\D/g, "");

    // قانون یکتایی کد ملی به‌ازای هر نقش (دستور مالک)
    if (isNationalIdTaken(role, normalizedNationalId)) {
      setErrors({ nationalId: "این کد ملی قبلاً در سیستم ثبت شده است" });
      return;
    }

    const displayName =
      isShop ? shopName.trim() : isInstaller ? `${firstName.trim()} ${lastName.trim()}` : `${firstName.trim()} ${lastName.trim()}`;

    const created: SessionUser = {
      phone: normalized,
      role,
      displayName,
      nationalId: normalizedNationalId,
      ...(isInstaller ? { specialtyKeys: [...specialtyKeys], experience: experience.trim() } : {}),
      ...(isShop ? { shopName: shopName.trim() } : {}),
    };

    register(created);
    onSuccess(created);
  }, [
    phone,
    regPassword,
    role,
    isInstaller,
    isShop,
    isRegisterRole,
    firstName,
    lastName,
    nationalId,
    shopName,
    experience,
    specialtyKeys,
    isNationalIdTaken,
    register,
    onSuccess,
    resetAll,
  ]);

  return useMemo(
    () => ({
      phone,
      password,
      setPhone,
      setPassword,
      handleLogin,
      registerStep,
      firstName,
      lastName,
      nationalId,
      shopName,
      experience,
      regPassword,
      specialtyKeys,
      setFirstName,
      setLastName,
      setNationalId,
      setShopName,
      setExperience,
      setRegPassword,
      toggleSpecialty,
      handleRegister,
      errors,
      notice,
      clearErrors,
    }),
    [
      phone,
      password,
      setPhone,
      setPassword,
      handleLogin,
      registerStep,
      firstName,
      lastName,
      nationalId,
      shopName,
      experience,
      regPassword,
      specialtyKeys,
      setFirstName,
      setLastName,
      setNationalId,
      setShopName,
      setExperience,
      setRegPassword,
      toggleSpecialty,
      handleRegister,
      errors,
      notice,
      clearErrors,
    ],
  );
}

/** برچسب تخصص‌ها برای نمایش در پنل */
export function specialtyLabels(keys: readonly string[]): string {
  return keys.map((key) => SPECIALTIES.find((entry) => entry.key === key)?.label ?? key).join("، ");
}
