"use client";

import { useEffect } from "react";

import { AdminApp } from "@/components/admin/admin-app";
import { AppHeader } from "@/components/nirookar/app-header";
import { BottomNav } from "@/components/nirookar/bottom-nav";
import { AboutView } from "@/components/nirookar/views/about-view";
import { AuthFlowView } from "@/components/nirookar/views/auth-flow-view";
import { CustomerPanelView } from "@/components/nirookar/views/customer-panel-view";
import { GuideView } from "@/components/nirookar/views/guide-view";
import { HomeView } from "@/components/nirookar/views/home-view";
import { InstallerPanelView } from "@/components/nirookar/views/installer-panel-view";
import { ShopPanelView } from "@/components/nirookar/views/shop-panel-view";
import { StatusView } from "@/components/nirookar/views/status-view";
import { AuthProvider } from "@/hooks/use-auth";
import { useAppView } from "@/lib/navigation";

/**
 * ریشه اپلیکیشن نیروکار — تمام نماها روی مسیر «/» با ناوبری hash اجرا می‌شوند.
 *
 * پوسته اپلیکیشن (App Shell) — بیلد 005 طبق دستور صریح مالک، ساختار استاندارد
 * سه‌تکه مثل اپ‌های واقعی (اینستاگرام/دیجی‌کالا):
 *
 *   ۱) هدر ثابت بالا (shrink-0): لوگوی «نیروکار» سمت راست + دکمه «→ بازگشت»
 *      در تمام صفحات غیر از خانه (یا وضعیت کاربر در خانه) سمت چپ.
 *   ۲) محتوای میانی (flex-1 overflow-y-auto): تنها بخشی که اسکرول می‌خورد و
 *      از زیر هدر بالا و از پشت/زیر نوار پایین رد می‌شود؛ padding پایین
 *      (pb-32) تضمین می‌کند آخرین خط متن پشت نوار پنهان نماند.
 *   ۳) تنها نوار ناوبری ۴ دکمه‌ای ثابت پایین (fixed + z-50) که با اسکرول
 *      جابه‌جا نمی‌شود — در تمام نماها (موبایل و دسکتاپ).
 *
 * ریشه با «fixed inset-0 h-[100dvh] overflow-hidden» قفل شده تا ارتفاع کل
 * اپ دقیقاً برابر کادر قابل مشاهده باشد و هدر/نوار پایین هرگز بیرون کادر
 * نروند. پنل مدیریت (#/admin) چیدمان مستقل خودش را دارد اما داخل همین پوسته
 * رندر می‌شود تا نوار پایین و قفل‌شدگی ارتفاع در آن هم برقرار باشد.
 */
export default function Page() {
  const view = useAppView();

  // با هر جابه‌جایی بین نماها، اسکرول محتوای میانی به بالای صفحه برمی‌گردد
  useEffect(() => {
    document.getElementById("app-main")?.scrollTo({ top: 0 });
  }, [view]);

  return (
    <AuthProvider>
      <div className="fixed inset-0 flex h-[100dvh] w-full flex-col overflow-hidden bg-brand-bg">
        {view === "admin" ? (
          <AdminApp />
        ) : (
          <>
            <AppHeader current={view} />
            <main
              id="app-main"
              className="w-full flex-1 overflow-y-auto overscroll-contain px-4 pb-32 pt-4 sm:px-6"
            >
              {view === "home" ? <HomeView /> : null}
              {view === "guide" ? <GuideView /> : null}
              {view === "about" ? <AboutView /> : null}
              {view === "status" ? <StatusView /> : null}
              {view === "login-customer" ? <AuthFlowView role="customer" /> : null}
              {view === "login-installer" ? <AuthFlowView role="installer" /> : null}
              {view === "login-shop" ? <AuthFlowView role="shop" /> : null}
              {view === "panel-customer" ? <CustomerPanelView /> : null}
              {view === "panel-installer" ? <InstallerPanelView /> : null}
              {view === "panel-shop" ? <ShopPanelView /> : null}
            </main>
          </>
        )}
        <BottomNav current={view} />
      </div>
    </AuthProvider>
  );
}
