import { PhaseNotImplementedError } from "@/lib/errors";
import type { AuthRepository } from "@/services/contracts/auth-repository";
import type { AuthSession } from "@/types/auth";

/**
 * پیاده‌سازی موقت فاز ۱.
 *
 * هیچ تماس شبکه‌ای انجام نمی‌شود و صادقانه خطای «فعال‌نشده» پرتاب می‌کند تا
 * رابط کاربری هرگز موفقیت جعلی نمایش ندهد. برای اتصال بک‌اند واقعی، فقط
 * همین کلاس با پیاده‌سازی جدید (مثلاً RestAuthRepository) جایگزین می‌شود.
 */
export class UnimplementedAuthRepository implements AuthRepository {
  // پیاده‌سازی با پارامتر کمتر، معتبرترین روش TS برای رعایت قرارداد است.
  async login(): Promise<AuthSession> {
    throw new PhaseNotImplementedError("اتصال به سرویس ورود");
  }

  async logout(): Promise<void> {
    throw new PhaseNotImplementedError("خروج از حساب");
  }
}
