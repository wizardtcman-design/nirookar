import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { AppTextField, HonestNotice, PrimaryButton, SubPageHeader } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { HONEST_NOTICE_BODY, HONEST_NOTICE_TITLE, useLoginForm } from "../src/use-login-form";
import { ROLE_CORE_REGISTRY } from "@shared/roles-core";

type ProfessionalRole = "installer" | "shop";

function RoleLoginForm({ roleId }: { roleId: ProfessionalRole }) {
  const role = ROLE_CORE_REGISTRY.find((entry) => entry.id === roleId)!;
  const form = useLoginForm(role.identifierType);
  const dark = roleId === "installer";

  return (
    <View style={[styles.card, dark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardTitle, { color: dark ? COLORS.white : COLORS.coral }]}>{role.title}</Text>
          <Text style={[styles.cardSubtitle, dark && { color: "#cbd5e1" }]}>{role.subtitle}</Text>
        </View>
        <View
          style={[
            styles.cardIconWrap,
            { borderColor: dark ? "rgba(204,251,241,0.7)" : "rgba(239,99,81,0.6)" },
          ]}
        >
          <Ionicons
            name={roleId === "installer" ? "construct-outline" : "storefront-outline"}
            size={24}
            color={dark ? COLORS.tealLight : COLORS.coral}
          />
        </View>
      </View>

      <View style={[styles.divider, dark && { backgroundColor: "rgba(255,255,255,0.15)" }]} />

      <View style={styles.form}>
        <AppTextField
          label={role.identifierLabel}
          placeholder={role.identifierPlaceholder}
          keyboardType="phone-pad"
          onDark={dark}
          value={form.identifier}
          onChangeText={form.setIdentifier}
          error={form.errors.identifier}
        />
        <AppTextField
          label="رمز عبور"
          placeholder="رمز عبور خود را وارد کنید"
          secureTextEntry
          onDark={dark}
          value={form.password}
          onChangeText={form.setPassword}
          error={form.errors.password}
        />

        {form.notice ? <HonestNotice title={HONEST_NOTICE_TITLE} body={HONEST_NOTICE_BODY} /> : null}

        <PrimaryButton
          label={role.submitLabel}
          color={dark ? COLORS.teal : COLORS.coral}
          onPress={form.handleSubmit}
        />

        <Text style={[styles.forgot, dark && { color: "#cbd5e1" }]}>رمز عبور خود را فراموش کردید؟ — در فازهای بعدی</Text>
      </View>
    </View>
  );
}

/** صفحه ورود نقش‌های حرفه‌ای (نصاب + فروشگاه) — هماهنگ با نسخه وب */
export default function ProfessionalScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <SubPageHeader title="به اپلیکیشن خوش آمدید" onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
          <Text style={styles.intro}>لطفاً نوع ورود خود را انتخاب کنید</Text>

          <RoleLoginForm roleId="installer" />
          <RoleLoginForm roleId="shop" />

          <View style={styles.features}>
            {[
              { icon: "headset-outline" as const, title: "پشتیبانی تخصصی", sub: "همراه شما در هر زمان" },
              { icon: "phone-portrait-outline" as const, title: "طراحی حرفه‌ای", sub: "تجربه کاری بهتر" },
              { icon: "shield-checkmark-outline" as const, title: "امن و مطمئن", sub: "ارتباط امن با سرور" },
            ].map((feature) => (
              <View key={feature.title} style={styles.featureItem}>
                <Ionicons name={feature.icon} size={18} color={COLORS.teal} />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSub}>{feature.sub}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.xl, gap: SPACING.md },
  intro: { textAlign: "center", fontSize: 13, color: COLORS.textSecondary },
  card: { borderRadius: RADII.xl, padding: SPACING.lg },
  cardDark: {
    backgroundColor: COLORS.navy,
    shadowColor: COLORS.navy,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardLight: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: "rgba(239,99,81,0.3)",
  },
  cardHeader: { flexDirection: "row-reverse", alignItems: "center", gap: SPACING.md },
  cardTitle: { fontSize: 18, fontWeight: "900" },
  cardSubtitle: { marginTop: 2, fontSize: 12, color: COLORS.textSecondary },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
  form: { gap: SPACING.md },
  forgot: { textAlign: "center", fontSize: 11, color: COLORS.textMuted },
  features: {
    flexDirection: "row-reverse",
    backgroundColor: "rgba(255,255,255,0.7)",
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADII.lg,
    paddingVertical: 14,
  },
  featureItem: { flex: 1, alignItems: "center", gap: 2 },
  featureTitle: { fontSize: 11, fontWeight: "800", color: COLORS.navy },
  featureSub: { fontSize: 10, color: COLORS.textMuted },
});
