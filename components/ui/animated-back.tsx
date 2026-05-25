// AnimatedBack.tsx
import { BLUE } from "@/constants/extra/psychoCopy";
import { fs, lh } from "@/constants/typography";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  I18nManager,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AnimatedBackProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  blue: string;
  onRenderTop?: React.ReactNode;
  minHeight?: number;
};

export default function AnimatedBack({
  visible,
  title,
  subtitle,
  blue,
  onRenderTop,
  minHeight = 250,
}: AnimatedBackProps) {
  const isRTL = I18nManager.isRTL;
  const textAlign = isRTL ? "right" : "left";

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const heroTranslate = useRef(new Animated.Value(24)).current;

  const blob1 = useRef(new Animated.Value(0)).current;
  const blob2 = useRef(new Animated.Value(0)).current;
  const blob3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    heroOpacity.setValue(0);
    heroTranslate.setValue(24);

    Animated.parallel([
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(heroTranslate, {
        toValue: 0,
        duration: 380,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(blob1, {
          toValue: 1,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(blob1, {
          toValue: 0,
          duration: 3600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(blob2, {
          toValue: 1,
          duration: 4600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(blob2, {
          toValue: 0,
          duration: 4600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const loop3 = Animated.loop(
      Animated.sequence([
        Animated.timing(blob3, {
          toValue: 1,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(blob3, {
          toValue: 0,
          duration: 2800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    loop1.start();
    loop2.start();
    loop3.start();

    return () => {
      loop1.stop();
      loop2.stop();
      loop3.stop();
    };
  }, [visible, heroOpacity, heroTranslate, blob1, blob2, blob3]);

  const blob1Y = blob1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const blob2Y = blob2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  const blob3Scale = blob3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  return (
    <Animated.View
      style={[
        styles.hero,
        {
          backgroundColor: blue,
          minHeight,
          opacity: heroOpacity,
          transform: [{ translateY: heroTranslate }],
        },
      ]}
    >
      <View style={styles.heroTop}>{onRenderTop}</View>

      <Animated.View
        style={[
          styles.heroBlobBig,
          {
            transform: [{ translateY: blob1Y }, { scale: blob3Scale }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.heroBlobMedium,
          {
            transform: [{ translateY: blob2Y }],
          },
        ]}
      />

      <View style={styles.heroDot1} />
      <View style={styles.heroDot2} />
      <View style={styles.heroDot3} />

      <View style={styles.heroContent}>
        <Text style={[styles.heroTitle, { textAlign }]}>{title}</Text>
      </View>
    </Animated.View>
  );
}

export function MenuButton({
  index,
  title,
  subtitle,
  isRTL,
  onPress,
}: {
  index: number;
  title: string;
  subtitle: string;
  isRTL: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.985,
      speed: 24,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      speed: 24,
      bounciness: 4,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.menuButton}
      >
        <View
          style={[
            styles.menuButtonInner,
            { flexDirection: isRTL ? "row-reverse" : "row" },
          ]}
        >
          <View style={styles.menuIndex}>
            <Text style={styles.menuIndexText}>{index}</Text>
          </View>

          <View style={styles.menuContent}>
            <Text
              style={[
                styles.menuTitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                styles.menuSubtitle,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {subtitle}
            </Text>
          </View>

          <View style={styles.menuArrowWrap}>
            <Text style={styles.menuArrow}>{isRTL ? "‹" : "›"}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  heroTop: {
    paddingTop: 26,
    paddingBottom: 12,
    zIndex: 5,
    alignItems: "flex-start",
  },
  heroContent: {
    zIndex: 5,
    width: "83%",
    marginTop: 20,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: fs(29),
    fontWeight: "800",
    lineHeight: lh(34),
    letterSpacing: -0.6,
    marginBottom: 0,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: fs(14),
    lineHeight: lh(21),
    fontWeight: "500",
    marginBottom: 16,
  },

  heroBlobBig: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 999,
    right: -28,
    top: 40,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  heroBlobMedium: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 999,
    right: 132,
    top: 40,
    backgroundColor: "rgba(255,255,255,0.24)",
  },
  heroDot1: {
    position: "absolute",
    right: 78,
    top: 88,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  heroDot2: {
    position: "absolute",
    right: 93,
    top: 88,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  heroDot3: {
    position: "absolute",
    right: 108,
    top: 88,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  menuButton: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(41,130,218,0.08)",
    shadowColor: "#0e3a66",
    shadowOpacity: 0.07,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  menuButtonInner: {
    alignItems: "center",
    width: "100%",
  },
  menuIndex: {
    width: 42,
    height: 42,
    borderRadius: 999,
    backgroundColor: "rgba(41,130,218,0.10)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginLeft: 12,
  },
  menuIndexText: {
    color: BLUE,
    fontSize: fs(16),
    fontWeight: "800",
  },
  menuTitle: {
    color: "#16324d",
    fontSize: fs(17),
    fontWeight: "800",
    marginBottom: 4,
  },
  menuSubtitle: {
    color: "#7C8FA3",
    fontSize: fs(13),
    lineHeight: lh(18),
    fontWeight: "500",
  },
  menuArrowWrap: {
    marginLeft: 10,
    marginRight: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  menuArrow: {
    color: BLUE,
    fontSize: fs(28),
    fontWeight: "400",
  },
  menuContent: {
    flex: 1,
  },
});
