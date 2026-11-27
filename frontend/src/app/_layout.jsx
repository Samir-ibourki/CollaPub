import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import * as NativeSplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashOnboarding from "@/components/SplashOnboarding";
import SplashScreen from "@/components/SplashScreen";

// keep native splash visible until fonts finish loading
NativeSplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const [revealOnboarding, setRevealOnboarding] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashReveal = useCallback(() => {
    setRevealOnboarding(true);
  }, []);

  const handleSplashDone = useCallback(() => {
    setSplashDone(true);
  }, []);

  const appReady = fontsLoaded || Boolean(fontError);

  useEffect(() => {
    if (!appReady) return;
    NativeSplashScreen.hideAsync().catch(() => {});
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={StyleSheet.absoluteFill}>
          <SplashOnboarding active={revealOnboarding} />
          {!splashDone && (
            <View style={StyleSheet.absoluteFill}>
              <SplashScreen
                onReveal={handleSplashReveal}
                onDone={handleSplashDone}
              />
            </View>
          )}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
