"use client";

import { Check, Minus, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { AdminPermission, AdminRole } from "@shared/admin-rbac";
import { ADMIN_PERMISSION_FA, ADMIN_ROLE_FA, ADMIN_ROLE_PERMISSIONS, roleHasPermission } from "@shared/admin-rbac";
import {
  clampToRange,
  PLATFORM_SETTINGS_LIMITS,
  type PlatformSettings,
  type ShopBoothModel,
  type InstallerRevenueModel,
  type WarrantyCategoryConfig,
  INSTALLER_REVENUE_MODEL_FA,
  SHOP_BOOTH_MODEL_FA,
} from "@shared/platform-settings";
import { SPECIALTIES } from "@shared/specialties";

import { DemoBadge, LiveBadge, SectionBanner } from "@/components/admin/parts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { fetchAdminSettings, updateAdminSettings } from "@/services/admin-api";
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

/** تنظیمات پویا — ۱۰۰٪ عملیاتی؛ هر تغییر اینجا در Audit Log ثبت و زنده اعمال می‌شود */
export function SettingsSection({ role }: { role: AdminRole }) {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    fetchAdminSettings()
      .then((data) => setSettings(data.settings))
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  function patch(update: Partial<PlatformSettings>) {
    setSettings((prev) => (prev ? { ...prev, ...update } : prev));
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      const result = await updateAdminSettings(settings);
      setSettings(result.settings);
      toast.success(
        result.changedCount > 0
          ? `تنظیمات ذخیره شد (${result.changedCount} فیلد تغییر کرد) و در Audit Log ثبت گردید.`
          : "تنظیمات ذخیره شد (تغییری نداشت).",
      );
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "خطای ذخیره تنظیمات");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">
        {error}
      </div>
    );
  }

  if (!settings) {
    return <div aria-busy="true" aria-label="در حال بارگذاری تنظیمات" className="h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-white" />;
  }

  const canManage = roleHasPermission(role, "settings.manage");

  return (
    <div className="space-y-5">
      <SectionBanner live extra="تمام اعداد تجاری پلتفرم فقط از همین بخش مدیریت می‌شوند (قانون صفر درصد هاردکد) و هر تغییر در Audit Log ثبت می‌شود." />

      {/* ── احراز هویت و ورود ── */}
      <SettingsCard title="احراز هویت و ورود کاربران" live>
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 p-4">
            <div>
              <Label htmlFor="otp-enabled" className="text-[13px] font-black text-brand-navy">
                ورود با کد تأیید پیامکی (OTP)
              </Label>
              <p className="mt-1.5 max-w-xl text-[11.5px] leading-6 text-slate-500">
                خاموش (پیش‌فرض): ورود و ثبت‌نام با «شماره موبایل + کد ملی یکتا + رمز عبور» — بدون نیاز به کد پیامکی،
                مناسب تا زمان خرید پنل پیامک. روشن: جریان کد تأیید (الان Sandbox با کد آزمایشی؛ بعداً سرویس پیامک واقعی).
              </p>
            </div>
            <Switch
              id="otp-enabled"
              checked={settings.otpEnabled}
              disabled={!canManage}
              onCheckedChange={(checked) => patch({ otpEnabled: checked })}
              aria-label="سوئیچ ورود با کد تأیید پیامکی"
            />
          </div>
          <p className="text-[11px] leading-6 text-slate-400">
            توجه: حساب‌های قدیمی که با کد تأیید ساخته شده‌اند رمز عبور ندارند؛ برای ورود آن‌ها باید همین سوئیچ موقتاً روشن شود.
          </p>
        </div>
      </SettingsCard>

      {/* ── درآمد از نصاب ── */}
      <SettingsCard title="درآمد پلتفرم از نصاب‌ها" live>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="revenue-model">مدل درآمد</Label>
            <select
              id="revenue-model"
              value={settings.installerRevenueModel}
              disabled={!canManage}
              onChange={(event) => patch({ installerRevenueModel: event.target.value as InstallerRevenueModel })}
              className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-brand-teal"
            >
              {(Object.keys(INSTALLER_REVENUE_MODEL_FA) as InstallerRevenueModel[]).map((model) => (
                <option key={model} value={model}>{INSTALLER_REVENUE_MODEL_FA[model]}</option>
              ))}
            </select>
          </div>
          {settings.installerRevenueModel === "PERCENTAGE" ? (
            <NumberField
              id="revenue-percent"
              label="درصد کارمزد"
              value={settings.installerRevenuePercentage}
              range={PLATFORM_SETTINGS_LIMITS.percentage}
              disabled={!canManage}
              onChange={(value) => patch({ installerRevenuePercentage: value })}
              suffix="٪"
            />
          ) : null}
          {settings.installerRevenueModel === "FIXED" ? (
            <NumberField
              id="revenue-fixed"
              label="مبلغ ثابت هر سفارش (تومان)"
              value={settings.installerRevenueFixedAmount}
              range={PLATFORM_SETTINGS_LIMITS.fixedAmount}
              disabled={!canManage}
              onChange={(value) => patch({ installerRevenueFixedAmount: value })}
            />
          ) : null}
          {settings.installerRevenueModel === "SUBSCRIPTION" ? (
            <NumberField
              id="revenue-subscription"
              label="اشتراک ماهانه نصاب (تومان)"
              value={settings.installerSubscriptionMonthly}
              range={PLATFORM_SETTINGS_LIMITS.fixedAmount}
              disabled={!canManage}
              onChange={(value) => patch({ installerSubscriptionMonthly: value })}
            />
          ) : null}
          <NumberField
            id="referrer-share"
            label="سهم فروشگاه معرف (٪ — از کارمزد پلتفرم، نه سهم نصاب)"
            value={settings.referrerShopSharePercentage}
            range={PLATFORM_SETTINGS_LIMITS.percentage}
            disabled={!canManage}
            onChange={(value) => patch({ referrerShopSharePercentage: value })}
            suffix="٪"
          />
        </div>
      </SettingsCard>

      {/* ── غرفه فروشگاه ── */}
      <SettingsCard title="مدل درآمد غرفه فروشگاه‌ها" live>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="booth-model">مدل غرفه</Label>
            <select
              id="booth-model"
              value={settings.shopBoothModel}
              disabled={!canManage}
              onChange={(event) => patch({ shopBoothModel: event.target.value as ShopBoothModel })}
              className="mt-1.5 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-brand-teal"
            >
              {(Object.keys(SHOP_BOOTH_MODEL_FA) as ShopBoothModel[]).map((model) => (
                <option key={model} value={model}>{SHOP_BOOTH_MODEL_FA[model]}</option>
              ))}
            </select>
          </div>
          {settings.shopBoothModel === "SUBSCRIPTION" ? (
            <NumberField
              id="booth-subscription"
              label="اشتراک ماهانه غرفه (تومان)"
              value={settings.shopBoothSubscriptionMonthly}
              range={PLATFORM_SETTINGS_LIMITS.fixedAmount}
              disabled={!canManage}
              onChange={(value) => patch({ shopBoothSubscriptionMonthly: value })}
            />
          ) : null}
          {settings.shopBoothModel === "SALES_PERCENTAGE" ? (
            <NumberField
              id="booth-percent"
              label="درصد از فروش"
              value={settings.shopBoothSalesPercentage}
              range={PLATFORM_SETTINGS_LIMITS.percentage}
              disabled={!canManage}
              onChange={(value) => patch({ shopBoothSalesPercentage: value })}
              suffix="٪"
            />
          ) : null}
        </div>
      </SettingsCard>

      {/* ── بیعانه بازدید حضوری (ضد تبانی) ── */}
      <SettingsCard title="بیعانه بازدید حضوری (قانون ضد تبانی)" live>
        <p className="mb-4 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">
          بازدید حضوری رایگان ممنوع است. اگر پس از بازدید سفارش اصلی ثبت شود، بیعانه از فاکتور نهایی کسر می‌شود؛
          در صورت لغو برای کار خارج از اپ، بیعانه سوخته و بین پلتفرم و نصاب تقسیم می‌شود.
        </p>
        <div className="grid gap-4 sm:grid-cols-4">
          <NumberField
            id="deposit-min"
            label="حداقل بیعانه (تومان)"
            value={settings.visitDepositMin}
            range={PLATFORM_SETTINGS_LIMITS.deposit}
            disabled={!canManage}
            onChange={(value) => patch({ visitDepositMin: value })}
          />
          <NumberField
            id="deposit-max"
            label="حداکثر بیعانه (تومان)"
            value={settings.visitDepositMax}
            range={PLATFORM_SETTINGS_LIMITS.deposit}
            disabled={!canManage}
            onChange={(value) => patch({ visitDepositMax: value })}
          />
          <NumberField
            id="deposit-default"
            label="مبلغ پیش‌فرض (تومان)"
            value={settings.visitDepositDefault}
            range={PLATFORM_SETTINGS_LIMITS.deposit}
            disabled={!canManage}
            onChange={(value) => patch({ visitDepositDefault: value })}
          />
          <NumberField
            id="deposit-platform"
            label="سهم پلتفرم از بیعانه سوخته (٪)"
            value={settings.visitDepositBurnPlatformShare}
            range={PLATFORM_SETTINGS_LIMITS.percentage}
            disabled={!canManage}
            onChange={(value) => patch({ visitDepositBurnPlatformShare: value })}
            suffix="٪"
          />
        </div>
      </SettingsCard>

      {/* ── گارانتی نصب ── */}
      <SettingsCard title="گارانتی نصب (برای هر دسته شغلی)" live>
        <ToggleRow
          id="warranty-enabled"
          label="گارانتی نصب فعال باشد"
          checked={settings.warrantyEnabled}
          disabled={!canManage}
          onCheckedChange={(checked) => patch({ warrantyEnabled: checked })}
        />
        {settings.warrantyEnabled ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SPECIALTIES.map((specialty) => {
              const existing = settings.warrantyCategories.find((entry) => entry.categoryKey === specialty.key);
              return (
                <div key={specialty.key} className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3">
                  <p className="text-[12px] font-extrabold text-brand-navy">{specialty.label}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      type="number"
                      inputMode="numeric"
                      dir="ltr"
                      aria-label={`گارانتی ${specialty.label} به ماه`}
                      className="h-9 w-20 text-[13px]"
                      disabled={!canManage}
                      value={existing?.months ?? 1}
                      onChange={(event) => {
                        const months = clampToRange(Number(event.target.value), PLATFORM_SETTINGS_LIMITS.warrantyMonths);
                        const next: WarrantyCategoryConfig[] = settings.warrantyCategories.filter(
                          (entry) => entry.categoryKey !== specialty.key,
                        );
                        next.push({ categoryKey: specialty.key, months, extraDays: existing?.extraDays ?? 0 });
                        patch({ warrantyCategories: next });
                      }}
                    />
                    <span className="text-[11px] text-slate-500">ماه</span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      dir="ltr"
                      aria-label={`گارانتی ${specialty.label} به روز`}
                      className="h-9 w-16 text-[13px]"
                      disabled={!canManage}
                      value={existing?.extraDays ?? 0}
                      onChange={(event) => {
                        const extraDays = clampToRange(Number(event.target.value), PLATFORM_SETTINGS_LIMITS.warrantyExtraDays);
                        const next: WarrantyCategoryConfig[] = settings.warrantyCategories.filter(
                          (entry) => entry.categoryKey !== specialty.key,
                        );
                        next.push({
                          categoryKey: specialty.key,
                          months: existing?.months ?? 1,
                          extraDays,
                        });
                        patch({ warrantyCategories: next });
                      }}
                    />
                    <span className="text-[11px] text-slate-500">روز</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}
      </SettingsCard>

      {/* ── زمان‌بندی‌ها ── */}
      <SettingsCard title="زمان‌بندی‌های عملیاتی" live>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <NumberField
            id="affiliated-hours"
            label="اولویت نصاب وابسته به فروشگاه (ساعت)"
            value={settings.affiliatedInstallerPriorityHours}
            range={PLATFORM_SETTINGS_LIMITS.hours}
            disabled={!canManage}
            onChange={(value) => patch({ affiliatedInstallerPriorityHours: value })}
            hint="اگر نصاب فروشگاه در این مهلت قبول نکند، سفارش برای نصاب‌های آزاد باز می‌شود"
          />
          <NumberField
            id="approval-hours"
            label="مهلت تأیید کار توسط مشتری (ساعت)"
            value={settings.customerApprovalDeadlineHours}
            range={PLATFORM_SETTINGS_LIMITS.hours}
            disabled={!canManage}
            onChange={(value) => patch({ customerApprovalDeadlineHours: value })}
            hint="پس از آپلود عکس پایان کار"
          />
          <NumberField
            id="settlement-hours"
            label="مهلت تسویه با نصاب (ساعت)"
            value={settings.settlementDeadlineHours}
            range={PLATFORM_SETTINGS_LIMITS.hours}
            disabled={!canManage}
            onChange={(value) => patch({ settlementDeadlineHours: value })}
          />
          <NumberField
            id="video-seconds"
            label="حداکثر ویدئوی بازدید تصویری (ثانیه)"
            value={settings.videoMaxSeconds}
            range={PLATFORM_SETTINGS_LIMITS.videoSeconds}
            disabled={!canManage}
            onChange={(value) => patch({ videoMaxSeconds: value })}
          />
        </div>
      </SettingsCard>

      {/* ── روش‌های قیمت‌گذاری ── */}
      <SettingsCard title="روش‌های قیمت‌گذاری سفارش" live>
        <div className="space-y-3">
          <ToggleRow
            id="method-calculator"
            label="روش ۱ — محاسبه هوشمند (متراژ/تعداد)"
            checked={settings.pricingMethodsEnabled.SMART_CALCULATOR}
            disabled={!canManage}
            onCheckedChange={(checked) =>
              patch({ pricingMethodsEnabled: { ...settings.pricingMethodsEnabled, SMART_CALCULATOR: checked } })
            }
          />
          <ToggleRow
            id="method-photo"
            label="روش ۲ — بازدید تصویری رایگان (عکس + ویدئو کوتاه)"
            checked={settings.pricingMethodsEnabled.PHOTO_VIDEO_VISIT}
            disabled={!canManage}
            onCheckedChange={(checked) =>
              patch({ pricingMethodsEnabled: { ...settings.pricingMethodsEnabled, PHOTO_VIDEO_VISIT: checked } })
            }
          />
          <ToggleRow
            id="method-deposit"
            label="روش ۳ — بازدید حضوری با پرداخت بیعانه اجباری"
            checked={settings.pricingMethodsEnabled.ON_SITE_DEPOSIT}
            disabled={!canManage}
            onCheckedChange={(checked) =>
              patch({ pricingMethodsEnabled: { ...settings.pricingMethodsEnabled, ON_SITE_DEPOSIT: checked } })
            }
          />
        </div>
      </SettingsCard>

      {/* ── BNPL و پلیس چت ── */}
      <SettingsCard title="خرید اقساطی (BNPL) و پلیس خودکار چت" live>
        <div className="space-y-4">
          <ToggleRow
            id="bnpl-enabled"
            label="نمایش برچسب «پرداخت اقساطی بدون چک و ضامن»"
            checked={settings.bnplEnabled}
            disabled={!canManage}
            onCheckedChange={(checked) => patch({ bnplEnabled: checked })}
          />
          {settings.bnplEnabled ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                id="bnpl-count"
                label="تعداد اقساط"
                value={settings.bnplInstallments}
                range={PLATFORM_SETTINGS_LIMITS.bnplInstallments}
                disabled={!canManage}
                onChange={(value) => patch({ bnplInstallments: value })}
              />
              <div>
                <Label htmlFor="bnpl-label">متن برچسب اقساط</Label>
                <Input
                  id="bnpl-label"
                  className="mt-1.5"
                  value={settings.bnplLabel}
                  disabled={!canManage}
                  onChange={(event) => patch({ bnplLabel: event.target.value })}
                />
                <p className="mt-1 text-[10px] text-slate-400">مبلغ هر قسط = تقسیم مبلغ کل بر تعداد اقساط</p>
              </div>
            </div>
          ) : null}
          <ToggleRow
            id="chat-police"
            label="پلیس خودکار چت — سانسور شماره موبایل و آیدی شبکه‌های اجتماعی تا قبل از پرداخت امانی"
            checked={settings.chatPoliceEnabled}
            disabled={!canManage}
            onCheckedChange={(checked) => patch({ chatPoliceEnabled: checked })}
          />
        </div>
      </SettingsCard>

      {/* ── شهرها ── */}
      <SettingsCard title="شهرهای فعال پلتفرم" live>
        <p className="mb-3 text-[11px] leading-5 text-slate-500">
          پلتفرم به هیچ شهری هاردکد نشده است؛ شهر شروع کسب‌وکار شما (با محوریت انبار مرکزی دکوراسیون) را همین‌جا
          تعریف کنید. ثبت‌نام فقط در شهرهای فعال این لیست امکان‌پذیر است.
        </p>
        <div className="flex flex-wrap gap-2">
          {settings.cities.map((city) => (
            <span
              key={city}
              className="flex items-center gap-1.5 rounded-full border border-brand-teal/30 bg-brand-teal-light px-3 py-1 text-[12px] font-bold text-brand-teal"
            >
              {city}
              {canManage ? (
                <button
                  type="button"
                  aria-label={`حذف شهر ${city}`}
                  onClick={() => patch({ cities: settings.cities.filter((entry) => entry !== city) })}
                  className="text-brand-teal/70 transition-colors hover:text-rose-600"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </button>
              ) : null}
            </span>
          ))}
        </div>
        {canManage ? (
          <div className="mt-3 flex max-w-sm gap-2">
            <Input
              value={newCity}
              onChange={(event) => setNewCity(event.target.value)}
              placeholder="نام شهر جدید"
              aria-label="نام شهر جدید"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const city = newCity.trim();
                if (!city) return;
                if (settings.cities.includes(city)) {
                  toast.info("این شهر قبلاً اضافه شده است");
                  return;
                }
                patch({ cities: [...settings.cities, city] });
                setNewCity("");
              }}
            >
              <Plus className="size-4" aria-hidden="true" />
              افزودن
            </Button>
          </div>
        ) : null}
      </SettingsCard>

      {/* ── ذخیره ── */}
      {canManage ? (
        <div className="sticky bottom-4 z-20 rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <Button type="button" className="w-full sm:w-auto" onClick={() => void handleSave()} disabled={saving}>
            <Save className="size-4" aria-hidden="true" />
            {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
          </Button>
        </div>
      ) : (
        <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-bold text-amber-900">
          نقش شما مجوز «تغییر تنظیمات» را ندارد — فیلدها فقط-خواندنی نمایش داده می‌شوند (کنترل سمت سرور نیز فعال است).
        </div>
      )}

      {/* ── ماتریس RBAC ── */}
      <RbacMatrix currentRole={role} />
    </div>
  );
}

/* ── اجزای کمکی ── */

function SettingsCard({ title, live, children }: { title: string; live?: boolean; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-brand-navy">{title}</h2>
        {live ? <LiveBadge /> : <DemoBadge />}
      </div>
      {children}
    </section>
  );
}

function NumberField({
  id,
  label,
  value,
  range,
  disabled,
  onChange,
  suffix,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  range: { min: number; max: number };
  disabled?: boolean;
  onChange: (value: number) => void;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1.5">
        <Input
          id={id}
          type="number"
          dir="ltr"
          inputMode="decimal"
          className={cn("text-[13px]", suffix && "pl-10")}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(clampToRange(Number(event.target.value), range))}
        />
        {suffix ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-slate-400">
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? <p className="mt-1 text-[10px] leading-4 text-slate-400">{hint}</p> : null}
    </div>
  );
}

function ToggleRow({
  id,
  label,
  checked,
  disabled,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
      <Label htmlFor={id} className="cursor-pointer text-[12px] font-bold leading-5 text-slate-700">
        {label}
      </Label>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function RbacMatrix({ currentRole }: { currentRole: AdminRole }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
        <div>
          <h2 className="text-sm font-extrabold text-brand-navy">ماتریس نقش‌ها و دسترسی‌ها (RBAC)</h2>
          <p className="mt-1 text-[11px] text-slate-500">
            داده واقعی از هسته مشترک <span dir="ltr" className="font-bold">packages/shared/admin-rbac</span> — نقش فعلی شما: {ADMIN_ROLE_FA[currentRole].title}
          </p>
        </div>
        <LiveBadge label="معماری واقعی" />
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
      <p className="border-t border-slate-100 p-4 text-[11px] leading-6 text-slate-500">
        این ماتریس در APIها به‌صورت سمت سرور اعمال می‌شود (گارد requireAdmin)؛ منوی غیرمجاز هم در رابط کاربری
        پنهان است و هم درخواست مستقیم به آن با پاسخ 403 مسدود می‌شود.
      </p>
    </section>
  );
}
