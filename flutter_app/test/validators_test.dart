import 'package:flutter_test/flutter_test.dart';
import 'package:nirookar/core/strings/app_strings.dart';
import 'package:nirookar/core/utils/validators.dart';
import 'package:nirookar/domain/models/identifier_type.dart';

void main() {
  group('normalizePersianDigits', () {
    test('ارقام فارسی به ASCII تبدیل و ورودی trim می‌شود', () {
      expect(normalizePersianDigits('  ۰۹۱۲۳۴۵۶۷۸۹  '), '09123456789');
    });

    test('ارقام عربی هم پشتیبانی می‌شوند', () {
      expect(normalizePersianDigits('٠١٢٣٤٥٦٧٨٩'), '0123456789');
    });

    test('ورودی ASCII بدون تغییر می‌ماند', () {
      expect(normalizePersianDigits('09123456789'), '09123456789');
    });
  });

  group('validateIdentifier — phoneOnly', () {
    test('موبایل معتبر پذیرفته می‌شود', () {
      expect(validateIdentifier('09123456789', IdentifierType.phoneOnly), isNull);
      expect(
        validateIdentifier('۰۹۱۲۳۴۵۶۷۸۹', IdentifierType.phoneOnly),
        isNull,
      );
    });

    test('بدون صفر ابتدایی نامعتبر است', () {
      expect(
        validateIdentifier('9123456789', IdentifierType.phoneOnly),
        AppStrings.errMobile,
      );
    });

    test('طول ناقص نامعتبر است', () {
      expect(
        validateIdentifier('0912345678', IdentifierType.phoneOnly),
        AppStrings.errMobile,
      );
    });
  });

  group('validateIdentifier — emailOrPhone', () {
    test('هر دو شکل معتبر (ایمیل و موبایل) پذیرفته می‌شوند', () {
      expect(
        validateIdentifier('a@b.com', IdentifierType.emailOrPhone),
        isNull,
      );
      expect(
        validateIdentifier('09123456789', IdentifierType.emailOrPhone),
        isNull,
      );
    });

    test('ایمیل نامعتبر رد می‌شود', () {
      expect(
        validateIdentifier('a@b', IdentifierType.emailOrPhone),
        AppStrings.errEmail,
      );
    });

    test('عدد غیرموبایلی با errIdentifier رد می‌شود', () {
      expect(
        validateIdentifier('9123456789', IdentifierType.emailOrPhone),
        AppStrings.errIdentifier,
      );
    });
  });

  group('validateIdentifier — خالی', () {
    test('شناسهٔ خالی/null پیام الزامی برمی‌گرداند', () {
      expect(validateIdentifier('', IdentifierType.phoneOnly), AppStrings.errRequired);
      expect(
        validateIdentifier(null, IdentifierType.emailOrPhone),
        AppStrings.errRequired,
      );
    });
  });

  group('validatePassword', () {
    test('رمز کمتر از ۶ کاراکتر نامعتبر است', () {
      expect(validatePassword('12345'), AppStrings.errShortPassword);
    });

    test('رمز ۶ کاراکتری معتبر است', () {
      expect(validatePassword('123456'), isNull);
    });

    test('رمز خالی/null پیام الزامی برمی‌گرداند', () {
      expect(validatePassword(''), AppStrings.errRequired);
      expect(validatePassword(null), AppStrings.errRequired);
    });
  });
}
