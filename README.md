# نیروکار | NirooKar

بازارگاه چندخدمتی خدمات فنی، نصب و فروشگاه‌های مرتبط — نسخه اولیه محصول **1.0.0** (فاز ۱).

> **قانون طلایی فاز ۱:** فقط صفحه اول و سه مسیر ورود مشتری/نصاب/فروشگاه ساخته شده است. هیچ قابلیت دیگری پیاده‌سازی نشده و هیچ دکمه‌ای قابلیت جعلی را شبیه‌سازی نمی‌کند؛ هر بخش غیرفعال، صادقانه «فعال‌نشده» را اعلام می‌کند.

---

## ۱) محتویات مخزن

| مسیر | توضیح |
|---|---|
| `src/` | وب‌اپلیکیشن Next.js 16 (پیش‌نمایش زنده نسخه وب + پایه نسخه وب محصول) |
| `flutter_app/` | سورس کامل اپلیکیشن Flutter (اندروید، iOS، وب) با معماری ماژولار |
| `.github/workflows/flutter-apk.yml` | CI گیت‌هاب: تحلیل کد، تست، ساخت APK و انتشار Release |

### معماری پروژه Flutter

```
flutter_app/lib/
├── main.dart / app.dart            ← نقطه ورود، تم متریال ۳، RTL، زبان فارسی
├── core/
│   ├── theme/                      ← AppColors (تنها منبع رنگ‌ها) + AppTheme
│   ├── strings/app_strings.dart    ← تمام متن‌های فارسی متمرکز
│   ├── utils/validators.dart       ← اعتبارسنجی موبایل/ایمیل/رمز + نرمال‌سازی ارقام فارسی
│   ├── error/failures.dart         ← PhaseNotImplementedFailure (شفافیت فاز ۱)
│   ├── di/service_locator.dart     ← نقطه تعویض Repository در فازهای بعد
│   └── config/app_config.dart      ← نسخه محصول و برچسب فاز
├── domain/
│   ├── models/role_registry.dart   ← ⭐ رجیستری نقش‌ها (افزودن نقش جدید = یک entry)
│   ├── models/...                  ← LoginCredentials، AuthSession، RoleDefinition
│   └── repositories/auth_repository.dart ← قرارداد لایه سرویس (UI فقط به قرارداد وابسته است)
├── data/repositories/              ← پیاده‌سازی صادقانه فاز ۱ (بدون تماس شبکه‌ای جعلی)
└── presentation/
    ├── routes/app_router.dart      ← مسیریابی نام‌دار
    ├── widgets/                    ← RoleCard، AppTextField، PrimaryButton، BottomNavBar و ...
    └── views/                      ← خانه، ورود مشتری، ورود نصاب/فروشگاه، راهنما، درباره ما
```

**توسعه‌پذیری از روز اول:** برای افزودن نقش جدید (راننده وانت‌بار، شرکت حمل‌ونقل، متخصص تعمیرات و ...) فقط یک entry به `role_registry` اضافه می‌شود؛ صفحه خانه و فرم ورود به‌صورت خودکار از آن استفاده می‌کنند. طراحی به هیچ دسته‌بندی خاصی وابسته نیست.

## ۲) فاز ۱ — چه چیزی انجام شده / نشده

**انجام‌شده:**
- ساختار ماژولار وب + Flutter با جداسازی UI / منطق / مدل / لایه سرویس
- هویت بصری متمرکز (رنگ‌ها، فونت وزیرمتن، فاصله‌ها) در فایل توکن‌ها
- صفحه اول با سه ورودی متمایز مشتری / نصاب / فروشگاه
- صفحات ورود مشتری و صفحه مشترک نصاب+فروشگاه مطابق طرح مرجع
- ناوبری واقعی (پشتیبانی از دکمه بازگشت مرورگر در وب و Navigator در Flutter)
- اعتبارسنجی اولیه سمت UI (موبایل 09xxxxxxxxx، ایمیل، رمز ≥۶ کاراکتر، ارقام فارسی)
- لایه Repository با قرارداد مشخص — آماده اتصال بک‌اند بدون بازنویسی UI
- تست‌های Flutter (اعتبارسنجی، رجیستری، دود اپ) + CI کامل با خروجی APK
- صفحات راهنما و درباره ما با محتوای صادقانه

**عمداً انجام‌نشده (نیازمند تأیید مالک برای فازهای بعد):**
- احراز هویت واقعی، ثبت‌نام، فراموشی رمز
- سیستم سفارش، چت، پرداخت، امتیازدهی، پنل مدیریت
- هر دسته‌بندی خدماتی (فقط در «راهنما» به‌عنوان نقشه آینده ذکر شده‌اند)

## ۳) اجرای محلی

### وب (Next.js)
```bash
bun install
bun run dev        # http://localhost:3000
bun run lint
```

### Flutter (اندروید/iOS/وب)
پوشه‌های `android/` `ios/` `web/` به‌صورت عمدی commit نمی‌شوند و در CI ساخته می‌شوند. برای اجرای محلی یک‌بار:
```bash
cd flutter_app
flutter create --platforms=android,ios,web --org ir.nirookar --project-name nirookar /tmp/platform_gen
cp -r /tmp/platform_gen/android /tmp/platform_gen/ios /tmp/platform_gen/web .
flutter pub get
flutter run            # یا: flutter run -d chrome / flutter build apk --release
flutter test           # تست‌ها
flutter analyze        # تحلیل استاتیک
```

## ۴) نسخه‌بندی

- **نسخه محصول:** `1.0.0` — فقط با انتشار نسخه جدید تغییر می‌کند (`pubspec.yaml` و `src/lib/version.ts`).
- **شماره Build:** مستقل از نسخه محصول؛ در CI برابر `github.run_number` است و در هر ساخت افزایش می‌یابد (۱، ۲، … و پس از ۱۰۰: ۱۰۱ و ...). `versionCode` اندروید نیز همین عدد افزایشی است.
- ساخت APK: `flutter build apk --release --build-name=1.0.0 --build-number=<run_number>`

## ۵) GitHub Actions و دریافت APK

هر Push/PR روی `main` که `flutter_app/**` را تغییر دهد، دو Job اجرا می‌کند:

1. **quality** → `flutter pub get` + `flutter analyze` + `flutter test`
2. **build-apk** → ساخت `app-release.apk` (نسخه محصول 1.0.0، شماره build = شماره اجرای workflow) و ذخیره به‌عنوان **Artifact** با نام `NirooKar-1.0.0-build-<N>`

**دریافت APK:** صفحه مخزن → تب **Actions** → اجرای موفق «Flutter CI & APK» → بخش **Artifacts** → دانلود `NirooKar-1.0.0-build-<N>`.

**انتشار رسمی:** با زدن تگ `v1.0.0` (یا هر `vX.Y.Z`)، جاب release خودکار APK را به GitHub Release همان تگ پیوست می‌کند.

## ۶) امنیت

- هیچ کلید/توکن محرمانه‌ای در کد یا این مخزن قرار ندارد (ببینید `SECURITY.md`).
- اطلاعات حساس فقط از طریق **GitHub Secrets** به CI تزریق می‌شود.
- `.env*` در `.gitignore` است و نباید commit شود.
- معماری از روز اول مرز نقش‌ها را در نظر دارد؛ منطق تجاری به UI نشت نمی‌کند (لایه Repository).

## ۷) پیش‌نمایش زنده وب

نسخه وب روی مسیر `/` اجرا می‌شود (پیش‌نمایش پنل). تمام نماها (خانه، ورود سه نقش، راهنما، درباره ما) با ناوبری hash روی همین مسیر اجرا می‌شوند و دکمه بازگشت مرورگر کار می‌کند.
