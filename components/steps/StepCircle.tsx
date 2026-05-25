import { PortraitLang } from "@/data/dummy/portrait";
import { Pedometer } from "expo-sensors";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  AppState,
  AppStateStatus,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { fs } from "@/constants/typography";
import { syncStepProgressNotifications } from "@/services/stepNotifications";
import {
  DEFAULT_DAILY_STEP_GOAL,
  getStartOfDay,
  loadStoredTodayStats,
  saveTodayStats,
  stepsToKcal,
  stepsToKm,
} from "@/services/stepStats";

// ======================================================
// Types
// ======================================================

interface StepCircleProps {
  maxValue?: number;
  size?: number;
  color?: string;
  backgroundColor?: string;
  label?: string;
  subtitle?: string;
  lang: PortraitLang; // en | ru | tr | kz
}

export type Metric = "steps" | "km" | "kcal";

type SupportedLang = "en" | "ru" | "tr" | "kz";

// ======================================================
// Constants
// ======================================================

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// ======================================================
// i18n
// ======================================================

const translations: Record<
  SupportedLang,
  {
    today: string;
    daySteps: string;
    distancePerDay: string;
    caloriesFromWalking: string;
    sensorUnavailable: string;
    checkingSensor: string;
    goal: string;
    remaining: string;
    stepsUnit: string;
    kmUnit: string;
    kcalUnit: string;
    metricSteps: string;
    metricKm: string;
    metricKcal: string;
    weekdayShort: string[];
    weekdayFull: string[];
  }
> = {
  ru: {
    today: "Сегодня",
    daySteps: "Шагов за день",
    distancePerDay: "Дистанция за день",
    caloriesFromWalking: "Калории от ходьбы",
    sensorUnavailable: "Датчик недоступен",
    checkingSensor: "Проверяем датчик…",
    goal: "Цель",
    remaining: "Осталось",
    stepsUnit: "шагов",
    kmUnit: "км",
    kcalUnit: "ккал",
    metricSteps: "Шаги",
    metricKm: "Км",
    metricKcal: "Ккал",
    weekdayShort: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    weekdayFull: [
      "Понедельник",
      "Вторник",
      "Среда",
      "Четверг",
      "Пятница",
      "Суббота",
      "Воскресенье",
    ],
  },
  en: {
    today: "Today",
    daySteps: "Steps today",
    distancePerDay: "Distance today",
    caloriesFromWalking: "Walking calories",
    sensorUnavailable: "Sensor unavailable",
    checkingSensor: "Checking sensor…",
    goal: "Goal",
    remaining: "Remaining",
    stepsUnit: "steps",
    kmUnit: "km",
    kcalUnit: "kcal",
    metricSteps: "Steps",
    metricKm: "Km",
    metricKcal: "Kcal",
    weekdayShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    weekdayFull: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  tr: {
    today: "Bugün",
    daySteps: "Bugünkü adımlar",
    distancePerDay: "Bugünkü mesafe",
    caloriesFromWalking: "Yürüyüş kalorileri",
    sensorUnavailable: "Sensör kullanılamıyor",
    checkingSensor: "Sensör kontrol ediliyor…",
    goal: "Hedef",
    remaining: "Kalan",
    stepsUnit: "adım",
    kmUnit: "km",
    kcalUnit: "kcal",
    metricSteps: "Adım",
    metricKm: "Km",
    metricKcal: "Kcal",
    weekdayShort: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
    weekdayFull: [
      "Pazartesi",
      "Salı",
      "Çarşamba",
      "Perşembe",
      "Cuma",
      "Cumartesi",
      "Pazar",
    ],
  },
  kz: {
    today: "Бүгін",
    daySteps: "Бүгінгі қадамдар",
    distancePerDay: "Бүгінгі қашықтық",
    caloriesFromWalking: "Жүруден жанған калория",
    sensorUnavailable: "Сенсор қолжетімсіз",
    checkingSensor: "Сенсор тексеріліп жатыр…",
    goal: "Мақсат",
    remaining: "Қалды",
    stepsUnit: "қадам",
    kmUnit: "км",
    kcalUnit: "ккал",
    metricSteps: "Қадам",
    metricKm: "Км",
    metricKcal: "Ккал",
    weekdayShort: ["Дс", "Сс", "Ср", "Бс", "Жм", "Сб", "Жс"],
    weekdayFull: [
      "Дүйсенбі",
      "Сейсенбі",
      "Сәрсенбі",
      "Бейсенбі",
      "Жұма",
      "Сенбі",
      "Жексенбі",
    ],
  },
};

const normalizeLang = (lang?: PortraitLang): SupportedLang => {
  if (lang === "en" || lang === "ru" || lang === "tr" || lang === "kz") {
    return lang;
  }
  return "en";
};

// ======================================================
// Shared helpers
// ======================================================

// ======================================================
// Component
// ======================================================

const StepCircle: React.FC<StepCircleProps> = ({
  maxValue = DEFAULT_DAILY_STEP_GOAL,
  size = 260,
  color = "#3B82F6",
  backgroundColor = "#E5E7EB",
  label,
  subtitle,
  lang,
}) => {
  const currentLang = normalizeLang(lang);
  const t = translations[currentLang];

  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<Metric>("steps");

  const radius = size / 2 - 14;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.min(maxValue === 0 ? 0 : steps / maxValue, 1);
  const percentage = Math.round(progress * 100);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const distanceKm = useMemo(() => stepsToKm(steps), [steps]);
  const distanceGoalKm = useMemo(() => stepsToKm(maxValue), [maxValue]);

  const calories = useMemo(() => stepsToKcal(steps), [steps]);
  const caloriesGoal = useMemo(() => stepsToKcal(maxValue), [maxValue]);

  const resolvedLabel = label ?? t.today;
  const resolvedSubtitle = subtitle ?? t.daySteps;

  const getDisplayData = () => {
    switch (selectedMetric) {
      case "km":
        return {
          value: distanceKm.toFixed(2),
          unit: t.kmUnit,
          remaining: Math.max(distanceGoalKm - distanceKm, 0).toFixed(2),
          goal: distanceGoalKm.toFixed(2),
          subtitleText: t.distancePerDay,
        };
      case "kcal":
        return {
          value: Math.round(calories).toString(),
          unit: t.kcalUnit,
          remaining: Math.max(caloriesGoal - calories, 0).toFixed(0),
          goal: Math.round(caloriesGoal).toString(),
          subtitleText: t.caloriesFromWalking,
        };
      default:
        return {
          value: steps.toString(),
          unit: t.stepsUnit,
          remaining: Math.max(maxValue - steps, 0).toString(),
          goal: maxValue.toString(),
          subtitleText: resolvedSubtitle,
        };
    }
  };

  const display = getDisplayData();

  const refreshTodaySteps = async () => {
    try {
      const now = new Date();
      const startOfDay = getStartOfDay(now);
      const result = await Pedometer.getStepCountAsync(startOfDay, now);

      setSteps(result.steps);
      await saveTodayStats(result.steps, maxValue, now);
      void syncStepProgressNotifications({
        currentSteps: result.steps,
        goalSteps: maxValue,
        lang: currentLang,
        now,
      });
    } catch {
      const today = await loadStoredTodayStats(maxValue);
      if (today) setSteps(today.steps);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const available = await Pedometer.isAvailableAsync();
        if (!mounted) return;

        setIsAvailable(available);

        if (!available) {
          const today = await loadStoredTodayStats(maxValue);
          if (today && mounted) setSteps(today.steps);
          return;
        }

        const permission = await Pedometer.getPermissionsAsync();
        if (!permission.granted) {
          const requested = await Pedometer.requestPermissionsAsync();
          if (!requested.granted) {
            const today = await loadStoredTodayStats(maxValue);
            if (today && mounted) setSteps(today.steps);
            return;
          }
        }

        await refreshTodaySteps();
      } catch {
        const today = await loadStoredTodayStats(maxValue);
        if (today && mounted) setSteps(today.steps);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [maxValue, currentLang]);

  useEffect(() => {
    if (!isAvailable) return;

    const sub = Pedometer.watchStepCount(() => {
      refreshTodaySteps();
    });

    return () => {
      sub?.remove();
    };
  }, [isAvailable, maxValue, currentLang]);

  useEffect(() => {
    const appStateSub = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          refreshTodaySteps();
        }
      },
    );

    return () => {
      appStateSub.remove();
    };
  }, [maxValue, currentLang]);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 900,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [animatedValue, progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.toggleWrapper}>
          <MetricToggle
            value={selectedMetric}
            onChange={setSelectedMetric}
            lang={currentLang}
          />
        </View>

        <View style={styles.circleWrapper}>
          <Svg width={size} height={size}>
            <Defs>
              <LinearGradient
                id="progressGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <Stop offset="0%" stopColor="#000000" />
                <Stop offset="100%" stopColor={color} />
              </LinearGradient>
            </Defs>

            <Circle
              stroke={backgroundColor}
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
            />

            <AnimatedCircle
              stroke="url(#progressGradient)"
              fill="none"
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset as unknown as number}
              strokeLinecap="round"
              rotation="-90"
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>

          <View style={styles.center}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{resolvedLabel}</Text>
            </View>

            {isAvailable === false && (
              <Text style={styles.sensorUnavailableText}>
                {t.sensorUnavailable}
              </Text>
            )}

            {isAvailable === null && (
              <Text style={styles.sensorUnavailableText}>
                {t.checkingSensor}
              </Text>
            )}

            <View style={styles.valueRow}>
              <Text style={styles.valueText}>{display.value}</Text>
              <Text style={styles.unitText}>{display.unit}</Text>
            </View>

            <Text style={styles.maxText}>
              {t.goal.toLowerCase()}: {display.goal} · {percentage}%
            </Text>

            <Text style={styles.subtitleText}>{display.subtitleText}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>{t.remaining}</Text>
            <Text style={styles.statsValue}>{display.remaining}</Text>
          </View>

          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>{t.goal}</Text>
            <Text style={styles.statsValue}>{display.goal}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ======================================================
// Toggle
// ======================================================

const MetricToggle = ({
  value,
  onChange,
  lang,
}: {
  value: Metric;
  onChange: (v: Metric) => void;
  lang: SupportedLang;
}) => {
  const t = translations[lang];

  const options: { key: Metric; label: string }[] = [
    { key: "steps", label: t.metricSteps },
    { key: "km", label: t.metricKm },
    { key: "kcal", label: t.metricKcal },
  ];

  return (
    <View style={styles.toggle}>
      {options.map((opt) => {
        const active = value === opt.key;
        return (
          <TouchableOpacity
            key={opt.key}
            style={[styles.toggleItem, active && styles.toggleItemActive]}
            onPress={() => onChange(opt.key)}
            activeOpacity={0.9}
          >
            <Text
              style={[styles.toggleText, active && styles.toggleTextActive]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ======================================================
// Styles
// ======================================================

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  card: {
    borderRadius: 30,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  toggleWrapper: {
    width: "100%",
    marginBottom: 18,
    alignItems: "center",
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  toggleItem: {
    width: 74,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  toggleItemActive: {
    backgroundColor: "#3B82F6",
  },
  toggleText: {
    fontSize: fs(13),
    textAlign: "center",
    color: "#111111",
    fontWeight: "500",
  },
  toggleTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  circleWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
    maxWidth: "72%",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "#00000010",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 10,
  },
  badgeText: {
    fontSize: fs(12),
    fontWeight: "700",
    color: "#111111",
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  valueText: {
    fontSize: fs(40),
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -1,
  },
  unitText: {
    fontSize: fs(16),
    color: "#9CA3AF",
    marginLeft: 6,
    marginBottom: 6,
    fontWeight: "600",
  },
  maxText: {
    fontSize: fs(14),
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  subtitleText: {
    fontSize: fs(13),
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  sensorUnavailableText: {
    color: "#6B7280",
    marginBottom: 6,
    fontSize: fs(13),
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 18,
    gap: 12,
    width: "100%",
  },
  statsItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  statsLabel: {
    fontSize: fs(12),
    color: "#6B7280",
    marginBottom: 5,
  },
  statsValue: {
    fontSize: fs(16),
    fontWeight: "700",
    color: "#111111",
  },
});

export default StepCircle;
