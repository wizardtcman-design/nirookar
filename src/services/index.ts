import type { AuthRepository } from "@/services/contracts/auth-repository";
import { UnimplementedAuthRepository } from "@/services/repositories/unimplemented-auth-repository";

/**
 * نقطه تزریق وابستگی سرویس‌ها.
 *
 * برای اتصال بک‌اند واقعی در فازهای بعد فقط همین نمونه عوض می‌شود و
 * هیچ جزئیات پیاده‌سازی به لایه UI نشت نمی‌کند.
 */
export const authRepository: AuthRepository = new UnimplementedAuthRepository();
