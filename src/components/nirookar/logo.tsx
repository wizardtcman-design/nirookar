import { cn } from "@/lib/utils";

/** نشان لوگوی نیروکار — مربع سرمه‌ای با حرف N و نقطه تاییدی سبز */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex size-11 items-center justify-center rounded-2xl bg-brand-navy text-lg font-black text-white shadow-sm",
        className,
      )}
    >
      <span className="-translate-y-px">N</span>
      <span className="absolute -bottom-0.5 -left-0.5 size-3 rounded-full border-2 border-white bg-brand-teal" />
    </span>
  );
}

/** لوگوی کامل با نام و شعار برند */
export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="flex flex-col leading-tight">
        <span className="text-xl font-black text-brand-navy">نیروکار</span>
        <span className="text-[11px] font-medium text-slate-500">بازار خدمات فنی و نصب</span>
      </span>
    </span>
  );
}

/** لوگوی فشرده هدر — فقط نشان و نام «نیروکار»؛ طبق دستور مالک با shrink-0 در هدر باریک */
export function CompactLogo() {
  return (
    <span className="flex shrink-0 items-center gap-2">
      <LogoMark className="size-9 rounded-xl text-base" />
      <span className="text-lg font-black text-brand-navy">نیروکار</span>
    </span>
  );
}
