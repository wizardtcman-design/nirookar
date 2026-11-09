import { Stack } from "expo-router";
import { I18nManager } from "react-native";
import { useEffect } from "react";

import { SafeAreaProvider } from "react-native-safe-area-context";

/**
 * چیدمان ریشه اپ — فارسی و راست‌به‌چپ.
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
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="customer" />
        <Stack.Screen name="professional" />
        <Stack.Screen name="guide" />
        <Stack.Screen name="about" />
      </Stack>
    </SafeAreaProvider>
  );
}
