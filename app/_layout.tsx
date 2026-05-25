import { Asset } from "expo-asset";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import "react-native-reanimated";

import { ThemeProvider } from "@/components/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { RevenueCatProvider } from "@/context/RevenueCatContext";

const CRITICAL_HOME_ASSETS = [
  require("../assets/images/header-copy.png"),
  require("../assets/images/bg/bg-1.png"),
  require("../assets/images/bg/clever.png"),
];

void SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash may already be controlled by Expo in development.
});

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const prepareApp = async () => {
      try {
        await Asset.loadAsync(CRITICAL_HOME_ASSETS);
      } catch (error) {
        console.warn("Failed to preload critical home assets", error);
      } finally {
        if (mounted) {
          setAssetsReady(true);
        }
      }
    };

    void prepareApp();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!assetsReady) return;

    void SplashScreen.hideAsync().catch(() => {
      // ignore hide race conditions
    });
  }, [assetsReady]);

  return (
    <View style={{ flex: 1 }}>
      <AuthProvider>
        <RevenueCatProvider>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", title: "Modal" }}
              />

              <Stack.Screen
                name="auth/login"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/register"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/welcome"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/wiza"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="privacy-policy"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/forgotPassword"
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="auth/wizard"
                options={{ headerShown: false }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </RevenueCatProvider>
      </AuthProvider>
    </View>
  );
}
