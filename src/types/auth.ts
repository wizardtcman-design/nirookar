/**
 * مدل‌های دامنه احراز هویت — فاز ۲ گام ۱.
 *
 * نقش‌های اکانت = نقش‌های عمومی (مشتری/نصاب/فروشگاه) + ۵ نقش مدیریتی.
 * جلسه واقعی با کوکی httpOnly مدیریت می‌شود؛ کلاینت فقط پروفایل سبک را می‌بیند.
 */

export type UserRole = "customer" | "installer" | "shop";

/** نوع فیلد شناسه ورود — نقش‌های آینده می‌توانند نوع جدید اضافه کنند */
export type IdentifierType = "email-or-phone" | "phone";

export type AccountRole = UserRole | "super_admin" | "ops_manager" | "finance_manager" | "support_specialist" | "auditor";

export type ProfileStatus = "ACTIVE" | "PENDING_VERIFICATION" | "REJECTED";

/** پروفایل سبک کاربر که کلاینت می‌بیند (بدون هیچ داده محرمانه) */
export interface AuthUser {
  id: string;
  role: AccountRole;
  displayName: string;
  profileStatus: ProfileStatus;
}

/** داده‌های ثبت‌نام مشتری */
export interface CustomerRegistration {
  role: "customer";
  phone: string;
  firstName: string;
  lastName: string;
  city: string;
  neighborhood?: string;
  photoUrl?: string | null;
}

/** داده‌های ثبت‌نام نصاب — پرونده کامل طبق قوانین پلتفرم */
export interface InstallerRegistration {
  role: "installer";
  phone: string;
  fullName: string;
  nationalId: string;
  city: string;
  residenceAddress: string;
  workHistory: string;
  specialties: string[];
  sheba: string;
  photoUrl: string;
  nationalCardUrl: string;
}

/** داده‌های ثبت‌نام فروشگاه/همکار */
export interface ShopRegistration {
  role: "shop";
  phone: string;
  shopName: string;
  ownerName: string;
  nationalId: string;
  address: string;
  contactPhone: string;
  sheba: string;
  logoUrl: string;
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
