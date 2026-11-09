"use client";

import { Landmark, PiggyBank, ReceiptText, Wallet } from "lucide-react";

import { DemoBadge, SectionBanner, StatCard } from "@/components/admin/parts";
import { DEMO_FINANCE } from "@/lib/admin-demo-data";

const FINANCE_CARDS = [
  { id: "revenue", label: "درآمد کل پلتفرم", value: DEMO_FINANCE.totalRevenue, icon: Landmark },
  { id: "commission", label: "کمیسیون‌ها", value: DEMO_FINANCE.commission, icon: ReceiptText },
  { id: "settled", label: "تسویه‌شده با همکاران", value: DEMO_FINANCE.settled, icon: PiggyBank },
  { id: "debts", label: "بدهی و تسویه‌نشده", value: DEMO_FINANCE.debts, icon: Wallet },
] as const;

/** مدیریت مالی — خلاصه درآمد، کمیسیون و تسویه (کاملاً نمایشی) */
export function FinanceSection() {
  return (
    <div className="space-y-5">
      <SectionBanner extra="گزارش مالی واقعی، محاسبه کمیسیون و تسویه‌حساب به Backend آینده وابسته است." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {FINANCE_CARDS.map((card) => (
          <StatCard key={card.id} icon={card.icon} label={card.label} value={card.value} />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-brand-navy">روند درآمد ماهانه (نمایشی)</h2>
          <DemoBadge />
        </div>
        <div className="mt-5 flex h-40 items-end gap-3" role="img" aria-label="نمودار ساده درآمد ماهانه — داده نمایشی">
          {DEMO_FINANCE.monthly.map((item) => (
            <div key={item.month} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full max-w-12 rounded-t-lg bg-brand-teal/80 transition-all"
                style={{ height: `${item.value}%` }}
              />
              <span className="text-[10px] font-bold text-slate-500">{item.month}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-[11px] leading-6 text-slate-500">
        در فازهای بعد: گزارش درآمد روزانه/ماهانه/سالانه، مدیریت پرداخت‌ها، بدهی‌ها و قوانین کمیسیون هر بخش —
        همه با کنترل دسترسی سمت سرور و ثبت سوابق حساس.
      </p>
    </div>
  );
}
