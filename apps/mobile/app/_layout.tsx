import { Stack } from "expo-router";
import { I18nManager } from "react-native";
import { useEffect } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

import { SessionProvider } from "../src/session";

/**
 * چیدمان ریشه اپ — فارسی و راست‌به‌چپ.
 *
 * بیلد 006 — SessionProvider سراسری اضافه شد تا ورود/ثبت‌نام و پنل‌های نقش‌محور
 * (هماهنگ با گام ۳ وب) در کل اپ یک نشست یکپارچه داشته باشند.
 *
 * توجه: در اندروید/iOS فعال‌سازی RTL پس از اولین اجرا نیازمند بازراه‌اندازی
 * اپ است (رفتار استاندارد I18nManager در React Native).
 */
export default function RootLayout() {
  useEffect(() => {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="sandbox" />
          <Stack.Screen name="panel" />
          <Stack.Screen name="status" />
          <Stack.Screen name="guide" />
          <Stack.Screen name="about" />
        </Stack>
      </SessionProvider>
    </SafeAreaProvider>
  );
}
