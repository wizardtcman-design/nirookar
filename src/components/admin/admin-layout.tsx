"use client";

import {
  BarChart3,
  ClipboardList,
  HardHat,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Store,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { AdminPermission, AdminRole } from "@shared/admin-rbac";
import { ADMIN_ROLE_FA, roleHasPermission } from "@shared/admin-rbac";

import { LogoMark } from "@/components/nirookar/logo";
import { DemoBadge } from "@/components/admin/parts";
import { OverviewSection } from "@/components/admin/sections/overview";
import { UsersSection } from "@/components/admin/sections/users";
import { ShopsSection } from "@/components/admin/sections/shops";
import { InstallersSection } from "@/components/admin/sections/installers";
import { OrdersSection } from "@/components/admin/sections/orders";
import { FinanceSection } from "@/components/admin/sections/finance";
import { ViolationsSection } from "@/components/admin/sections/violations";
import { ReportsSection } from "@/components/admin/sections/reports";
import { SettingsSection } from "@/components/admin/sections/settings";
import { cn } from "@/lib/utils";

interface AdminNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  permission: AdminPermission;
}

const ADMIN_NAV: readonly AdminNavItem[] = [
  { id: "overview", label: "داشبورد", icon: LayoutDashboard, permission: "dashboard.view" },
  { id: "users", label: "کاربران", icon: Users, permission: "users.view" },
  { id: "shops", label: "فروشگاه‌ها", icon: Store, permission: "shops.view" },
  { id: "installers", label: "نصاب‌ها", icon: HardHat, permission: "installers.view" },
  { id: "orders", label: "سفارش‌ها", icon: ClipboardList, permission: "orders.view" },
  { id: "finance", label: "مالی", icon: Wallet, permission: "finance.view" },
  { id: "violations", label: "شکایات و تخلفات", icon: ShieldAlert, permission: "violations.view" },
  { id: "reports", label: "گزارش‌ها", icon: BarChart3, permission: "reports.view" },
  { id: "settings", label: "تنظیمات", icon: Settings, permission: "settings.view" },
];

const SECTION_TITLES: Record<string, string> = Object.fromEntries(ADMIN_NAV.map((item) => [item.id, item.label]));

interface SectionProps {
  role: AdminRole;
}

const SECTIONS: Record<string, (props: SectionProps) => React.ReactNode> = {
  overview: () => <OverviewSection />,
  users: () => <UsersSection />,
  shops: () => <ShopsSection />,
  installers: () => <InstallersSection />,
  orders: () => <OrdersSection />,
  finance: () => <FinanceSection />,
  violations: () => <ViolationsSection />,
  reports: () => <ReportsSection />,
  settings: ({ role }: SectionProps) => <SettingsSection role={role} />,
};

interface AdminLayoutProps {
  role: AdminRole;
  section: string;
  onLogout: () => void;
}

/**
 * چیدمان پنل مدیریت — سایدبار تیره مستقل + ناوبری موبایل.
 * منوها بر اساس مجوز نقش فیلتر می‌شوند (نمایش معماری RBAC فاز ۱) و ورود
 * مستقیم به بخش غیرمجاز نیز با پیام صادقانه مسدود می‌شود؛ کنترل واقعی
 * در فاز Backend سمت سرور اجرا خواهد شد.
 */
export function AdminLayout({ role, section, onLogout }: AdminLayoutProps) {
  const visibleNav = ADMIN_NAV.filter((item) => roleHasPermission(role, item.permission));
  const roleInfo = ADMIN_ROLE_FA[role];

  const isSectionAllowed = visibleNav.some((item) => item.id === section);
  const SectionComponent = isSectionAllowed ? SECTIONS[section] : undefined;
  const currentTitle = SECTION_TITLES[section] ?? "بخش ناشناخته";

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* سایدبار دسکتاپ */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-brand-navy lg:flex">
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <LogoMark className="size-10 rounded-xl text-base" />
          <div className="min-w-0 leading-tight">
            <p className="text-sm font-black text-white">نیروکار</p>
            <p className="text-[10px] text-slate-400">پنل مدیریت مرکزی</p>
          </div>
        </div>

        <nav aria-label="منوی مدیریت" className="flex-1 space-y-1 overflow-y-auto p-3">
          {visibleNav.map((item) => {
            const active = item.id === section;
            return (
              <a
                key={item.id}
                href={`#/admin/${item.id}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold transition-colors",
                  active ? "bg-brand-teal text-white shadow-sm" : "text-slate-300 hover:bg-white/10 hover:text-white",
                )}
              >
                <item.icon className="size-4.5 shrink-0" strokeWidth={1.9} aria-hidden="true" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-white/10 p-4">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-[11px] font-bold text-brand-teal-light">{roleInfo.title}</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-400">{roleInfo.description}</p>
            <DemoBadge className="mt-2 border-amber-400/40 bg-amber-400/15 text-amber-200" label="نشست نمایشی" />
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2 text-xs font-bold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="size-4" aria-hidden="true" />
            خروج نمایشی
          </button>
          <a
            href="#/"
            className="block text-center text-[10px] text-slate-500 transition-colors hover:text-slate-300"
          >
            بازگشت به وب‌سایت عمومی
          </a>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* نوار بالایی */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-slate-200/70 bg-white/95 px-4 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <span className="lg:hidden">
              <LogoMark className="size-8 rounded-lg text-xs" />
            </span>
            <h1 className="truncate text-base font-extrabold text-brand-navy">{currentTitle}</h1>
            <DemoBadge className="hidden sm:inline-flex" />
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-slate-light px-3 py-1 text-[11px] font-bold text-brand-navy">
              {roleInfo.title}
            </span>
            <button
              type="button"
              onClick={onLogout}
              className="flex size-9 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy lg:hidden"
              aria-label="خروج نمایشی از پنل مدیریت"
            >
              <LogOut className="size-4.5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* ناوبری افقی موبایل */}
        <nav aria-label="منوی مدیریت (موبایل)" className="scrollbar-thin overflow-x-auto border-b border-slate-200/70 bg-white px-3 py-2 lg:hidden">
          <div className="flex w-max gap-2">
            {visibleNav.map((item) => {
              const active = item.id === section;
              return (
                <a
                  key={item.id}
                  href={`#/admin/${item.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold whitespace-nowrap transition-colors",
                    active ? "bg-brand-teal text-white" : "bg-brand-slate-light text-slate-600",
                  )}
                >
                  <item.icon className="size-3.5" aria-hidden="true" />
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 p-4 lg:p-6">
          {SectionComponent ? (
            SectionComponent({ role })
          ) : (
            <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
              <p className="text-sm font-extrabold text-rose-800">دسترسی به این بخش برای نقش شما مجاز نیست.</p>
              <p className="mt-2 text-xs leading-6 text-rose-700">
                این پیام نمایش معماری سطوح دسترسی (RBAC) است: منوی «{currentTitle}» برای نقش «{roleInfo.title}» فعال
                نیست. در فاز Backend، همین کنترل به‌صورت واقعی و سمت سرور اجرا می‌شود.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
