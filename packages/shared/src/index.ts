/**
 * packages/shared — کد و داده مشترک وب و موبایل.
 *
 * قواعد اشتراک کد پروژه:
 * - مدل‌های داده و اعتبارسنجی مشترک فقط اینجا تعریف می‌شوند.
 * - ظاهر و تجربه کاربری وب و موبایل مشترک نمی‌شود؛ هر پلتفرم لایه UI خودش را دارد.
 * - قراردادهای Service/Repository آینده برای اتصال Backend نیز در همین پکیج
 *   توسعه می‌یابند تا تغییر Backend نیازمند بازنویسی UI نباشد.
 */
export * from "./roles-core";
export * from "./validation";
export * from "./admin-rbac";
export * from "./feature-matrix";
export * from "./version-core";
