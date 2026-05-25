import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { Theme } from "@/constants/theme";
import { fs, lh } from "@/constants/typography";

type Props = {
  theme: Theme;
  title: string;
  subtitle: string;
  onPress: () => void;
  style?: ViewStyle;

  badge?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  gradientColors?: [string, string, ...string[]];
};

export default function HomeCard({
  theme,
  title,
  subtitle,
  onPress,
  style,
  badge = "Рекомендуем",
  icon = "sparkles-outline",
  gradientColors = ["#2982da", "#2982da", "#2982da"],
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrapper,
        {
          transform: [{ scale: pressed ? 0.985 : 1 }],
          opacity: pressed ? 0.96 : 1,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderColor:
              theme.summaryCardBackground ?? "rgba(255,255,255,0.08)",
          },
        ]}
      >
        {/* Декоративные glow-элементы */}
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        {/* Стеклянный затемняющий слой */}
        <View style={styles.overlay} />

        {/* Контент */}
        <View style={styles.content}>
          <Text numberOfLines={2} style={styles.title}>
            {title}
          </Text>

          <Text numberOfLines={3} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const CARD_HEIGHT = 170;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
  },

  card: {
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    padding: 16,
    justifyContent: "space-between",

    ...Platform.select({
      ios: {
        shadowColor: "#0B1220",
        shadowOpacity: 0.16,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 6,
      },
    }),
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 16, 32, 0.04)",
  },

  glowTop: {
    position: "absolute",
    top: -30,
    right: -10,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
  },

  glowBottom: {
    position: "absolute",
    bottom: -50,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  topRow: {
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
  },

  badgeText: {
    color: "#FFFFFF",
    fontSize: fs(11),
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },

  content: {
    zIndex: 2,
    gap: 8,
    paddingRight: 14,
  },

  title: {
    color: "#FFFFFF",
    fontSize: fs(21),
    lineHeight: lh(26),
    fontWeight: "800",
    letterSpacing: 0.2,
  },

  subtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: fs(13.5),
    lineHeight: lh(19),
    fontWeight: "500",
  },

  footer: {
    zIndex: 2,
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  footerPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.20)",
  },

  footerText: {
    color: "#FFFFFF",
    fontSize: fs(12),
    fontWeight: "700",
  },
});
