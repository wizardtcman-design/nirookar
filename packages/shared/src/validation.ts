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
/** شبا ایران: IR + ۲۴ رقم */
const SHEBA_REGEX = /^IR\d{24}$/;

export const VALIDATION_MESSAGES = {
  required: "این فیلد الزامی است",
  invalidMobile: "شماره موبایل معتبر نیست (مثال: 09123456789)",
  invalidEmail: "ایمیل معتبر نیست",
  invalidIdentifier: "ایمیل یا شماره موبایل معتبر وارد کنید",
  shortPassword: "رمز عبور باید حداقل ۶ کاراکتر باشد",
  invalidNationalId: "کد ملی معتبر نیست (باید ۱۰ رقم باشد و الگوریتم صحت‌سنجی را پاس کند)",
  duplicateNationalId: "این کد ملی قبلاً در سیستم ثبت شده است",
  invalidSheba: "شماره شبا معتبر نیست (باید با IR شروع شود و ۲۶ کاراکتر باشد)",
  invalidPostalCode: "کد پستی معتبر نیست (باید ۱۰ رقم باشد و طبق استاندارد پستی ایران، پنج رقم اول آن شامل رقم ۰ یا ۲ نباشد)",
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

/**
 * الگوریتم ریاضی صحت‌سنجی کد ملی ایران (۱۰ رقم).
 *
 * روش استاندارد: مجموع حاصل‌ضرب ۹ رقم اول در وزن‌های ۱۰ تا ۲ محاسبه، باقیمانده
 * تقسیم بر ۱۱ سنجیده می‌شود؛ اگر باقیمانده کمتر از ۲ باشد رقم کنترل باید با آن
 * برابر باشد، در غیر این صورت رقم کنترل باید ۱۱ منهای باقیمانده باشد.
 * ارقام فارسی/عربی به‌صورت خودکار نرمال‌سازی می‌شوند.
 */
export function isValidIranianNationalId(raw: string): boolean {
  const value = normalizeDigits(raw ?? "").replace(/\D/g, "");
  if (!/^\d{10}$/.test(value)) return false;

  // کدهای ملی با ارقام تکراری یکسان نامعتبر شناخته می‌شوند
  if (/^(\d)\1{9}$/.test(value)) return false;

  const digits = value.split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += digits[i] * (10 - i);
  }
  const remainder = sum % 11;
  const control = digits[9];
  return remainder < 2 ? control === remainder : control === 11 - remainder;
}

/** اعتبارسنجی فیلد کد ملی با پیام صادقانه — استفاده مشترک در فرم‌ها و سرور */
export function validateNationalId(raw: string): FieldValidation {
  const value = normalizeDigits(raw ?? "").replace(/\D/g, "");
  if (!value) return { ok: false, message: VALIDATION_MESSAGES.required };
  if (!isValidIranianNationalId(value)) {
    return { ok: false, message: VALIDATION_MESSAGES.invalidNationalId };
  }
  return { ok: true };
}

/**
 * صحت‌سنجی ساختاری و ریاضی شماره شبا ایران (IBAN - الگوریتم mod-97).
 * شبا معتبر: ۲۶ کاراکتر، شروع با «IR»، باقیمانده تقسیم عدد جابه‌جاشده بر ۹۷ = ۱.
 */
export function isValidIranianSheba(raw: string): boolean {
  const value = normalizeDigits(raw ?? "").replace(/\s/g, "").toUpperCase();
  if (!SHEBA_REGEX.test(value)) return false;

  // جابه‌جایی ۴ کاراکتر اول به انتها و تبدیل حروف به عدد (I=18، R=27)
  const rearranged = value.slice(4) + "1827" + value.slice(2, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const digit = Number(char);
    if (Number.isNaN(digit)) return false;
    remainder = (remainder * 10 + digit) % 97;
  }
  return remainder === 1;
}

/** اعتبارسنجی فیلد شبا با پیام صادقانه */
export function validateSheba(raw: string): FieldValidation {
  const value = (raw ?? "").trim();
  if (!value) return { ok: false, message: VALIDATION_MESSAGES.required };
  if (!isValidIranianSheba(value)) {
    return { ok: false, message: VALIDATION_MESSAGES.invalidSheba };
  }
  return { ok: true };
}

/**
 * اعتبارسنجی ساختاری کد پستی ایران (۱۰ رقم) — نسخه 0.1.2.
 *
 * قاعده (طبق دستور مالک و استاندارد پستی ایران):
 * - دقیقاً ۱۰ رقم (ارقام فارسی/عربی خودکار نرمال‌سازی می‌شوند)؛
 * - در پنج رقم اول (کد منطقه‌ای)، رقم ۰ و ۲ مجاز نیست؛
 * - پنج رقم دوم (کد توزیع مکانی) هر رقمی می‌تواند باشد.
 */
export function isValidIranianPostalCode(raw: string): boolean {
  const value = normalizeDigits(raw ?? "").replace(/\D/g, "");
  if (!/^\d{10}$/.test(value)) return false;
  for (let i = 0; i < 5; i += 1) {
    const digit = value.charCodeAt(i) - 48;
    if (digit === 0 || digit === 2) return false;
  }
  return true;
}

/** اعتبارسنجی فیلد کد پستی با پیام صادقانه — فرم پنل شخصی و سرور یکی است */
export function validatePostalCode(raw: string): FieldValidation {
  const value = normalizeDigits(raw ?? "").replace(/\D/g, "");
  if (!value) return { ok: false, message: VALIDATION_MESSAGES.required };
  if (!isValidIranianPostalCode(value)) {
    return { ok: false, message: VALIDATION_MESSAGES.invalidPostalCode };
  }
  return { ok: true };
}

/** اعتبارسنجی متن الزامی عمومی (نام، آدرس، سابقه کار و ...) */
export function validateRequiredText(raw: string, minLength = 2): FieldValidation {
  const value = (raw ?? "").trim();
  if (!value) return { ok: false, message: VALIDATION_MESSAGES.required };
  if (value.length < minLength) {
    return { ok: false, message: `این فیلد باید حداقل ${minLength} کاراکتر باشد` };
  }
  return { ok: true };
}
