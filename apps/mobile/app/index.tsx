import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppShell, ROLE_APPEARANCE, RoleCard, SandboxButton } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { SANDBOX_ACCOUNTS, useSession } from "../src/session";
import { APP_BUILD, APP_BUILD_NOTE, APP_VERSION } from "@shared/version-core";

/**
 * صفحه خانه — بیلد 006 همگام با گام ۳ وب.
 *
 * کارت‌های نقش به صفحه احراز هویت یکسانه می‌روند و نقش انتخابی با پارامتر
 * منتقل می‌شود؛ در صفحه ورود «فقط» فرم همان نقش باز می‌شود (رفع باگ نمایش
 * همزمان دو فرم نصاب/فروشگاه).
 */

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useSession();

  return (
    <AppShell active="home">
      <Text style={styles.welcomeTitle}>
        {user ? `سلام ${user.displayName}!` : "خوش آمدید"}
      </Text>
      <Text style={styles.welcomeSubtitle}>
        {user
          ? "از نوار پایین به پنل کاربری خود بروید یا نقش دیگری را بیازمایید."
          : "لطفاً نقش خود را برای ورود یا ثبت‌نام مستقیم انتخاب کنید"}
      </Text>
      <Text style={styles.welcomeNote}>
        نیروکار بازارگاه چندخدمتی خدمات فنی، نصب و فروشگاه‌های مرتبط است. با ورود، پنل اختصاصی نقش شما باز می‌شود.
      </Text>

      <View style={styles.cards}>
        {ROLE_CARDS.map((role) => {
          const appearance = ROLE_APPEARANCE[role.id];
          return (
            <RoleCard
              key={role.id}
              icon={appearance.icon}
              color={appearance.color}
              softColor={appearance.soft}
              title={role.title}
              subtitle={role.subtitle}
              onPress={() => router.push({ pathname: "/login", params: { role: role.id } })}
            />
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>ورود سریع Sandbox</Text>
      <Text style={styles.sectionHint}>حساب‌های آماده تست با رمز پیش‌فرض 123456 — همهٔ نقش‌ها</Text>
      <View style={styles.quickWrap}>
        {SANDBOX_ACCOUNTS.slice(0, 3).map((account) => {
          const appearance = ROLE_APPEARANCE[account.role];
          return (
            <SandboxButton
              key={account.phone}
              title={account.displayName}
              hint={account.hint}
              phone={account.phone}
              color={appearance.color}
              softColor={appearance.soft}
              icon={appearance.icon}
              onPress={() =>
                router.push({
                  pathname: "/login",
                  params: { role: account.role, quickPhone: account.phone },
                })
              }
            />
          );
        })}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/sandbox")}
          style={({ pressed }) => [styles.allRolesButton, pressed && { opacity: 0.9 }]}
        >
          <Ionicons name="flask-outline" size={16} color={COLORS.teal} />
          <Text style={styles.allRolesText}>آزمایش همه نقش‌ها (شامل مدیران)</Text>
        </Pressable>
      </View>

      <View style={styles.links}>
        <Pressable accessibilityRole="button" onPress={() => router.push("/guide")} style={styles.linkButton}>
          <Ionicons name="help-circle-outline" size={18} color={COLORS.teal} />
          <Text style={styles.linkText}>راهنما</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => router.push("/about")} style={styles.linkButton}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.teal} />
          <Text style={styles.linkText}>درباره ما</Text>
        </Pressable>
      </View>

      <Text style={styles.versionNote}>
        نسخه پیش‌انتشار {APP_VERSION} — بیلد {APP_BUILD} ({APP_BUILD_NOTE})
      </Text>
    </AppShell>
  );
}

const ROLE_CARDS = [
  { id: "customer", title: "ورود مشتری", subtitle: "دسترسی به خدمات و سفارش‌ها" },
  { id: "installer", title: "ورود نصاب", subtitle: "برای متخصصان و نصابان" },
  { id: "shop", title: "ورود فروشگاه", subtitle: "مدیریت فروشگاه و محصولات" },
] as const;

const styles = StyleSheet.create({
  welcomeTitle: { marginTop: SPACING.md, textAlign: "center", fontSize: 26, fontWeight: "900", color: COLORS.navy },
  welcomeSubtitle: { marginTop: 6, textAlign: "center", fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  welcomeNote: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.xs,
  },
  cards: { marginTop: SPACING.lg, gap: SPACING.md },
  sectionTitle: { marginTop: SPACING.xl, fontSize: 15, fontWeight: "900", color: COLORS.navy },
  sectionHint: { marginTop: 4, fontSize: 11, color: COLORS.textMuted },
  quickWrap: { marginTop: SPACING.md, gap: SPACING.sm + 2 },
  allRolesButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADII.md,
    paddingVertical: 12,
  },
  allRolesText: { fontSize: 12, fontWeight: "800", color: COLORS.teal },
  links: { marginTop: SPACING.lg + 4, flexDirection: "row-reverse", justifyContent: "center", gap: SPACING.sm + 4 },
  linkButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
  },
  linkText: { fontSize: 12, fontWeight: "700", color: COLORS.navy },
  versionNote: { marginTop: SPACING.lg, textAlign: "center", fontSize: 10, color: COLORS.textMuted, lineHeight: 16 },
});
