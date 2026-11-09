"use client";

import { Camera, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  id: string;
  label: string;
  /** true: بدون انتخاب فایل، ارسال فرم ممکن نیست */
  required?: boolean;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  error?: string;
  hint?: string;
}

const MAX_EDGE = 640;
const JPEG_QUALITY = 0.72;

/**
 * فیلد آپلود تصویر — فشرده‌سازی سمت کلاینت (حداکثر ۶۴۰px، JPEG ۷۲٪).
 * خروجی dataURL برای ذخیره پایدار در دیتابیس فاز ۲ گام ۱ استفاده می‌شود.
 */
export function ImageUploadField({ id, label, required, value, onChange, error, hint }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File): Promise<void> {
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const dataUrl = await readAndResize(file);
      onChange(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full">
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-bold text-brand-navy">
        {label}
        {required ? <span className="mr-1 text-rose-500">*</span> : <span className="mr-1 text-[10px] font-normal text-slate-400">(اختیاری)</span>}
      </label>

      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5">
          <img
            src={value}
            alt={`پیش‌نمایش ${label}`}
            className="size-16 rounded-lg border border-slate-100 object-cover"
          />
          <div className="min-w-0 flex-1 text-[12px] font-semibold text-emerald-600">تصویر انتخاب شد</div>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label={`حذف ${label}`}
            className="flex size-9 items-center justify-center rounded-lg text-rose-500 transition-colors hover:bg-rose-50"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={cn(
            "flex min-h-20 w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed bg-white p-4 text-center transition-colors",
            error
              ? "border-red-300 hover:border-red-400"
              : "border-slate-200 hover:border-brand-teal hover:bg-brand-teal-light/20",
            busy && "opacity-60",
          )}
        >
          <Camera className="size-5 text-slate-400" aria-hidden="true" />
          <span className="text-[12px] font-semibold text-slate-500">
            {busy ? "در حال پردازش تصویر..." : "انتخاب تصویر از دستگاه"}
          </span>
          <span className="text-[10px] text-slate-400">JPG یا PNG — به‌صورت خودکار فشرده می‌شود</span>
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        name={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void handleFile(file);
          event.target.value = "";
        }}
      />

      {hint && !error ? <p className="mt-1.5 text-[11px] text-slate-400">{hint}</p> : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** خواندن و فشرده‌سازی تصویر با Canvas — بدون هیچ کتابخانه اضافه */
function readAndResize(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خواندن فایل ناموفق بود"));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("فایل تصویر معتبر نیست"));
      image.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        if (!context) {
          reject(new Error("پردازش تصویر ممکن نیست"));
          return;
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };
      image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
