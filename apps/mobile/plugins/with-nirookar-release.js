/**
 * پلاگین Expo اختصاصی نیروکار — بیلد 007 (زیرساخت انتشار)
 *
 * وظایف (طبق دستور مالک پروژه):
 * ۱) امضای ثابت و دائمی APK — همه بیلدها با یک Keystore واحد (ثابت در مخزن) امضا
 *    می‌شوند تا SHA-1/SHA-256 گواهی در همه بیلدهای فعلی و آینده یکسان بماند و
 *    اندروید نصب نسخه جدید را «به‌روزرسانی روی نسخه قبلی» بپذیرد.
 * ۲) محدودسازی معماری به arm64-v8a (حذف armeabi-v7a و x86/x86_64 شبیه‌ساز)
 * ۳) فشرده‌سازی کتابخانه‌های Native داخل APK (expo.useLegacyPackaging=true)
 * ۴) کوچک‌سازی کد با R8 (android.enableProguardInReleaseBuilds=true)
 * ۵) حذف منابع بلااستفاده (android.enableShrinkResourcesInReleaseBuilds=true)
 * ۶) فشرده‌سازی باندل Hermes داخل APK (android.enableBundleCompression=true)
 *
 * نکته: نسخه‌های 1 تا 4 APK قبلی با کلیدهای موقتی prebuild امضا شده بودند؛
 * از بیلد 007 به بعد امضا ثابت است — بنابراین یک بار باید نسخه قبلی حذف شود
 * و پس از آن همه نسخه‌های آینده بدون حذف، روی نسخه قبلی نصب می‌شوند.
 */

const fs = require("fs");
const path = require("path");
const {
  withGradleProperties,
  withAppBuildGradle,
  withDangerousMod,
  createRunOncePlugin,
} = require("@expo/config-plugins");

/* ─────────── مشخصات ثابت Keystore (مخزن خصوصی) ─────────── */
const KEYSTORE_RELATIVE_PATH = "../../keystore/nirookar-release.keystore";
const KEY_ALIAS = "nirookar";
const STORE_PASSWORD = "nirookar2024";
const KEY_PASSWORD = "nirookar2024";

/* ─────────── بازنویسی/افزودن ویژگی‌های gradle.properties ─────────── */
const GRADLE_PROPERTY_OVERRIDES = {
  "reactNativeArchitectures": "arm64-v8a",
  "expo.useLegacyPackaging": "true",
  "android.enableProguardInReleaseBuilds": "true",
  "android.enableShrinkResourcesInReleaseBuilds": "true",
  "android.enableBundleCompression": "true",
};

/* بلوک امضای release که پیش از buildTypes تزریق می‌شود */
const RELEASE_SIGNING_BLOCK = [
  "    signingConfigs {",
  "        release {",
  "            // Keystore ثابت نیروکار — امضای واحد در همه بیلدها (بیلد 007+)",
  `            storeFile file('${KEYSTORE_RELATIVE_PATH}')`,
  `            storePassword '${STORE_PASSWORD}'`,
  `            keyAlias '${KEY_ALIAS}'`,
  `            keyPassword '${KEY_PASSWORD}'`,
  "        }",
  "    }",
  "",
].join("\n");

/* قواعد ProGuard امن برای R8 — جلوگیری از خطاهای متداول «کلاس گم‌شده» */
const PROGUARD_APPEND_MARKER = "# nirookar build 007 — safe R8 dontwarn rules";
const PROGUARD_APPENDIX = [
  "",
  PROGUARD_APPEND_MARKER,
  "-dontwarn java.lang.invoke.**",
  "-dontwarn javax.naming.**",
  "-dontwarn org.slf4j.**",
  "-dontwarn org.bouncycastle.**",
  "-dontwarn org.joda.time.**",
  "",
].join("\n");

/* ۱) ویژگی‌های gradle.properties — modResults آرایه‌ای از {type, key, value} است */
function applyGradleProperties(mod) {
  const props = mod.modResults;
  if (!Array.isArray(props)) return mod;
  for (const item of props) {
    if (
      item.type === "property" &&
      Object.prototype.hasOwnProperty.call(GRADLE_PROPERTY_OVERRIDES, item.key)
    ) {
      item.value = GRADLE_PROPERTY_OVERRIDES[item.key];
    }
  }
  for (const [key, value] of Object.entries(GRADLE_PROPERTY_OVERRIDES)) {
    if (!props.some((p) => p.type === "property" && p.key === key)) {
      props.push({ type: "property", key, value });
    }
  }
  return mod;
}

/* ۲) امضای ثابت release در android/app/build.gradle */
function applyReleaseSigning(gradle) {
  if (gradle.includes("nirookar-release.keystore")) {
    return gradle; /* اجرای تکراری — از قبل اعمال شده */
  }

  let next = gradle;

  /* ۲-۱) تغییر امضای buildType «release» به کلید ثابت نیروکار
     توجه: این جایگزینی باید «قبل از» تزریق بلوک signingConfigs انجام شود
     تا regex اولین «release {» واقعی (buildTypes) را پیدا کند نه بلوک تزریق‌شده */
  const releasePattern = /(release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/;
  if (!releasePattern.test(next)) {
    throw new Error("with-nirookar-release: امضای buildType release یافت نشد");
  }
  next = next.replace(releasePattern, "$1signingConfig signingConfigs.release");

  /* ۲-۲) تزریق بلوک signingConfigs.release پیش از buildTypes */
  const anchor = next.search(/^\s*buildTypes\s*\{/m);
  if (anchor === -1) {
    throw new Error("with-nirookar-release: بلوک buildTypes در app/build.gradle یافت نشد");
  }
  next = next.slice(0, anchor) + RELEASE_SIGNING_BLOCK + "\n" + next.slice(anchor);

  /* ۲-۳) اطمینان نهایی */
  if (!next.includes("signingConfig signingConfigs.release")) {
    throw new Error("with-nirookar-release: اعمال امضای ثابت ناموفق بود");
  }

  return next;
}

/* ۳) قواعد R8 امن در android/app/proguard-rules.pro */
function applyProguardRules(config, platformProjectRoot) {
  if (!platformProjectRoot) return config;
  const target = path.join(platformProjectRoot, "app", "proguard-rules.pro");
  try {
    if (fs.existsSync(target) && !fs.readFileSync(target, "utf8").includes(PROGUARD_APPEND_MARKER)) {
      fs.appendFileSync(target, PROGUARD_APPENDIX);
    }
  } catch {
    /* غیرمرگبار — اگر فایل موجود نبود، R8 از قواعد پیش‌فرض استفاده می‌کند */
  }
  return config;
}

const withNirookarRelease = (config) => {
  config = withGradleProperties(config, applyGradleProperties);
  config = withAppBuildGradle(config, (mod) => {
    if (mod.modResults.language === "groovy") {
      mod.modResults.contents = applyReleaseSigning(mod.modResults.contents);
    }
    return mod;
  });
  config = withDangerousMod(config, ["android", (cfg) => {
    const projectRoot = cfg.modRequest?.projectRoot ?? process.cwd();
    return applyProguardRules(cfg, path.join(projectRoot, "android"));
  }]);
  return config;
};

module.exports = createRunOncePlugin(withNirookarRelease, "with-nirookar-release", "0.1.3");
