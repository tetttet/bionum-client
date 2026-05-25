import { LANGUAGE_KEY } from "@/constants/params";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av";
import { getLocales } from "expo-localization";
import { StatusBar } from "expo-status-bar";
import { I18n } from "i18n-js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { fs, lh } from "@/constants/typography";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ---- i18n ----
const i18n = new I18n({
  en: {
    welcome: "Welcome to",
    appName: "BioNum",
    tagline: "Choose your language and enter your energy path",
    selectLang: "Select Language",
    getStarted: "Get started",
    alreadyAccount: "I already have an account",
    loading: "Loading...",
    skip: "Skip",
  },
  ru: {
    welcome: "Добро пожаловать в",
    appName: "BioNum",
    tagline: "Выберите язык и начните свой путь энергии",
    selectLang: "Выберите язык",
    getStarted: "Начать",
    alreadyAccount: "У меня уже есть аккаунт",
    loading: "Загрузка...",
    skip: "Пропустить",
  },
  kz: {
    welcome: "Қош келдіңіз",
    appName: "BioNum",
    tagline: "Тілді таңдап, энергия жолыңызды бастаңыз",
    selectLang: "Тілді таңдаңыз",
    getStarted: "Бастау",
    alreadyAccount: "Менің аккаунтым бар",
    loading: "Жүктелуде...",
    skip: "Өткізу",
  },
  tr: {
    welcome: "Hoş geldiniz",
    appName: "BioNum",
    tagline: "Dilini seç ve enerji yolculuğuna başla",
    selectLang: "Dil seçin",
    getStarted: "Başlayın",
    alreadyAccount: "Zaten bir hesabım var",
    loading: "Yükleniyor...",
    skip: "Atla",
  },
});
i18n.enableFallback = true;
i18n.defaultLocale = "en";

const INTRO_VIDEO_SEEN_KEY = "INTRO_VIDEO_SEEN_V1";
const { width, height } = Dimensions.get("window");

// ---- White mystic theme ----
const COLORS = {
  bg: "#F8FBFF",
  bgSoft: "#F3F7FD",
  bgWarm: "#FCFDFF",

  primary: "#2B7FFF",
  primaryDeep: "#1E67D9",
  accent: "#8B7CFF",
  accentSoft: "#B9AEFF",
  teal: "#59C7BC",
  gold: "#D9B96E",

  text: "#102033",
  muted: "#66758A",
  lightText: "#8EA0B7",

  cardBg: "rgba(255,255,255,0.72)",
  cardBorder: "rgba(255,255,255,0.92)",
  glass: "rgba(255,255,255,0.60)",

  ring: "rgba(58,110,190,0.10)",
  ringStrong: "rgba(58,110,190,0.16)",
  number: "rgba(40,84,145,0.08)",

  orbBlue: "rgba(83,155,255,0.16)",
  orbPurple: "rgba(139,124,255,0.14)",
  orbTeal: "rgba(89,199,188,0.12)",
  orbGold: "rgba(217,185,110,0.10)",

  star: "rgba(43,127,255,0.30)",
  activeGlow: "rgba(43,127,255,0.12)",
  activeBorder: "rgba(43,127,255,0.42)",

  buttonBg: "#2B7FFF",
  buttonBgDisabled: "#B8CBE8",
  secondaryBg: "rgba(255,255,255,0.72)",
  secondaryBorder: "rgba(43,127,255,0.14)",
};

const FLAGS: {
  code: "en" | "ru" | "kz" | "tr";
  label: string;
}[] = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "kz", label: "Қазақша" },
  { code: "tr", label: "Türkçe" },
];

const SUPPORTED_CODES = FLAGS.map((f) => f.code);
const NUMBERS_BG = ["1", "3", "7", "9", "11", "22", "33"];

const STAR_POINTS = [
  { left: 24, top: 88, size: 2, opacity: 0.5 },
  { left: 65, top: 142, size: 3, opacity: 0.75 },
  { left: width - 44, top: 104, size: 2, opacity: 0.58 },
  { left: width - 76, top: 190, size: 4, opacity: 0.65 },
  { left: width * 0.3, top: 90, size: 2, opacity: 0.45 },
  { left: width * 0.82, top: 320, size: 3, opacity: 0.55 },
  { left: width * 0.14, top: 350, size: 2, opacity: 0.6 },
  { left: width * 0.54, top: 250, size: 2, opacity: 0.45 },
  { left: width * 0.48, top: 620, size: 3, opacity: 0.55 },
  { left: width * 0.9, top: 560, size: 2, opacity: 0.6 },
  { left: width * 0.12, top: 580, size: 4, opacity: 0.58 },
  { left: width * 0.72, top: 700, size: 2, opacity: 0.55 },
];

const WizardScreen: React.FC = () => {
  const navigation = useNavigation();

  const systemLang = useMemo(() => getLocales()[0]?.languageCode || "en", []);

  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [bootLoading, setBootLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [savedLangAtBoot, setSavedLangAtBoot] = useState<string | null>(null);

  const videoRef = useRef<Video | null>(null);

  // entrance animations
  const screenFade = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(24)).current;
  const cardScale = useRef(new Animated.Value(0.97)).current;

  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const actionsTranslate = useRef(new Animated.Value(18)).current;

  // background macro animations
  const orbFloat1 = useRef(new Animated.Value(0)).current;
  const orbFloat2 = useRef(new Animated.Value(0)).current;
  const orbFloat3 = useRef(new Animated.Value(0)).current;
  const orbBreath = useRef(new Animated.Value(0)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const ringRotateReverse = useRef(new Animated.Value(0)).current;
  const auraPulse = useRef(new Animated.Value(0)).current;

  // language cards
  const langAnim = useRef(
    FLAGS.reduce(
      (acc, item) => {
        acc[item.code] = new Animated.Value(0);
        return acc;
      },
      {} as Record<string, Animated.Value>,
    ),
  ).current;

  const activePulse = useRef(
    FLAGS.reduce(
      (acc, item) => {
        acc[item.code] = new Animated.Value(0);
        return acc;
      },
      {} as Record<string, Animated.Value>,
    ),
  ).current;

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [introSeen, savedLang] = await Promise.all([
          AsyncStorage.getItem(INTRO_VIDEO_SEEN_KEY),
          AsyncStorage.getItem(LANGUAGE_KEY),
        ]);

        if (savedLang) {
          setSavedLangAtBoot(savedLang);
          i18n.locale = savedLang;
        }

        if (!introSeen) {
          setShowIntro(true);

          if (!savedLang) {
            const initial = SUPPORTED_CODES.includes(systemLang as any)
              ? systemLang
              : "en";
            setSelectedLang(initial);
            i18n.locale = initial;
          }

          setBootLoading(false);
          return;
        }

        if (savedLang) {
          navigation.navigate("auth/login" as never);
          return;
        }

        const initial = SUPPORTED_CODES.includes(systemLang as any)
          ? systemLang
          : "en";
        setSelectedLang(initial);
        i18n.locale = initial;
      } catch (e) {
        console.log("Bootstrap error", e);
        setSelectedLang("en");
        i18n.locale = "en";
      } finally {
        setBootLoading(false);
      }
    };

    bootstrap();
  }, [navigation, systemLang]);

  useEffect(() => {
    if (bootLoading || showIntro) return;

    Animated.parallel([
      Animated.timing(screenFade, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.stagger(
      90,
      FLAGS.map((item) =>
        Animated.spring(langAnim[item.code], {
          toValue: 1,
          friction: 7,
          tension: 75,
          useNativeDriver: true,
        }),
      ),
    ).start();

    const loops = [
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbFloat1, {
            toValue: 1,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(orbFloat1, {
            toValue: 0,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbFloat2, {
            toValue: 1,
            duration: 6800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(orbFloat2, {
            toValue: 0,
            duration: 6800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbFloat3, {
            toValue: 1,
            duration: 7600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(orbFloat3, {
            toValue: 0,
            duration: 7600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(orbBreath, {
            toValue: 1,
            duration: 3600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(orbBreath, {
            toValue: 0,
            duration: 3600,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
      Animated.loop(
        Animated.timing(ringRotate, {
          toValue: 1,
          duration: 24000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.timing(ringRotateReverse, {
          toValue: 1,
          duration: 30000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
      Animated.loop(
        Animated.sequence([
          Animated.timing(auraPulse, {
            toValue: 1,
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(auraPulse, {
            toValue: 0,
            duration: 2800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ),
    ];

    loops.forEach((l) => l.start());

    return () => {
      loops.forEach((l) => l.stop());
    };
  }, [
    bootLoading,
    showIntro,
    screenFade,
    contentTranslate,
    cardScale,
    orbFloat1,
    orbFloat2,
    orbFloat3,
    orbBreath,
    ringRotate,
    ringRotateReverse,
    auraPulse,
    langAnim,
  ]);

  useEffect(() => {
    if (showIntro) return;

    Animated.parallel([
      Animated.timing(actionsOpacity, {
        toValue: selectedLang ? 1 : 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(actionsTranslate, {
        toValue: selectedLang ? 0 : 16,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedLang, actionsOpacity, actionsTranslate, showIntro]);

  useEffect(() => {
    FLAGS.forEach((item) => {
      const isActive = selectedLang === item.code;
      Animated.spring(activePulse[item.code], {
        toValue: isActive ? 1 : 0,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }).start();
    });
  }, [selectedLang, activePulse]);

  const onSelectLang = (code: string) => {
    setSelectedLang(code);
    i18n.locale = code;
  };

  const persistLangAndGo = async (route: string) => {
    if (!selectedLang) return;
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, selectedLang);
      i18n.locale = selectedLang;
      navigation.navigate(route as never);
    } catch (e) {
      console.log("Ошибка сохранения языка", e);
    }
  };

  const finishIntro = async () => {
    try {
      await AsyncStorage.setItem(INTRO_VIDEO_SEEN_KEY, "1");
    } catch (e) {
      console.log("Ошибка сохранения INTRO flag", e);
    } finally {
      setShowIntro(false);
      if (savedLangAtBoot) {
        navigation.navigate("auth/login" as never);
      }
    }
  };

  const orb1Y = orbFloat1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -24],
  });
  const orb1X = orbFloat1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 12],
  });

  const orb2Y = orbFloat2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 28],
  });
  const orb2X = orbFloat2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });

  const orb3Y = orbFloat3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });
  const orb3X = orbFloat3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  const auraScale = auraPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const auraOpacity = auraPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.62],
  });

  const orbBreathScale = orbBreath.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  const rotateRing = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const rotateRingReverse = ringRotateReverse.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-360deg"],
  });

  if (bootLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <View style={styles.center}>
          <Text style={styles.loadingText}>{i18n.t("loading")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showIntro) {
    return (
      <View style={styles.introContainer}>
        <StatusBar hidden />

        <Video
          ref={(r) => {
            videoRef.current = r;
          }}
          source={require("../../assets/videos/preview.mp4")}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
            if (!status.isLoaded) return;
            if (status.didJustFinish) finishIntro();
          }}
        />

        <View style={styles.introOverlay} />

        <Pressable style={styles.skipBtn} onPress={finishIntro}>
          <Text style={styles.skipText}>{i18n.t("skip")}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Image
        source={require("../../assets/images/bg/bg-card.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <View style={styles.backgroundOverlay} />
      <View style={styles.backgroundBase} />
      <View style={styles.backgroundLayerTop} />
      <View style={styles.backgroundLayerBottom} />

      <Animated.View
        style={[
          styles.auraCenter,
          {
            opacity: auraOpacity,
            transform: [{ scale: auraScale }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.orbLargeA,
          {
            transform: [
              { translateX: orb1X },
              { translateY: orb1Y },
              { scale: orbBreathScale },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orbLargeB,
          {
            transform: [{ translateX: orb2X }, { translateY: orb2Y }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.orbLargeC,
          {
            transform: [{ translateX: orb3X }, { translateY: orb3Y }],
          },
        ]}
      />

      <View style={styles.ringsWrap} pointerEvents="none">
        <Animated.View
          style={[
            styles.ring,
            styles.ring1,
            { transform: [{ rotate: rotateRing }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring2,
            { transform: [{ rotate: rotateRingReverse }] },
          ]}
        />
        <Animated.View
          style={[
            styles.ring,
            styles.ring3,
            { transform: [{ rotate: rotateRing }] },
          ]}
        />
      </View>

      <View pointerEvents="none" style={styles.crossHairWrap}>
        <View style={styles.crossLineHorizontal} />
        <View style={styles.crossLineVertical} />
      </View>

      <View pointerEvents="none" style={styles.numbersLayer}>
        {NUMBERS_BG.map((num, idx) => (
          <Text
            key={`${num}-${idx}`}
            style={[
              styles.bgNumber,
              {
                top: [80, 160, 250, 360, 470, 560, 680][idx % 7],
                left: [
                  24,
                  width - 88,
                  48,
                  width - 104,
                  34,
                  width - 96,
                  width / 2 - 20,
                ][idx % 7],
                fontSize: fs([26, 38, 30, 46, 28, 36, 42][idx % 7]),
                opacity: [0.11, 0.1, 0.08, 0.11, 0.07, 0.09, 0.1][idx % 7],
                transform: [
                  {
                    rotate: `${[-18, 12, -8, 16, -10, 8, -14][idx % 7]}deg`,
                  },
                ],
              },
            ]}
          >
            {num}
          </Text>
        ))}
      </View>

      <View pointerEvents="none" style={styles.starsLayer}>
        {STAR_POINTS.map((star, idx) => (
          <Animated.View
            key={`star-${idx}`}
            style={[
              styles.star,
              {
                left: star.left,
                top: star.top,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                transform: [
                  {
                    scale: auraPulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, idx % 2 === 0 ? 1.3 : 0.92],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: screenFade,
              transform: [{ translateY: contentTranslate }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            <View style={styles.cardGlow} />

            <View style={styles.brandWrap}>
              <Text style={styles.brandTopLine}>{i18n.t("welcome")}</Text>
              <Text style={styles.brandName}>{i18n.t("appName")}</Text>
              <View style={styles.topBadgeRow}>
                <View style={styles.topBadge}>
                  <Text style={styles.badgeText}>{i18n.t("selectLang")}</Text>
                </View>
              </View>
            </View>

            <View style={styles.flagsGrid}>
              {FLAGS.map((lang) => {
                const active = selectedLang === lang.code;

                const enterValue = langAnim[lang.code];
                const pulseValue = activePulse[lang.code];

                const translateY = enterValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                });

                const opacity = enterValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                });

                const scale = pulseValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.035],
                });

                const glowOpacity = pulseValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                });

                return (
                  <Animated.View
                    key={lang.code}
                    style={{
                      width: "48%",
                      opacity,
                      transform: [{ translateY }, { scale }],
                    }}
                  >
                    <Pressable
                      onPress={() => onSelectLang(lang.code)}
                      style={({ pressed }) => [
                        styles.flagCard,
                        active && styles.flagCardActive,
                        pressed && styles.flagCardPressed,
                      ]}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${lang.label}`}
                    >
                      <Animated.View
                        pointerEvents="none"
                        style={[
                          styles.flagCardGlow,
                          {
                            opacity: glowOpacity,
                          },
                        ]}
                      />

                      {active && (
                        <View style={styles.checkBadge}>
                          <Text style={styles.checkBadgeText}>✦</Text>
                        </View>
                      )}

                      <Text
                        style={[
                          styles.flagLabel,
                          active && styles.flagLabelActive,
                        ]}
                      >
                        {lang.label}
                      </Text>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </View>
          </Animated.View>
        </Animated.View>

        <Animated.View
          style={[
            styles.actionsBar,
            {
              opacity: actionsOpacity,
              transform: [{ translateY: actionsTranslate }],
            },
          ]}
        >
          <View style={styles.actionsPanel}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryBtn,
                {
                  backgroundColor: selectedLang
                    ? COLORS.buttonBg
                    : COLORS.buttonBgDisabled,
                  transform: [{ scale: pressed ? 0.988 : 1 }],
                },
              ]}
              onPress={() => persistLangAndGo("auth/welcome")}
              disabled={!selectedLang}
            >
              <Text style={styles.primaryBtnText}>
                {i18n.t("getStarted").toUpperCase()}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryBtn,
                {
                  transform: [{ scale: pressed ? 0.99 : 1 }],
                  opacity: selectedLang ? 1 : 0.65,
                },
              ]}
              onPress={() => persistLangAndGo("auth/login")}
              disabled={!selectedLang}
            >
              <Text style={styles.secondaryBtnText}>
                {i18n.t("alreadyAccount").toUpperCase()}
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

export default WizardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(248,251,255,0.62)",
  },

  safeArea: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  loadingText: {
    color: COLORS.text,
    fontSize: fs(16),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Intro
  introContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  introOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  skipBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 54 : 18,
    right: 14,
    backgroundColor: "rgba(255,255,255,0.55)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.88)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  skipText: {
    color: "#13263D",
    fontWeight: "800",
    fontSize: fs(13),
  },

  // Background
  backgroundBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(248,251,255,0.18)",
  },
  backgroundLayerTop: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    height: height * 0.45,
    backgroundColor: COLORS.bgSoft,
    opacity: 0.45,
  },
  backgroundLayerBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    backgroundColor: COLORS.bgWarm,
    opacity: 0.42,
  },

  auraCenter: {
    position: "absolute",
    alignSelf: "center",
    top: height * 0.16,
    width: width * 0.82,
    height: width * 0.82,
    borderRadius: 999,
    backgroundColor: "rgba(109,163,255,0.12)",
  },

  orbLargeA: {
    position: "absolute",
    top: -30,
    left: -30,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: COLORS.orbBlue,
  },
  orbLargeB: {
    position: "absolute",
    top: 110,
    right: -60,
    width: 210,
    height: 210,
    borderRadius: 999,
    backgroundColor: COLORS.orbPurple,
  },
  orbLargeC: {
    position: "absolute",
    bottom: 80,
    left: -35,
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: COLORS.orbTeal,
  },

  ringsWrap: {
    position: "absolute",
    alignSelf: "center",
    top: height * 0.13,
    width: width * 0.94,
    height: width * 0.94,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.ring,
  },
  ring1: {
    width: width * 0.84,
    height: width * 0.84,
  },
  ring2: {
    width: width * 0.68,
    height: width * 0.68,
    borderStyle: "dashed",
    borderColor: COLORS.ringStrong,
  },
  ring3: {
    width: width * 0.52,
    height: width * 0.52,
  },

  crossHairWrap: {
    position: "absolute",
    alignSelf: "center",
    top: height * 0.12,
    width: width * 0.96,
    height: width * 0.96,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.3,
  },
  crossLineHorizontal: {
    position: "absolute",
    width: "100%",
    height: 1,
    backgroundColor: "rgba(50,92,150,0.06)",
  },
  crossLineVertical: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(50,92,150,0.06)",
  },

  numbersLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  bgNumber: {
    position: "absolute",
    color: "#406AA1",
    fontWeight: "900",
    letterSpacing: 1,
  },

  starsLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  star: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: COLORS.star,
  },

  // Main
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 72,
    alignItems: "center",
    justifyContent: "center",
  },

  topBadgeRow: {
    width: "100%",
    maxWidth: 470,
    marginTop: 1,
    marginBottom: 14,
  },
  topBadge: {
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.76)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    shadowColor: "#7DA6E8",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  badgeText: {
    fontSize: fs(12),
    fontWeight: "900",
    color: COLORS.primaryDeep,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },

  card: {
    width: "100%",
    maxWidth: 470,
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: "#94B4E8",
    shadowOpacity: 0.2,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: -45,
    alignSelf: "center",
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "rgba(139,124,255,0.07)",
  },

  brandWrap: {
    alignItems: "center",
    marginBottom: 14,
    zIndex: 2,
  },
  brandTopLine: {
    fontSize: fs(12.5),
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 6,
    color: COLORS.primary,
    letterSpacing: 1.4,
  },
  brandName: {
    fontSize: fs(40),
    fontWeight: "900",
    letterSpacing: 0.4,
    color: COLORS.text,
  },
  brandTagline: {
    fontSize: fs(15),
    textAlign: "center",
    marginTop: 7,
    color: COLORS.muted,
    lineHeight: lh(21),
    paddingHorizontal: 10,
  },

  centerSigil: {
    alignSelf: "center",
    width: 74,
    height: 74,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  centerSigilOuter: {
    position: "absolute",
    width: 74,
    height: 74,
    borderRadius: 999,
    borderWidth: 1.1,
    borderColor: "rgba(43,127,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.26)",
  },
  centerSigilInner: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(43,127,255,0.14)",
  },
  centerSigilText: {
    color: COLORS.primaryDeep,
    fontSize: fs(20),
    fontWeight: "900",
    letterSpacing: 1,
  },

  flagsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
  },
  flagCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(43,127,255,0.07)",
    backgroundColor: "rgba(255,255,255,0.62)",
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 12,
    minHeight: 88,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    shadowColor: "#A6BFE7",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  flagCardPressed: {
    opacity: 0.97,
  },
  flagCardActive: {
    borderColor: COLORS.activeBorder,
    backgroundColor: "rgba(255,255,255,0.82)",
    shadowColor: "#62A0FF",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  flagCardGlow: {
    position: "absolute",
    top: -10,
    left: "15%",
    width: "70%",
    height: 46,
    borderRadius: 999,
    backgroundColor: COLORS.activeGlow,
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    minWidth: 24,
    height: 24,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  checkBadgeText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: fs(12),
  },
  flagLabel: {
    textAlign: "center",
    fontSize: fs(15),
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  flagLabelActive: {
    color: COLORS.primaryDeep,
  },
  flagHint: {
    textAlign: "center",
    fontSize: fs(11.5),
    fontWeight: "800",
    color: COLORS.lightText,
    letterSpacing: 1.2,
  },
  flagHintActive: {
    color: COLORS.primary,
  },

  // Actions
  actionsBar: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  actionsPanel: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.95)",
    borderRadius: 22,
    padding: 14,
    shadowColor: "#9EBBEA",
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  primaryBtn: {
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#5B9BFF",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: fs(15),
    fontWeight: "900",
    letterSpacing: 0.9,
  },

  secondaryBtn: {
    borderColor: COLORS.secondaryBorder,
    borderWidth: 1,
    backgroundColor: COLORS.secondaryBg,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: fs(14),
    color: COLORS.primaryDeep,
    fontWeight: "900",
    letterSpacing: 0.65,
  },
});
