/**
 * مدل تنظیمات پویا (Dynamic Platform Config) — قانون «صفر درصد هاردکد».
 *
 * هیچ عدد مالی یا زمانی مجاز به هاردکد شدن در کد نیست؛ همه‌ی مقادیر تجاری
 * از این مدل خوانده می‌شوند که در پنل مدیریت به‌صورت زنده قابل ویرایش است و
 * در پایگاه داده ذخیره می‌شود. مقادیر پیش‌فرض فقط «مقدار اولیه» هستند.
 *
 * قوانین تجاری ثبت‌شده (دستور مالک — فاز ۲):
 * ۱) مدل درآمد از نصاب: درصدی (پیش‌فرض ۱۵٪) / مبلغ ثابت / اشتراک ماهانه
 * ۲) سهم فروشگاه معرف: پیش‌فرض ۵٪ — از محل کارمزد پلتفرم کسر می‌شود نه سهم نصاب
 * ۳) مدل درآمد از غرفه فروشگاه‌ها: رایگان / اشتراک ماهانه / درصدی از فروش
 * ۴) گارانتی نصب: فعال/غیرفعال + مدت برای هر دسته شغلی
 * ۵) اولویت نصاب وابسته به فروشگاه: پیش‌فرض ۲ ساعت (قانون ۲۴ ساعت قبلی حذف شد)
 * ۶) مهلت تأیید کار توسط مشتری: پیش‌فرض ۲۴ ساعت + تسویه با نصاب ظرف ۲۴ ساعت
 */

/** مدل درآمد پلتفرم از نصاب‌ها */
export type InstallerRevenueModel = "PERCENTAGE" | "FIXED" | "SUBSCRIPTION";

/** مدل درآمد پلتفرم از غرفه فروشگاه‌ها */
export type ShopBoothModel = "FREE" | "SUBSCRIPTION" | "SALES_PERCENTAGE";

/** سه روش قیمت‌گذاری سفارش (ضد تبانی — بازدید حضوری رایگان ممنوع است) */
export type PricingMethodId = "SMART_CALCULATOR" | "PHOTO_VIDEO_VISIT" | "ON_SITE_DEPOSIT";

/** پیکربندی گارانتی برای یک دسته شغلی */
export interface WarrantyCategoryConfig {
  /** کلید دسته شغلی — همان کلیدهای تخصص‌ها (specialties) */
  categoryKey: string;
  /** مدت گارانتی به ماه */
  months: number;
  /** مدت گارانتی اضافی به روز (برای تنظیم دقیق) */
  extraDays: number;
}

/** مدل کامل تنظیمات پلتفرم — منبع یگانه اعداد تجاری */
export interface PlatformSettings {
  // ── درآمد از نصاب ──
  installerRevenueModel: InstallerRevenueModel;
  /** درصد کارمزد (اگر مدل PERCENTAGE) — پیش‌فرض ۱۵ */
  installerRevenuePercentage: number;
  /** مبلغ ثابت به تومان (اگر مدل FIXED) */
  installerRevenueFixedAmount: number;
  /** اشتراک ماهانه نصاب به تومان (اگر مدل SUBSCRIPTION) */
  installerSubscriptionMonthly: number;

  // ── سهم فروشگاه معرف ──
  /** درصد سهم فروشگاه معرف — از محل کارمزد پلتفرم پرداخت می‌شود (پیش‌فرض ۵) */
  referrerShopSharePercentage: number;

  // ── غرفه فروشگاه ──
  shopBoothModel: ShopBoothModel;
  shopBoothSubscriptionMonthly: number;
  shopBoothSalesPercentage: number;

  // ── بیعانه بازدید حضوری (قانون ضد تبانی) ──
  /** حداقل مبلغ بیعانه به تومان (پیش‌فرض ۵۰۰٬۰۰۰) */
  visitDepositMin: number;
  /** حداکثر مبلغ بیعانه به تومان (پیش‌فرض ۱٬۰۰۰٬۰۰۰) */
  visitDepositMax: number;
  /** مبلغ پیش‌فرض بیعانه که در اپ نمایش داده می‌شود */
  visitDepositDefault: number;
  /** سهم پلتفرم از بیعانه سوخته (درصد) — باقی با نصاب */
  visitDepositBurnPlatformShare: number;

  // ── گارانتی نصب ──
  warrantyEnabled: boolean;
  warrantyCategories: readonly WarrantyCategoryConfig[];

  // ── زمان‌بندی‌ها (ساعت) ──
  /** اولویت نصاب وابسته به فروشگاه — پیش‌فرض ۲ ساعت */
  affiliatedInstallerPriorityHours: number;
  /** مهلت تأیید کار توسط مشتری پس از آپلود عکس پایان کار — پیش‌فرض ۲۴ ساعت */
  customerApprovalDeadlineHours: number;
  /** مهلت تسویه‌حساب با نصاب پس از تأیید — پیش‌فرض ۲۴ ساعت */
  settlementDeadlineHours: number;
  /** حداکثر طول ویدئوی بازدید تصویری به ثانیه — پیش‌فرض ۱۵ */
  videoMaxSeconds: number;

  // ── روش‌های قیمت‌گذاری (روشن/خاموش هر روش) ──
  pricingMethodsEnabled: Record<PricingMethodId, boolean>;

  // ── خرید اقساطی (BNPL) ──
  bnplEnabled: boolean;
  /** تعداد اقساط — پیش‌فرض ۴ */
  bnplInstallments: number;
  /** برچسب نمایشی اقساط */
  bnplLabel: string;

  // ── پلیس خودکار چت (ضد خروج تراکنش از اپ) ──
  chatPoliceEnabled: boolean;

  // ── شهرهای فعال پلتفرم (قابل تعریف از پنل — بدون هاردکد شهر) ──
  cities: readonly string[];
}

/** مقادیر پیش‌فرض — فقط مقدار اولیه سیستم؛ ادمین می‌تواند همه را زنده تغییر دهد */
export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  installerRevenueModel: "PERCENTAGE",
  installerRevenuePercentage: 15,
  installerRevenueFixedAmount: 0,
  installerSubscriptionMonthly: 0,

  referrerShopSharePercentage: 5,

  shopBoothModel: "FREE",
  shopBoothSubscriptionMonthly: 0,
  shopBoothSalesPercentage: 0,

  visitDepositMin: 500_000,
  visitDepositMax: 1_000_000,
  visitDepositDefault: 500_000,
  visitDepositBurnPlatformShare: 30,

  warrantyEnabled: true,
  warrantyCategories: [],

  affiliatedInstallerPriorityHours: 2,
  customerApprovalDeadlineHours: 24,
  settlementDeadlineHours: 24,
  videoMaxSeconds: 15,

  pricingMethodsEnabled: {
    SMART_CALCULATOR: true,
    PHOTO_VIDEO_VISIT: true,
    ON_SITE_DEPOSIT: true,
  },

  bnplEnabled: true,
  bnplInstallments: 4,
  bnplLabel: "امکان پرداخت در ۴ قسط بدون چک و ضامن",

  chatPoliceEnabled: true,

  cities: ["تهران"],
};

/** برچسب‌های فارسی مدل درآمد نصاب */
export const INSTALLER_REVENUE_MODEL_FA: Record<InstallerRevenueModel, string> = {
  PERCENTAGE: "درصدی از هر سفارش",
  FIXED: "مبلغ ثابت هر سفارش",
  SUBSCRIPTION: "اشتراک ماهانه",
};

/** برچسب‌های فارسی مدل غرفه فروشگاه */
export const SHOP_BOOTH_MODEL_FA: Record<ShopBoothModel, string> = {
  FREE: "کاملاً رایگان",
  SUBSCRIPTION: "اشتراک ماهانه",
  SALES_PERCENTAGE: "درصدی از فروش",
};

/** برچسب‌های فارسی سه روش قیمت‌گذاری + توضیح صادقانه هر روش */
export const PRICING_METHOD_FA: Record<PricingMethodId, { title: string; description: string }> = {
  SMART_CALCULATOR: {
    title: "محاسبه هوشمند (متراژ/تعداد)",
    description:
      "مشتری متراژ یا تعداد را وارد می‌کند و قیمت دقیق نصب لحظه‌ای محاسبه می‌شود.",
  },
  PHOTO_VIDEO_VISIT: {
    title: "بازدید تصویری رایگان",
    description:
      "مشتری عکس و ویدئوی کوتاه می‌فرستد و نصاب‌ها قیمت می‌دهند؛ شماره تماس و آدرس دقیق تا قبل از پرداخت قفل است.",
  },
  ON_SITE_DEPOSIT: {
    title: "بازدید حضوری با بیعانه اجباری",
    description:
      "مشتری بیعانه بازدید را پرداخت امانی می‌کند تا آدرس باز شود؛ در صورت ثبت سفارش اصلی، بیعانه از فاکتور نهایی کسر می‌شود و در صورت لغو برای کار خارج از اپ، سوخت و بین پلتفرم و نصاب تقسیم می‌شود.",
  },
};

/** قواعد اعتبارسنجی مقادیر تنظیمات (سمت پنل و سرور یکی است) */
export const PLATFORM_SETTINGS_LIMITS = {
  percentage: { min: 0, max: 100 },
  fixedAmount: { min: 0, max: 10_000_000_000 },
  deposit: { min: 0, max: 100_000_000 },
  hours: { min: 0.5, max: 720 },
  videoSeconds: { min: 5, max: 120 },
  bnplInstallments: { min: 2, max: 12 },
  warrantyMonths: { min: 0, max: 120 },
  warrantyExtraDays: { min: 0, max: 365 },
} as const;

/** محدود کردن عدد ورودی به بازه مجاز — در پنل ادمین و سرور یکسان استفاده می‌شود */
export function clampToRange(value: number, range: { min: number; max: number }): number {
  if (Number.isNaN(value)) return range.min;
  return Math.min(range.max, Math.max(range.min, value));
}

/**
 * پاک‌سازی و اعتبارسنجی شیء تنظیمات ورودی از پنل ادمین.
 * هر فیلد نامعتبر به مقدار مجاز clamp می‌شود تا تنظیمات همیشه سازگار بماند.
 */
export function sanitizePlatformSettings(input: Partial<PlatformSettings>): PlatformSettings {
  const base = DEFAULT_PLATFORM_SETTINGS;
  const limits = PLATFORM_SETTINGS_LIMITS;

  const depositMin = clampToRange(Number(input.visitDepositMin ?? base.visitDepositMin), limits.deposit);
  const depositMax = clampToRange(Number(input.visitDepositMax ?? base.visitDepositMax), limits.deposit);

  return {
    installerRevenueModel:
      input.installerRevenueModel && ["PERCENTAGE", "FIXED", "SUBSCRIPTION"].includes(input.installerRevenueModel)
        ? input.installerRevenueModel
        : base.installerRevenueModel,
    installerRevenuePercentage: clampToRange(
      Number(input.installerRevenuePercentage ?? base.installerRevenuePercentage),
      limits.percentage,
    ),
    installerRevenueFixedAmount: clampToRange(
      Number(input.installerRevenueFixedAmount ?? base.installerRevenueFixedAmount),
      limits.fixedAmount,
    ),
    installerSubscriptionMonthly: clampToRange(
      Number(input.installerSubscriptionMonthly ?? base.installerSubscriptionMonthly),
      limits.fixedAmount,
    ),

    referrerShopSharePercentage: clampToRange(
      Number(input.referrerShopSharePercentage ?? base.referrerShopSharePercentage),
      limits.percentage,
    ),

    shopBoothModel:
      input.shopBoothModel && ["FREE", "SUBSCRIPTION", "SALES_PERCENTAGE"].includes(input.shopBoothModel)
        ? input.shopBoothModel
        : base.shopBoothModel,
    shopBoothSubscriptionMonthly: clampToRange(
      Number(input.shopBoothSubscriptionMonthly ?? base.shopBoothSubscriptionMonthly),
      limits.fixedAmount,
    ),
    shopBoothSalesPercentage: clampToRange(
      Number(input.shopBoothSalesPercentage ?? base.shopBoothSalesPercentage),
      limits.percentage,
    ),

    visitDepositMin: depositMin,
    visitDepositMax: Math.max(depositMin, depositMax),
    visitDepositDefault: clampToRange(
      Number(input.visitDepositDefault ?? base.visitDepositDefault),
      limits.deposit,
    ),
    visitDepositBurnPlatformShare: clampToRange(
      Number(input.visitDepositBurnPlatformShare ?? base.visitDepositBurnPlatformShare),
      limits.percentage,
    ),

    warrantyEnabled: Boolean(input.warrantyEnabled ?? base.warrantyEnabled),
    warrantyCategories: Array.isArray(input.warrantyCategories)
      ? input.warrantyCategories.map((category) => ({
          categoryKey: String(category.categoryKey ?? ""),
          months: clampToRange(Number(category.months ?? 0), limits.warrantyMonths),
          extraDays: clampToRange(Number(category.extraDays ?? 0), limits.warrantyExtraDays),
        }))
      : base.warrantyCategories,

    affiliatedInstallerPriorityHours: clampToRange(
      Number(input.affiliatedInstallerPriorityHours ?? base.affiliatedInstallerPriorityHours),
      limits.hours,
    ),
    customerApprovalDeadlineHours: clampToRange(
      Number(input.customerApprovalDeadlineHours ?? base.customerApprovalDeadlineHours),
      limits.hours,
    ),
    settlementDeadlineHours: clampToRange(
      Number(input.settlementDeadlineHours ?? base.settlementDeadlineHours),
      limits.hours,
    ),
    videoMaxSeconds: clampToRange(
      Number(input.videoMaxSeconds ?? base.videoMaxSeconds),
      limits.videoSeconds,
    ),

    pricingMethodsEnabled: {
      SMART_CALCULATOR: Boolean(input.pricingMethodsEnabled?.SMART_CALCULATOR ?? true),
      PHOTO_VIDEO_VISIT: Boolean(input.pricingMethodsEnabled?.PHOTO_VIDEO_VISIT ?? true),
      ON_SITE_DEPOSIT: Boolean(input.pricingMethodsEnabled?.ON_SITE_DEPOSIT ?? true),
    },

    bnplEnabled: Boolean(input.bnplEnabled ?? base.bnplEnabled),
    bnplInstallments: clampToRange(
      Number(input.bnplInstallments ?? base.bnplInstallments),
      limits.bnplInstallments,
    ),
    bnplLabel: (input.bnplLabel ?? base.bnplLabel).trim() || base.bnplLabel,

    chatPoliceEnabled: Boolean(input.chatPoliceEnabled ?? base.chatPoliceEnabled),

    cities:
      Array.isArray(input.cities) && input.cities.length > 0
        ? input.cities.map((city) => String(city).trim()).filter(Boolean).slice(0, 100)
        : base.cities,
  };
}

/**
 * محاسبه مبلغ هر قسط BNPL — یک‌چهارم (یا یک‌n‌اُم) مبلغ کل، گرد شده به پایین.
 * بدون هاردکد: تعداد اقساط از تنظیمات پویا خوانده می‌شود.
 */
export function calculateInstallment(totalAmount: number, installments: number): number {
  if (!totalAmount || totalAmount <= 0 || installments <= 0) return 0;
  return Math.floor(totalAmount / installments);
}
