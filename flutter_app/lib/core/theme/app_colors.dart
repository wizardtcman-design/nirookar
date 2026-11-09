import 'package:flutter/material.dart';

/// توکن‌های رنگ نیروکار — تنها منبع رنگ در کل پروژه.
///
/// هیچ فایل دیگری نباید مقدار Color خام تعریف کند؛ رنگ‌های مشتق‌شدهٔ
/// خنثی (خاکستری‌های اسلیت، پس‌زمینهٔ فیلد و ...) نیز اینجا متمرکز شده‌اند.
abstract final class AppColors {
  // ——— رنگ‌های برند (طبق طراحی فاز ۱) ———

  /// رنگ اصلی نقش مشتری.
  static const Color teal = Color(0xFF0F766E);

  /// تیرهٔ رنگ اصلی (حالت فشرده/هاور).
  static const Color tealDark = Color(0xFF115E59);

  /// کانتینر روشن رنگ اصلی.
  static const Color tealContainer = Color(0xFFCCFBF1);

  /// سطوح تیره و تیترها (نقش نصاب).
  static const Color navy = Color(0xFF0F2A43);

  /// تیره‌تر از navy برای سطوح عمیق.
  static const Color navyDark = Color(0xFF0B1F33);

  /// رنگ نقش فروشگاه.
  static const Color coral = Color(0xFFEF6351);

  /// تیرهٔ رنگ فروشگاه.
  static const Color coralDark = Color(0xFFDC4C3F);

  /// کانتینر روشن رنگ فروشگاه.
  static const Color coralContainer = Color(0xFFFDEDEA);

  /// پس‌زمینهٔ عمومی صفحه‌ها.
  static const Color background = Color(0xFFF2F5F7);

  /// سطح کارت‌ها.
  static const Color card = Color(0xFFFFFFFF);

  /// رنگ متن اصلی (برابر navy).
  static const Color textPrimary = navy;

  /// رنگ متن کم‌اهمیت.
  static const Color textMuted = Color(0xFF64748B);

  // ——— رنگ‌های مشتق‌شدهٔ خنثی ———

  /// حاشیهٔ فیلدها و جداکننده‌ها.
  static const Color slate200 = Color(0xFFE2E8F0);

  /// متن ثانویه روی سطوح تیره (#CBD5E1).
  static const Color slate300 = Color(0xFFCBD5E1);

  /// پس‌زمینهٔ دایره‌ها و عناصر خنثی (#EEF2F7).
  static const Color fieldBackground = Color(0xFFEEF2F7);

  /// رنگ خطاهای فرم.
  static const Color error = Color(0xFFDC2626);

  // ——— پالت اسنک‌بار صادقانه (کهربایی خنثی) ———

  static const Color amberContainer = Color(0xFFFEF3C7);
  static const Color amberInk = Color(0xFF92400E);
  static const Color amberIcon = Color(0xFFB45309);
}
