"use client";

import { AdminApp } from "@/components/admin/admin-app";
import { BottomNav } from "@/components/nirookar/bottom-nav";
import { AboutView } from "@/components/nirookar/views/about-view";
import { CustomerLoginView } from "@/components/nirookar/views/customer-login-view";
import { GuideView } from "@/components/nirookar/views/guide-view";
import { HomeView } from "@/components/nirookar/views/home-view";
import { ProfessionalLoginView } from "@/components/nirookar/views/professional-login-view";
import { StatusView } from "@/components/nirookar/views/status-view";
import { isTabView, useAppView } from "@/lib/navigation";

/**
 * ریشه اپلیکیشن نیروکار — تمام نماها روی مسیر «/» با ناوبری hash اجرا می‌شوند.
 * نگاشت نما به کامپوننت در یک نقطه متمرکز است تا در فازهای بعد به‌سادگی
 * به روتر واقعی Next.js منتقل شود.
 *
 * پنل مدیریت (#/admin) چیدمان مستقل و تیره خودش را دارد و برخلاف وب‌سایت
 * عمومی، نوار ناوبری پایین ندارد.
 */
export default function Page() {
  const view = useAppView();

  if (view === "admin") {
    return <AdminApp />;
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {view === "home" ? <HomeView /> : null}
      {view === "guide" ? <GuideView /> : null}
      {view === "about" ? <AboutView /> : null}
      {view === "status" ? <StatusView /> : null}
      {view === "login-customer" ? <CustomerLoginView /> : null}
      {view === "login-installer" ? <ProfessionalLoginView focus="installer" /> : null}
      {view === "login-shop" ? <ProfessionalLoginView focus="shop" /> : null}
      <BottomNav current={view} />
    </div>
  );
}
