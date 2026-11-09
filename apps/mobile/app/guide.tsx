import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { SubPageHeader } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { ROLE_CORE_REGISTRY } from "@shared/roles-core";

/** دسته‌بندی‌های آینده بازارگاه — صرفاً اطلاع‌رسانی، بدون قابلیت نمایشی */
const UPCOMING_CATEGORIES = [
  "دکوراسیون داخلی و نصب",
  "نصاب‌ها و متخصصان ساختمان",
  "فروشگاه‌های محصولات ساختمانی",
  "وانت‌بار و حمل‌ونقل",
  "تعمیرات و خدمات منزل",
] as const;

/** صفحه راهنما — توضیح صادقانه وضعیت فعلی و مسیر توسعه */
export default function GuideScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <SubPageHeader title="راهنما" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>نیروکار چیست؟</Text>
          <Text style={styles.sectionBody}>
            نیروکار یک بازارگاه چندخدمتی برای خدمات فنی، نصب و فروشگاه‌های مرتبط است. در نسخه فعلی (فاز ۱) فقط
            صفحه ورود نقش‌ها فعال است و قابلیت‌های اصلی، مرحله‌به‌مرحله و با تأیید شما اضافه می‌شوند.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>مسیرهای فعال فعلی</Text>
          {ROLE_CORE_REGISTRY.map((role) => (
            <View key={role.id} style={styles.activeRole}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.teal} />
              <Text style={styles.activeRoleText}>
                <Text style={styles.activeRoleBold}>{role.title}</Text> — {role.subtitle}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xl, gap: SPACING.md },
  section: { backgroundColor: COLORS.white, borderRadius: RADII.lg, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: COLORS.navy },
  sectionBody: { marginTop: 8, fontSize: 13, lineHeight: 24, color: COLORS.textSecondary },
  activeRole: { flexDirection: "row-reverse", alignItems: "center", gap: 8, marginTop: 10 },
  activeRoleText: { flex: 1, fontSize: 13, lineHeight: 22, color: COLORS.textSecondary },
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
