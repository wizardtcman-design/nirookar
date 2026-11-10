import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { AppShell, HonestNotice } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { APP_BUILD, APP_BUILD_NOTE, APP_PHASE_LABEL, APP_VERSION } from "@shared/version-core";
import { FEATURE_MATRIX, type BuildStatus } from "@shared/feature-matrix";

/**
 * صفحه «وضعیت توسعه» — بیلد 006.
 *
 * ماتریس تطبیق امکانات (packages/shared/feature-matrix.ts) مستقیماً از هسته
 * مشترک خوانده می‌شود تا موبایل و وب همیشه شفاف و هم‌نسخه گزارش دهند.
 */

const STATUS_META: Record<BuildStatus, { label: string; bg: string; color: string }> = {
  done: { label: "انجام‌شده", bg: "#ecfdf5", color: "#047857" },
  planned: { label: "در نقشه راه", bg: COLORS.amberBg, color: COLORS.amberText },
  backend: { label: "نیازمند بک‌اند", bg: "#eef2ff", color: "#4338ca" },
};

export default function StatusScreen() {
  const doneCount = FEATURE_MATRIX.filter((row) => row.status === "done").length;

  return (
    <AppShell active="status" title="وضعیت توسعه">
      <View style={styles.versionCard}>
        <View style={styles.versionRow}>
          <Ionicons name="rocket-outline" size={18} color={COLORS.teal} />
          <Text style={styles.versionTitle}>
            نسخه {APP_VERSION} — بیلد {APP_BUILD}
          </Text>
        </View>
        <Text style={styles.versionNote}>{APP_BUILD_NOTE}</Text>
        <Text style={styles.phaseText}>{APP_PHASE_LABEL}</Text>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{FEATURE_MATRIX.length}</Text>
          <Text style={styles.summaryLabel}>قابلیت در ماتریس</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{doneCount}</Text>
          <Text style={styles.summaryLabel}>انجام‌شده</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>۲</Text>
          <Text style={styles.summaryLabel}>پلتفرم هم‌گام</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>ماتریس تطبیق امکانات</Text>
      <View style={styles.matrixList}>
        {FEATURE_MATRIX.map((row) => {
          const meta = STATUS_META[row.status];
          return (
            <View key={row.id} style={styles.matrixRow}>
              <View style={styles.matrixTextWrap}>
                <Text style={styles.matrixFeature} numberOfLines={2}>
                  {row.feature}
                </Text>
                <Text style={styles.matrixMeta}>
                  فاز {row.phase} • موبایل: {row.mobile === "yes" ? "✓" : "—"} • وب: {row.web === "yes" ? "✓" : "—"}
                  {row.note ? ` • ${row.note}` : ""}
                </Text>
              </View>
              <View style={[styles.matrixChip, { backgroundColor: meta.bg }]}>
                <Text style={[styles.matrixChipText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <HonestNotice
        title="شفافیت توسعه"
        body="این صفحه از ماتریس مشترک وب و موبایل تغذیه می‌شود؛ هر قابلیت دقیقاً مشخص می‌کند در کدام فاز ساخته می‌شود و به بک‌اند نیاز دارد یا نه."
      />
    </AppShell>
  );
}

const styles = StyleSheet.create({
  versionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    gap: 8,
  },
  versionRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  versionTitle: { fontSize: 16, fontWeight: "900", color: COLORS.navy },
  versionNote: { fontSize: 12, fontWeight: "700", color: COLORS.teal },
  phaseText: { fontSize: 11, lineHeight: 19, color: COLORS.textSecondary, textAlign: "right" },
  summaryRow: { flexDirection: "row-reverse", gap: SPACING.md, marginTop: SPACING.md },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: "center",
    gap: 4,
  },
  summaryValue: { fontSize: 20, fontWeight: "900", color: COLORS.navy },
  summaryLabel: { fontSize: 10, color: COLORS.textMuted, textAlign: "center" },
  sectionTitle: { marginTop: SPACING.lg, fontSize: 15, fontWeight: "900", color: COLORS.navy },
  matrixList: { marginTop: SPACING.md, gap: SPACING.sm + 2 },
  matrixRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
  },
  matrixTextWrap: { flex: 1, minWidth: 0, gap: 3 },
  matrixFeature: { fontSize: 13, fontWeight: "800", color: COLORS.navy, textAlign: "right" },
  matrixMeta: { fontSize: 10, lineHeight: 16, color: COLORS.textMuted, textAlign: "right" },
  matrixChip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5, alignSelf: "flex-start" },
  matrixChipText: { fontSize: 10, fontWeight: "800" },
});
