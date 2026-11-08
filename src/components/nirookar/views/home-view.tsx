"use client";

import { Bell } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/nirookar/logo";
import { RoleCard } from "@/components/nirookar/role-card";
import { navigateToView } from "@/lib/navigation";
import { ROLE_REGISTRY } from "@/lib/roles";

const NOTIFICATIONS_DISABLED_MESSAGE = "اعلان‌ها در نسخه‌های بعدی فعال می‌شود";

/** صفحه اول اپلیکیشن — خوش‌آمد و انتخاب نقش ورود (مشتری / نصاب / فروشگاه) */
export function HomeView() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <Logo />
        <button
          type="button"
          onClick={() => toast.info(NOTIFICATIONS_DISABLED_MESSAGE)}
          aria-label="اعلان‌ها"
          className="flex size-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
        >
          <Bell className="size-5" aria-hidden="true" />
        </button>
      </header>

      <main className="flex-1 px-5 pb-32">
        <h1 className="mt-6 text-center text-[28px] font-black text-brand-navy sm:text-3xl">خوش آمدید</h1>
        <p className="mt-2 text-center text-sm text-slate-500">لطفاً نقش خود را برای ورود انتخاب کنید</p>

        <div className="mx-auto mt-8 flex max-w-sm flex-col gap-4">
          {ROLE_REGISTRY.map((role) => (
            <RoleCard key={role.id} role={role} onClick={() => navigateToView(`login-${role.id}`)} />
          ))}
        </div>
      </main>
    </div>
  );
}
