"use client";

import { useEffect, useState } from "react";

import type { AdminRole } from "@shared/admin-rbac";

import { AdminLayout } from "@/components/admin/admin-layout";
import { AdminLogin } from "@/components/admin/admin-login";
import { useHashPath } from "@/lib/navigation";

/**
 * ریشه پنل مدیریت — وضعیت ورود نمایشی فقط در حافظه نشست نگه داشته می‌شود
 * (هیچ توکن یا رمزی ذخیره یا ارسال نمی‌شود) و با بستن صفحه پاک می‌شود.
 */
export function AdminApp() {
  const [sessionRole, setSessionRole] = useState<AdminRole | null>(null);
  const path = useHashPath();

  // استخراج بخش فعال از مسیر: /admin/users → users
  const section = path.replace(/^\/admin\/?/, "") || "overview";

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [path]);

  if (!sessionRole) {
    return <AdminLogin onLogin={setSessionRole} />;
  }

  return <AdminLayout role={sessionRole} section={section} onLogout={() => setSessionRole(null)} />;
}
