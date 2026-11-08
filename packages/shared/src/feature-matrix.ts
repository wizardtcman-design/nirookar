/**
 * ماتریس تطبیق امکانات (Feature Parity Matrix).
 *
 * هدف: هیچ قابلیتی در اپ موبایل یا وب «فراموش» نشود. برای هر قابلیت مشخص است
 * در کدام پلتفرم وجود دارد، در چه فازی ساخته می‌شود و به Backend نیاز دارد یا نه.
 * این ماتریس باید در پایان هر فاز به‌روزرسانی شود.
 *
 * همین داده در صفحه «وضعیت توسعه» وب نمایش داده می‌شود تا وضعیت پروژه همیشه
 * شفاف و قابل بررسی باشد.
 */

export type PlatformAvailability = "yes" | "no";
export type BuildStatus = "done" | "planned" | "backend";
export type MatrixPhase = "۱" | "۲" | "۳" | "آینده";

export interface FeatureMatrixRow {
  id: string;
  feature: string;
  /** وجود در اپ موبایل (Expo / React Native) */
  mobile: PlatformAvailability;
  /** وجود در وب‌سایت (Next.js) */
  web: PlatformAvailability;
  phase: MatrixPhase;
  status: BuildStatus;
  needsBackend: boolean;
  note?: string;
}

export const FEATURE_MATRIX: readonly FeatureMatrixRow[] = [
  {
    id: "home-entries",
    feature: "صفحه آغازین و سه مسیر ورود (مشتری / نصاب / فروشگاه)",
    mobile: "yes",
    web: "yes",
    phase: "۱",
    status: "done",
    needsBackend: false,
  },
  {
    id: "login-forms",
    feature: "فرم‌های ورود سه نقش + اعتبارسنجی اولیه",
    mobile: "yes",
    web: "yes",
    phase: "۱",
    status: "done",
    needsBackend: false,
  },
  {
    id: "navigation",
    feature: "ناوبری واقعی بین صفحات (پشتیبانی از بازگشت)",
    mobile: "yes",
    web: "yes",
    phase: "۱",
    status: "done",
    needsBackend: false,
  },
  {
    id: "guide-about",
    feature: "صفحات راهنما و درباره ما با محتوای صادقانه",
    mobile: "yes",
    web: "yes",
    phase: "۱",
    status: "done",
    needsBackend: false,
  },
  {
    id: "responsive",
    feature: "طراحی واکنش‌گرا (موبایل / تبلت / دسکتاپ)",
    mobile: "yes",
    web: "yes",
    phase: "۱",
    status: "done",
    needsBackend: false,
    note: "وب: چیدمان واکنش‌گرا؛ موبایل: تجربه بومی با ورود اپلیکیشن",
  },
  {
    id: "admin-structure",
    feature: "ساختار، طراحی اولیه و مسیرهای پنل مدیریت + RBAC",
    mobile: "no",
    web: "yes",
    phase: "۱",
    status: "done",
    needsBackend: true,
    note: "طبق معماری، پنل مدیریت وب مستقل است و داخل اپ عمومی قرار نمی‌گیرد",
  },
  {
    id: "dev-status",
    feature: "صفحه وضعیت توسعه و ماتریس امکانات (شفافیت)",
    mobile: "no",
    web: "yes",
    phase: "۱",
    status: "done",
    needsBackend: false,
    note: "صفحه اطلاع‌رسانی است؛ در اپ عمومی جایی ندارد",
  },
  {
    id: "auth-real",
    feature: "احراز هویت و ثبت‌نام واقعی (مشتری / نصاب / فروشگاه)",
    mobile: "no",
    web: "no",
    phase: "۲",
    status: "backend",
    needsBackend: true,
  },
  {
    id: "orders",
    feature: "ثبت سفارش خدمت و واگذاری به نصاب/فروشگاه",
    mobile: "no",
    web: "no",
    phase: "۲",
    status: "backend",
    needsBackend: true,
  },
  {
    id: "order-tracking",
    feature: "پیگیری زنده سفارش با تاریخچه تغییر وضعیت (Audit)",
    mobile: "no",
    web: "no",
    phase: "۲",
    status: "planned",
    needsBackend: true,
    note: "هر تغییر وضعیت: وضعیت قبلی/جدید، شخص، زمان، توضیح و مستندات — بدون امکان دستکاری سوابق",
  },
  {
    id: "shop-products",
    feature: "مدیریت محصولات و خدمات فروشگاه‌ها",
    mobile: "no",
    web: "no",
    phase: "۲",
    status: "backend",
    needsBackend: true,
  },
  {
    id: "notifications",
    feature: "اعلان‌ها (درون‌اپ و پیامک)",
    mobile: "no",
    web: "no",
    phase: "۲",
    status: "backend",
    needsBackend: true,
  },
  {
    id: "ratings",
    feature: "امتیازدهی و نظرات",
    mobile: "no",
    web: "no",
    phase: "۳",
    status: "planned",
    needsBackend: true,
  },
  {
    id: "chat",
    feature: "گفتگوی مشتری / نصاب / فروشگاه",
    mobile: "no",
    web: "no",
    phase: "۳",
    status: "planned",
    needsBackend: true,
  },
  {
    id: "payment",
    feature: "پرداخت واقعی و تسویه‌حساب",
    mobile: "no",
    web: "no",
    phase: "۳",
    status: "backend",
    needsBackend: true,
  },
  {
    id: "commission",
    feature: "سیستم عملیاتی کمیسیون و مدل‌های درآمدی",
    mobile: "no",
    web: "no",
    phase: "۳",
    status: "backend",
    needsBackend: true,
    note: "کمیسیون سفارش، اشتراک ماهانه، خدمات ویژه — معماری از فاز ۱ در نظر گرفته شده",
  },
  {
    id: "violations-ops",
    feature: "رسیدگی عملیاتی به شکایت و جبران خسارت مشتری",
    mobile: "no",
    web: "no",
    phase: "۳",
    status: "planned",
    needsBackend: true,
    note: "سازوکار نهایی نیازمند بررسی حقوقی و تأیید مالک است",
  },
  {
    id: "driver-role",
    feature: "نقش راننده وانت‌بار / شرکت حمل‌ونقل",
    mobile: "no",
    web: "no",
    phase: "آینده",
    status: "planned",
    needsBackend: true,
    note: "فقط در سطح معماری ثبت شده (FUTURE_ROLES) — بدون UI",
  },
] as const;

/** اقلام انجام‌شده فاز ۱ — منبع: گزارش واقعی توسعه */
export const PHASE1_DONE: readonly string[] = [
  "وب‌سایت Next.js: صفحه اصلی، سه مسیر ورود، راهنما، درباره ما — با ناوبری واقعی hash",
  "طراحی واکنش‌گرا وب برای موبایل، تبلت و دسکتاپ",
  "اعتبارسنجی اولیه فرم‌ها (موبایل 09xxxxxxxxx، ایمیل، رمز ≥۶ کاراکتر، ارقام فارسی)",
  "ساختار و طراحی اولیه پنل مدیریت (ورود نمایشی، داشبورد، ۹ منو، ماتریس RBAC)",
  "اپ موبایل Expo / React Native با همان صفحات و فرم‌های فاز ۱",
  "پکیج مشترک packages/shared (نقش‌ها، RBAC، اعتبارسنجی، ماتریس امکانات)",
  "مستندات معماری، نسخه‌بندی، امنیت و نقشه راه + GitHub Actions (وب و موبایل)",
];

/** اقلامی که عمداً در فاز ۱ ساخته نشده‌اند — نیازمند تأیید مالک برای فاز بعد */
export const PHASE1_EXCLUDED: readonly string[] = [
  "Backend عملیاتی و پایگاه داده واقعی",
  "احراز هویت / ثبت‌نام واقعی متصل به سرور",
  "ثبت و پیگیری سفارش، پرداخت، تسویه و سیستم واقعی کمیسیون",
  "ارسال پیامک و اتصال به سرویس‌های خارجی",
  "ذخیره اطلاعات کاربران واقعی",
  "سیستم عملیاتی رسیدگی به شکایت‌ها و جبران خسارت",
];
