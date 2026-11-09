"use client";

import { useEffect } from "react";

import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminLogin } from "@/components/admin/admin-login";
import { useAuth } from "@/hooks/use-auth";
import { useHashPath } from "@/lib/navigation";

/**
 * ریشه پنل مدیریت — فاز ۲ گام ۱.
 *
 * دسترسی فقط بر اساس نشست واقعی (کوکی httpOnly) و نقش مدیریتی کاربر لاگین‌شده
 * باز می‌شود؛ اگر کاربر وارد نشده یا نقش مدیریتی ندارد، صفحه ورود نمایش داده
 * می‌شود. کنترل مجوز هر بخش، علاوه بر UI، سمت سرور هم اجرا می‌شود.
 */
export function AdminApp() {
  const { user, adminRole, loading, logout } = useAuth();
  const path = useHashPath();

  // استخراج بخش فعال از مسیر: /admin/users → users
  const section = path.replace(/^\/admin\/?/, "") || "overview";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-navy-dark">
        <div aria-label="در حال بارگذاری پنل مدیریت" className="flex flex-col items-center gap-3">
          <span className="size-8 animate-spin rounded-full border-2 border-brand-teal border-t-transparent" />
          <p className="text-xs text-slate-400">در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  if (!user || !adminRole) {
    return <AdminLogin />;
  }

  return (
    <AdminLayout
      role={adminRole}
      adminName={user.displayName}
      section={section}
      onLogout={() => void logout()}
    />
  );
}
