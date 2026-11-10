"use client";

/**
 * عنوان صفحات داخلی — بیلد 005 (دستور مالک):
 *
 * دکمه‌های «بازگشت» و «صفحه اصلی» که اینجا تکرار می‌شدند حذف شدند؛ بازگشت
 * اکنون همیشه و به‌صورت ثابت در «هدر بالای پوسته» (AppHeader) در دسترس است و
 * این بخش فقط عنوان خوانای صفحه را نشان می‌دهد — بدون نوار چسبان تکراری.
 */
export function SubPageHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span aria-hidden="true" className="h-6 w-1.5 rounded-full bg-brand-teal" />
      <h1 className="min-w-0 truncate text-xl font-black text-brand-navy sm:text-2xl">{title}</h1>
    </div>
  );
}
