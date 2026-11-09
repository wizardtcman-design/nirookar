"use client";

import { Eye, EyeOff, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface AppTextFieldProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon?: LucideIcon;
  type?: "text" | "password";
  placeholder?: string;
  /** نمایش دکمه چشم برای رمز عبور */
  onToggleReveal?: () => void;
  revealed?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal";
  /** جهت متن — پیش‌فرض LTR برای فیلدهای عددی/لاتین */
  dir?: "ltr" | "rtl";
  /** راهنمای کوتاه زیر فیلد */
  hint?: string;
  /** onDark برای کارت تیره نصاب */
  tone?: "light" | "onDark";
  /** غیرفعال — برای فیلدهای نمایشی که در فازهای بعد فعال می‌شوند */
  disabled?: boolean;
}

/**
 * فیلد ورودی استاندارد اپلیکیشن.
 * محتوای فیلدها چپ‌چین (LTR) و برچسب‌ها راست‌چین؛ آیکون‌ها مطابق طرح مرجع:
 * آیکون اصلی سمت چپ فیلد و دکمه نمایش رمز سمت راست.
 */
export function AppTextField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  icon: Icon,
  type = "text",
  placeholder,
  onToggleReveal,
  revealed,
  autoComplete,
  inputMode,
  dir = "ltr",
  hint,
  tone = "light",
  disabled,
}: AppTextFieldProps) {
  const isPassword = type === "password";
  const hasToggle = isPassword && Boolean(onToggleReveal);
  const onDark = tone === "onDark";
  const inputType = isPassword && !revealed ? "password" : "text";

  return (
    <div className="w-full">
      <label htmlFor={id} className={cn("mb-1.5 block text-[13px] font-bold", onDark ? "text-white" : "text-brand-navy")}>
        {label}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-slate-400"
          />
        ) : null}
        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          dir={dir}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-slate-900 outline-none transition-shadow placeholder:text-slate-400",
            Icon && "pl-11",
            hasToggle && "pr-12",
            disabled && "cursor-not-allowed bg-slate-50 text-slate-400",
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-slate-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/15",
          )}
        />
        {hasToggle ? (
          <button
            type="button"
            onClick={onToggleReveal}
            aria-label={revealed ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
            className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
          >
            {revealed ? (
              <EyeOff className="size-[18px]" aria-hidden="true" />
            ) : (
              <Eye className="size-[18px]" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>
      {hint && !error ? (
        <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className={cn("mt-1.5 text-xs font-medium", onDark ? "text-red-300" : "text-red-600")}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
