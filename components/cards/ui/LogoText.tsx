import { Theme } from "@/constants/theme";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { fs } from "@/constants/typography";

const LogoText = ({ theme }: { theme: Theme }) => {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [glow]);

  // свечение: 0.15 -> 0.55
  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.55],
  });

  // можно чуть “дышать” самой надписью: 1 -> 0.92 (без движения)
  const baseOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.92],
  });

  return (
    <View style={styles.wrap}>
      {/* Glow слой (абсолютно поверх, не двигает layout) */}
      <Animated.Text
        pointerEvents="none"
        style={[
          styles.headerTitle,
          styles.glowText,
          {
            color: theme.mainTitle,
            opacity: glowOpacity,
          },
        ]}
      >
        BioNum
      </Animated.Text>

      {/* Основной текст */}
      <Animated.Text
        style={[
          styles.headerTitle,
          {
            color: theme.mainTitle,
            opacity: baseOpacity,
          },
        ]}
      >
        BioNum
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: fs(32),
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  glowText: {
    position: "absolute",
    // glow через тень (визуальный эффект, размер/позиция текста не меняется)
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textShadowColor: "rgba(255,255,255,0.85)",
  },
});

export default LogoText;
