import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS, RADII, SPACING } from "../src/theme";
import { RoleCard } from "../src/ui";
import { ROLE_CORE_REGISTRY } from "@shared/roles-core";
import { APP_BUILD, APP_VERSION } from "@shared/version-core";

/** آیکون و رنگ هر نقش — ظاهر اختصاصی موبایل (داده نقش‌ها از هسته مشترک) */
const ROLE_APPEARANCE: Record<string, { icon: keyof typeof Ionicons.glyphMap; color: string; soft: string }> = {
  customer: { icon: "person-circle-outline", color: COLORS.teal, soft: COLORS.tealLight },
  installer: { icon: "construct-outline", color: COLORS.navy, soft: COLORS.slateLight },
  shop: { icon: "storefront-outline", color: COLORS.coral, soft: COLORS.coralLight },
};

/** صفحه آغازین — خوش‌آمد و انتخاب نقش ورود (مشتری / نصاب / فروشگاه) */
export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView contentContainerStyle={styles.scroll} bounces={false}>
        <View style={styles.header}>
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

        <Text style={styles.welcomeTitle}>خوش آمدید</Text>
        <Text style={styles.welcomeSubtitle}>لطفاً نقش خود را برای ورود انتخاب کنید</Text>
        <Text style={styles.welcomeNote}>
          نیروکار بازارگاه چندخدمتی خدمات فنی، نصب و فروشگاه‌های مرتبط است. در فاز ۱ فقط ورود نقش‌ها فعال است.
        </Text>

        <View style={styles.cards}>
          {ROLE_CORE_REGISTRY.filter((role) => role.enabled).map((role) => {
            const appearance = ROLE_APPEARANCE[role.id];
            return (
              <RoleCard
                key={role.id}
                icon={appearance.icon}
                color={appearance.color}
                softColor={appearance.soft}
                title={role.title}
                subtitle={role.subtitle}
                onPress={() => {
                  if (role.id === "customer") {
                    router.push("/customer");
                  } else {
                    router.push("/professional");
                  }
                }}
              />
            );
          })}
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
          نسخه پیش‌انتشار {APP_VERSION} — بیلد {APP_BUILD} — هیچ داده‌ای به سرور ارسال نمی‌شود
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  header: { paddingTop: SPACING.sm },
  logoRow: { flexDirection: "row-reverse", alignItems: "center", gap: SPACING.sm + 2, alignSelf: "flex-start" },
  logoMark: {
    width: 44,
    height: 44,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { color: COLORS.white, fontSize: 18, fontWeight: "900" },
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
  logoName: { fontSize: 19, fontWeight: "900", color: COLORS.navy },
  logoTagline: { fontSize: 11, color: COLORS.textSecondary },
  welcomeTitle: { marginTop: SPACING.xl, textAlign: "center", fontSize: 26, fontWeight: "900", color: COLORS.navy },
  welcomeSubtitle: { marginTop: SPACING.xs + 2, textAlign: "center", fontSize: 14, color: COLORS.textSecondary },
  welcomeNote: {
    marginTop: SPACING.sm + 2,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.textMuted,
    paddingHorizontal: SPACING.xs,
  },
  cards: { marginTop: SPACING.lg + 4, gap: SPACING.md },
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
  versionNote: { marginTop: SPACING.lg, textAlign: "center", fontSize: 10, color: COLORS.textMuted },
});
