import { COPY, Locale } from "@/constants/data";
import { LANGUAGE_KEY } from "@/constants/params";
import { i18n } from "@/data/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fs, lh } from "@/constants/typography";

const { width: W, height: H } = Dimensions.get("window");

const SUPPORTED: Locale[] = ["en", "tr", "kz", "ru"];

const COLORS = {
  primary: "#2982da",
  primarySoft: "rgba(41,130,218,0.20)",
  text: "#0F172A",
  muted: "#6B7280",
  bottomBarBg: "rgba(255,255,255,0.60)",
  outline: "rgba(15,23,42,0.10)",
  overlay: "rgba(255,255,255,0.10)",
  peach: "#e79e91",
  violet: "#8B5CF6",
  gold: "#F59E0B",
  cyan: "#56CCF2",
  white: "#FFFFFF",
  deep: "#EAF4FF",
} as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function FloatingParticle({
  size,
  left,
  top,
  duration,
  delay,
}: {
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.2)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -16,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.9,
            duration: duration * 0.45,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1.12,
            duration: duration * 0.5,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.25,
            duration: duration * 0.55,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.92,
            duration: duration * 0.55,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [delay, duration, opacity, scale, translateY]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          left,
          top,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    />
  );
}

function SacredRing({
  size,
  borderColor,
  style,
  duration = 16000,
  reverse = false,
}: {
  size: number;
  borderColor: string;
  style?: any;
  duration?: number;
  reverse?: boolean;
}) {
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [duration, rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: reverse ? ["0deg", "-360deg"] : ["0deg", "360deg"],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 1.2,
          borderColor,
          transform: [{ rotate: spin }],
        },
        style,
      ]}
    >
      <View
        style={[
          styles.ringDot,
          {
            top: -4,
            left: size / 2 - 4,
            backgroundColor: COLORS.gold,
          },
        ]}
      />
      <View
        style={[
          styles.ringDot,
          {
            bottom: 18,
            right: 8,
            backgroundColor: COLORS.primary,
          },
        ]}
      />
      <View
        style={[
          styles.ringDot,
          {
            bottom: -3,
            left: size * 0.28,
            backgroundColor: COLORS.peach,
          },
        ]}
      />
    </Animated.View>
  );
}

export default function WizardScreen() {
  const router = useRouter();

  const scrollRef = useRef<ScrollView>(null!);
  const x = useRef(new Animated.Value(0)).current;

  const [locale, setLocale] = useState<Locale>("en");
  const [ready, setReady] = useState(false);
  const [page, setPage] = useState(0);

  const aura1 = useRef(new Animated.Value(0)).current;
  const aura2 = useRef(new Animated.Value(0)).current;
  const aura3 = useRef(new Animated.Value(0)).current;
  const shimmer = useRef(new Animated.Value(0)).current;

  const t = useMemo(() => COPY[locale], [locale]);

  const pages = useMemo(
    () => [
      { title: t.page1Title, body: t.page1Body },
      { title: t.page2Title, body: t.page2Body },
      { title: t.page3Title, body: t.page3Body },
      { title: t.page4Title, body: t.page4Body },
      { title: t.page5Title, body: t.page5Body },
    ],
    [t],
  );

  const lastIndex = pages.length - 1;

  useEffect(() => {
    const loop1 = Animated.loop(
      Animated.sequence([
        Animated.timing(aura1, {
          toValue: 1,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(aura1, {
          toValue: 0,
          duration: 5200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const loop2 = Animated.loop(
      Animated.sequence([
        Animated.timing(aura2, {
          toValue: 1,
          duration: 6800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(aura2, {
          toValue: 0,
          duration: 6800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const loop3 = Animated.loop(
      Animated.sequence([
        Animated.timing(aura3, {
          toValue: 1,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(aura3, {
          toValue: 0,
          duration: 9000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 4200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    loop1.start();
    loop2.start();
    loop3.start();
    shimmerLoop.start();

    return () => {
      loop1.stop();
      loop2.stop();
      loop3.stop();
      shimmerLoop.stop();
    };
  }, [aura1, aura2, aura3, shimmer]);

  useFocusEffect(
    useCallback(() => {
      let alive = true;

      const init = async () => {
        try {
          const saved = (await AsyncStorage.getItem(
            LANGUAGE_KEY,
          )) as Locale | null;

          if (saved && SUPPORTED.includes(saved)) {
            i18n.locale = saved;
            if (alive) setLocale(saved);
          } else {
            i18n.locale = "en";
          }
        } finally {
          if (alive) setReady(true);
        }
      };

      init();
      return () => {
        alive = false;
      };
    }, []),
  );

  const progress = Animated.divide(x, W);

  const bgTranslateY = progress.interpolate({
    inputRange: [0, lastIndex || 1],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const blob1Translate = progress.interpolate({
    inputRange: [0, lastIndex || 1],
    outputRange: [0, 28],
    extrapolate: "clamp",
  });

  const blob2Translate = progress.interpolate({
    inputRange: [0, lastIndex || 1],
    outputRange: [0, -24],
    extrapolate: "clamp",
  });

  const blob3Translate = progress.interpolate({
    inputRange: [0, lastIndex || 1],
    outputRange: [0, 18],
    extrapolate: "clamp",
  });

  const contentLift = progress.interpolate({
    inputRange: [0, lastIndex || 1],
    outputRange: [0, -6],
    extrapolate: "clamp",
  });

  const aura1Y = aura1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -22],
  });
  const aura1Scale = aura1.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });

  const aura2Y = aura2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 18],
  });
  const aura2Scale = aura2.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const aura3Y = aura3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -14],
  });
  const aura3Scale = aura3.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const shimmerOpacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.14, 0.28],
  });

  const goRegister = useCallback(() => {
    router.replace("/auth/register");
  }, [router]);

  const onMomentumEnd = useCallback(
    (e: any) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / W);
      const clamped = clamp(idx, 0, lastIndex);
      setPage(clamped);
    },
    [lastIndex],
  );

  const onEndDrag = useCallback(
    (e: any) => {
      if (page !== lastIndex) return;

      const vx = e?.nativeEvent?.velocity?.x ?? 0;
      if (vx > 0.25) {
        goRegister();
      }
    },
    [goRegister, lastIndex, page],
  );

  if (!ready) {
    return (
      <View style={styles.bg}>
        <LinearGradient
          colors={["#F8FBFF", "#EEF6FF", "#FDF7FF"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tint} />
        <View style={styles.center}>
          <Text style={styles.loading}>Loading...</Text>
        </View>
      </View>
    );
  }

  let swipe = "Swipe →";
  let end = "End →";
  if (locale === "tr") {
    swipe = "Kaydır →";
    end = "Son →";
  } else if (locale === "kz") {
    swipe = "Сырғытыңыз →";
    end = "Аяқ →";
  } else if (locale === "ru") {
    swipe = "Свайп →";
    end = "Конец →";
  }

  return (
    <View style={styles.bg}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <LinearGradient
        colors={["#F8FBFF", "#EEF6FF", "#F6EEFF", "#FFF7F3"]}
        locations={[0, 0.34, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.tint} />

      <Animated.View
        pointerEvents="none"
        style={[
          styles.bgParallaxLayer,
          { transform: [{ translateY: bgTranslateY }] },
        ]}
      >
        <Animated.View
          style={[
            styles.bigAura,
            styles.auraTopRight,
            {
              transform: [{ translateY: aura1Y }, { scale: aura1Scale }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(86,204,242,0.22)",
              "rgba(41,130,218,0.08)",
              "transparent",
            ]}
            style={styles.full}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.bigAura,
            styles.auraBottomLeft,
            {
              transform: [{ translateY: aura2Y }, { scale: aura2Scale }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(139,92,246,0.16)",
              "rgba(231,158,145,0.10)",
              "transparent",
            ]}
            style={styles.full}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.bigAura,
            styles.auraCenter,
            {
              transform: [{ translateY: aura3Y }, { scale: aura3Scale }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(245,158,11,0.10)",
              "rgba(255,255,255,0.03)",
              "transparent",
            ]}
            style={styles.full}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.blob,
            styles.blob1,
            { transform: [{ translateY: blob1Translate }] },
          ]}
        />
        <Animated.View
          style={[
            styles.blob,
            styles.blob2,
            { transform: [{ translateY: blob2Translate }] },
          ]}
        />
        <Animated.View
          style={[
            styles.blob,
            styles.blob3,
            { transform: [{ translateY: blob3Translate }] },
          ]}
        />

        <SacredRing
          size={250}
          borderColor="rgba(41,130,218,0.13)"
          duration={22000}
          style={{ top: 105, right: -30 }}
        />
        <SacredRing
          size={180}
          borderColor="rgba(139,92,246,0.16)"
          duration={18000}
          reverse
          style={{ top: 145, right: 8 }}
        />
        <SacredRing
          size={320}
          borderColor="rgba(245,158,11,0.09)"
          duration={30000}
          reverse
          style={{ bottom: -40, left: -90 }}
        />

        <Animated.View
          style={[styles.shimmerLayer, { opacity: shimmerOpacity }]}
        >
          <LinearGradient
            colors={["transparent", "rgba(255,255,255,0.22)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.full}
          />
        </Animated.View>

        <FloatingParticle
          size={6}
          left={30}
          top={150}
          duration={2600}
          delay={400}
        />
        <FloatingParticle
          size={7}
          left={75}
          top={230}
          duration={3200}
          delay={900}
        />
        <FloatingParticle
          size={5}
          left={W - 52}
          top={210}
          duration={2800}
          delay={300}
        />
        <FloatingParticle
          size={8}
          left={W - 86}
          top={120}
          duration={3600}
          delay={1200}
        />
        <FloatingParticle
          size={5}
          left={W * 0.32}
          top={H * 0.2}
          duration={3100}
          delay={700}
        />
        <FloatingParticle
          size={7}
          left={W * 0.55}
          top={H * 0.72}
          duration={3500}
          delay={1000}
        />
        <FloatingParticle
          size={6}
          left={W * 0.82}
          top={H * 0.62}
          duration={3000}
          delay={600}
        />
        <FloatingParticle
          size={4}
          left={W * 0.16}
          top={H * 0.78}
          duration={2600}
          delay={1300}
        />
      </Animated.View>

      <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
        <Animated.View
          style={[styles.top, { transform: [{ translateY: contentLift }] }]}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandPill}>
              <LinearGradient
                colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.72)"]}
                style={styles.brandPillGradient}
              >
                <Text style={styles.brandPillText}>BIONUM</Text>
                <Text style={styles.brandPillGlyph}>✦</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, lastIndex],
                    outputRange: [W * 0.18, W * 0.62],
                    extrapolate: "clamp",
                  }),
                },
              ]}
            />
          </View>
        </Animated.View>

        <Animated.ScrollView
          ref={(r) => {
            if (r) scrollRef.current = r as ScrollView;
          }}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x } } }],
            { useNativeDriver: false },
          )}
          onMomentumScrollEnd={onMomentumEnd}
          onScrollEndDrag={onEndDrag}
          bounces={page !== lastIndex}
          alwaysBounceHorizontal={false}
          contentContainerStyle={styles.scrollContent}
          overScrollMode={page === lastIndex ? "always" : "never"}
        >
          {pages.map((p, idx) => (
            <View key={idx} style={[styles.page, { width: W }]}>
              <View style={styles.cardWrap}>
                <View style={styles.card}>
                  <View style={styles.cardGlow} />
                  <Text style={styles.title}>{p.title}</Text>
                  <Text style={styles.body}>{p.body}</Text>
                  <View style={styles.hintRow}>
                    <Text style={styles.hint}>
                      {idx === lastIndex ? end : swipe}
                    </Text>
                    <Text style={styles.hintIcon}>✦</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </Animated.ScrollView>

        <View style={styles.dotsRow}>
          {pages.map((_, i) => {
            const dotScale = progress.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [1, 1.45, 1],
              extrapolate: "clamp",
            });

            const dotOpacity = progress.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [0.28, 1, 0.28],
              extrapolate: "clamp",
            });

            const dotWidth = progress.interpolate({
              inputRange: [i - 1, i, i + 1],
              outputRange: [8, 20, 8],
              extrapolate: "clamp",
            });

            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity: dotOpacity,
                    transform: [{ scale: dotScale }],
                  },
                ]}
              />
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    flex: 1,
  },

  bg: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },

  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },

  bgParallaxLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  bigAura: {
    position: "absolute",
    borderRadius: 9999,
    overflow: "hidden",
  },

  auraTopRight: {
    width: 320,
    height: 320,
    top: -70,
    right: -80,
  },

  auraBottomLeft: {
    width: 360,
    height: 360,
    bottom: -120,
    left: -130,
  },

  auraCenter: {
    width: 220,
    height: 220,
    top: H * 0.28,
    left: W * 0.38,
  },

  blob: {
    position: "absolute",
    borderRadius: 9999,
  },

  blob1: {
    width: 220,
    height: 220,
    top: 30,
    right: -50,
    backgroundColor: "rgba(86,204,242,0.12)",
  },

  blob2: {
    width: 280,
    height: 280,
    bottom: -90,
    left: -100,
    backgroundColor: "rgba(139,92,246,0.11)",
  },

  blob3: {
    width: 160,
    height: 160,
    top: H * 0.5,
    left: -40,
    backgroundColor: "rgba(245,158,11,0.08)",
  },

  shimmerLayer: {
    ...StyleSheet.absoluteFillObject,
  },

  ringDot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  particle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#2982da",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  safe: {
    flex: 1,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    color: COLORS.text,
    opacity: 0.7,
    fontSize: fs(15),
    fontWeight: "700",
  },

  top: {
    paddingHorizontal: 18,
    paddingTop: Platform.OS === "android" ? 10 : 6,
    paddingBottom: 10,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  brandPill: {
    borderRadius: 999,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.55)",
    shadowColor: "#0F172A",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  brandPillGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  brandPillText: {
    color: COLORS.text,
    fontWeight: "900",
    letterSpacing: 1.25,
    fontSize: fs(12),
    opacity: 0.96,
  },

  brandPillGlyph: {
    color: COLORS.gold,
    fontSize: fs(11),
    fontWeight: "900",
  },

  progressTrack: {
    height: 7,
    borderRadius: 999,
    backgroundColor: "rgba(15,23,42,0.08)",
    overflow: "hidden",
  },

  progressFill: {
    height: 7,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },

  scrollContent: {
    paddingBottom: 8,
  },

  page: {
    paddingHorizontal: 18,
    paddingTop: 6,
  },

  cardWrap: {
    flex: 1,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },

  card: {
    flex: 1,
    padding: 22,
    justifyContent: "center",
  },

  cardGlow: {
    position: "absolute",
    top: -40,
    right: -10,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: "rgba(41,130,218,0.08)",
  },

  title: {
    color: COLORS.text,
    fontSize: fs(31),
    fontWeight: "900",
    lineHeight: lh(37),
    marginBottom: 12,
    letterSpacing: -0.35,
  },

  body: {
    color: "#334155",
    fontSize: fs(16.5),
    lineHeight: lh(24),
    fontWeight: "500",
  },

  hintRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  hint: {
    color: COLORS.primary,
    fontWeight: "900",
    opacity: 0.95,
    fontSize: fs(14),
    letterSpacing: 0.2,
  },

  hintIcon: {
    color: COLORS.gold,
    fontSize: fs(13),
  },

  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  dot: {
    height: 8,
    borderRadius: 99,
    backgroundColor: COLORS.primary,
  },
});
