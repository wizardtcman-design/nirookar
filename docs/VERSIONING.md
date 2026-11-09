# نسخه‌بندی و ساخت (Versioning & Build)

> قوانین قطعی پروژه — هیچ نسخه آزمایشی نباید با نسخه رسمی اشتباه گرفته شود.

## ۱) دو شماره مستقل

| مفهوم | مقدار فعلی | قانون |
|---|---|---|
| **نسخه محصول** | `0.1.1` (پیش‌انتشار فاز ۲ گام ۱) | نسخه رسمی اولین انتشار عمومی، `1.0.0` است و قبل از تأیید نهایی هرگز استفاده نمی‌شود |
| **شماره Build** | `002` | مستقل از نسخه؛ در هر ساخت افزایش می‌یابد (001، 002، 003، ...) |
| **versionCode اندروید** | `1` (همگام با بیلد ۰۰۱) | همیشه افزایشی؛ هرگز کاهش نمی‌یابد — در اولین ساخت APK به ۲ ارتقا می‌یابد |

منبع حقیقت: `packages/shared/src/version-core.ts`

## ۲) شماره Build در CI

- در GitHub Actions، `github.run_number` به‌عنوان شماره build استفاده می‌شود
  (خودکار، افزایشی، بدون دخالت دستی).
- نام Artifact: `nirookar-mobile-apk-build-<run_number>`.
- در ساخت محلی، شماره build باید به‌صورت دستی در `app.json` (`versionCode`) و
  `version-core.ts` (`APP_BUILD`) به‌روزرسانی شود.

## ۳) ساخت APK اندروید (اپ موبایل Expo)

**راه ۱ — GitHub Actions (توصیه‌شده):**
هر push به `main` جاب `mobile-apk` در `.github/workflows/ci.yml` را اجرا می‌کند:
`npm install` → `expo prebuild -p android` → `gradlew assembleRelease` →
Artifact قابل دانلود از تب Actions.

**راه ۲ — محلی:**
```bash
cd apps/mobile
npm install
npx expo prebuild -p android
cd android && ./gradlew assembleRelease
# خروجی: android/app/build/outputs/apk/release/app-release.apk
```

**راه ۳ — EAS (نیازمند اکانت Expo؛ توکن فقط در GitHub Secrets):**
```bash
npx eas build -p android --profile preview   # خروجی: APK قابل نصب
```

## ۴) ساخت وب (Next.js)

```bash
bun install
bun run build     # خروجی استاندارد Next.js
```

## ۵) چک‌لیست انتشار رسمی 1.0.0 (آینده — فقط با تأیید مالک)

- [ ] تکمیل فازهای تأییدشده و تست کامل
- [ ] تغییر `APP_VERSION` از `0.1.0` به `1.0.0` (در `version-core.ts`)
- [ ] به‌روزرسانی `app.json` (version: 1.0.0) و versionCode
- [ ] ساخت نسخه نهایی APK و وب
- [ ] برچسب Git: `v1.0.0` و انتشار Release رسمی
- [ ] به‌روزرسانی ماتریس امکانات و گزارش فاز

## ۶) قواعد ممنوعه

- ❌ انتشار نسخه آزمایشی به‌عنوان Release عمومی
- ❌ تغییر نسخه محصول بدون تصمیم مالک
- ❌ کاهش versionCode یا شماره build
- ❌ استفاده از شماره 1.0.0 برای نسخه‌های آزمایشی
