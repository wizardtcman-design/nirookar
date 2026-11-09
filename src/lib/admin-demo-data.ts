/**
 * ⚠️⚠️ داده‌های کاملاً «نمایشی» (Demo) پنل مدیریت — فاز ۱ ⚠️⚠️
 *
 * هیچ‌کدام از داده‌های این فایل واقعی نیستند؛ به هیچ سرور یا پایگاه داده‌ای
 * متصل نیستند و فقط برای نمایش طراحی اولیه پنل مدیریت استفاده می‌شوند.
 * در فاز Backend، این فایل به‌طور کامل با داده واقعی از API جایگزین می‌شود.
 */

export type DemoStatusTone = "green" | "amber" | "red" | "slate" | "teal";

export interface DemoUserRow {
  id: string;
  name: string;
  role: string;
  city: string;
  status: string;
  statusTone: DemoStatusTone;
  joinedAt: string;
}

export const DEMO_USERS: readonly DemoUserRow[] = [
  { id: "USR-1024", name: "سارا محمدی", role: "مشتری", city: "تهران", status: "فعال", statusTone: "green", joinedAt: "۱۴۰۳/۰۹/۱۲" },
  { id: "USR-1023", name: "رضا کریمی", role: "نصاب", city: "تهران", status: "فعال", statusTone: "green", joinedAt: "۱۴۰۳/۰۹/۱۰" },
  { id: "USR-1022", name: "فروشگاه آریا دکور", role: "فروشگاه", city: "تهران", status: "در انتظار تأیید", statusTone: "amber", joinedAt: "۱۴۰۳/۰۹/۰۸" },
  { id: "USR-1019", name: "امیر حسینی", role: "مشتری", city: "تهران", status: "غیرفعال", statusTone: "slate", joinedAt: "۱۴۰۳/۰۸/۲۵" },
  { id: "USR-1014", name: "حسین رستمی", role: "نصاب", city: "تهران", status: "مسدود", statusTone: "red", joinedAt: "۱۴۰۳/۰۸/۰۲" },
] as const;

export interface DemoShopRow {
  id: string;
  name: string;
  category: string;
  city: string;
  documents: string;
  documentsTone: DemoStatusTone;
  ordersCount: string;
  status: string;
  statusTone: DemoStatusTone;
}

export const DEMO_SHOPS: readonly DemoShopRow[] = [
  { id: "SHP-201", name: "گالری دکوراسیون مهر", category: "دکوراسیون داخلی", city: "تهران", documents: "تأییدشده", documentsTone: "green", ordersCount: "۴۸", status: "همکار فعال", statusTone: "green" },
  { id: "SHP-202", name: "آریا کابینت", category: "نصب کابینت", city: "تهران", documents: "تأییدشده", documentsTone: "green", ordersCount: "۳۱", status: "همکار فعال", statusTone: "green" },
  { id: "SHP-203", name: "فروشگاه پرده هلال", category: "پرده و کرکره", city: "تهران", documents: "در انتظار تأیید", documentsTone: "amber", ordersCount: "۰", status: "در حال بررسی", statusTone: "amber" },
  { id: "SHP-204", name: "پارکت پارس", category: "کف‌پوش و پارکت", city: "تهران", documents: "نیازمند تکمیل", documentsTone: "red", ordersCount: "۵", status: "معلق", statusTone: "red" },
] as const;

export interface DemoInstallerRow {
  id: string;
  name: string;
  skills: string;
  city: string;
  ordersDone: string;
  rating: string;
  status: string;
  statusTone: DemoStatusTone;
}

export const DEMO_INSTALLERS: readonly DemoInstallerRow[] = [
  { id: "INS-301", name: "رضا کریمی", skills: "کابینت، کمد دیواری", city: "تهران", ordersDone: "۶۴", rating: "۴٫۸", status: "فعال", statusTone: "green" },
  { id: "INS-302", name: "مجید صادقی", skills: "پرده و کرکره", city: "تهران", ordersDone: "۴۱", rating: "۴٫۶", status: "فعال", statusTone: "green" },
  { id: "INS-303", name: "حسین رستمی", skills: "کف‌پوش و پارکت", city: "تهران", ordersDone: "۱۲", rating: "۳٫۹", status: "معلق", statusTone: "amber" },
  { id: "INS-304", name: "علی نادری", skills: "نورپردازی و لوستر", city: "تهران", ordersDone: "۲۷", rating: "۴٫۴", status: "فعال", statusTone: "green" },
] as const;

export interface DemoOrderRow {
  id: string;
  customer: string;
  service: string;
  provider: string;
  providerType: string;
  status: string;
  statusTone: DemoStatusTone;
  amount: string;
  date: string;
}

export const DEMO_ORDERS: readonly DemoOrderRow[] = [
  { id: "ORD-1001", customer: "سارا محمدی", service: "نصب کابینت آشپزخانه", provider: "آریا کابینت", providerType: "فروشگاه", status: "در حال انجام", statusTone: "teal", amount: "۱۸٬۵۰۰٬۰۰۰ تومان", date: "۱۴۰۳/۰۹/۱۴" },
  { id: "ORD-1002", customer: "نگار احمدی", service: "نصب پرده و کرکره", provider: "مجید صادقی", providerType: "نصاب", status: "تکمیل‌شده", statusTone: "green", amount: "۴٬۲۰۰٬۰۰۰ تومان", date: "۱۴۰۳/۰۹/۱۱" },
  { id: "ORD-1003", customer: "محمد توکلی", service: "کمد دیواری اتاق خواب", provider: "رضا کریمی", providerType: "نصاب", status: "جدید", statusTone: "amber", amount: "۹٬۸۰۰٬۰۰۰ تومان", date: "۱۴۰۳/۰۹/۱۶" },
  { id: "ORD-1004", customer: "الهام قاسمی", service: "کف‌پوش پارکت", provider: "پارکت پارس", providerType: "فروشگاه", status: "لغوشده", statusTone: "red", amount: "۱۲٬۰۰۰٬۰۰۰ تومان", date: "۱۴۰۳/۰۹/۰۵" },
] as const;

/** نمونه طراحی «تاریخچه تغییر وضعیت» — پایه پیگیری زنده سفارش در فاز ۲ */
export interface DemoOrderEvent {
  fromStatus: string;
  toStatus: string;
  actor: string;
  actorRole: string;
  date: string;
  time: string;
  note: string;
  attachment?: string;
}

export const DEMO_ORDER_TIMELINE: Record<string, readonly DemoOrderEvent[]> = {
  "ORD-1001": [
    { fromStatus: "—", toStatus: "جدید", actor: "سارا محمدی", actorRole: "مشتری", date: "۱۴۰۳/۰۹/۱۴", time: "۱۰:۲۴", note: "ثبت سفارش توسط مشتری" },
    { fromStatus: "جدید", toStatus: "تأیید و واگذاری", actor: "آریا کابینت", actorRole: "فروشگاه", date: "۱۴۰۳/۰۹/۱۴", time: "۱۲:۰۵", note: "فروشگاه سفارش را پذیرفت و نصاب تعیین شد" },
    { fromStatus: "تأیید و واگذاری", toStatus: "در حال انجام", actor: "رضا کریمی", actorRole: "نصاب", date: "۱۴۰۳/۰۹/۱۵", time: "۰۹:۰۰", note: "شروع کار نصب در محل مشتری", attachment: "عکس: پیش از نصب" },
  ] as const,
  "ORD-1002": [
    { fromStatus: "—", toStatus: "جدید", actor: "نگار احمدی", actorRole: "مشتری", date: "۱۴۰۳/۰۹/۱۱", time: "۰۸:۴۰", note: "ثبت سفارش" },
    { fromStatus: "جدید", toStatus: "در حال انجام", actor: "مجید صادقی", actorRole: "نصاب", date: "۱۴۰۳/۰۹/۱۱", time: "۱۴:۱۰", note: "مراجعه به محل" },
    { fromStatus: "در حال انجام", toStatus: "تکمیل‌شده", actor: "مجید صادقی", actorRole: "نصاب", date: "۱۴۰۳/۰۹/۱۱", time: "۱۸:۳۵", note: "پایان کار و تأیید مشتری", attachment: "عکس: پس از نصب" },
  ] as const,
} as const;

export const DEMO_FINANCE = {
  totalRevenue: "۱۸۴٬۵۰۰٬۰۰۰ تومان",
  commission: "۲۷٬۶۷۵٬۰۰۰ تومان",
  settled: "۱۴۱٬۲۰۰٬۰۰۰ تومان",
  debts: "۱۵٬۶۲۵٬۰۰۰ تومان",
  /** مقادیر درصدی نمایشی برای نمودار ساده ماهانه */
  monthly: [
    { month: "تیر", value: 38 },
    { month: "مرداد", value: 52 },
    { month: "شهریور", value: 47 },
    { month: "مهر", value: 66 },
    { month: "آبان", value: 74 },
    { month: "آذر", value: 88 },
  ] as const,
} as const;

export interface DemoViolationRow {
  id: string;
  title: string;
  complainant: string;
  respondent: string;
  amount: string;
  status: string;
  statusTone: DemoStatusTone;
  summary: string;
}

export const DEMO_VIOLATIONS: readonly DemoViolationRow[] = [
  { id: "VIO-501", title: "خسارت به کابینت حین نصب", complainant: "سارا محمدی", respondent: "آریا کابینت", amount: "۲٬۵۰۰٬۰۰۰ تومان", status: "در بررسی", statusTone: "amber", summary: "مشتری ادعای خط و خش روی بدنه کابینت دارد؛ منتظر مستندات تصویری طرفین." },
  { id: "VIO-502", title: "عدم حضور نصاب در زمان مقرر", complainant: "محمد توکلی", respondent: "حسین رستمی", amount: "—", status: "رسیدگی‌شده", statusTone: "green", summary: "نصاب علت فنی اعلام کرد؛ تذکر کتبی ثبت شد." },
  { id: "VIO-503", title: "اختلاف در مبلغ نهایی فاکتور", complainant: "الهام قاسمی", respondent: "پارکت پارس", amount: "۱٬۸۰۰٬۰۰۰ تومان", status: "در بررسی", statusTone: "amber", summary: "اختلاف بین برآورد اولیه و مبلغ نهایی؛ نیازمند بررسی قرارداد." },
] as const;

/** گروه‌های تنظیمات آینده پنل مدیریت — فقط جایگاه معماری، بدون عملیات واقعی */
export const ADMIN_SETTING_GROUPS: readonly { id: string; title: string; description: string }[] = [
  { id: "general", title: "تنظیمات عمومی", description: "نام پلتفرم، مناطق زمانی، اطلاعات پایه" },
  { id: "roles", title: "نقش‌ها و دسترسی‌ها", description: "مدیریت مدیران و سطوح مجوز (RBAC سمت سرور)" },
  { id: "commission", title: "تنظیمات کمیسیون", description: "درصد کمیسیون هر بخش و مدل‌های درآمدی" },
  { id: "cities", title: "مدیریت شهرها", description: "شهرهای فعال و صف گسترش — فعلاً فقط تهران فعال است" },
  { id: "categories", title: "دسته‌بندی خدمات", description: "مدیریت دسته‌های خدماتی و گسترش آینده" },
  { id: "notifications", title: "اطلاع‌رسانی", description: "قالب پیامک، اعلان درون‌اپ و ایمیل" },
] as const;
