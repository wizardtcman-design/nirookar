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
    feature: "ورود OTP آزمایشی (Sandbox) + احراز هویت واقعی سمت سرور",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "وب: کد آزمایشی 12345 با نشست کوکی امن — اپ موبایل: گام بعدی فاز ۲ (نیازمند endpoint مستقر؛ عمداً موقتاً خارج)",
  },
  {
    id: "registration",
    feature: "ثبت‌نام سه نقش با فرم کامل (مشتری / نصاب / فروشگاه)",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "وب: کد ملی + شبا + تخصص‌ها + عکس؛ وضعیت نصاب/فروشگاه PENDING_VERIFICATION — اپ: گام بعدی",
  },
  {
    id: "national-id",
    feature: "صحت‌سنجی ریاضی کد ملی + جلوگیری از ثبت تکراری",
    mobile: "yes",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "الگوریتم در packages/shared مشترک است؛ تکراری بودن سمت سرور + هشدار به ادمین (Audit Log)",
  },
  {
    id: "admin-ops",
    feature: "پنل مدیریت متصل به داده واقعی + تأیید قرارداد و سفته نصاب",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "نصاب‌ها/فروشگاه‌ها/کاربران/داشبورد/Audit زنده از دیتابیس؛ سفارش‌ها و مالی هنوز نمایشی (برچسب‌دار)",
  },
  {
    id: "platform-settings",
    feature: "تنظیمات پویا (PlatformSettings) — قانون صفر درصد هاردکد",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "کمیسیون، سهم معرف، غرفه، بیعانه، گارانتی، زمان‌بندی‌ها، BNPL و شهرها از پنل قابل ویرایش زنده است",
  },
  {
    id: "orders",
    feature: "ثبت سفارش خدمت و واگذاری به نصاب/فروشگاه (سه روش قیمت‌گذاری)",
    mobile: "no",
    web: "no",
    phase: "۲",
    status: "planned",
    needsBackend: false,
    note: "سه روش: محاسبه هوشمند / بازدید تصویری / بازدید حضوری با بیعانه — مدل و تنظیمات پویا آماده است",
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
    feature: "گفتگوی مشتری / نصاب / فروشگاه + پلیس خودکار شماره و آیدی",
    mobile: "no",
    web: "no",
    phase: "۳",
    status: "planned",
    needsBackend: true,
    note: "قاعده سانسور شماره موبایل (ارقام/فاصله/حروف فارسی) و آیدی شبکه‌های اجتماعی تا قبل از پرداخت امانی — در تنظیمات قابل خاموش/روشن است",
  },
  {
    id: "bnpl",
    feature: "نمایش برچسب خرید اقساطی (BNPL — ۴ قسط بدون چک و ضامن)",
    mobile: "no",
    web: "no",
    phase: "۳",
    status: "planned",
    needsBackend: true,
    note: "مدل محاسبه قسط (calculateInstallment) و سوئیچ ادمین آماده است؛ نمایش واقعی با وجود محصولات/سفارش‌ها",
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
  "ساختار و طراحی اولیه پنل مدیریت (ورود، داشبورد، ۹ منو، ماتریس RBAC)",
  "اپ موبایل Expo / React Native با همان صفحات و فرم‌های فاز ۱",
  "پکیج مشترک packages/shared (نقش‌ها، RBAC، اعتبارسنجی، ماتریس امکانات)",
  "مستندات معماری، نسخه‌بندی، امنیت و نقشه راه + GitHub Actions (وب و موبایل)",
];

/** اقلام انجام‌شده فاز ۲ گام ۱ (نسخه 0.1.1 — بیلد 002) */
export const PHASE2_STEP1_DONE: readonly string[] = [
  "ورود OTP آزمایشی (Sandbox — کد 12345) با نشست کوکی امن سمت سرور",
  "ثبت‌نام سه نقش: مشتری (ساده) / نصاب و فروشگاه (کامل + کد ملی، شبا، عکس الزامی، PENDING_VERIFICATION)",
  "صحت‌سنجی ریاضی کد ملی ایران + جلوگیری از ثبت تکراری + هشدار ادمین",
  "API Routes واقعی (auth + admin) با کنترل دسترسی RBAC سمت سرور",
  "پنل ادمین متصل به دیتابیس: نصاب‌ها، فروشگاه‌ها، کاربران، داشبورد و Audit Log زنده",
  "تأیید حضوری «قرارداد و سفته» نصاب توسط ادمین با ثبت در Audit Log",
  "تنظیمات پویا ۱۰۰٪ عملیاتی: کمیسیون، سهم معرف، غرفه، بیعانه، گارانتی، زمان‌بندی‌ها، BNPL، شهرها",
  "حذف میراث Flutter طبق تأیید مالک — معماری موبایل قطعی: Expo / React Native",
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
