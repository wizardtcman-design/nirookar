/**
 * اعتبارسنجی سمت رابط کاربری (فاز ۱) — منبع مشترک وب و موبایل.
 *
 * این توابع فقط اعتبار ساختاری ورودی‌ها را بررسی می‌کنند و هیچ ارتباطی با
 * منطق تجاری یا سرور ندارند؛ در فازهای بعد، اعتبارسنجی سمت سرور به‌صورت
 * مستقل اضافه خواهد شد.
 */

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

const MOBILE_REGEX = /^09\d{9}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const VALIDATION_MESSAGES = {
  required: "این فیلد الزامی است",
  invalidMobile: "شماره موبایل معتبر نیست (مثال: 09123456789)",
  invalidEmail: "ایمیل معتبر نیست",
  invalidIdentifier: "ایمیل یا شماره موبایل معتبر وارد کنید",
  shortPassword: "رمز عبور باید حداقل ۶ کاراکتر باشد",
} as const;

/** تبدیل ارقام فارسی/عربی به لاتین برای اعتبارسنجی یکدست */
export function normalizeDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (char) => {
    const persianIndex = PERSIAN_DIGITS.indexOf(char);
    if (persianIndex > -1) return String(persianIndex);
    return String(ARABIC_DIGITS.indexOf(char));
  });
}

export function isValidMobile(value: string): boolean {
  return MOBILE_REGEX.test(normalizeDigits(value).trim());
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

export interface FieldValidation {
  ok: boolean;
  message?: string;
}

export type IdentifierValidationType = "email-or-phone" | "phone";

/** اعتبارسنجی فیلد شناسه (موبایل، یا ایمیل/موبایل بسته به نقش) */
export function validateIdentifier(raw: string, type: IdentifierValidationType): FieldValidation {
  const value = normalizeDigits(raw).trim();
  if (!value) return { ok: false, message: VALIDATION_MESSAGES.required };
  if (type === "phone") {
    return isValidMobile(value) ? { ok: true } : { ok: false, message: VALIDATION_MESSAGES.invalidMobile };
  }
  if (value.includes("@")) {
    return isValidEmail(value) ? { ok: true } : { ok: false, message: VALIDATION_MESSAGES.invalidEmail };
  }
  return isValidMobile(value) ? { ok: true } : { ok: false, message: VALIDATION_MESSAGES.invalidIdentifier };
}

/** اعتبارسنجی رمز عبور در سمت UI (حداقل ۶ کاراکتر — سیاست نهایی در فاز بک‌اند تعیین می‌شود) */
export function validatePassword(raw: string): FieldValidation {
  const value = raw ?? "";
  if (!value.trim()) return { ok: false, message: VALIDATION_MESSAGES.required };
  if (value.length < 6) return { ok: false, message: VALIDATION_MESSAGES.shortPassword };
  return { ok: true };
}
