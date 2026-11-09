"use client";

import { BadgeCheck, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  fetchAdminShops,
  verifyShop,
  type AdminShopRow,
} from "@/services/admin-api";

/** مدیریت فروشگاه‌ها — پرونده واقعی فروشگاه‌ها از دیتابیس + تأیید همکاری */
export function ShopsSection() {
  const [shops, setShops] = useState<AdminShopRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminShopRow | null>(null);
  const [verifying, setVerifying] = useState(false);

  function reload() {
    fetchAdminShops()
      .then((data) => setShops(data.shops))
      .catch((loadError: Error) => setError(loadError.message));
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleVerify() {
    if (!selected) return;
    setVerifying(true);
    try {
      await verifyShop(selected.id);
      toast.success(`فروشگاه «${selected.shopName}» تأیید و فعال شد.`);
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

  if (!shops) {
    return <div aria-busy="true" aria-label="در حال بارگذاری فروشگاه‌ها" className="h-48 animate-pulse rounded-2xl border border-slate-200/80 bg-white" />;
  }

  return (
    <div className="space-y-5">
      <SectionBanner live extra="تأیید فروشگاه فقط با مجوز «مدیریت فروشگاه‌ها» سمت سرور انجام می‌شود." />

      {shops.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-sm">
          <Store className="mx-auto size-10 text-slate-300" aria-hidden="true" />
          <p className="mt-3 text-sm font-extrabold text-brand-navy">هنوز فروشگاهی ثبت‌نام نکرده است</p>
          <p className="mt-1.5 text-[12px] leading-6 text-slate-500">
            به‌محض ثبت‌نام فروشگاه از صفحه عمومی، پرونده آن بلافاصله در همین بخش ظاهر می‌شود.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shops.map((shop) => (
            <article key={shop.id} className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={shop.logoUrl}
                    alt={`لوگوی ${shop.shopName}`}
                    className="size-12 shrink-0 rounded-xl border border-slate-100 object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-extrabold text-brand-navy">{shop.shopName}</p>
                    <p className="mt-0.5 truncate text-[11px] text-slate-500">مالک: {shop.ownerName}</p>
                  </div>
                </div>
                <StatusChip tone={shop.status === "ACTIVE" ? "green" : "amber"}>
                  {shop.status === "ACTIVE" ? "همکار فعال" : "در انتظار تأیید"}
                </StatusChip>
              </div>

              {shop.status === "ACTIVE" ? (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  تأییدشده توسط {shop.verifiedByName ?? "مدیر"}
                </p>
              ) : null}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => setSelected(shop)}
              >
                مشاهده پرونده کامل
              </Button>
            </article>
          ))}
        </section>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-right">پرونده فروشگاه: {selected.shopName}</DialogTitle>
                <DialogDescription className="text-right">
                  اطلاعات کامل فروشگاه از دیتابیس واقعی خوانده شده است.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-[13px]">
                <Row label="نام مالک" value={selected.ownerName} />
                <Row label="کد ملی مالک" value={selected.nationalId} />
                <Row label="آدرس فروشگاه" value={selected.address} />
                <Row label="شماره تماس" value={selected.contactPhone} />
                <Row label="شماره شبا" value={selected.sheba} ltr />
                <div>
                  <img src={selected.logoUrl} alt={`لوگوی ${selected.shopName}`} className="size-24 rounded-xl border border-slate-100 object-cover" />
                </div>
              </div>

              {selected.status === "ACTIVE" ? (
                <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3.5 text-[12px] font-bold text-emerald-700">
                  <BadgeCheck className="size-4" aria-hidden="true" />
                  این فروشگاه همکار فعال است — تأییدکننده: {selected.verifiedByName ?? "—"}
                </p>
              ) : (
                <Button type="button" className="mt-4 w-full" onClick={() => void handleVerify()} disabled={verifying}>
                  {verifying ? "در حال ثبت..." : "تأیید فروشگاه و فعال‌سازی غرفه"}
                </Button>
              )}
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3">
      <span className="shrink-0 text-[11px] font-bold text-slate-500">{label}</span>
      <span dir={ltr ? "ltr" : undefined} className="min-w-0 break-words text-left text-[12px] font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}
