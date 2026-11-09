"use client";

import { BadgeCheck, HardHat, ImageOff, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { specialtyKeysToLabels } from "@shared/specialties";

import { LiveBadge, SectionBanner, StatusChip } from "@/components/admin/parts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchAdminInstallers,
  verifyInstaller,
  type AdminInstallerRow,
} from "@/services/admin-api";

const PENDING_TONE = "amber" as const;
const ACTIVE_TONE = "green" as const;
const INCOMPLETE_TONE = "slate" as const;

function statusLabel(status: string): string {
  if (status === "ACTIVE") return "فعال — قرارداد و سفته تأیید شده";
  if (status === "PENDING_VERIFICATION") return "در انتظار تأیید حضوری — مدارک ارسال شده";
  if (status === "INCOMPLETE") return "ناقص — مدارک هنوز از پنل نصاب ارسال نشده";
  return status;
}

/** مدیریت نصاب‌ها — پرونده واقعی نصاب‌ها از دیتابیس + تأیید حضوری قرارداد و سفته */
export function InstallersSection() {
  const [installers, setInstallers] = useState<AdminInstallerRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminInstallerRow | null>(null);
  const [verifying, setVerifying] = useState(false);

  function reload() {
    fetchAdminInstallers()
      .then((data) => setInstallers(data.installers))
      .catch((loadError: Error) => setError(loadError.message));
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleVerify() {
    if (!selected) return;
    setVerifying(true);
    try {
      await verifyInstaller(selected.id);
      toast.success(`قرارداد و سفته «${selected.fullName}» ثبت شد و پرونده فعال گردید.`);
      setSelected(null);
      reload();
    } catch (verifyError) {
      toast.error(verifyError instanceof Error ? verifyError.message : "خطای نامشخص");
    } finally {
      setVerifying(false);
    }
  }

  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-800">
        {error}
      </div>
    );
  }

  if (!installers) {
    return <div aria-busy="true" aria-label="در حال بارگذاری نصاب‌ها" className="h-48 animate-pulse rounded-2xl border border-slate-200/80 bg-white" />;
  }

  return (
    <div className="space-y-5">
      <SectionBanner live extra="تأیید قرارداد و سفته فقط با مجوز «مدیریت نصاب‌ها» سمت سرور انجام می‌شود." />

      {installers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
          <HardHat className="mx-auto size-10 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm font-extrabold text-brand-navy">هنوز نصابی ثبت‌نام نکرده است</p>
          <p className="mt-1.5 text-[12px] leading-6 text-slate-500">
            به‌محض ثبت‌نام نصاب از صفحه عمومی، پرونده او بلافاصله و به‌صورت زنده در همین بخش ظاهر می‌شود.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {installers.map((installer) => (
            <article key={installer.id} className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {installer.photoUrl ? (
                    <img
                      src={installer.photoUrl}
                      alt={`عکس ${installer.fullName}`}
                      className="size-12 shrink-0 rounded-xl border border-slate-100 object-cover"
                    />
                  ) : (
                    <span aria-hidden="true" className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-slate-300">
                      <ImageOff className="size-5" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-extrabold text-brand-navy">{installer.fullName}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-500">
                      <MapPin className="size-3" aria-hidden="true" />
                      {installer.city}
                    </p>
                  </div>
                </div>
                <StatusChip
                  tone={installer.status === "ACTIVE" ? ACTIVE_TONE : installer.status === "INCOMPLETE" ? INCOMPLETE_TONE : PENDING_TONE}
                >
                  {installer.status === "ACTIVE" ? "فعال" : installer.status === "INCOMPLETE" ? "ناقص" : "در انتظار تأیید"}
                </StatusChip>
              </div>

              <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-slate-500">
                تخصص‌ها: {specialtyKeysToLabels(installer.specialties)}
              </p>

              {installer.status === "ACTIVE" ? (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  قرارداد و سفته توسط {installer.verifiedByName ?? "مدیر"} تأیید شده است
                </p>
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => setSelected(installer)}
              >
                مشاهده پرونده کامل
              </Button>
            </article>
          ))}
        </section>
      )}

      {/* دیالوگ پرونده کامل نصاب */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-right">
                  <ShieldCheck className="size-5 text-brand-teal" aria-hidden="true" />
                  پرونده نصاب: {selected.fullName}
                </DialogTitle>
                <DialogDescription className="text-right">
                  فیلدهای محرمانه (کد ملی و آدرس سکونت) فقط برای نقش‌های دارای مجوز «installers.view» از سمت سرور ارسال می‌شود.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-[13px]">
                <DetailRow label="شماره موبایل" value={selected.phone} icon />
                <DetailRow label="کد ملی" value={selected.nationalId} />
                <DetailRow label="شهر" value={selected.city} />
                <DetailRow label="کد پستی" value={selected.postalCode} ltr />
                <DetailRow label="آدرس محل سکونت (محرمانه)" value={selected.residenceAddress} />
                <DetailRow label="سابقه کار" value={selected.workHistory} />
                <DetailRow label="تخصص‌ها" value={specialtyKeysToLabels(selected.specialties)} />
                <DetailRow label="شماره شبا" value={selected.sheba} ltr />
                <div className="flex gap-3">
                  {selected.photoUrl ? (
                    <img src={selected.photoUrl} alt={`عکس ${selected.fullName}`} className="size-20 rounded-xl border border-slate-100 object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex size-20 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">بدون عکس</span>
                  )}
                  {selected.nationalCardUrl ? (
                    <img src={selected.nationalCardUrl} alt="کارت ملی" className="size-20 rounded-xl border border-slate-100 object-cover" />
                  ) : (
                    <span aria-hidden="true" className="flex size-20 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400">بدون کارت ملی</span>
                  )}
                </div>
              </div>

              {selected.status === "ACTIVE" ? (
                <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-[12px] font-bold text-emerald-700">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  این پرونده فعال است — تأییدکننده: {selected.verifiedByName ?? "—"}
                </p>
              ) : selected.status === "INCOMPLETE" ? (
                <p className="mt-4 rounded-xl bg-slate-50 p-3.5 text-[12px] font-bold leading-6 text-slate-500">
                  این پرونده هنوز مدارکش را از پنل شخصی نصاب ارسال نکرده است؛ تأیید حضوری فقط پس از تکمیل مدارک معنا دارد.
                </p>
              ) : (
                <Button type="button" className="mt-4 w-full" onClick={() => void handleVerify()} disabled={verifying}>
                  {verifying ? "در حال ثبت..." : "تأیید قرارداد و دریافت سفته حضوری"}
                </Button>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DetailRow({ label, value, ltr, icon }: { label: string; value: string | null; ltr?: boolean; icon?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3">
      <span className="shrink-0 text-[11px] font-bold text-slate-500">{label}</span>
      <span dir={ltr ? "ltr" : undefined} className="min-w-0 break-words text-left text-[12px] font-semibold text-slate-800">
        {icon ? <Phone className="ml-1 inline size-3 text-slate-400" aria-hidden="true" /> : null}
        {value ?? "— هنوز ثبت نشده"}
      </span>
    </div>
  );
}
