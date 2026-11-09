/**
 * هسته مشترک نقش‌های پلتفرم — تنها منبع حقیقت «داده» نقش‌ها برای وب و موبایل.
 *
 * وب (src/lib/roles.ts) روی همین داده، آیکون و تم بصری اختصاصی خودش را سوار
 * می‌کند و موبایل (apps/mobile) نیز همین داده را با ظاهر React Native مصرف
 * می‌کند. افزودن نقش جدید = افزودن یک entry به همین رجیستری.
 *
 * نکته توسعه‌پذیری: نقش‌های آینده فقط در سطح معماری ثبت می‌شوند و هیچ UI
 * یا مسیری برای آن‌ها در فاز جاری ساخته نمی‌شود.
 */

/** نقش‌های فعال فاز ۱ */
export type CoreRole = "customer" | "installer" | "shop";

/** نوع فیلد شناسه ورود — نقش‌های آینده می‌توانند نوع جدید اضافه کنند */
export type IdentifierTypeCore = "email-or-phone" | "phone";

export interface RoleCoreData {
  id: CoreRole;
  title: string;
  subtitle: string;
  identifierLabel: string;
  identifierPlaceholder: string;
  identifierType: IdentifierTypeCore;
  submitLabel: string;
  /** نقش‌ها می‌توانند با enabled: false بدون حذف از رجیستری مدیریت شوند */
  enabled: boolean;
}

/** رجیستری نقش‌های فعال — داده خالص، بدون وابستگی به پلتفرم */
export const ROLE_CORE_REGISTRY: readonly RoleCoreData[] = [
  {
    id: "customer",
    title: "ورود مشتری",
    subtitle: "دسترسی به خدمات و سفارش‌ها",
    identifierLabel: "ایمیل یا شماره موبایل",
    identifierPlaceholder: "example@email.com | 09xxxxxxxxx",
    identifierType: "email-or-phone",
    submitLabel: "ورود به حساب مشتری",
    enabled: true,
  },
  {
    id: "installer",
    title: "ورود نصاب",
    subtitle: "برای متخصصان و نصابان",
    identifierLabel: "شماره موبایل",
    identifierPlaceholder: "09xxxxxxxxx",
    identifierType: "phone",
    submitLabel: "ورود به پنل نصاب",
    enabled: true,
  },
  {
    id: "shop",
    title: "ورود فروشگاه",
    subtitle: "مدیریت فروشگاه و محصولات",
    identifierLabel: "شماره موبایل",
    identifierPlaceholder: "09xxxxxxxxx",
    identifierType: "phone",
    submitLabel: "ورود به پنل فروشگاه",
    enabled: true,
  },
] as const;

export type FutureRoleId =
  | "driver"
  | "transport_company"
  | "repair_specialist"
  | "platform_admin";

export interface FutureRoleDefinition {
  id: FutureRoleId;
  title: string;
  /** توضیح صادقانه جایگاه نقش در نقشه راه — بدون هیچ UI عملیاتی در فاز ۱ */
  note: string;
}

/** نقش‌های آینده — فقط مرز معماری؛ ساخت UI برای آن‌ها نیازمند تأیید مالک است */
export const FUTURE_ROLES: readonly FutureRoleDefinition[] = [
  {
    id: "driver",
    title: "راننده وانت‌بار",
    note: "حمل کالا و اجناس فروشگاه‌ها — در نقشه راه فازهای آینده ثبت شده است",
  },
  {
    id: "transport_company",
    title: "شرکت حمل‌ونقل",
    note: "همکاری سازمانی برای حمل — نیازمند طراحی قرارداد و مدل درآمدی",
  },
  {
    id: "repair_specialist",
    title: "متخصص تعمیرات",
    note: "تعمیرات منزل و ساختمان — گسترش دسته‌بندی خدمات",
  },
  {
    id: "platform_admin",
    title: "مدیران پلتفرم",
    note: "دسترسی مدیران فقط از پنل مدیریت مستقل وب است، نه اپ عمومی مشتری/نصاب/فروشگاه",
  },
] as const;
