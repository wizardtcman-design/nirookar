import { Ionicons } from "@expo/vector-icons";
import { useRouter, type Router } from "expo-router";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { COLORS, RADII, SPACING } from "./theme";
import { useSession, type AppRole } from "./session";

/**
 * کامپوننت‌های پایه UI موبایل — تجربه کاربری بومی موبایل.
 *
 * بیلد 006 — پوستهٔ استاندارد سه‌تکه (هماهنگ با وب بیلد 005):
 *   ۱) هدر ثابت بالا (لوگو در خانه / دکمه بازگشت در بقیه صفحات)
 *   ۲) محتوای میانی تنها بخش اسکرول‌شونده با فاصله امن از هدر و نوار پایین
 *   ۳) تنها نوار ناوبری ۴ دکمه‌ای ثابت پایین — بدون هیچ نوار تکراری دیگر
 *
 * طبق قواعد پروژه، UI وب و موبایل به اجبار یکسان نمی‌شوند؛ فقط داده و
 * اعتبارسنجی مشترک است (packages/shared).
 */

/* ─────────── کارت انتخاب نقش ─────────── */

interface RoleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  softColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export function RoleCard({ icon, color, softColor, title, subtitle, onPress }: RoleCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title} — ${subtitle}`}
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      style={({ pressed }) => [styles.roleCard, pressed && { opacity: 0.92 }]}
    >
      <View style={styles.roleTextWrap}>
        <Text style={[styles.roleTitle, { color }]}>{title}</Text>
        <Text style={styles.roleSubtitle}>{subtitle}</Text>
        <View style={[styles.roleAccentBar, { backgroundColor: color }]} />
      </View>
      <View style={[styles.roleIconWrap, { backgroundColor: softColor }]}>
        <Ionicons name={icon} size={26} color={color} />
      </View>
    </Pressable>
  );
}

/* ─────────── فیلد ورودی ─────────── */

interface AppTextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  onDark?: boolean;
}

export function AppTextField({ label, error, onDark = false, style, ...props }: AppTextFieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, onDark && { color: COLORS.white }]}>{label}</Text>
      <TextInput
        placeholderTextColor={COLORS.textMuted}
        style={[styles.input, onDark && styles.inputOnDark, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

/* ─────────── دکمه اصلی ─────────── */

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, color = COLORS.teal, disabled = false, style }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: "rgba(255,255,255,0.2)" }}
      style={({ pressed }) => [
        styles.primaryButton,
        { backgroundColor: color },
        disabled && { opacity: 0.6 },
        pressed && { opacity: 0.9 },
        style,
      ]}
    >
      <Text style={styles.primaryButtonLabel}>{label}</Text>
    </Pressable>
  );
}

/* ─────────── اعلان شفافیت ─────────── */

export function HonestNotice({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.notice}>
      <Text style={styles.noticeText}>
        <Text style={styles.noticeTitle}>{title}: </Text>
        {body}
      </Text>
    </View>
  );
}

/* ─────────── سربرگ صفحات داخلی ─────────── */

export function SubPageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.subHeader}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="بازگشت به صفحه قبل"
        onPress={onBack}
        hitSlop={10}
        style={styles.backButton}
      >
        <Ionicons name="arrow-forward" size={22} color={COLORS.navy} />
      </Pressable>
      <Text style={styles.subHeaderTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

/* ─────────── نوار ناوبری ۴ دکمه‌ای ثابت پایین (بیلد 006) ─────────── */

export type MainTabId = "home" | "sandbox" | "auth" | "status";

const NAV_HEIGHT = 64;

export function BottomNav({ active }: { active: MainTabId }) {
  const { user } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // تب سوم پویاست: بدون نشست «ورود»، با نشست «پنل کاربری/پنل مدیریت»
  const authTabLabel = user ? (isAdminRoleSafe(user.role) ? "پنل مدیریت" : "پنل کاربری") : "ورود";
  const authTabIcon: keyof typeof Ionicons.glyphMap = user
    ? isAdminRoleSafe(user.role)
      ? "shield-checkmark"
      : "grid-outline"
    : "log-in-outline";

  const tabs: { id: MainTabId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: "home", label: "خانه", icon: "home-outline" },
    { id: "sandbox", label: "آزمایش نقش‌ها", icon: "flask-outline" },
    { id: "auth", label: authTabLabel, icon: authTabIcon },
    { id: "status", label: "وضعیت توسعه", icon: "stats-chart-outline" },
  ];

  return (
    <View style={[styles.navOuter, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      <View style={styles.navGrid}>
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: isActive }}
              onPress={() => navigateToTab(router, tab.id)}
              android_ripple={{ color: "rgba(15,42,67,0.08)", borderless: false }}
              style={({ pressed }) => [styles.navItem, isActive && styles.navItemActive, pressed && { opacity: 0.85 }]}
            >
              <Ionicons name={tab.icon} size={20} color={isActive ? COLORS.navy : COLORS.textMuted} />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]} numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function isAdminRoleSafe(role: string): boolean {
  return ["super_admin", "ops_manager", "finance_manager", "support_specialist", "auditor"].includes(role);
}

/** جابه‌جایی بین تب‌های اصلی — با جایگزینی (replace) تا پشته انباشته نشود */
function navigateToTab(router: Router, tab: MainTabId) {
  const target = tab === "auth" ? "/login" : tab === "home" ? "/" : `/${tab}`;
  router.replace(target as never);
}

/* ─────────── پوستهٔ اصلی صفحه (هدر + اسکرول + نوار پایین) ─────────── */

const NAV_TOTAL = NAV_HEIGHT + 10;

interface AppShellProps {
  active: MainTabId;
  /** عنوان صفحه داخلی — اگر داده شود، هدر با دکمه بازگشت نمایش داده می‌شود */
  title?: string;
  /** حالت بدون اسکرول (برای صفحات فرم کوتاه هم قابل استفاده است) */
  keyboardAvoid?: boolean;
  children: ReactNode;
}

export function AppShell({ active, title, keyboardAvoid = false, children }: AppShellProps) {
  const router = useRouter();
  const isHome = !title;

  const content = (
    <ScrollView
      contentContainerStyle={styles.shellScroll}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* فاصله امن بالای محتوا از هدر — رفع بریدگی متن زیر هدر (دستور مالک) */}
      <View style={styles.shellContent}>{children}</View>
      {/* فاصله امن پایینی — دکمه‌های پایینی هرگز زیر نوار ناوبری/نوار سیستم بریده نمی‌شوند */}
      <View style={{ height: NAV_TOTAL + SPACING.lg }} />
    </ScrollView>
  );

  return (
    <View style={styles.shellRoot}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <SafeAreaView edges={["top"]} style={styles.shellHeaderSafe}>
        {isHome ? <HomeHeader /> : <SubPageHeader title={title!} onBack={() => router.back()} />}
      </SafeAreaView>
      {keyboardAvoid ? (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.shellBody}>
          {content}
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.shellBody}>{content}</View>
      )}
      <View style={styles.shellNavSafe}>
        <BottomNav active={active} />
      </View>
    </View>
  );
}

/** هدر خانه — لوگوی نیروکار همیشه سمت راست کادر (دستور مالک) */
function HomeHeader() {
  return (
    <View style={styles.homeHeader}>
      <View style={styles.logoRow}>
        <View style={styles.logoMark}>
          <Text style={styles.logoLetter}>N</Text>
          <View style={styles.logoDot} />
        </View>
        <View>
          <Text style={styles.logoName}>نیروکار</Text>
          <Text style={styles.logoTagline}>بازار خدمات فنی و نصب</Text>
        </View>
      </View>
    </View>
  );
}

/* ─────────── تب‌های سگمنتی (ورود / ثبت‌نام مستقیم و انتخاب نقش) ─────────── */

interface SegmentedTabsProps<T extends string> {
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  /** رنگ فعال‌سازی — پیش‌فرض سرمه‌ای برند */
  accentColor?: string;
}

export function SegmentedTabs<T extends string>({ options, value, onChange, accentColor = COLORS.navy }: SegmentedTabsProps<T>) {
  return (
    <View style={styles.segmentWrap}>
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(option.id)}
            style={({ pressed }) => [
              styles.segmentItem,
              isActive && { backgroundColor: accentColor, borderColor: accentColor },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={[styles.segmentLabel, isActive && styles.segmentLabelActive]} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ─────────── چیپ وضعیت پرونده ─────────── */

export type ProfileStatus = "INCOMPLETE" | "PENDING_VERIFICATION" | "ACTIVE" | "REJECTED";

const STATUS_META: Record<ProfileStatus, { label: string; bg: string; color: string }> = {
  INCOMPLETE: { label: "نیازمند تکمیل مدارک", bg: COLORS.coralLight, color: COLORS.coralDark },
  PENDING_VERIFICATION: { label: "در انتظار تأیید مدیر", bg: COLORS.amberBg, color: COLORS.amberText },
  ACTIVE: { label: "تأییدشده — فعال", bg: "#ecfdf5", color: "#047857" },
  REJECTED: { label: "ردشده — نیازمند اصلاح", bg: "#fef2f2", color: "#b91c1c" },
};

export function StatusChip({ status }: { status: ProfileStatus }) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.chip, { backgroundColor: meta.bg }]}>
      <Text style={[styles.chipText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

/* ─────────── کارت حساب Sandbox (ورود سریع) ─────────── */

interface SandboxButtonProps {
  title: string;
  hint: string;
  phone: string;
  color: string;
  softColor: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

export function SandboxButton({ title, hint, phone, color, softColor, icon, onPress }: SandboxButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`ورود سریع ${title}`}
      onPress={onPress}
      android_ripple={{ color: "rgba(0,0,0,0.06)" }}
      style={({ pressed }) => [styles.sandboxButton, pressed && { opacity: 0.9 }]}
    >
      <View style={[styles.sandboxIconWrap, { backgroundColor: softColor }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.sandboxTextWrap}>
        <Text style={styles.sandboxTitle}>{title}</Text>
        <Text style={styles.sandboxHint} numberOfLines={1}>
          {hint}
        </Text>
      </View>
      <View style={styles.sandboxMeta}>
        <Text style={styles.sandboxPhone}>{phone}</Text>
        <View style={styles.sandboxBadge}>
          <Text style={styles.sandboxBadgeText}>ورود سریع</Text>
        </View>
      </View>
    </Pressable>
  );
}

/** آیکون و رنگ هر نقش — مشترک بین صفحات موبایل */
export const ROLE_APPEARANCE: Record<AppRole, { icon: keyof typeof Ionicons.glyphMap; color: string; soft: string }> = {
  customer: { icon: "person-circle-outline", color: COLORS.teal, soft: COLORS.tealLight },
  installer: { icon: "construct-outline", color: COLORS.navy, soft: COLORS.slateLight },
  shop: { icon: "storefront-outline", color: COLORS.coral, soft: COLORS.coralLight },
  super_admin: { icon: "shield-checkmark", color: "#b45309", soft: "#fef3c7" },
  ops_manager: { icon: "settings-outline", color: "#7c3aed", soft: "#f3e8ff" },
  finance_manager: { icon: "cash-outline", color: "#15803d", soft: "#dcfce7" },
  support_specialist: { icon: "headset-outline", color: "#0369a1", soft: "#e0f2fe" },
  auditor: { icon: "document-text-outline", color: "#475569", soft: "#f1f5f9" },
};

/* ─────────── استایل‌ها ─────────── */

const styles = StyleSheet.create({
  roleCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  roleTextWrap: { flex: 1, alignItems: "flex-start", gap: 2 },
  roleTitle: { fontSize: 17, fontWeight: "800" },
  roleSubtitle: { fontSize: 13, color: COLORS.textSecondary },
  roleAccentBar: { marginTop: 6, width: 36, height: 3, borderRadius: 999 },
  roleIconWrap: { width: 56, height: 56, borderRadius: 999, alignItems: "center", justifyContent: "center" },
  fieldWrap: { width: "100%" },
  fieldLabel: { fontSize: 13, fontWeight: "700", color: COLORS.navy, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADII.md,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    fontSize: 15,
    color: COLORS.text,
  },
  inputOnDark: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderColor: "rgba(255,255,255,0.2)",
    color: COLORS.white,
  },
  inputError: { borderColor: COLORS.danger },
  fieldError: { marginTop: 6, fontSize: 12, color: COLORS.danger },
  primaryButton: {
    height: 50,
    borderRadius: RADII.md,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonLabel: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
  notice: {
    backgroundColor: COLORS.amberBg,
    borderColor: COLORS.amberBorder,
    borderWidth: 1,
    borderRadius: RADII.md,
    padding: SPACING.md,
  },
  noticeText: { fontSize: 12, lineHeight: 22, color: COLORS.amberText },
  noticeTitle: { fontWeight: "800" },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226,232,240,0.7)",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: RADII.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.slateLight,
  },
  subHeaderTitle: { fontSize: 16, fontWeight: "800", color: COLORS.navy, flex: 1, textAlign: "center", marginHorizontal: 8 },

  /* پوستهٔ اصلی */
  shellRoot: { flex: 1, backgroundColor: COLORS.bg },
  shellHeaderSafe: { backgroundColor: COLORS.white },
  shellBody: { flex: 1 },
  shellScroll: { flexGrow: 1, paddingHorizontal: SPACING.md, paddingTop: SPACING.lg },
  shellContent: { flex: 1 },
  shellNavSafe: { backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.border },

  /* هدر خانه */
  homeHeader: { height: 56, justifyContent: "center", paddingHorizontal: SPACING.md },
  logoRow: { flexDirection: "row-reverse", alignItems: "center", gap: SPACING.sm + 2, alignSelf: "flex-start" },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { color: COLORS.white, fontSize: 17, fontWeight: "900" },
  logoDot: {
    position: "absolute",
    bottom: -2,
    left: -2,
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: COLORS.teal,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  logoName: { fontSize: 18, fontWeight: "900", color: COLORS.navy },
  logoTagline: { fontSize: 10, color: COLORS.textSecondary },

  /* نوار ناوبری */
  navOuter: { backgroundColor: COLORS.white },
  navGrid: { flexDirection: "row", height: NAV_HEIGHT, alignItems: "stretch" },
  navItem: {
    flex: 1,
    minWidth: 0,
    borderRadius: RADII.md,
    marginHorizontal: 2,
    marginVertical: 6,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  navItemActive: { backgroundColor: COLORS.slateLight },
  navLabel: { fontSize: 10, fontWeight: "700", color: COLORS.textMuted, maxWidth: "100%" },
  navLabelActive: { color: COLORS.navy, fontWeight: "800" },

  /* تب‌های سگمنتی */
  segmentWrap: {
    flexDirection: "row-reverse",
    backgroundColor: COLORS.slateLight,
    borderRadius: RADII.md,
    padding: 4,
    gap: 4,
  },
  segmentItem: {
    flex: 1,
    minWidth: 0,
    height: 42,
    borderRadius: RADII.md - 2,
    borderWidth: 1,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingHorizontal: 6,
  },
  segmentLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },
  segmentLabelActive: { color: COLORS.white, fontWeight: "800" },

  /* چیپ وضعیت */
  chip: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  chipText: { fontSize: 12, fontWeight: "800" },

  /* دکمه Sandbox */
  sandboxButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: SPACING.sm + 2,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  sandboxIconWrap: { width: 44, height: 44, borderRadius: RADII.lg, alignItems: "center", justifyContent: "center" },
  sandboxTextWrap: { flex: 1, minWidth: 0, gap: 2 },
  sandboxTitle: { fontSize: 14, fontWeight: "800", color: COLORS.navy },
  sandboxHint: { fontSize: 11, color: COLORS.textSecondary },
  sandboxMeta: { alignItems: "flex-end", gap: 4 },
  sandboxPhone: { fontSize: 11, fontWeight: "700", color: COLORS.text, fontVariant: ["tabular-nums"] },
  sandboxBadge: {
    backgroundColor: COLORS.tealLight,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sandboxBadgeText: { fontSize: 10, fontWeight: "800", color: COLORS.tealDark },
});
