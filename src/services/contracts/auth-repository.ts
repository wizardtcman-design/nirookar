import type { AuthSession, LoginCredentials } from "@/types/auth";

/**
 * قرارداد لایه دسترسی به سرویس احراز هویت.
 *
 * رابط کاربری فقط به این قرارداد وابسته است، نه به پیاده‌سازی مشخص.
 * در فازهای بعد، پیاده‌سازی واقعی (REST/NextAuth) جایگزین نمونه فعلی می‌شود
 * بدون آنکه نیازی به تغییر UI باشد (اصل وابستگی معکوس).
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  logout(): Promise<void>;
}
