/// پیکربندی سراسری محصول؛ مستقل از شمارهٔ بیلد CI.
///
/// شمارهٔ بیلد (`--build-number`) توسط گردش‌کار CI به‌صورت `run_number` به
/// APK تزریق می‌شود و عمداً اینجا ذخیره نمی‌شود.
abstract final class AppConfig {
  /// نسخهٔ محصول (سازگار با pubspec.yaml).
  static const String appVersion = '1.0.0';

  /// برچسب فاز فعلی توسعه.
  static const String phaseLabel = 'فاز ۱ — صفحه ورود نقش‌ها';
}
