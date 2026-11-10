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
    feature: "طراحی واکنش‌گرا (موبایل / تبلت / دسکتاپ) — هیچ دکمه‌ای در موبایل مخفی نیست",
    mobile: "yes",
    web: "yes",
    phase: "۱",
    status: "done",
    needsBackend: false,
    note: "0.1.3: جراحی کامل موبایل ۳۶۰ تا ۴۳۰px — نوار پایین ۴ تب (خانه/راهنما/وضعیت/درباره ما)، هدر دونقطه‌ای ادمین، چیپ وضعیت زیر اطلاعات پنل‌ها؛ همه دکمه‌ها و لینک‌ها قابل دسترس",
  },
  {
    id: "vazirmatn-font",
    feature: "فونت سراسری وزیرمتن (Vazirmatn) با وزن‌های متغیر و اعداد خوانا",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "0.1.3: next/font سلف‌هاست (subset عربی + لاتین، وزن ۱۰۰ تا ۹۰۰) روی همه صفحات وب، پنل‌های کاربری و پنل مدیریت؛ اپ موبایل در گام اتصال به API",
  },
  {
    id: "multi-role-uniqueness",
    feature: "یکتایی کد ملی/موبایل به‌ازای هر نقش (چندنقشی) + ورود نقش‌آگاه",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "0.1.3: قفل ترکیبی (nationalId, role) و (phone, role) در دیتابیس؛ هشدار ادمین فقط برای تکرار در همان نقش؛ ورود با رمز/OTP اولویت نقش فرم را اعمال می‌کند",
  },
  {
    id: "seed-password",
    feature: "رمز پیش‌فرض ۱۲۳۴۵۶ برای حساب‌های Seed و مدیران Sandbox",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "0.1.3: با خاموش بودن otpEnabled بدون تغییر تنظیمات می‌توان با موبایل + رمز ۱۲۳۴۵۶ وارد شد (وب و پنل ادمین)",
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
    feature: "ورود دوحالته (رمز عبور پیش‌فرض / OTP با سوئیچ ادمین) + احراز هویت واقعی سمت سرور",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "0.1.2: سوئیچ otpEnabled (پیش‌فرض خاموش) — ورود با موبایل + رمز (scrypt سمت سرور)؛ روشن کردن آن جریان کد تأیید (الان Sandbox) را برمی‌گرداند — اپ موبایل: گام بعدی فاز ۲",
  },
  {
    id: "registration",
    feature: "ثبت‌نام اولیه سه نقش (موبایل + کد ملی یکتا + نام + رمز عبور + فیلد اختصاصی نقش)",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "0.1.2: ثبت‌نام مینیمال و ورود بلافاصله به پنل شخصی؛ وضعیت اولیه نصاب/فروشگاه INCOMPLETE — کد ملی برای همه نقش‌ها الزامی و یکتا است",
  },
  {
    id: "profile-verification",
    feature: "کارت «تکمیل احراز هویت و مدارک» در پنل شخصی نصاب/فروشگاه",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "0.1.2: کد پستی ۱۰ رقمی (استاندارد ایران: پنج رقم اول بدون ۰ و ۲) + آدرس + شبا + عکس پروفایل/کارت ملی — ارسال/ویرایش تا ACTIVE؛ پس از ارسال PENDING_VERIFICATION",
  },
  {
    id: "personal-panels",
    feature: "پنل شخصی سه نقش (#/panel/...) با ورود بلافاصله پس از ثبت‌نام/ورود",
    mobile: "no",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "0.1.2: نصاب/فروشگاه: کارت مدارک + خلاصه پرونده؛ مشتری: حساب + اعلام صادقانه گام بعدی",
  },
  {
    id: "postal-code",
    feature: "اعتبارسنجی کد پستی ایران (۱۰ رقم، پنج رقم اول بدون ۰ و ۲)",
    mobile: "yes",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "در packages/shared مشترک — فرم پنل شخصی و سرور یکی است",
  },
  {
    id: "national-id",
    feature: "صحت‌سنجی ریاضی کد ملی + جلوگیری از ثبت تکراری (به‌ازای هر نقش)",
    mobile: "yes",
    web: "yes",
    phase: "۲",
    status: "done",
    needsBackend: false,
    note: "الگوریتم در packages/shared مشترک است؛ تکراری بودن در همان نقش سمت سرور + هشدار به ادمین (Audit Log) — نقش‌های دیگر آزادند (0.1.3)",
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

/** اقلام انجام‌شده فاز ۲ گام ۲ (نسخه 0.1.2 — بیلد 003) */
export const PHASE2_STEP2_DONE: readonly string[] = [
  "سوئیچ otpEnabled در تنظیمات پنل (پیش‌فرض خاموش): ورود/ثبت‌نام بدون نیاز به کد پیامکی تا خرید پنل پیامک",
  "ورود با شماره موبایل + رمز عبور — هش scrypt با salt اختصاصی و مقایسه زمان‌ایمن (بدون ذخیره رمز خام)",
  "ثبت‌نام اولیه همه نقش‌ها: موبایل + کد ملی (الزامی و یکتا در سراسر پلتفرم) + نام + رمز + تخصص/سابقه نصاب یا نام فروشگاه",
  "ورود بلافاصله به پنل شخصی پس از ثبت‌نام (#/panel/customer | installer | shop)",
  "کارت مرحله‌ای «تکمیل احراز هویت و مدارک» در پنل نصاب/فروشگاه: کد پستی، آدرس محرمانه، شبا، عکس پروفایل و کارت ملی — ثبت/ویرایش تا ACTIVE",
  "اعتبارسنجی کد پستی ایران (۱۰ رقم؛ پنج رقم اول بدون ۰ و ۲) در packages/shared مشترک بین UI و سرور",
  "API پروفایل شخصی (/api/profile) و ارسال مدارک (/api/profile/documents) با Audit Log کامل",
  "وضعیت جدید INCOMPLETE در پنل ادمین: چیپ ناقص، شمارنده داشبورد و قفل تأیید حضوری تا تکمیل مدارک",
];

/** اقلام انجام‌شده فاز ۲ گام ۳ (نسخه 0.1.3 — بیلد 004) */
export const PHASE2_STEP3_DONE: readonly string[] = [
  "فونت سراسری وزیرمتن (Vazirmatn) — سلف‌هاست با next/font، وزن متغیر ۱۰۰ تا ۹۰۰، روی همه صفحات وب و پنل‌ها",
  "جراحی کامل ریسپانسیو موبایل (۳۶۰ تا ۴۳۰px): نوار پایین ۴ تب (افزودن «وضعیت توسعه»)، هدر دونقطه‌ای پنل ادمین، چیپ وضعیت زیر اطلاعات پنل‌های شخصی — هیچ دکمه/لینکی در موبایل مخفی نیست",
  "قانون یکتایی به‌ازای هر نقش: قفل ترکیبی (nationalId, role) و (phone, role)؛ یک نفر در هر نقش یک حساب ولی می‌تواند نقش‌های دیگر هم داشته باشد",
  "هشدار ادمین (Audit Log) فقط برای تلاش ثبت تکراری در «همان نقش» با برچسب scope=SAME_ROLE",
  "ورود نقش‌آگاه: رمز عبور و کد تأیید اولویت نقش فرم را اعمال می‌کنند (حساب‌های چندنقشی روی یک موبایل)",
  "رمز پیش‌فرض ۱۲۳۴۵۶ برای همه حساب‌های Seed و مدیران Sandbox (ورود مستقیم با خاموش بودن OTP — وب و پنل مدیریت)",
  "راهنمای اسکرول افقی جدول‌های عریض (ماتریس امکانات و RBAC) در موبایل",
];

/** اقلام زیرساختی بیلد 007 (0.1.3 — بهینه‌سازی انتشار) */
export const BUILD007_INFRA_DONE: readonly string[] = [
  "امضای دیجیتال ثابت و دائمی (Keystore واحد در مخزن) — از بیلد 007 به بعد همه APKها با یک گواهی امضا می‌شوند و نسخه جدید بدون حذف نسخه قبلی، به‌صورت به‌روزرسانی نصب می‌شود",
  "کاهش حجم APK با محدودسازی معماری به arm64-v8a (حذف armeabi-v7a و x86/x86_64 شبیه‌ساز)",
  "فشرده‌سازی کتابخانه‌های Native داخل APK (useLegacyPackaging)",
  "کوچک‌سازی کد با R8/ProGuard (Minify) و حذف منابع بلااستفاده (Shrink Resources)",
  "فشرده‌سازی باندل Hermes داخل APK و ارتقای versionCode به 7 با قانون افزایش خودکار در هر بیلد CI",
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
