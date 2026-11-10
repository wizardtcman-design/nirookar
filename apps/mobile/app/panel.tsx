import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";

import { AppShell, AppTextField, HonestNotice, PrimaryButton, ROLE_APPEARANCE, StatusChip, type ProfileStatus } from "../src/ui";
import { COLORS, RADII, SPACING } from "../src/theme";
import { getRoleTitle, isAdminRole, useSession } from "../src/session";
import { specialtyLabels } from "../src/use-auth-form";
import { validatePostalCode, validateRequiredText, validateSheba, type FieldValidation } from "@shared/validation";

/**
 * پنل اختصاصی نقش — بیلد 006 همگام با گام ۳ وب.
 *
 *  - مشتری: کارت هویت + بخش‌های آینده خدمات (برچسب صادقانه «فازهای بعدی»)
 *  - نصاب/فروشگاه: کارت مرحله‌ای «تکمیل احراز هویت و مدارک» با همان ماشین وضعیت وب:
 *      INCOMPLETE → (ارسال مدارک) → PENDING_VERIFICATION → (تأیید مدیر در Sandbox) → ACTIVE
 *      کد پستی ۱۰ رقمی + آدرس محرمانه محل سکونت + شبا Mod-97 + پیوست مدارک + وضعیت سفته حضوری
 *  - مدیران: داشبورد مدیریتی نمایشی (مخفی برای کاربران عادی)
 */

interface DocumentForm {
  postalCode: string;
  address: string;
  sheba: string;
}

interface DocumentErrors {
  postalCode?: string;
  address?: string;
  sheba?: string;
}

/* ─────────── کارت هویت مشترک ─────────── */

function IdentityCard({
  displayName,
  phone,
  role,
  status,
  extra,
}: {
  displayName: string;
  phone: string;
  role: "customer" | "installer" | "shop";
  status?: ProfileStatus;
  extra?: string;
}) {
  const appearance = ROLE_APPEARANCE[role];
  return (
    <View style={styles.identityCard}>
      <View style={[styles.identityIconWrap, { backgroundColor: appearance.soft }]}>
        <Ionicons name={appearance.icon} size={30} color={appearance.color} />
      </View>
      <View style={styles.identityTextWrap}>
        <Text style={styles.identityName} numberOfLines={1}>
          {displayName}
        </Text>
        <Text style={styles.identityPhone}>{phone}</Text>
        {extra ? <Text style={styles.identityExtra} numberOfLines={2}>{extra}</Text> : null}
      </View>
      {status ? (
        <View style={styles.identityChipWrap}>
          <StatusChip status={status} />
        </View>
      ) : null}
    </View>
  );
}

/* ─────────── بخش آینده (برچسب صادقانه) ─────────── */

function UpcomingSection({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="hourglass-outline" size={16} color={COLORS.textMuted} />
        <Text style={styles.sectionCardTitle}>{title}</Text>
      </View>
      <View style={styles.upcomingList}>
        {items.map((item) => (
          <Text key={item} style={styles.upcomingItem}>
            • {item}
          </Text>
        ))}
      </View>
      <Text style={styles.upcomingNote}>فعال‌سازی این بخش‌ها پس از اتصال بک‌اند در فازهای بعدی انجام می‌شود.</Text>
    </View>
  );
}

/* ─────────── کارت تکمیل مدارک نصاب/فروشگاه ─────────── */

function DocumentsCard({
  roleLabel,
  status,
  onSubmit,
  onSimulateApproval,
}: {
  roleLabel: string;
  status: ProfileStatus;
  onSubmit: (form: DocumentForm) => void;
  onSimulateApproval: () => void;
}) {
  const [form, setForm] = useState<DocumentForm>({ postalCode: "", address: "", sheba: "" });
  const [errors, setErrors] = useState<DocumentErrors>({});
  const [submitDocError, setSubmitDocError] = useState<string | null>(null);
  const [docsAttached, setDocsAttached] = useState<{ idPhoto: boolean; certPhoto: boolean }>({
    idPhoto: false,
    certPhoto: false,
  });

  const isEditable = status === "INCOMPLETE" || status === "REJECTED";

  function update<K extends keyof DocumentForm>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit() {
    const nextErrors: DocumentErrors = {};
    const postalCheck: FieldValidation = validatePostalCode(form.postalCode);
    if (!postalCheck.ok) nextErrors.postalCode = postalCheck.message;
    const addressCheck: FieldValidation = validateRequiredText(form.address, 10);
    if (!addressCheck.ok) nextErrors.address = addressCheck.message ?? "آدرس دقیق محل سکونت را کامل وارد کنید";
    const shebaCheck: FieldValidation = validateSheba(form.sheba);
    if (!shebaCheck.ok) nextErrors.sheba = shebaCheck.message;

    const docsOk = docsAttached.idPhoto && docsAttached.certPhoto;
    setSubmitDocError(docsOk ? null : "هر دو مدرک (تصویر شناسنامه/کارت ملی و مدرک مهارتی) باید پیوست شود");
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !docsOk) return;
    onSubmit(form);
  }

  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="clipboard-outline" size={16} color={COLORS.navy} />
        <Text style={styles.sectionCardTitle}>تکمیل احراز هویت و مدارک {roleLabel}</Text>
      </View>
      <Text style={styles.docIntro}>
        برای فعال شدن پرونده، اطلاعات مالی و محل سکونت را تکمیل کنید. آدرس شما محرمانه است و فقط برای هماهنگی مراجعه
        حضوری استفاده می‌شود.
      </Text>

      <StatusChip status={status} />

      {isEditable ? (
        <View style={styles.docForm}>
          <AppTextField
            label="کد پستی (۱۰ رقم)"
            placeholder="کد پستی ۱۰ رقمی محل سکونت"
            keyboardType="number-pad"
            value={form.postalCode}
            onChangeText={(value) => update("postalCode", value)}
            error={errors.postalCode}
          />
          <AppTextField
            label="آدرس دقیق محل سکونت (محرمانه)"
            placeholder="خیابان، کوچه، پلاک، واحد"
            multiline
            style={styles.multiline}
            value={form.address}
            onChangeText={(value) => update("address", value)}
            error={errors.address}
          />
          <AppTextField
            label="شماره شبا (IR + ۲۴ رقم)"
            placeholder="IR..."
            autoCapitalize="characters"
            value={form.sheba}
            onChangeText={(value) => update("sheba", value)}
            error={errors.sheba}
          />

          <Text style={styles.docsLabel}>پیوست مدارک</Text>
          <View style={styles.docButtons}>
            <AttachButton
              label="تصویر شناسنامه / کارت ملی"
              attached={docsAttached.idPhoto}
              onPress={() => setDocsAttached((prev) => ({ ...prev, idPhoto: true }))}
            />
            <AttachButton
              label="مدرک مهارتی / جواز کسب"
              attached={docsAttached.certPhoto}
              onPress={() => setDocsAttached((prev) => ({ ...prev, certPhoto: true }))}
            />
          </View>
          {submitDocError ? <Text style={styles.docError}>{submitDocError}</Text> : null}

          <Text style={styles.softeNote}>
            وضعیت سفته حضوری: پس از ارسال مدارک، قرارداد و سفته به‌صورت حضوری در دفتر بررسی و تأیید می‌شود.
          </Text>

          <PrimaryButton label="ارسال مدارک برای بررسی" color={COLORS.teal} onPress={handleSubmit} />
        </View>
      ) : status === "PENDING_VERIFICATION" ? (
        <View style={styles.pendingBox}>
          <Ionicons name="time-outline" size={18} color={COLORS.amberText} />
          <Text style={styles.pendingText}>
            مدارک شما ارسال شده و در انتظار بررسی مدیر است. پس از تأیید حضوری قرارداد و سفته، پرونده فعال می‌شود.
          </Text>
          <PrimaryButton
            label="شبیه‌سازی تأیید مدیر (Sandbox)"
            color="#b45309"
            onPress={onSimulateApproval}
            style={styles.simulateButton}
          />
        </View>
      ) : (
        <View style={styles.activeBox}>
          <Ionicons name="checkmark-circle" size={20} color="#047857" />
          <Text style={styles.activeText}>
            پرونده شما فعال است. اطلاعات بانکی و محل سکونت با موفقیت تأیید شده و می‌توانید سفارش بپذیرید.
          </Text>
        </View>
      )}
    </View>
  );
}

/** دکمه پیوست نمایشی مدارک — اتصال واقعی به سرویس آپلود در فاز Backend */
function AttachButton({ label, attached, onPress }: { label: string; attached: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={attached}
      style={({ pressed }) => [styles.attachButton, attached && styles.attachButtonDone, pressed && { opacity: 0.9 }]}
    >
      <Ionicons name={attached ? "checkmark-circle" : "cloud-upload-outline"} size={16} color={attached ? "#047857" : COLORS.navy} />
      <Text style={[styles.attachText, attached && styles.attachTextDone]} numberOfLines={2}>
        {attached ? `${label} — پیوست شد` : label}
      </Text>
    </Pressable>
  );
}

/* ─────────── داشبورد مدیریتی نمایشی (مخفی) ─────────── */

const ADMIN_USERS = [
  { id: "USR-1024", name: "سارا محمدی", role: "مشتری", status: "فعال", tone: "green" as const },
  { id: "USR-1023", name: "رضا کریمی", role: "نصاب", status: "فعال", tone: "green" as const },
  { id: "USR-1022", name: "فروشگاه آریا دکور", role: "فروشگاه", status: "در انتظار تأیید", tone: "amber" as const },
  { id: "USR-1019", name: "امیر حسینی", role: "مشتری", status: "غیرفعال", tone: "slate" as const },
  { id: "USR-1014", name: "حسین رستمی", role: "نصاب", status: "مسدود", tone: "red" as const },
];

const ADMIN_ORDERS = [
  { id: "ORD-1001", service: "نصب کابینت آشپزخانه", provider: "آریا کابینت", status: "در حال انجام", tone: "teal" as const },
  { id: "ORD-1002", service: "نصب پرده و کرکره", provider: "مجید صادقی", status: "تکمیل‌شده", tone: "green" as const },
  { id: "ORD-1003", service: "کمد دیواری اتاق خواب", provider: "رضا کریمی", status: "جدید", tone: "amber" as const },
  { id: "ORD-1004", service: "کف‌پوش پارکت", provider: "پارکت پارس", status: "لغوشده", tone: "red" as const },
];

const TONE_COLORS: Record<string, { bg: string; text: string }> = {
  green: { bg: "#ecfdf5", text: "#047857" },
  amber: { bg: COLORS.amberBg, text: COLORS.amberText },
  red: { bg: "#fef2f2", text: "#b91c1c" },
  slate: { bg: COLORS.slateLight, text: COLORS.textSecondary },
  teal: { bg: COLORS.tealLight, text: COLORS.tealDark },
};

function MiniChip({ label, tone }: { label: string; tone: string }) {
  const colors = TONE_COLORS[tone] ?? TONE_COLORS.slate;
  return (
    <View style={[styles.miniChip, { backgroundColor: colors.bg }]}>
      <Text style={[styles.miniChipText, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

function AdminDashboard({ adminTitle }: { adminTitle: string }) {
  const stats = [
    { label: "کاربران", value: "۴۲" },
    { label: "سفارش‌های فعال", value: "۷" },
    { label: "درآمد ماه (نمایشی)", value: "۱۸۴م ت" },
    { label: "شکایات باز", value: "۲" },
  ];
  return (
    <>
      <View style={styles.adminBanner}>
        <Ionicons name="shield-checkmark" size={18} color="#b45309" />
        <Text style={styles.adminBannerText}>
          پنل مدیریت نمایشی — نقش: {adminTitle} (دسترسی کامل فقط در پنل مدیریت وب)
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>آخرین کاربران</Text>
        <View style={styles.adminList}>
          {ADMIN_USERS.map((row) => (
            <View key={row.id} style={styles.adminRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminRowTitle}>{row.name}</Text>
                <Text style={styles.adminRowSub}>
                  {row.id} • {row.role}
                </Text>
              </View>
              <MiniChip label={row.status} tone={row.tone} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionCardTitle}>آخرین سفارش‌ها</Text>
        <View style={styles.adminList}>
          {ADMIN_ORDERS.map((row) => (
            <View key={row.id} style={styles.adminRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.adminRowTitle}>{row.service}</Text>
                <Text style={styles.adminRowSub}>
                  {row.id} • مجری: {row.provider}
                </Text>
              </View>
              <MiniChip label={row.status} tone={row.tone} />
            </View>
          ))}
        </View>
      </View>

      <HonestNotice
        title="داده نمایشی"
        body="این داشبورد فقط طراحی موبایل را نشان می‌دهد؛ داده واقعی پس از اتصال به API پنل مدیریت وب (فاز Backend) جایگزین می‌شود."
      />
    </>
  );
}

/* ─────────── صفحه اصلی پنل ─────────── */

export default function PanelScreen() {
  const router = useRouter();
  const { user, logout } = useSession();
  const [docStatus, setDocStatus] = useState<ProfileStatus>("INCOMPLETE");

  const adminTitle = useMemo(
    () => (user && isAdminRole(user.role) ? getRoleTitle(user.role) : null),
    [user],
  );

  if (!user) {
    // بدون نشست — به ورود هدایت می‌شود (این حالت از نوار پایین رخ نمی‌دهد)
    return (
      <AppShell active="auth" title="پنل کاربری">
        <View style={styles.guestCard}>
          <Ionicons name="lock-closed-outline" size={30} color={COLORS.textMuted} />
          <Text style={styles.guestText}>برای دیدن پنل، ابتدا وارد حساب خود شوید.</Text>
          <PrimaryButton label="رفتن به ورود" onPress={() => router.replace("/login")} />
        </View>
      </AppShell>
    );
  }

  if (adminTitle) {
    return (
      <AppShell active="auth" title="پنل مدیریت">
        <AdminDashboard adminTitle={adminTitle} />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            logout();
            router.replace("/login");
          }}
          style={({ pressed }) => [styles.logoutWide, pressed && { opacity: 0.85 }]}
        >
          <Ionicons name="log-out-outline" size={16} color={COLORS.danger} />
          <Text style={styles.logoutWideText}>خروج از حساب مدیر</Text>
        </Pressable>
      </AppShell>
    );
  }

  const appearance = ROLE_APPEARANCE[user.role];
  const isInstaller = user.role === "installer";
  const isShop = user.role === "shop";
  const roleLabel = isInstaller ? "نصاب" : isShop ? "فروشگاه" : "مشتری";

  const profileExtra = isInstaller
    ? `تخصص‌ها: ${user.specialtyKeys?.length ? specialtyLabels(user.specialtyKeys) : "—"}\nسابقه: ${user.experience ?? "—"}`
    : isShop
      ? `نام فروشگاه: ${user.shopName ?? user.displayName}`
      : undefined;

  return (
    <AppShell active="auth" title={`پنل ${roleLabel}`}>
      <IdentityCard
        displayName={user.displayName}
        phone={user.phone}
        role={user.role as "customer" | "installer" | "shop"}
        status={isInstaller || isShop ? docStatus : undefined}
        extra={profileExtra}
      />

      {isInstaller || isShop ? (
        <DocumentsCard
          roleLabel={roleLabel}
          status={docStatus}
          onSubmit={() => setDocStatus("PENDING_VERIFICATION")}
          onSimulateApproval={() => setDocStatus("ACTIVE")}
        />
      ) : (
        <>
          <UpcomingSection
            title="خدمات و سفارش‌ها"
            items={[
              "ثبت درخواست نصب و خدمات فنی",
              "پیگیری زنده سفارش‌ها با تایم‌لاین",
              "تاریخچه و امتیازدهی به مجری‌ها",
            ]}
          />
          <UpcomingSection
            title="کیف پول و پرداخت"
            items={["پرداخت امن سفارش‌ها", "کد تخفیف و بسته‌های خدماتی", "فاکتور و رسید دیجیتال"]}
          />
        </>
      )}

      {isInstaller ? (
        <UpcomingSection
          title="فرصت‌های کاری نصاب"
          items={["دریافت سفارش‌های نزدیک به محل سکونت", "تقویم کاری و پذیرش سانس", "تسویه هفتگی به شبا تأییدشده"]}
        />
      ) : null}
      {isShop ? (
        <UpcomingSection
          title="مدیریت غرفه فروشگاه"
          items={["افزودن محصولات و کاتالوگ", "اتصال به نصابان همکار", "گزارش فروش و کمیسیون"]}
        />
      ) : null}

      <View style={[styles.roleColorCard, { backgroundColor: appearance.soft }]}>
        <Ionicons name={appearance.icon} size={20} color={appearance.color} />
        <Text style={[styles.roleColorText, { color: appearance.color }]}>
          تجربه پنل {roleLabel} در موبایل — هماهنگ با نسخه وب (بیلد 006)
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          logout();
          router.replace("/login");
        }}
        style={({ pressed }) => [styles.logoutWide, pressed && { opacity: 0.85 }]}
      >
        <Ionicons name="log-out-outline" size={16} color={COLORS.danger} />
        <Text style={styles.logoutWideText}>خروج از حساب</Text>
      </Pressable>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  /* هویت */
  identityCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: SPACING.md,
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
    flexWrap: "wrap",
  },
  identityIconWrap: { width: 56, height: 56, borderRadius: RADII.lg, alignItems: "center", justifyContent: "center" },
  identityTextWrap: { flex: 1, minWidth: 120, gap: 2 },
  identityName: { fontSize: 16, fontWeight: "900", color: COLORS.navy },
  identityPhone: { fontSize: 12, color: COLORS.textSecondary, fontVariant: ["tabular-nums"] },
  identityExtra: { fontSize: 11, lineHeight: 18, color: COLORS.textMuted, marginTop: 2 },
  identityChipWrap: { width: "100%", marginTop: 4 },

  /* بخش‌ها */
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    gap: SPACING.md,
  },
  sectionHeaderRow: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  sectionCardTitle: { fontSize: 15, fontWeight: "900", color: COLORS.navy, flex: 1 },
  upcomingList: { gap: 6 },
  upcomingItem: { fontSize: 12, lineHeight: 20, color: COLORS.textSecondary },
  upcomingNote: { fontSize: 10, color: COLORS.textMuted, lineHeight: 17 },

  /* مدارک */
  docIntro: { fontSize: 12, lineHeight: 20, color: COLORS.textSecondary, textAlign: "right" },
  docForm: { gap: SPACING.md },
  multiline: { height: 90, textAlignVertical: "top", paddingTop: 12 },
  docsLabel: { fontSize: 13, fontWeight: "700", color: COLORS.navy },
  docButtons: { gap: SPACING.sm + 2 },
  attachButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.textMuted,
    borderRadius: RADII.md,
    padding: SPACING.md,
    backgroundColor: COLORS.slateLight,
  },
  attachButtonDone: { borderColor: "#047857", borderStyle: "solid", backgroundColor: "#ecfdf5" },
  attachText: { flex: 1, fontSize: 12, fontWeight: "700", color: COLORS.navy },
  attachTextDone: { color: "#047857" },
  docError: { fontSize: 12, color: COLORS.danger, textAlign: "right" },
  softeNote: { fontSize: 11, lineHeight: 19, color: COLORS.textMuted, textAlign: "right" },
  pendingBox: {
    backgroundColor: COLORS.amberBg,
    borderColor: COLORS.amberBorder,
    borderWidth: 1,
    borderRadius: RADII.md,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  pendingText: { fontSize: 12, lineHeight: 20, color: COLORS.amberText, textAlign: "right" },
  simulateButton: { height: 44 },
  activeBox: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    borderWidth: 1,
    borderRadius: RADII.md,
    padding: SPACING.md,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  activeText: { flex: 1, fontSize: 12, lineHeight: 20, color: "#047857", textAlign: "right" },

  /* مهمان */
  guestCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADII.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.xl,
    marginTop: SPACING.lg,
    alignItems: "center",
    gap: SPACING.md,
  },
  guestText: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center" },

  /* مدیر */
  adminBanner: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fffbeb",
    borderColor: COLORS.amberBorder,
    borderWidth: 1,
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginTop: SPACING.xs,
  },
  adminBannerText: { flex: 1, fontSize: 12, lineHeight: 19, color: COLORS.amberText, fontWeight: "700" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: SPACING.md, marginTop: SPACING.md },
  statCard: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: "center",
    gap: 4,
  },
  statValue: { fontSize: 18, fontWeight: "900", color: COLORS.navy },
  statLabel: { fontSize: 10, color: COLORS.textMuted, textAlign: "center" },
  adminList: { gap: SPACING.sm + 2 },
  adminRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: COLORS.slateLight,
    borderRadius: RADII.md,
    padding: SPACING.md,
  },
  adminRowTitle: { fontSize: 13, fontWeight: "800", color: COLORS.navy },
  adminRowSub: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  miniChip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 },
  miniChipText: { fontSize: 10, fontWeight: "800" },

  /* رنگ نقش */
  roleColorCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    borderRadius: RADII.lg,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  roleColorText: { flex: 1, fontSize: 12, fontWeight: "800", lineHeight: 19 },

  /* خروج */
  logoutWide: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: SPACING.lg,
    paddingVertical: 12,
    borderRadius: RADII.md,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  logoutWideText: { fontSize: 13, fontWeight: "800", color: COLORS.danger },
});
