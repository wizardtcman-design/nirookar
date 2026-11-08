import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { AppTextField, HonestNotice, PrimaryButton, SubPageHeader } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { HONEST_NOTICE_BODY, HONEST_NOTICE_TITLE, useLoginForm } from "../src/use-login-form";
import { ROLE_CORE_REGISTRY } from "@shared/roles-core";

/** صفحه ورود مشتری — هماهنگ با نسخه وب */
export default function CustomerScreen() {
  const router = useRouter();
  const role = ROLE_CORE_REGISTRY.find((entry) => entry.id === "customer")!;
  const form = useLoginForm(role.identifierType);

  return (
    <SafeAreaView style={styles.safe}>
      <SubPageHeader title={role.title} onBack={() => router.back()} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" bounces={false}>
          <View style={styles.card}>
            <View style={styles.hero}>
              <View style={styles.heroIconWrap}>
                <Ionicons name="person-circle-outline" size={40} color={COLORS.navy} />
              </View>
              <Text style={styles.heroTitle}>خوش آمدید</Text>
              <Text style={styles.heroSubtitle}>برای ورود لطفاً اطلاعات خود را وارد کنید.</Text>
            </View>

            <View style={styles.form}>
              <AppTextField
                label={role.identifierLabel}
                placeholder={role.identifierPlaceholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="username"
                value={form.identifier}
                onChangeText={form.setIdentifier}
                error={form.errors.identifier}
              />
              <AppTextField
                label="رمز عبور"
                placeholder="رمز عبور خود را وارد کنید"
                secureTextEntry
                autoComplete="current-password"
                value={form.password}
                onChangeText={form.setPassword}
                error={form.errors.password}
              />

              {form.notice ? (
                <HonestNotice title={HONEST_NOTICE_TITLE} body={HONEST_NOTICE_BODY} />
              ) : null}

              <PrimaryButton label={role.submitLabel} onPress={form.handleSubmit} />

              <Text style={styles.comingSoon}>ثبت‌نام مشتری جدید و فراموشی رمز — در فازهای بعدی فعال می‌شود</Text>
            </View>
          </View>

          <Text style={styles.footerNote}>امن و مطمئن | حریم خصوصی شما برای ما مهم است</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flexGrow: 1, paddingHorizontal: SPACING.md, paddingTop: SPACING.lg, paddingBottom: SPACING.xl },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    shadowColor: "#0f172a",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  hero: { alignItems: "center" },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 999,
    backgroundColor: COLORS.slateLight,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: { marginTop: 12, fontSize: 20, fontWeight: "900", color: COLORS.navy },
  heroSubtitle: { marginTop: 4, fontSize: 12, color: COLORS.textSecondary },
  form: { marginTop: SPACING.lg, gap: SPACING.md },
  comingSoon: { textAlign: "center", fontSize: 11, color: COLORS.textMuted, lineHeight: 18 },
  footerNote: { marginTop: "auto", textAlign: "center", fontSize: 11, color: COLORS.textMuted, paddingTop: SPACING.lg },
});
