/**
 * مدل‌های دامنه احراز هویت — فاز ۲ گام ۲ (نسخه 0.1.2).
 *
 * نقش‌های اکانت = نقش‌های عمومی (مشتری/نصاب/فروشگاه) + ۵ نقش مدیریتی.
 * جلسه واقعی با کوکی httpOnly مدیریت می‌شود؛ کلاینت فقط پروفایل سبک را می‌بیند.
 *
 * جریان ورود دو حالته بر اساس تنظیم otpEnabled پنل مدیریت:
 *  - otpEnabled=false (پیش‌فرض): ورود با شماره موبایل + رمز عبور؛ ثبت‌نام با
 *    «موبایل + کد ملی یکتا + نام + رمز عبور» و فیلد اختصاصی نقش.
 *  - otpEnabled=true: جریان کد تأیید (Sandbox فعلی تا اتصال سرویس پیامک).
 */

export type UserRole = "customer" | "installer" | "shop";

/** نوع فیلد شناسه ورود — نقش‌های آینده می‌توانند نوع جدید اضافه کنند */
export type IdentifierType = "email-or-phone" | "phone";

export type AccountRole = UserRole | "super_admin" | "ops_manager" | "finance_manager" | "support_specialist" | "auditor";

/**
 * وضعیت پرونده:
 *  - INCOMPLETE: ثبت‌نام اولیه انجام شده؛ مدارک هنوز از پنل شخصی ارسال نشده
 *  - PENDING_VERIFICATION: مدارک ارسال شده؛ در انتظار تأیید حضوری قرارداد و سفته
 *  - ACTIVE: تأیید شده توسط ادمین
 *  - REJECTED: رد شده
 */
export type ProfileStatus = "INCOMPLETE" | "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED";

/** پروفایل سبک کاربر که کلاینت می‌بیند (بدون هیچ داده محرمانه) */
export interface AuthUser {
  id: string;
  role: AccountRole;
  displayName: string;
  profileStatus: ProfileStatus;
}

/** داده‌های ثبت‌نام اولیه مشتری — رمز الزامی در حالت پیش‌فرض (بدون OTP) */
export interface CustomerRegistration {
  role: "customer";
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  city: string;
  neighborhood?: string;
  photoUrl?: string | null;
}

/** داده‌های ثبت‌نام اولیه نصاب — مدارک بعداً از پنل شخصی ارسال می‌شود */
export interface InstallerRegistration {
  role: "installer";
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  city: string;
  workHistory: string;
  specialties: string[];
}

/** داده‌های ثبت‌نام اولیه فروشگاه/همکار — مدارک بعداً از پنل شخصی ارسال می‌شود */
export interface ShopRegistration {
  role: "shop";
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  city: string;
  shopName: string;
}

export type RegistrationData = CustomerRegistration | InstallerRegistration | ShopRegistration;

export type OtpRequestResult = {
  ok: true;
  sandbox: true;
  devCode: string;
  expiresInSec: number;
};

export type OtpVerifyResult =
  | { ok: true; isNew: false; user: AuthUser }
  | { ok: true; isNew: true; phone: string };

export type ApiError = { ok: false; error: string };

/* ── پروفایل شخصی (پنل کاربر) ── */

export interface InstallerOwnProfile {
  fullName: string;
  phone: string;
  nationalId: string;
  city: string;
  workHistory: string;
  specialties: string[];
  postalCode: string | null;
  residenceAddress: string | null;
  sheba: string | null;
  photoUrl: string | null;
  nationalCardUrl: string | null;
}

export interface ShopOwnProfile {
  shopName: string;
  ownerName: string;
  phone: string;
  nationalId: string;
  contactPhone: string;
  postalCode: string | null;
  address: string | null;
  sheba: string | null;
  logoUrl: string | null;
  nationalCardUrl: string | null;
}

export interface CustomerOwnProfile {
  displayName: string;
  phone: string;
  city: string;
  neighborhood: string | null;
  photoUrl: string | null;
}

export type OwnProfileResult =
  | { ok: true; role: "installer"; status: ProfileStatus; profile: InstallerOwnProfile; verifiedByName: string | null }
  | { ok: true; role: "shop"; status: ProfileStatus; profile: ShopOwnProfile; verifiedByName: string | null }
  | { ok: true; role: "customer"; status: ProfileStatus; profile: CustomerOwnProfile }
  | { ok: true; role: Exclude<AccountRole, UserRole>; status: ProfileStatus; profile: { displayName: string; phone: string } };

/** مدارک احراز هویت نصاب — از کارت «تکمیل احراز هویت و مدارک» */
export interface InstallerDocuments {
  postalCode: string;
  residenceAddress: string;
  sheba: string;
  photoUrl: string;
  nationalCardUrl: string;
}

/** مدارک احراز هویت فروشگاه */
export interface ShopDocuments {
  postalCode: string;
  address: string;
  sheba: string;
  logoUrl: string;
  nationalCardUrl: string;
  contactPhone?: string;
}
