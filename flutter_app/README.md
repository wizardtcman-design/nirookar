# نیروکار (NirooKar) — اپلیکیشن Flutter

بازار خدمات فنی و نصب — اپلیکیشن چندسکویی موبایل/دسکتاپ/وب.
**فاز ۱:** صفحه ورود نقش‌ها (مشتری، نصاب، فروشگاه) با پیام‌های صادقانه برای بخش‌های هنوز متصل‌نشده.

## پیش‌نیازها

- Flutter (کانال stable، نسخه ۳.۲۲ یا بالاتر)

## اجرا

```bash
cd flutter_app
flutter pub get
flutter run
```

## تحلیل و تست

```bash
flutter analyze
flutter test
```

## ساخت APK در CI

پوشه‌های پلتفرم (`android/`, `ios/`, `web/`) عمداً در مخزن commit نمی‌شوند و در
GitHub Actions با `flutter create` تولید می‌شوند. گردش‌کار
`.github/workflows/flutter-apk.yml`:

1. روی هر push/pull_request به `main` (مسیرهای `flutter_app/**`) و اجرای دستی:
   - تحلیل استاتیک و تست (`quality`)
   - ساخت APK ریلیز با نسخهٔ محصول `1.0.0` و شمارهٔ بیلد `run_number` و آپلود artifact
2. روی تگ‌های `v*`: اتصال APK به GitHub Release

## ساختار

- `lib/core` — توکن‌های طراحی، تم، رشته‌ها، اعتبارسنج‌ها، پیکربندی و نقطهٔ تزریق وابستگی
- `lib/domain` — مدل‌ها (نقش‌ها، اعتبارنامه، نشست) و قرارداد `AuthRepository`
- `lib/data` — پیاده‌سازی موقت و صادقانهٔ `UnimplementedAuthRepository` (نقطهٔ تعویض بک‌اند آینده)
- `lib/presentation` — مسیرها، ویجت‌های پایه و صفحات

نسخهٔ محصول: **1.0.0**
