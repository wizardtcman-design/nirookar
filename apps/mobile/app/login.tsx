import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";

import { AppShell, AppTextField, PrimaryButton, ROLE_APPEARANCE, SandboxButton, SegmentedTabs } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import {
  MAIN_ROLE_LABELS,
  MAIN_ROLES,
  SANDBOX_ACCOUNTS,
  isAdminRole,
  useSession,
  type SessionUser,
} from "../src/session";
import { useAuthForm, type AuthTab } from "../src/use-auth-form";
import { SPECIALTIES } from "@shared/specialties";

/**
 * صفحه احراز هویت — بیلد 006 (رفع باگ مالک).
 *
 * ⚠️ رفع باگ نمایش همزمان فرم «ورود نصاب» و «ورود فروشگاه»:
 *   پیش‌تر صفحه حرفه‌ای‌ها هر دو کارت را همزمان زیر هم رندر می‌کرد. اکنون
 *   فقط و فقط فرم نقش انتخاب‌شده رندر می‌شود و نقش با تب‌های بالای فرم
 *   قابل تغییر است.
 *
 * دو تب «ورود» و «ثبت‌نام مستقیم (بدون پیامک)» — دقیقاً مثل وب:
 *   ثبت‌نام = موبایل + کد ملی ۱۰ رقمی (ریاضی + یکتا به‌ازای هر نقش) +
 *   نام و نام خانوادگی + رمز عبور + فیلد اختصاصی نقش.
 * پس از ورود، کاربر بلافاصله به پنل اختصاصی نقش هدایت می‌شود.
 */

const ROLE_TABS = MAIN_ROLES.map((role) => ({ id: role, label: MAIN_ROLE_LABELS[role] }));
const FLOW_TABS = [
  { id: "login" as const, label: "ورود" },
  { id: "register" as const, label: "ثبت‌نام مستقیم (بدون پیامک)" },
];

function isMainRole(value: string | undefined): value is "customer" | "installer" | "shop" {
  return value === "customer" || value === "installer" || value === "shop";
}

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: string; quickPhone?: string }>();
  const { user, login, logout } = useSession();

  const [selectedRole, setSelectedRole] = useState<"customer" | "installer" | "shop">(
    isMainRole(params.role) ? params.role : "customer",
  );
  const [flowTab, setFlowTab] = useState<AuthTab>("login");

  // نقش انتخابی از کارت خانه — هر بار که پارامتر عوض شود همگام می‌شود
  useEffect(() => {
    if (isMainRole(params.role) && params.role !== selectedRole) {
      setSelectedRole(params.role);
    }
  }, [params.role, selectedRole]);

  const appearance = ROLE_APPEARANCE[selectedRole];

  const handleSuccess = useCallback(
    (sessionUser: SessionUser) => {
      router.replace("/panel");
    },
    [router],
  );

  const form = useAuthForm(selectedRole, handleSuccess);

  // پیش‌فرض شماره حساب Sandbox وقتی از دکمه ورود سریع آمده‌ایم
  useEffect(() => {
    if (params.quickPhone && typeof params.quickPhone === "string") {
      form.setPhone(params.quickPhone);
      router.setParams({ quickPhone: undefined });
    }
  }, [params.quickPhone, form, router]);

  const sandboxForRole = useMemo(
    () => SANDBOX_ACCOUNTS.filter((account) => account.role === selectedRole || isAdminRole(account.role)),
    [selectedRole],
  );

  // کاربر واردشده — خلاصه نشست با دکمه رفتن به پنل
  if (user) {
    const userAppearance = ROLE_APPEARANCE[user.role];
    return (
      <AppShell active="auth" title="ورود / پنل کاربری">
        <View style={styles.sessionCard}>
          <View style={[styles.sessionIconWrap, { backgroundColor: userAppearance.soft }]}>
            <Ionicons name={userAppearance.icon} size={30} color={userAppearance.color} />
          </View>
          <Text style={styles.sessionName}>{user.displayName}</Text>
          <Text style={styles.sessionMeta}>{user.phone}</Text>
          <Text style={styles.sessionRole}>
            نقش: {user.role === "installer" ? "نصاب" : user.role === "shop" ? "فروشگاه" : user.role === "customer" ? "مشتری" : "مدیر"}
            {isAdminRole(user.role) ? " — پنل مدیریت نمایشی" : ""}
          </Text>
          <PrimaryButton
            label={isAdminRole(user.role) ? "رفتن به پنل مدیریت" : "رفتن به پنل کاربری"}
            color={userAppearance.color}
            onPress={() => router.replace("/panel")}
            style={{ marginTop: SPACING.lg, width: "100%" }}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              logout();
              router.replace("/login");
            }}
            style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.85 }]}
          >
            <Ionicons name="log-out-outline" size={16} color={COLORS.danger} />
            <Text style={styles.logoutText}>خروج از حساب</Text>
          </Pressable>
        </View>
      </AppShell>
    );
  }

  return (
    <AppShell active="auth" title="ورود / ثبت‌نام" keyboardAvoid>
      {/* تب‌های انتخاب نقش — فقط یک فرم برای نقش انتخابی رندر می‌شود */}
      <SegmentedTabs options={ROLE_TABS} value={selectedRole} onChange={setSelectedRole} accentColor={appearance.color} />

      {/* نشان نقش انتخابی */}
      <View style={styles.roleBadge}>
        <View style={[styles.roleBadgeIcon, { backgroundColor: appearance.soft }]}>
          <Ionicons name={appearance.icon} size={22} color={appearance.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleBadgeTitle}>{formTitle(selectedRole)}</Text>
          <Text style={styles.roleBadgeSub}>{formSubtitle(selectedRole)}</Text>
        </View>
      </View>

      {/* تب‌های جریان: ورود / ثبت‌نام مستقیم */}
      <SegmentedTabs options={FLOW_TABS} value={flowTab} onChange={setFlowTab} />

      {flowTab === "login" ? (
        <View style={styles.card}>
          <AppTextField
            label="شماره موبایل"
            placeholder="09xxxxxxxxx"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={form.setPhone}
            error={form.errors.phone}
          />
          <AppTextField
            label="رمز عبور"
            placeholder="رمز عبور خود را وارد کنید"
            secureTextEntry
            value={form.password}
            onChangeText={form.setPassword}
            error={form.errors.password}
          />

          {form.errors.form ? <Text style={styles.formError}>{form.errors.form}</Text> : null}

          <PrimaryButton
            label={submitLabel(selectedRole)}
            color={appearance.color}
            onPress={form.handleLogin}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ورود سریع Sandbox — رمز 123456</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.quickList}>
            {sandboxForRole.map((account) => {
              const accAppearance = ROLE_APPEARANCE[account.role];
              return (
                <SandboxButton
                  key={account.phone}
                  title={account.displayName}
                  hint={account.hint}
                  phone={account.phone}
                  color={accAppearance.color}
                  softColor={accAppearance.soft}
                  icon={accAppearance.icon}
                  onPress={() => {
                    login({
                      phone: account.phone,
                      role: account.role,
                      displayName: account.displayName,
                      nationalId: account.nationalId,
                    });
                    router.replace("/panel");
                  }}
                />
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <AppTextField
            label="شماره موبایل"
            placeholder="09xxxxxxxxx"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={form.setPhone}
            error={form.errors.phone}
          />
          <AppTextField
            label="کد ملی (۱۰ رقم)"
            placeholder="کد ملی ۱۰ رقمی بدون خط تیره"
            keyboardType="number-pad"
            value={form.nationalId}
            onChangeText={form.setNationalId}
            error={form.errors.nationalId}
          />
          <View style={{ flexDirection: "row-reverse", gap: SPACING.md }}>
            <View style={{ flex: 1 }}>
              <AppTextField
                label="نام"
                placeholder="نام"
                value={form.firstName}
                onChangeText={form.setFirstName}
                error={form.errors.firstName}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppTextField
                label="نام خانوادگی"
                placeholder="نام خانوادگی"
                value={form.lastName}
                onChangeText={form.setLastName}
                error={form.errors.lastName}
              />
            </View>
          </View>

          {selectedRole === "shop" ? (
            <AppTextField
              label="نام فروشگاه"
              placeholder="مثال: آریا دکور"
              value={form.shopName}
              onChangeText={form.setShopName}
              error={form.errors.shopName}
            />
          ) : null}

          {selectedRole === "installer" ? (
            <>
              <View style={styles.specialtyBlock}>
                <Text style={styles.specialtyLabel}>تخصص‌ها (حداقل یک مورد)</Text>
                <View style={styles.specialtyWrap}>
                  {SPECIALTIES.map((specialty) => {
                    const active = form.specialtyKeys.includes(specialty.key);
                    return (
                      <Pressable
                        key={specialty.key}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: active }}
                        onPress={() => form.toggleSpecialty(specialty.key)}
                        style={({ pressed }) => [
                          styles.specialtyChip,
                          active && styles.specialtyChipActive,
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        <Text style={[styles.specialtyChipText, active && styles.specialtyChipTextActive]}>
                          {specialty.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {form.errors.specialty ? <Text style={styles.fieldInlineError}>{form.errors.specialty}</Text> : null}
              </View>
              <AppTextField
                label="سابقه کار (مثال: ۶ سال)"
                placeholder="سابقه کار خود را وارد کنید"
                value={form.experience}
                onChangeText={form.setExperience}
                error={form.errors.experience}
              />
            </>
          ) : null}

          <AppTextField
            label="رمز عبور"
            placeholder="حداقل ۶ کاراکتر"
            secureTextEntry
            value={form.regPassword}
            onChangeText={form.setRegPassword}
            error={form.errors.password}
          />

          {form.errors.form ? <Text style={styles.formError}>{form.errors.form}</Text> : null}

          <PrimaryButton
            label={registerSubmitLabel(selectedRole)}
            color={appearance.color}
            onPress={form.handleRegister}
          />

          <Text style={styles.registerNote}>
            ثبت‌نام بدون پیامک است و بلافاصله وارد پنل نقش خود می‌شوید؛ مدارک احراز هویت نصاب/فروشگاه بعداً از کارت
            «تکمیل احراز هویت و مدارک» پنل ارسال می‌شود.
          </Text>
        </View>
      )}
    </AppShell>
  );
}

function formTitle(role: "customer" | "installer" | "shop"): string {
  if (role === "installer") return "ورود / ثبت‌نام نصاب";
  if (role === "shop") return "ورود / ثبت‌نام فروشگاه";
  return "ورود مشتری";
}

function formSubtitle(role: "customer" | "installer" | "shop"): string {
  if (role === "installer") return "متخصصان نصب و خدمات فنی";
  if (role === "shop") return "غرفه‌داران و فروشگاه‌های مرتبط";
  return "دریافت خدمات و پیگیری سفارش‌ها";
}

function submitLabel(role: "customer" | "installer" | "shop"): string {
  if (role === "installer") return "ورود به پنل نصاب";
  if (role === "shop") return "ورود به پنل فروشگاه";
  return "ورود به حساب مشتری";
}

function registerSubmitLabel(role: "customer" | "installer" | "shop"): string {
  if (role === "installer") return "ثبت‌نام نصاب و ورود به پنل";
  if (role === "shop") return "ثبت‌نام فروشگاه و ورود به پنل";
  return "ثبت‌نام مشتری و ورود به پنل";
}

const styles = StyleSheet.create({
  roleBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  roleBadgeIcon: { width: 48, height: 48, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  roleBadgeTitle: { fontSize: 16, fontWeight: "900", color: COLORS.navy },
  roleBadgeSub: { marginTop: 2, fontSize: 12, color: COLORS.textSecondary },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    gap: SPACING.md,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  formError: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
    borderRadius: RADII.md,
    padding: SPACING.md,
    color: "#b91c1c",
    fontSize: 12,
    lineHeight: 20,
    textAlign: "right",
  },
  divider: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 4 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { fontSize: 10, color: COLORS.textMuted, fontWeight: "700" },
  quickList: { gap: SPACING.sm + 2 },
  specialtyBlock: { gap: 8 },
  specialtyLabel: { fontSize: 13, fontWeight: "700", color: COLORS.navy },
  specialtyWrap: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 },
  specialtyChip: {
    backgroundColor: COLORS.slateLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  specialtyChipActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  specialtyChipText: { fontSize: 12, fontWeight: "700", color: COLORS.textSecondary },
  specialtyChipTextActive: { color: COLORS.white, fontWeight: "800" },
  fieldInlineError: { fontSize: 12, color: COLORS.danger },
  registerNote: { fontSize: 11, lineHeight: 19, color: COLORS.textMuted, textAlign: "right" },
  sessionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    alignItems: "center",
    gap: 6,
  },
  sessionIconWrap: { width: 72, height: 72, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  sessionName: { marginTop: 10, fontSize: 18, fontWeight: "900", color: COLORS.navy },
  sessionMeta: { fontSize: 13, color: COLORS.textSecondary, fontVariant: ["tabular-nums"] },
  sessionRole: { fontSize: 12, color: COLORS.textMuted },
  logoutButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    marginTop: SPACING.md,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: RADII.md,
    backgroundColor: "#fef2f2",
  },
  logoutText: { fontSize: 12, fontWeight: "800", color: COLORS.danger },
});
