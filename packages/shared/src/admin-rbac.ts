/**
 * مدل نقش‌ها و دسترسی‌های پنل مدیریت (RBAC).
 *
 * در فاز ۱ این مدل فقط «طراحی و نمایش» است: پنل مدیریت وب با همین داده‌ها
 * منوها را بر اساس نقش فیلتر می‌کند تا معماری دسترسی به‌صورت واقعی دیده شود.
 *
 * ⚠️ اصل امنیتی پروژه: کنترل دسترسی واقعی باید در فاز Backend به‌صورت
 * سمت سرور اجرا شود؛ مخفی‌کردن دکمه در رابط کاربری هرگز کنترل امنیتی نیست.
 */

export type AdminRole =
  | "super_admin"
  | "ops_manager"
  | "finance_manager"
  | "support_specialist"
  | "auditor";

export type AdminPermission =
  | "dashboard.view"
  | "users.view"
  | "users.manage"
  | "shops.view"
  | "shops.manage"
  | "installers.view"
  | "installers.manage"
  | "orders.view"
  | "orders.manage"
  | "finance.view"
  | "finance.manage"
  | "violations.view"
  | "violations.manage"
  | "reports.view"
  | "settings.view"
  | "settings.manage"
  | "audit.view";

/** عنوان و شرح نقش‌های مدیریتی (فارسی) */
export const ADMIN_ROLE_FA: Record<AdminRole, { title: string; description: string }> = {
  super_admin: {
    title: "مدیر کل",
    description: "دسترسی کامل به تمام بخش‌ها و تنظیمات پلتفرم",
  },
  ops_manager: {
    title: "مدیر عملیات",
    description: "کاربران، فروشگاه‌ها، نصاب‌ها، سفارش‌ها و رسیدگی به تخلفات",
  },
  finance_manager: {
    title: "مدیر مالی",
    description: "درآمد، کمیسیون‌ها، تسویه‌حساب‌ها و گزارش‌های مالی",
  },
  support_specialist: {
    title: "کارشناس پشتیبانی",
    description: "مشاهده کاربران، سفارش‌ها و پیگیری شکایات",
  },
  auditor: {
    title: "بازرس / حسابرس",
    description: "دسترسی فقط-خواندن به سوابق برای رسیدگی و حسابرسی",
  },
};

/** برچسب فارسی هر مجوز — برای نمایش ماتریس دسترسی در پنل و مستندات */
export const ADMIN_PERMISSION_FA: Record<AdminPermission, string> = {
  "dashboard.view": "مشاهده داشبورد",
  "users.view": "مشاهده کاربران",
  "users.manage": "مدیریت کاربران",
  "shops.view": "مشاهده فروشگاه‌ها",
  "shops.manage": "مدیریت فروشگاه‌ها",
  "installers.view": "مشاهده نصاب‌ها",
  "installers.manage": "مدیریت نصاب‌ها",
  "orders.view": "مشاهده سفارش‌ها",
  "orders.manage": "مدیریت سفارش‌ها",
  "finance.view": "مشاهده مالی",
  "finance.manage": "مدیریت مالی",
  "violations.view": "مشاهده شکایات و تخلفات",
  "violations.manage": "رسیدگی به تخلفات",
  "reports.view": "مشاهده گزارش‌ها",
  "settings.view": "مشاهده تنظیمات",
  "settings.manage": "تغییر تنظیمات",
  "audit.view": "مشاهده سوابق حساس (Audit Log)",
};

/** مجموعه دسترسی‌های مدیر کل — تنها منبع کامل مجوزها */
const ALL_PERMISSIONS: readonly AdminPermission[] = [
  "dashboard.view",
  "users.view",
  "users.manage",
  "shops.view",
  "shops.manage",
  "installers.view",
  "installers.manage",
  "orders.view",
  "orders.manage",
  "finance.view",
  "finance.manage",
  "violations.view",
  "violations.manage",
  "reports.view",
  "settings.view",
  "settings.manage",
  "audit.view",
];

const READ_ONLY_PERMISSIONS: readonly AdminPermission[] = [
  "dashboard.view",
  "users.view",
  "shops.view",
  "installers.view",
  "orders.view",
  "finance.view",
  "violations.view",
  "reports.view",
];

/** ماتریس نقش → مجوزها — منبع حقیقت RBAC (در فاز Backend سمت سرور اعمال می‌شود) */
export const ADMIN_ROLE_PERMISSIONS: Record<AdminRole, readonly AdminPermission[]> = {
  super_admin: ALL_PERMISSIONS,
  ops_manager: [
    "dashboard.view",
    "users.view",
    "users.manage",
    "shops.view",
    "shops.manage",
    "installers.view",
    "installers.manage",
    "orders.view",
    "orders.manage",
    "violations.view",
    "violations.manage",
    "reports.view",
    "audit.view",
  ],
  finance_manager: ["dashboard.view", "finance.view", "finance.manage", "orders.view", "reports.view", "audit.view"],
  support_specialist: ["dashboard.view", "users.view", "orders.view", "violations.view", "reports.view"],
  auditor: [...READ_ONLY_PERMISSIONS, "settings.view", "audit.view"],
};

/** بررسی دسترسی یک نقش به یک مجوز */
export function roleHasPermission(role: AdminRole, permission: AdminPermission): boolean {
  return ADMIN_ROLE_PERMISSIONS[role].includes(permission);
}
