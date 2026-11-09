import type {
  AuthUser,
  OtpRequestResult,
  OtpVerifyResult,
  RegistrationData,
} from "@/types/auth";

/**
 * قرارداد لایه دسترسی به سرویس احراز هویت — فاز ۲ گام ۱.
 *
 * رابط کاربری فقط به این قرارداد وابسته است، نه به پیاده‌سازی مشخص.
 * پیاده‌سازی فعلی: HttpAuthRepository (API Routes + SQLite/Prisma).
 * تعویض آینده به PostgreSQL یا سرویس خارجی فقط با جایگزینی همین
 * پیاده‌سازی انجام می‌شود و هیچ تغییر UI لازم ندارد (اصل وابستگی معکوس).
 */
export interface AuthRepository {
  /** درخواست کد تأیید (در این فاز Sandbox با کد آزمایشی) */
  requestOtp(phone: string): Promise<OtpRequestResult>;
  /** تأیید کد — کاربر موجود ورود می‌کند؛ کاربر جدید باید ثبت‌نام کند */
  verifyOtp(phone: string, code: string): Promise<OtpVerifyResult>;
  /** ثبت‌نام واقعی متناسب با نقش + ایجاد نشست */
  register(data: RegistrationData): Promise<AuthUser>;
  /** کاربر لاگین‌شده فعلی (یا null) */
  me(): Promise<AuthUser | null>;
  /** خروج از حساب */
  logout(): Promise<void>;
}
