import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps, type ViewStyle } from "react-native";

import { COLORS, RADII, SPACING } from "./theme";

/**
 * کامپوننت‌های پایه UI موبایل — تجربه کاربری بومی موبایل.
 * طبق قواعد پروژه، UI وب و موبایل به اجبار یکسان نمی‌شوند؛ فقط داده و
 * اعتبارسنجی مشترک است (packages/shared).
 */

interface RoleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  softColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

/** کارت انتخاب نقش در صفحه خانه */
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

interface AppTextFieldProps extends TextInputProps {
  label: string;
  error?: string;
  onDark?: boolean;
}

/** فیلد ورودی استاندارد فرم‌ها با نمایش خطا */
export function AppTextField({ label, error, onDark = false, style, ...props }: AppTextFieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, onDark && { color: COLORS.white }]}>{label}</Text>
      <TextInput
        placeholderTextColor={COLORS.textMuted}
        style={[
          styles.input,
          onDark && styles.inputOnDark,
          error ? styles.inputError : null,
          style,
        ]}
        {...props}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

/** دکمه اصلی اکشن فرم‌ها */
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

/**
 * اعلان شفافیت — وقتی قابلیتی در فاز ۱ فعال نیست، رابط کاربری صادقانه
 * وضعیت واقعی را توضیح می‌دهد و هیچ موفقیتی جعلی نمایش داده نمی‌شود.
 */
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

/** سربرگ صفحات داخلی با دکمه بازگشت */
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
      <Text style={styles.subHeaderTitle}>{title}</Text>
      <View style={{ width: 36 }} />
    </View>
  );
}

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
  subHeaderTitle: { fontSize: 16, fontWeight: "800", color: COLORS.navy },
});
