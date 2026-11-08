import 'package:flutter/material.dart';

import 'identifier_type.dart';

/// تعریف داده‌محور یک نقش کاربری.
///
/// نقش‌ها در نیروکار «کد» نیستند؛ داده‌اند. افزودن نقش تازه (مثلاً راننده
/// وانت‌بار یا شرکت حمل‌ونقل) تنها یعنی افزودن یک نمونهٔ [RoleDefinition]
/// به `RoleRegistry.roles` — بدون بازنویسی صفحات، اعتبارسنج‌ها یا ویجت‌ها.
class RoleDefinition {
  /// شناسهٔ پایدار نقش (مثل `customer`)؛ برای مسیریابی و نگاشت آینده.
  final String id;

  /// عنوان نمایشی نقش.
  final String title;

  /// توضیح کوتاه نقش.
  final String subtitle;

  /// برچسب دکمهٔ ورود نقش.
  final String submitLabel;

  /// برچسب فیلد شناسهٔ ورود.
  final String identifierLabel;

  /// متن راهنمای فیلد شناسه.
  final String identifierHint;

  /// نوع شناسهٔ مورد انتظار (ایمیل/موبایل یا فقط موبایل).
  final IdentifierType identifierType;

  /// رنگ تأکیدی نقش (تایپوگرافی، دایرهٔ آیکون، دکمه).
  final Color accent;

  /// پس‌زمینهٔ روشن عناصر تأکیدی نقش.
  final Color accentContainer;

  /// رنگ محتوا روی سطوح تأکیدی نقش.
  final Color onAccent;

  /// نقش‌های غیرفعال بدون مسیر ناوبری، فقط با پیام صادقانه نمایش داده می‌شوند.
  final bool enabled;

  const RoleDefinition({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.submitLabel,
    required this.identifierLabel,
    required this.identifierHint,
    required this.identifierType,
    required this.accent,
    required this.accentContainer,
    required this.onAccent,
    required this.enabled,
  });
}
