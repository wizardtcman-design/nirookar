import '../../domain/models/identifier_type.dart';
import '../strings/app_strings.dart';

/// توابع خالص اعتبارسنجی — بدون وابستگی به UI و کاملاً تست‌پذیر.
final RegExp _mobilePattern = RegExp(r'^09\d{9}$');
final RegExp _emailPattern = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

const String _persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const String _arabicDigits = '٠١٢٣٤٥٦٧٨٩';

/// ارقام فارسی/عربی را به ASCII تبدیل و ورودی را trim می‌کند.
String normalizePersianDigits(String input) {
  final String trimmed = input.trim();
  final StringBuffer buffer = StringBuffer();
  for (final int rune in trimmed.runes) {
    final String character = String.fromCharCode(rune);
    final int persianIndex = _persianDigits.indexOf(character);
    if (persianIndex >= 0) {
      buffer.write(persianIndex);
      continue;
    }
    final int arabicIndex = _arabicDigits.indexOf(character);
    if (arabicIndex >= 0) {
      buffer.write(arabicIndex);
      continue;
    }
    buffer.write(character);
  }
  return buffer.toString();
}

/// موبایل ایران با الگوی 09xxxxxxxxx (پس از نرمال‌سازی ارقام).
bool isValidIranMobile(String value) {
  return _mobilePattern.hasMatch(normalizePersianDigits(value));
}

/// اعتبارسنجی سادهٔ استاندارد ایمیل.
bool isValidEmail(String value) {
  return _emailPattern.hasMatch(value.trim());
}

/// اعتبارسنجی شناسهٔ ورود بر اساس نوع نقش.
///
/// - خالی → [AppStrings.errRequired]
/// - [IdentifierType.phoneOnly] → فقط موبایل معتبر ([AppStrings.errMobile])
/// - [IdentifierType.emailOrPhone] → اگر «@» داشته باشد ایمیل
///   ([AppStrings.errEmail]) و در غیر این صورت موبایل؛ موبایل نامعتبرِ
///   غیرایمیلی با [AppStrings.errIdentifier] رد می‌شود.
String? validateIdentifier(String? value, IdentifierType type) {
  final String normalized =
      value == null ? '' : normalizePersianDigits(value);
  if (normalized.isEmpty) {
    return AppStrings.errRequired;
  }
  return switch (type) {
    IdentifierType.phoneOnly =>
      isValidIranMobile(normalized) ? null : AppStrings.errMobile,
    IdentifierType.emailOrPhone => _validateEmailOrPhone(normalized),
  };
}

String? _validateEmailOrPhone(String normalized) {
  if (normalized.contains('@')) {
    return isValidEmail(normalized) ? null : AppStrings.errEmail;
  }
  return isValidIranMobile(normalized) ? null : AppStrings.errIdentifier;
}

/// اعتبارسنجی رمز عبور: الزامی، حداقل ۶ کاراکتر.
String? validatePassword(String? value) {
  final String trimmed = (value ?? '').trim();
  if (trimmed.isEmpty) {
    return AppStrings.errRequired;
  }
  if (trimmed.length < 6) {
    return AppStrings.errShortPassword;
  }
  return null;
}
