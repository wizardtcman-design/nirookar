/**
 * خطای «فعال‌نشده در این فاز».
 *
 * هدف: هیچ بخشی از رابط کاربری نباید وانمود کند قابلیتی واقعاً کار می‌کند.
 * لایه سرویس در فاز ۱ عمداً این خطا را پرتاب می‌کند تا UI پیام صادقانه نمایش دهد.
 */
export class PhaseNotImplementedError extends Error {
  readonly feature: string;

  constructor(feature = "این بخش") {
    super(`${feature} در فاز ۱ پیاده‌سازی نشده است؛ در مراحل بعدی فعال می‌شود.`);
    this.name = "PhaseNotImplementedError";
    this.feature = feature;
  }
}
