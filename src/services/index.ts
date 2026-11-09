import type { AuthRepository } from "@/services/contracts/auth-repository";
import { HttpAuthRepository } from "@/services/repositories/http-auth-repository";

/**
 * نقطه تزریق وابستگی سرویس‌ها — فاز ۲ گام ۱.
 *
 * پیاده‌سازی واقعی (HTTP + SQLite) جایگزین Unimplemented فاز ۱ شد.
 * برای تعویض Backend در آینده فقط همین نمونه عوض می‌شود و هیچ جزئیات
 * پیاده‌سازی به لایه UI نشت نمی‌کند.
 */
export const authRepository: AuthRepository = new HttpAuthRepository();
