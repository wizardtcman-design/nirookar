"use client";

import type { ButtonHTMLAttributes } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PrimaryButtonVariant = "teal" | "coral";

const VARIANT_CLASSES: Record<PrimaryButtonVariant, string> = {
  teal: "bg-brand-teal text-white hover:bg-brand-teal-dark",
  coral: "bg-brand-coral text-white hover:bg-brand-coral-dark",
};

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PrimaryButtonVariant;
}

/** دکمه اصلی اکشن فرم‌ها — ارتفاع استاندارد ۴۸px برای لمس راحت */
export function PrimaryButton({ variant = "teal", className, children, ...props }: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        "h-12 w-full rounded-xl text-base font-bold shadow-none",
        VARIANT_CLASSES[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
