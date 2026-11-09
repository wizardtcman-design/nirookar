"use client";

import type { RoleDefinition } from "@/lib/roles";
import { ROLE_THEME_STYLES } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: RoleDefinition;
  onClick: () => void;
}

/**
 * کارت انتخاب نقش در صفحه خانه.
 * در RTL: متن سمت راست (شروع)، آیکون سمت چپ (پایان) — مطابق طرح مرجع.
 */
export function RoleCard({ role, onClick }: RoleCardProps) {
  const theme = ROLE_THEME_STYLES[role.theme];
  const Icon = role.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${role.title} — ${role.subtitle}`}
      className={cn(
        "group flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-right shadow-sm transition-all duration-200",
        "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2",
        theme.focusRing,
      )}
    >
      <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <span className={cn("text-lg font-extrabold", theme.cardTitle)}>{role.title}</span>
        <span className="text-[13px] text-slate-500">{role.subtitle}</span>
        <span
          aria-hidden="true"
          className={cn("mt-1 h-[3px] w-9 rounded-full transition-all duration-200 group-hover:w-14", theme.accentBar)}
        />
      </span>
      <span aria-hidden="true" className={cn("h-12 w-px shrink-0", theme.divider)} />
      <span
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105",
          theme.iconWrap,
        )}
      >
        <Icon className="size-7" strokeWidth={1.8} aria-hidden="true" />
      </span>
    </button>
  );
}
