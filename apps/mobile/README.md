# نیروکار موبایل — Expo / React Native / TypeScript

اپلیکیشن موبایل واقعی (نه WebView) با همان صفحات و فرم‌های فاز ۱ وب:

- صفحه آغازین با سه مسیر ورود (مشتری / نصاب / فروشگاه)
- فرم‌های ورود با اعتبارسنجی مشترک (`packages/shared`)
- صفحات راهنما و درباره ما با محتوای صادقانه
- ناوبری واقعی (expo-router) و RTL فارسی

## اجرای محلی

```bash
cd apps/mobile
npm install          # یا bun install
npx expo start       # سپس با Expo Go یا شبیه‌ساز اجرا کنید
```

برای هم‌ترازسازی نسخه وابستگی‌ها با SDK نصب‌شده:
```bash
npx expo install --fix
```

## نکات مهم

- **RTL:** فعال‌سازی RTL با `I18nManager` انجام می‌شود؛ در اندروید/iOS پس از
  اولین اجرا یک‌بار باید اپ بازراه‌اندازی شود (رفتار استاندارد React Native).
- **داده مشترک:** نقش‌ها، اعتبارسنجی و نسخه از `packages/shared` خوانده می‌شود
  (تنظیم شده در `metro.config.js` و `tsconfig.json`).
- **شفافیت فاز ۱:** ارسال فرم به سرور عمداً انجام نمی‌شود و پیام صادقانه
  «اتصال در فاز ۱ فعال نیست» نمایش داده می‌شود.
- **بدون کلید محرمانه:** هیچ توکن یا Secret در کد قرار ندارد.

## ساخت APK اندروید

دو راه (هر دو مستند به `docs/VERSIONING.md`):

1. **GitHub Actions:** با هر push به `main` جاب `mobile-apk` فایل
   `app-release.apk` می‌سازد و به‌عنوان Artifact قرار می‌دهد
   (build number = `github.run_number`).
2. **محلی / EAS:**
   ```bash
   npm install
   npx expo prebuild -p android
   cd android && ./gradlew assembleRelease
   # خروجی: android/app/build/outputs/apk/release/app-release.apk
   ```
   یا با اکانت EAS: `npx eas build -p android --profile preview`
