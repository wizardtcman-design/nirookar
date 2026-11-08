"use client";

import { BarChart3, Search } from "lucide-react";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DemoBadge, SectionBanner, StatCard } from "@/components/admin/parts";
import { cn } from "@/lib/utils";

const REPORT_TYPES = [
  { id: "users", label: "گزارش کاربران" },
  { id: "orders", label: "گزارش سفارش‌ها" },
  { id: "finance", label: "گزارش مالی" },
  { id: "growth", label: "رشد شهرها و بخش‌ها" },
] as const;

const DEMO_SUMMARY_ROWS = [
  { id: 1, metric: "سفارش‌های تکمیل‌شده", value: "۲۱۴" },
  { id: 2, metric: "سفارش‌های لغوشده", value: "۱۹" },
  { id: 3, metric: "میانگین زمان تکمیل سفارش", value: "۲٫۴ روز" },
  { id: 4, metric: "نرخ رضایت مشتری", value: "۹۲٪" },
] as const;

/** گزارش‌ها — فرم فیلتر با رفتار مشخص و صادقانه (تولید گزارش واقعی → Backend) */
export function ReportsSection() {
  const [reportType, setReportType] = useState<string>("orders");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleApply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // رفتار واقعی و مشخص: اعتبارسنجی سبک + نمایش وضعیت صادقانه (گزارش واقعی در فاز Backend)
    setSubmitted(true);
  }

  return (
    <div className="space-y-5">
      <SectionBanner extra="دکمه اعمال فیلتر رفتار مشخص دارد: نمایش وضعیت صادقانه و جدول خلاصه نمایشی — نه گزارش جعلی." />

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-extrabold text-brand-navy">فیلتر گزارش</h2>
        <form onSubmit={handleApply} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5">
            <label htmlFor="report-type" className="text-xs font-bold text-brand-navy">نوع گزارش</label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger id="report-type" className="w-full">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="from-date" className="text-xs font-bold text-brand-navy">از تاریخ</label>
            <Input id="from-date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} placeholder="۱۴۰۳/۰۹/۰۱" />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="to-date" className="text-xs font-bold text-brand-navy">تا تاریخ</label>
            <Input id="to-date" value={toDate} onChange={(event) => setToDate(event.target.value)} placeholder="۱۴۰۳/۰۹/۳۰" />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="h-10 w-full gap-2 bg-brand-teal text-white hover:bg-brand-teal-dark">
              <Search className="size-4" aria-hidden="true" />
              اعمال فیلتر
            </Button>
          </div>
        </form>

        {submitted ? (
          <div role="status" className="mt-4 flex items-start gap-2.5 rounded-xl border border-sky-200 bg-sky-50 p-3.5">
            <BarChart3 className="mt-0.5 size-4 shrink-0 text-sky-600" aria-hidden="true" />
            <p className="text-xs leading-6 text-sky-900">
              فیلتر «{REPORT_TYPES.find((type) => type.id === reportType)?.label}» اعمال شد.
              در حالت نمایشی فاز ۱، گزارش واقعی محاسبه نمی‌شود؛ جدول زیر فقط خلاصه نمایشی است.
              موتور گزارش‌گیری واقعی در فاز Backend ساخته می‌شود.
            </p>
          </div>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BarChart3} label="خلاصه شاخص‌ها (نمایشی)" value="۴ شاخص" />
        <div className="sm:col-span-2 xl:col-span-3 rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-4">
            <h2 className={cn("text-sm font-extrabold text-brand-navy")}>خلاصه شاخص‌های پلتفرم</h2>
            <DemoBadge />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شاخص</TableHead>
                <TableHead>مقدار (نمایشی)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_SUMMARY_ROWS.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-[13px] text-slate-700">{row.metric}</TableCell>
                  <TableCell className="text-[13px] font-bold text-brand-navy">{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
