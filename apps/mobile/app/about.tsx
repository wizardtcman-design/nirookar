import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppShell } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { APP_BUILD, APP_BUILD_NOTE, APP_PHASE_LABEL, APP_PLATFORMS, APP_VERSION, OFFICIAL_FIRST_VERSION } from "@shared/version-core";

const ABOUT_ROWS = [
  { label: "نسخه محصول (پیش‌انتشار)", value: APP_VERSION },
  { label: "شماره Build", value: `${APP_BUILD} — ${APP_BUILD_NOTE}` },
  { label: "نسخه رسمی (رزروشده)", value: OFFICIAL_FIRST_VERSION },
  { label: "فاز جاری", value: APP_PHASE_LABEL },
  { label: "پلتفرم‌ها", value: APP_PLATFORMS },
] as const;

/** صفحه درباره ما — شفاف درباره وضعیت نسخه و مسیر توسعه (بیلد 006) */
export default function AboutScreen() {
  return (
    <AppShell active="home" title="درباره ما">
      <View style={styles.brandCard}>
        <View style={styles.logoMark}>
          <Text style={styles.logoLetter}>N</Text>
          <View style={styles.logoDot} />
        </View>
        <Text style={styles.brandName}>نیروکار</Text>
        <Text style={styles.brandTagline}>بازار خدمات فنی و نصب</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionBody}>
          نیروکار با رویکرد ماژولار و توسعه‌پذیر ساخته می‌شود تا در آینده نقش‌ها و دسته‌بندی‌های خدمات جدید، بدون
          بازنویسی ساختار اصلی به آن اضافه شوند. این نسخه، نسخه پیش‌انتشار محصول است و اپ موبایل در این فاز داده‌های
          خود را به‌صورت نمایشی (Sandbox) سمت کلاینت اجرا می‌کند؛ اتصال به بک‌اند مشترک وب در فاز Backend اضافه می‌شود.
        </Text>
      </View>

      <View style={styles.rowsCard}>
        {ABOUT_ROWS.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerNote}>
        <Ionicons name="information-circle-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.footerNoteText}>این صفحه بخشی از نسخه پیش‌انتشار جاری است.</Text>
      </View>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  brandCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: "center",
    marginTop: SPACING.md,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: RADII.xl,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { color: COLORS.white, fontSize: 26, fontWeight: "900" },
  logoDot: {
    position: "absolute",
    bottom: -3,
    left: -3,
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: COLORS.teal,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  brandName: { marginTop: 12, fontSize: 20, fontWeight: "900", color: COLORS.navy },
  brandTagline: { marginTop: 2, fontSize: 12, color: COLORS.textSecondary },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  sectionBody: { fontSize: 13, lineHeight: 26, color: COLORS.textSecondary, textAlign: "right" },
  rowsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
    marginTop: SPACING.md,
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    gap: SPACING.md,
  },
  rowLabel: { fontSize: 13, fontWeight: "800", color: COLORS.navy },
  rowValue: { fontSize: 12, color: COLORS.textSecondary, flexShrink: 1, textAlign: "left" },
  footerNote: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  footerNoteText: { fontSize: 11, color: COLORS.textMuted },
});
