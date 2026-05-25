import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Tabs, useRouter } from "expo-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  AppState,
  Animated,
  Easing,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LANGUAGE_KEY } from "@/constants/params";
import { AuthContext } from "@/context/AuthContext";
import { syncDailyReminderNotifications } from "@/services/dailyReminders";
import { syncStepProgressNotifications } from "@/services/stepNotifications";
import { fs } from "@/constants/typography";

type AppLang = "ru" | "en" | "kz" | "tr";

const TAB_LABELS: Record<
  AppLang,
  { home: string; premium: string; profile: string }
> = {
  ru: {
    home: "Главная",
    premium: "Премиум",
    profile: "Профиль",
  },
  en: {
    home: "Home",
    premium: "Premium",
    profile: "Profile",
  },
  kz: {
    home: "Басты бет",
    premium: "Premium",
    profile: "Профиль",
  },
  tr: {
    home: "Ana Sayfa",
    premium: "Premium",
    profile: "Profil",
  },
};

type AnimatedTabIconProps = {
  focused: boolean;
  color: string;
  label: string;
  icon: string;
};

function AnimatedTabIcon({
  focused,
  color,
  label,
  icon,
}: AnimatedTabIconProps) {
  const bgAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.96)).current;
  const translateYAnim = useRef(new Animated.Value(focused ? -2 : 0)).current;
  const opacityAnim = useRef(new Animated.Value(focused ? 1 : 0.78)).current;
  const labelOpacityAnim = useRef(
    new Animated.Value(focused ? 1 : 0.82),
  ).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(bgAnim, {
        toValue: focused ? 1 : 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.spring(scaleAnim, {
        toValue: focused ? 1 : 0.96,
        friction: 8,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: focused ? -3 : 0,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: focused ? 1 : 0.78,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(labelOpacityAnim, {
        toValue: focused ? 1 : 0.82,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    focused,
    bgAnim,
    scaleAnim,
    translateYAnim,
    opacityAnim,
    labelOpacityAnim,
  ]);

  const backgroundColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,0.68)"],
  });

  const borderColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0)", "rgba(255,255,255,0.68)"],
  });

  const activeColor = "#2982da";
  const iconColor = focused ? activeColor : color;
  const textColor = focused ? activeColor : color;

  return (
    <Animated.View
      style={[
        styles.tabItemOuter,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.tabItemInner,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
          },
        ]}
      >
        <IconSymbol size={21} name={icon as any} color={iconColor} />
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            {
              color: textColor,
              opacity: labelOpacityAnim,
            },
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

function GlassTabBarBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <BlurView intensity={72} tint="light" style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "rgba(255,255,255,0.28)",
          },
        ]}
      />
    </View>
  );
}

function FullScreenLoader() {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#2982da" />
    </View>
  );
}

export default function TabLayout() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();
  const hasRedirectedRef = useRef(false);
  const [lang, setLang] = useState<AppLang>("en");

  useEffect(() => {
    let mounted = true;

    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (
          mounted &&
          (savedLang === "ru" ||
            savedLang === "en" ||
            savedLang === "kz" ||
            savedLang === "tr")
        ) {
          setLang(savedLang);
        }
      } catch (error) {
        console.warn("Failed to load tab language from AsyncStorage", error);
      }
    };

    loadLanguage();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && !user && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (loading || !user) return;

    void syncDailyReminderNotifications();
    void syncStepProgressNotifications();

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void syncDailyReminderNotifications();
        void syncStepProgressNotifications();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loading, user]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <FullScreenLoader />;
  }

  const labels = TAB_LABELS[lang];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        animation: "shift",
        sceneStyle: {
          backgroundColor: "#f7f9fc",
        },
        tabBarBackground: () => <GlassTabBarBackground />,
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 24 : 18,
          height: 62,

          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.72)",
          backgroundColor: "transparent",
          borderRadius: 36,
          overflow: "hidden",

          paddingHorizontal: 10,
          marginHorizontal: 20,
          paddingTop: 12,
          paddingBottom: Platform.OS === "ios" ? 12 : 10,

          elevation: 0,
          shadowColor: "#0f172a",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.12,
          shadowRadius: 24,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: labels.home,
          tabBarActiveTintColor: "#2982da",
          tabBarInactiveTintColor: "rgba(15,23,42,0.48)",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              label={labels.home}
              icon="house.fill"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="premium"
        options={{
          title: labels.premium,
          tabBarActiveTintColor: "#2982da",
          tabBarInactiveTintColor: "rgba(15,23,42,0.48)",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              label={labels.premium}
              icon="star.fill"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: labels.profile,
          tabBarActiveTintColor: "#2982da",
          tabBarInactiveTintColor: "rgba(15,23,42,0.48)",
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              focused={focused}
              color={color}
              label={labels.profile}
              icon="person.fill"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemOuter: {
    width: 92,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabItemInner: {
    width: "100%",
    height: "100%",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  tabLabel: {
    fontSize: fs(11.5),
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
