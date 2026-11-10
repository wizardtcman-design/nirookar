import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppShell } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { APP_BUILD, APP_VERSION } from "@shared/version-core";

/** دسته‌بندی‌های آینده بازارگاه — صرفاً اطلاع‌رسانی، بدون قابلیت نمایشی */
const UPCOMING_CATEGORIES = [
  "دکوراسیون داخلی و نصب",
  "نصاب‌ها و متخصصان ساختمان",
  "فروشگاه‌های محصولات ساختمانی",
  "وانت‌بار و حمل‌ونقل",
  "تعمیرات و خدمات منزل",
] as const;

const ACTIVE_PATHS = [
  { title: "ورود / ثبت‌نام مستقیم", subtitle: "مشتری، نصاب و فروشگاه — بدون پیامک با موبایل + کد ملی + رمز" },
  { title: "پنل اختصاصی نقش‌ها", subtitle: "پس از ورود، پنل همان نقش باز می‌شود" },
  { title: "تکمیل مدارک نصاب و فروشگاه", subtitle: "کد پستی، آدرس محرمانه، شبا و پیوست مدارک" },
  { title: "آزمایش نقش‌ها (Sandbox)", subtitle: "ورود سریع حساب‌های تست با رمز 123456" },
  { title: "پنل مدیریت (نقش‌های ادمین)", subtitle: "داشبورد نمایشی برای پنج نقش مدیریتی" },
] as const;

/** صفحه راهنما — توضیح صادقانه وضعیت فعلی و مسیر توسعه (بیلد 006) */
export default function GuideScreen() {
  return (
    <AppShell active="home" title="راهنما">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>نیروکار چیست؟</Text>
        <Text style={styles.sectionBody}>
          نیروکار یک بازارگاه چندخدمتی برای خدمات فنی، نصب و فروشگاه‌های مرتبط است. در نسخه جاری ({APP_VERSION} — بیلد{" "}
          {APP_BUILD}) جریان کامل ورود، ثبت‌نام مستقیم و پنل‌های نقش‌محور فعال است و قابلیت‌های اصلی، مرحله‌به‌مرحله و
          با تأیید شما اضافه می‌شوند.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>مسیرهای فعال فعلی</Text>
        {ACTIVE_PATHS.map((path) => (
          <View key={path.title} style={styles.activeRole}>
            <Ionicons name="checkmark-circle" size={16} color={COLORS.teal} />
            <Text style={styles.activeRoleText}>
              <Text style={styles.activeRoleBold}>{path.title}</Text> — {path.subtitle}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>دسته‌بندی‌های آینده</Text>
        <View style={styles.chips}>
          {UPCOMING_CATEGORIES.map((category) => (
            <View key={category} style={styles.chip}>
              <Text style={styles.chipText}>{category}</Text>
              <View style={styles.chipBadge}>
                <Text style={styles.chipBadgeText}>به‌زودی</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: COLORS.navy },
  sectionBody: { marginTop: 8, fontSize: 13, lineHeight: 24, color: COLORS.textSecondary, textAlign: "right" },
  activeRole: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 10 },
  activeRoleText: { flex: 1, fontSize: 13, lineHeight: 22, color: COLORS.textSecondary, textAlign: "right" },
  activeRoleBold: { fontWeight: "800", color: COLORS.navy },
  chips: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 8, marginTop: 12 },
  chip: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.slateLight,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: { fontSize: 11, fontWeight: "600", color: COLORS.textSecondary },
  chipBadge: {
    backgroundColor: COLORS.coralLight,
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chipBadgeText: { fontSize: 9, fontWeight: "800", color: COLORS.coral },
});
