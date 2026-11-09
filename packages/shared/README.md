# packages/shared

کد و داده مشترک بین وب‌سایت (Next.js) و اپلیکیشن موبایل (Expo / React Native).

## محتوا

| فایل | توضیح |
|---|---|
| `src/roles-core.ts` | رجیستری نقش‌های فعال + نقش‌های آینده (فقط مرز معماری) |
| `src/validation.ts` | اعتبارسنجی مشترک ورودی‌ها (موبایل، ایمیل، رمز، ارقام فارسی) |
| `src/admin-rbac.ts` | نقش‌ها و مجوزهای پنل مدیریت (RBAC) |
| `src/feature-matrix.ts` | ماتریس تطبیق امکانات وب ↔ موبایل + وضعیت فاز ۱ |
| `src/version-core.ts` | نسخه محصول، شماره Build و برچسب فاز |

## قواعد

- فقط کد **خالص TypeScript بدون وابستگی به UI** در این پکیج قرار می‌گیرد.
- رابط کاربری وب و موبایل مشترک نمی‌شود؛ هر پلتفرم تجربه کاربری خودش را دارد.
- قراردادهای Service/Repository آینده برای اتصال Backend نیز در همین پکیج توسعه می‌یابند تا تغییر Backend نیازمند بازنویسی UI نباشد.

## مصرف در وب

از طریق مسیر `@shared/*` در `tsconfig.json` ریشه (مثال: `import { roleHasPermission } from "@shared/admin-rbac"`).

## مصرف در موبایل

از طریق `tsconfig.json` و `metro.config.js` در `apps/mobile` (watchFolders به ریشه Monorepo).
