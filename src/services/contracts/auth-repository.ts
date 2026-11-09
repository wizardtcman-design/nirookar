import type {
  ApiError,
  AuthUser,
  InstallerDocuments,
  OtpRequestResult,
  OtpVerifyResult,
  OwnProfileResult,
  RegistrationData,
  ShopDocuments,
} from "@/types/auth";

/**
 * قرارداد لایه دسترسی به سرویس احراز هویت — فاز ۲ گام ۲.
 *
 * رابط کاربری فقط به این قرارداد وابسته است، نه به پیاده‌سازی مشخص.
 * پیاده‌سازی فعلی: HttpAuthRepository (API Routes + SQLite/Prisma).
 * تعویض آینده به PostgreSQL یا سرویس خارجی فقط با جایگزینی همین
 * پیاده‌سازی انجام می‌شود و هیچ تغییر UI لازم ندارد (اصل وابستگی معکوس).
 */
export interface AuthRepository {
  /** درخواست کد تأیید (فقط در حالت otpEnabled فعال) */
  requestOtp(phone: string): Promise<OtpRequestResult>;
  /** تأیید کد — کاربر موجود ورود می‌کند؛ کاربر جدید باید ثبت‌نام کند */
  verifyOtp(phone: string, code: string): Promise<OtpVerifyResult>;
  /** ورود با شماره موبایل + رمز عبور (حالت پیش‌فرض otpEnabled خاموش) */
  loginWithPassword(phone: string, password: string): Promise<AuthUser>;
  /** ثبت‌نام اولیه متناسب با نقش + ایجاد نشست (ورود بلافاصله به پنل شخصی) */
  register(data: RegistrationData): Promise<AuthUser>;
  /** پروفایل کامل کاربر لاگین‌شده (فقط خودش) */
  getMyProfile(): Promise<OwnProfileResult>;
  /** ارسال/ویرایش مدارک احراز هویت نصاب از پنل شخصی */
  submitInstallerDocuments(documents: InstallerDocuments): Promise<{ status: string }>;
  /** ارسال/ویرایش مدارک احراز هویت فروشگاه از پنل شخصی */
  submitShopDocuments(documents: ShopDocuments): Promise<{ status: string }>;
  /** کاربر لاگین‌شده فعلی (یا null) */
  me(): Promise<AuthUser | null>;
  /** خروج از حساب */
  logout(): Promise<void>;
}

export type { ApiError };
