"use client";

import { AdminApp } from "@/components/admin/admin-app";
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
import { isTabView, useAppView } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * ریشه اپلیکیشن نیروکار — تمام نماها روی مسیر «/» با ناوبری hash اجرا می‌شوند.
 * نگاشت نما به کامپوننت در یک نقطه متمرکز است تا در فازهای بعد به‌سادگی
 * به روتر واقعی Next.js منتقل شود.
 *
 * پنل مدیریت (#/admin) چیدمان مستقل و تیره خودش را دارد و برخلاف وب‌سایت
 * عمومی، نوار ناوبری پایین ندارد. دسترسی پنل فقط بر اساس نقش لاگین‌شده است
 * و لینک عمومی آن در صفحه اصلی نمایش داده نمی‌شود (دستور مالک).
 */
export default function Page() {
  const view = useAppView();

  if (view === "admin") {
    return (
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      {/*
        pb-24 فقط برای نماهای دارای نوار پایین: محتوای صفحه هرگز زیر نوار
        ثابت پایین پنهان نمی‌شود (حتی وقتی صفحه کوتاه است).
      */}
      <div className={cn("min-h-screen bg-brand-bg", isTabView(view) && "pb-24")}>
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
        <BottomNav current={view} />
      </div>
    </AuthProvider>
  );
}
