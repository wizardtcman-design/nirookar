import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { SubPageHeader } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { APP_BUILD, APP_PHASE_LABEL, APP_PLATFORMS, APP_VERSION, OFFICIAL_FIRST_VERSION } from "@shared/version-core";

const ABOUT_ROWS = [
  { label: "نسخه محصول (پیش‌انتشار)", value: APP_VERSION },
  { label: "شماره Build", value: APP_BUILD },
  { label: "نسخه رسمی (رزروشده)", value: OFFICIAL_FIRST_VERSION },
  { label: "فاز جاری", value: APP_PHASE_LABEL },
  { label: "پلتفرم‌ها", value: APP_PLATFORMS },
] as const;

/** صفحه درباره ما — شفاف درباره وضعیت نسخه و مسیر توسعه */
export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <SubPageHeader title="درباره ما" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
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
            نیروکار با رویکرد ماژولار و توسعه‌پذیر ساخته می‌شود تا در آینده نقش‌ها و دسته‌بندی‌های خدمات جدید،
            بدون بازنویسی ساختار اصلی به آن اضافه شوند. این نسخه، نسخه اولیه محصول است و هنوز به سرور متصل نیست.
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
          <Text style={styles.footerNoteText}>این صفحه بخشی از نسخه اولیه (فاز ۱) است.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.md },
  brandCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    alignItems: "center",
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
  },
  sectionBody: { fontSize: 13, lineHeight: 26, color: COLORS.textSecondary },
  rowsCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  rowLabel: { fontSize: 13, fontWeight: "800", color: COLORS.navy },
  rowValue: { fontSize: 13, color: COLORS.textSecondary },
  footerNote: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 6, paddingBottom: SPACING.sm },
  footerNoteText: { fontSize: 11, color: COLORS.textMuted },
});
