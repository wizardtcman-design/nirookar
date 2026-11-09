/**
 * رجیستری تخصص‌های نصاب — منبع مشترک وب، موبایل و تنظیمات گارانتی پنل ادمین.
 *
 * افزودن تخصص جدید = افزودن یک entry؛ فرم ثبت‌نام نصاب، پروفایل ادمین و
 * پیکربندی گارانتی هر دسته شغلی به‌صورت خودکار از همین لیست استفاده می‌کنند.
 */

export interface SpecialtyDefinition {
  key: string;
  label: string;
  /** توضیح کوتاه برای نمایش در فرم‌ها */
  note?: string;
}

export const SPECIALTIES: readonly SpecialtyDefinition[] = [
  { key: "punch_curtain", label: "پرده پانچ", note: "پرده پانچ و رومیزی" },
  { key: "knauf", label: "کناف", note: "سقف کناف و دیوار خشک" },
  { key: "marble_sheet", label: "ماربل‌شیت", note: "ورق‌های دکوراتیو دیوار" },
  { key: "thermowall", label: "ترمووال", note: "پنل‌های ترمووال دکوراتیو" },
  { key: "ceiling_tile", label: "تایل سقفی", note: "تایل و تیغه سقف" },
  { key: "wallpaper", label: "کاغذدیواری", note: "کاغذدیواری و پنل سه‌بعدی" },
  { key: "parquet_flooring", label: "کف‌پوش و پارکت", note: "لمینت، پارکت و SPC" },
  { key: "cabinet", label: "کابینت", note: "نصب کابینت آشپزخانه" },
  { key: "wall_closet", label: "کمد دیواری", note: "کمد دیواری و درب ریلی" },
  { key: "lighting", label: "نورپردازی و لوستر", note: "نور مخفی، هالوژن و لوستر" },
  { key: "mirror_decor", label: "آینه و دکور دیوار", note: "آینه‌کاری و قاب دکوراتیو" },
  { key: "steam_sauna", label: "سونا و جکوزی", note: "نصب تجهیزات استخر و سونا" },
] as const;

export const SPECIALTY_KEYS: readonly string[] = SPECIALTIES.map((specialty) => specialty.key);

export function getSpecialtyLabel(key: string): string {
  return SPECIALTIES.find((specialty) => specialty.key === key)?.label ?? key;
}

/** تبدیل آرایه کلید تخصص‌ها به برچسب فارسی برای نمایش در جدول‌های ادمین */
export function specialtyKeysToLabels(keys: readonly string[]): string {
  if (!keys.length) return "—";
  return keys.map((key) => getSpecialtyLabel(key)).join("، ");
}
