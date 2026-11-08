/**
 * مدل‌های پایه دامنه احراز هویت.
 *
 * نکته توسعه‌پذیری: UserRole به‌صورت مجموعه بسته تعریف شده اما رجیستری نقش‌ها
 * (src/lib/roles.ts) منبع اصلی نقش‌هاست؛ در فازهای بعد با افزودن نقش جدید به
 * رجیستری و توسعه همین union، بقیه لایه‌ها بدون تغییر باقی می‌مانند.
 */
export type UserRole = "customer" | "installer" | "shop";

/** نوع فیلد شناسه ورود — نقش‌های آینده می‌توانند نوع جدید اضافه کنند */
export type IdentifierType = "email-or-phone" | "phone";

export interface LoginCredentials {
  role: UserRole;
  identifier: string;
  password: string;
}

export interface AuthSession {
  role: UserRole;
  displayName: string;
  token: string;
}

export type AuthResult = AuthSession;
