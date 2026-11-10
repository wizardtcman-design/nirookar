import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { AppShell, HonestNotice, ROLE_APPEARANCE, SandboxButton, StatusChip } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { SANDBOX_PASSWORD, SANDBOX_ACCOUNTS, getRoleTitle, useSession, type SessionUser } from "../src/session";

/**
 * صفحه «آزمایش نقش‌ها» — بیلد 006 (دستور مالک).
 *
 * دکمه‌های ورود سریع به همهٔ اکانت‌های آماده تست Sandbox (مشتری، نصاب، فروشگاه
 * و پنج مدیر) با رمز پیش‌فرض 123456 — هماهنگ با seed وب (src/server/seed.ts).
 * با هر ورود، کاربر بلافاصله به پنل اختصاصی همان نقش هدایت می‌شود.
 */

const SECTION_ORDER = ["customer", "installer", "shop"] as const;

const ADMIN_ORDER = ["super_admin", "ops_manager", "finance_manager", "support_specialist", "auditor"] as const;

export default function SandboxScreen() {
  const router = useRouter();
  const { login } = useSession();

  function quickLogin(account: (typeof SANDBOX_ACCOUNTS)[number]) {
    const sessionUser: SessionUser = {
      phone: account.phone,
      role: account.role,
      displayName: account.displayName,
      nationalId: account.nationalId,
    };
    login(sessionUser);
    router.replace("/panel");
  }

  const mainAccounts = SECTION_ORDER.map((role) => SANDBOX_ACCOUNTS.find((account) => account.role === role)!);
  const adminAccounts = ADMIN_ORDER.map((role) => SANDBOX_ACCOUNTS.find((account) => account.role === role)!);

  return (
    <AppShell active="sandbox" title="آزمایش نقش‌ها">
      <Text style={styles.intro}>
        با یک لمس وارد هر نقش شوید و پنل اختصاصی آن را ببینید؛ این حساب‌ها دقیقاً همان حساب‌های Sandbox وب با رمز
        پیش‌فرض 123456 هستند.
      </Text>

      <View style={styles.passwordBanner}>
        <Ionicons name="key-outline" size={16} color={COLORS.amberText} />
        <Text style={styles.passwordText}>
          رمز همه حساب‌ها: <Text style={styles.passwordStrong}>{SANDBOX_PASSWORD}</Text>
        </Text>
      </View>

      <Text style={styles.sectionTitle}>نقش‌های اصلی</Text>
      <View style={styles.list}>
        {mainAccounts.map((account) => {
          const appearance = ROLE_APPEARANCE[account.role];
          return (
            <SandboxButton
              key={account.phone}
              title={account.displayName}
              hint={`${getRoleTitle(account.role)} — ${account.hint}`}
              phone={account.phone}
              color={appearance.color}
              softColor={appearance.soft}
              icon={appearance.icon}
              onPress={() => quickLogin(account)}
            />
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>مدیران پلتفرم (پنل مدیریت مخفی)</Text>
      <Text style={styles.sectionHint}>
        ورود با هر نقش مدیریتی، داشبورد مدیریتی نمایشی را باز می‌کند — ماتریس دسترسی همان RBAC وب است.
      </Text>
      <View style={styles.list}>
        {adminAccounts.map((account) => {
          const appearance = ROLE_APPEARANCE[account.role];
          return (
            <SandboxButton
              key={account.phone}
              title={account.displayName}
              hint={`${getRoleTitle(account.role)} — ${account.hint}`}
              phone={account.phone}
              color={appearance.color}
              softColor={appearance.soft}
              icon={appearance.icon}
              onPress={() => quickLogin(account)}
            />
          );
        })}
      </View>

      <HonestNotice
        title="حالت نمایشی"
        body="اپ موبایل در این فاز سرور مستقل ندارد؛ حساب‌ها و داده‌های پنل‌ها سمت کلاینت شبیه‌سازی شده‌اند تا طراحی کامل قابل تست باشد. اتصال به API همان بک‌اند وب در فاز Backend اضافه می‌شود."
      />

      {isAdminTip()}
    </AppShell>
  );
}

function isAdminTip() {
  return (
    <View style={styles.tipCard}>
      <View style={styles.tipRow}>
        <StatusChip status="INCOMPLETE" />
        <StatusChip status="PENDING_VERIFICATION" />
        <StatusChip status="ACTIVE" />
      </View>
      <Text style={styles.tipText}>
        نصاب و فروشگاه پس از ورود، کارت «تکمیل احراز هویت و مدارک» را می‌بینند: کد پستی ۱۰ رقمی، آدرس محرمانه، شبا
        (الگوریتم Mod-97) و پیوست مدارک.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { marginTop: SPACING.sm, fontSize: 13, lineHeight: 22, color: COLORS.textSecondary, textAlign: "right" },
  passwordBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.amberBg,
    borderColor: COLORS.amberBorder,
    borderWidth: 1,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    marginTop: SPACING.md,
  },
  passwordText: { fontSize: 12, color: COLORS.amberText, flex: 1 },
  passwordStrong: { fontSize: 14, fontWeight: "900", letterSpacing: 2 },
  sectionTitle: { marginTop: SPACING.lg, fontSize: 15, fontWeight: "900", color: COLORS.navy },
  sectionHint: { marginTop: 4, fontSize: 11, lineHeight: 18, color: COLORS.textMuted },
  list: { marginTop: SPACING.md, gap: SPACING.sm + 2 },
  tipCard: {
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  tipRow: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  tipText: { fontSize: 11, lineHeight: 19, color: COLORS.textSecondary, textAlign: "right" },
});
