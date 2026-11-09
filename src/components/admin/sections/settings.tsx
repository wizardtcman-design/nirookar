"use client";

import { Check, Minus } from "lucide-react";

import type { AdminPermission, AdminRole } from "@shared/admin-rbac";
import { ADMIN_PERMISSION_FA, ADMIN_ROLE_FA, ADMIN_ROLE_PERMISSIONS } from "@shared/admin-rbac";

import { DemoBadge, SectionBanner } from "@/components/admin/parts";
import { ADMIN_SETTING_GROUPS, DEMO_VIOLATIONS } from "@/lib/admin-demo-data";
import { cn } from "@/lib/utils";

const ROLE_IDS = Object.keys(ADMIN_ROLE_FA) as AdminRole[];

const PERMISSION_GROUPS: readonly { title: string; permissions: AdminPermission[] }[] = [
  { title: "داشبورد", permissions: ["dashboard.view"] },
  { title: "کاربران", permissions: ["users.view", "users.manage"] },
  { title: "فروشگاه‌ها", permissions: ["shops.view", "shops.manage"] },
  { title: "نصاب‌ها", permissions: ["installers.view", "installers.manage"] },
  { title: "سفارش‌ها", permissions: ["orders.view", "orders.manage"] },
  { title: "مالی", permissions: ["finance.view", "finance.manage"] },
  { title: "تخلفات", permissions: ["violations.view", "violations.manage"] },
  { title: "گزارش‌ها", permissions: ["reports.view"] },
  { title: "تنظیمات", permissions: ["settings.view", "settings.manage"] },
  { title: "سوابق حساس", permissions: ["audit.view"] },
];

/** تنظیمات — جایگاه تنظیمات آینده + ماتریس واقعی RBAC از هسته مشترک */
export function SettingsSection({ role }: { role: AdminRole }) {
  return (
    <div className="space-y-5">
      <SectionBanner extra="تغییر تنظیمات واقعی پلتفرم فقط در فاز Backend و با کنترل دسترسی سمت سرور فعال می‌شود." />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-brand-navy">گروه‌های تنظیمات (نقشه آینده)</h2>
          <DemoBadge label="فاز آینده" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SETTING_GROUPS.map((group) => (
            <div key={group.id} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[13px] font-extrabold text-brand-navy">{group.title}</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-slate-400 shadow-sm">آینده</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-5 text-slate-500">{group.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div>
            <h2 className="text-sm font-extrabold text-brand-navy">ماتریس نقش‌ها و دسترسی‌ها (RBAC)</h2>
            <p className="mt-1 text-[11px] text-slate-500">
              داده واقعی از هسته مشترک <span dir="ltr" className="font-bold">packages/shared/admin-rbac</span> — نقش فعلی شما: {ADMIN_ROLE_FA[role].title}
            </p>
          </div>
          <DemoBadge label="معماری واقعی" />
        </div>
        <div className="scrollbar-thin overflow-x-auto p-4">
          <table className="w-full min-w-3xl border-collapse text-right">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-2.5 text-xs font-extrabold text-brand-navy">گروه دسترسی</th>
                {ROLE_IDS.map((roleId) => (
                  <th key={roleId} className="p-2.5 text-center text-[11px] font-extrabold whitespace-nowrap text-brand-navy">
                    {ADMIN_ROLE_FA[roleId].title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSION_GROUPS.map((group) => (
                <tr key={group.title} className="border-b border-slate-100">
                  <td className="p-2.5">
                    <span className="text-[12px] font-bold text-slate-700">{group.title}</span>
                    <span className="mr-2 hidden text-[10px] text-slate-400 lg:inline">
                      ({group.permissions.map((permission) => ADMIN_PERMISSION_FA[permission]).join("، ")})
                    </span>
                  </td>
                  {ROLE_IDS.map((roleId) => {
                    const allowed = group.permissions.every((permission) =>
                      ADMIN_ROLE_PERMISSIONS[roleId].includes(permission),
                    );
                    const partial = !allowed && group.permissions.some((permission) =>
                      ADMIN_ROLE_PERMISSIONS[roleId].includes(permission),
                    );
                    return (
                      <td key={roleId} className="p-2.5 text-center">
                        {allowed ? (
                          <Check className="mx-auto size-4 text-emerald-600" aria-label="دارد" />
                        ) : partial ? (
                          <span className="text-[10px] font-bold text-amber-600" title="بخشی از مجوزها">بخشی</span>
                        ) : (
                          <Minus className="mx-auto size-4 text-slate-300" aria-label="ندارد" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={cn("border-t border-slate-100 p-4 text-[11px] leading-6 text-slate-500")}>
          اصل امنیتی: این ماتریس در فاز Backend به‌صورت سمت سرور اعمال می‌شود؛ در فاز ۱ فقط منوهای مجاز هر نقش
          در رابط کاربری نمایش داده می‌شوند و ورود مستقیم به بخش غیرمجاز پیام صادقانه عدم دسترسی نشان می‌دهد.
          مثال: {DEMO_VIOLATIONS.length} پرونده نمایشی فعلی در بخش شکایات با نقش‌های مجاز قابل مشاهده است.
        </p>
      </section>
    </div>
  );
}
