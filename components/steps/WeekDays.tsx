import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import { AnimatePresence, MotiView } from "moti";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { fs, lh } from "@/constants/typography";
import { loadWeeklyHistory, WeekDayStats } from "@/services/stepStats";

const { width } = Dimensions.get("window");

const MAX_KM = 12;
const circleSize = 42;
export const HORIZONTAL_MARGIN = 18;

type Props = {
  theme: Theme;
  goalSteps?: number;
  lang: PortraitLang;
};

type SupportedLang = "en" | "ru" | "tr" | "kz";

const translations: Record<
  SupportedLang,
  {
    loadingWeek: string;
    weekActivity: string;
    currentWeekOnly: string;
    dataAutoCleared: string;
    weekSteps: string;
    calories: string;
    today: string;
    thisWeekDay: string;
    distance: string;
    goalProgress: string;
    weekGraph: string;
    bestDay: string;
    weekStorageHint: string;
    stepsWord: string;
    kmUnit: string;
    kcalUnit: string;
  }
> = {
  ru: {
    loadingWeek: "Загружаем неделю…",
    weekActivity: "Неделя активности",
    currentWeekOnly: "Только текущая неделя •",
    dataAutoCleared: "данные очищаются автоматически",
    weekSteps: "Шаги за неделю",
    calories: "Калории",
    today: "Сегодня",
    thisWeekDay: "День этой недели",
    distance: "Дистанция",
    goalProgress: "Выполнение цели",
    weekGraph: "График недели",
    bestDay: "Лучший день",
    weekStorageHint: "При новой неделе старые данные автоматически очищаются.",
    stepsWord: "шагов",
    kmUnit: "км",
    kcalUnit: "ккал",
  },
  en: {
    loadingWeek: "Loading week…",
    weekActivity: "Weekly activity",
    currentWeekOnly: "Current week only •",
    dataAutoCleared: "data is cleared automatically",
    weekSteps: "Weekly steps",
    calories: "Calories",
    today: "Today",
    thisWeekDay: "Day of this week",
    distance: "Distance",
    goalProgress: "Goal progress",
    weekGraph: "Week chart",
    bestDay: "Best day",
    weekStorageHint:
      "When a new week starts, old data is cleared automatically.",
    stepsWord: "steps",
    kmUnit: "km",
    kcalUnit: "kcal",
  },
  tr: {
    loadingWeek: "Hafta yükleniyor…",
    weekActivity: "Haftalık aktivite",
    currentWeekOnly: "Yalnızca mevcut hafta •",
    dataAutoCleared: "veriler otomatik temizlenir",
    weekSteps: "Haftalık adımlar",
    calories: "Kalori",
    today: "Bugün",
    thisWeekDay: "Bu haftanın günü",
    distance: "Mesafe",
    goalProgress: "Hedef tamamlama",
    weekGraph: "Hafta grafiği",
    bestDay: "En iyi gün",
    weekStorageHint:
      "Yeni hafta başladığında eski veriler otomatik temizlenir.",
    stepsWord: "adım",
    kmUnit: "km",
    kcalUnit: "kcal",
  },
  kz: {
    loadingWeek: "Апта жүктелуде…",
    weekActivity: "Апталық белсенділік",
    currentWeekOnly: "Тек ағымдағы апта •",
    dataAutoCleared: "деректер автоматты түрде тазаланады",
    weekSteps: "Апталық қадамдар",
    calories: "Калория",
    today: "Бүгін",
    thisWeekDay: "Осы аптаның күні",
    distance: "Қашықтық",
    goalProgress: "Мақсат орындалуы",
    weekGraph: "Апта графигі",
    bestDay: "Ең жақсы күн",
    weekStorageHint:
      "Жаңа апта басталғанда ескі деректер автоматты түрде тазаланады.",
    stepsWord: "қадам",
    kmUnit: "км",
    kcalUnit: "ккал",
  },
};

const normalizeLang = (lang?: PortraitLang): SupportedLang => {
  if (lang === "en" || lang === "ru" || lang === "tr" || lang === "kz") {
    return lang;
  }
  return "en";
};

const getLocale = (lang: SupportedLang) => {
  switch (lang) {
    case "ru":
      return "ru-RU";
    case "tr":
      return "tr-TR";
    case "kz":
      return "kk-KZ";
    case "en":
    default:
      return "en-US";
  }
};

export default function WeekDays({ theme, goalSteps = 10000, lang }: Props) {
  const currentLang = normalizeLang(lang);
  const t = translations[currentLang];
  const locale = getLocale(currentLang);

  const [days, setDays] = useState<WeekDayStats[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const rowWidth = width - HORIZONTAL_MARGIN * 2;

  const readWeek = useCallback(async () => {
    const weekly = await loadWeeklyHistory(goalSteps, currentLang);
    setDays(weekly);

    const todayIndex = weekly.findIndex((item) => item.isToday);
    setSelected((prev) => {
      if (prev !== null && weekly[prev]) return prev;
      return todayIndex >= 0 ? todayIndex : 0;
    });
  }, [goalSteps, currentLang]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const weekly = await loadWeeklyHistory(goalSteps, currentLang);
        if (!mounted) return;

        setDays(weekly);

        const todayIndex = weekly.findIndex((item) => item.isToday);
        setSelected(todayIndex >= 0 ? todayIndex : 0);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [goalSteps, currentLang]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await readWeek();
    } finally {
      setRefreshing(false);
    }
  }, [readWeek]);

  const selectedData = useMemo(
    () => (selected !== null ? (days[selected] ?? null) : null),
    [selected, days],
  );

  const weekTotalSteps = useMemo(
    () => days.reduce((sum, day) => sum + day.steps, 0),
    [days],
  );

  const weekTotalKm = useMemo(
    () => days.reduce((sum, day) => sum + day.km, 0),
    [days],
  );

  const weekTotalKcal = useMemo(
    () => days.reduce((sum, day) => sum + day.kcal, 0),
    [days],
  );

  const bestDay = useMemo(() => {
    if (!days.length) return null;
    return days.reduce((best, current) =>
      current.steps > best.steps ? current : best,
    );
  }, [days]);

  if (loading) {
    return (
      <View
        style={{
          paddingVertical: 20,
          marginHorizontal: HORIZONTAL_MARGIN,
        }}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.cardBackground,
              shadowColor: theme.shadowColor,
              borderColor: theme.healthCardTheme.border,
              borderWidth: 1,
              minHeight: 180,
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color={theme.accent} />
          <Text
            style={{
              marginTop: 10,
              color: theme.healthCardTheme.muted,
              fontSize: fs(13),
            }}
          >
            {t.loadingWeek}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{
        paddingVertical: 20,
        paddingTop: 0,
        marginHorizontal: HORIZONTAL_MARGIN,
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.cardBackground,
            shadowColor: theme.shadowColor,
            borderColor: theme.healthCardTheme.border,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {t.weekActivity}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: theme.healthCardTheme.muted },
              ]}
            >
              {t.currentWeekOnly}
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                { color: theme.healthCardTheme.muted },
              ]}
            >
              {t.dataAutoCleared}
            </Text>
          </View>

          <View
            style={[
              styles.weekBadge,
              {
                backgroundColor: theme.healthCardTheme.card,
                borderColor: theme.healthCardTheme.border,
              },
            ]}
          >
            <Text style={[styles.weekBadgeText, { color: theme.accent }]}>
              {weekTotalKm.toFixed(1)} {t.kmUnit}
            </Text>
          </View>
        </View>

        <View style={[styles.row, { width: rowWidth }]}>
          {days.map((day, index) => {
            const isSelected = selected === index;
            const normalizedKm = Math.min(1, day.km / MAX_KM);

            return (
              <View key={day.dateKey} style={styles.dayColumn}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  onPress={() => setSelected(isSelected ? null : index)}
                >
                  <MotiView
                    from={{ scale: 0.92, opacity: 0.75 }}
                    animate={{ scale: isSelected ? 1.06 : 1, opacity: 1 }}
                    transition={{ type: "timing", duration: 260 }}
                    style={[
                      styles.circle,
                      {
                        backgroundColor: isSelected
                          ? theme.accent
                          : theme.healthCardTheme.card,
                        shadowColor: isSelected
                          ? theme.accent
                          : theme.shadowColor,
                        borderColor: day.isToday
                          ? theme.accent
                          : theme.healthCardTheme.border,
                        borderWidth: day.isToday ? 1.5 : 1,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isSelected ? theme.pillText : theme.text,
                          fontWeight: isSelected ? "700" : "600",
                        },
                      ]}
                    >
                      {day.short}
                    </Text>
                  </MotiView>
                </TouchableOpacity>

                <Text
                  style={[
                    styles.timeText,
                    { color: theme.healthCardTheme.muted },
                  ]}
                >
                  {day.time}
                </Text>

                <View style={styles.kmBarWrap}>
                  <View
                    style={[
                      styles.kmBarTrack,
                      { backgroundColor: theme.healthCardTheme.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.kmBarFill,
                        {
                          width: `${Math.round(normalizedKm * 100)}%`,
                          backgroundColor: theme.accent,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.kmLabel,
                      { color: theme.healthCardTheme.muted },
                    ]}
                  >
                    {day.km.toFixed(1)} {t.kmUnit}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.summaryRow}>
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.healthCardTheme.card,
                borderColor: theme.healthCardTheme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.healthCardTheme.muted },
              ]}
            >
              {t.weekSteps}
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {weekTotalSteps.toLocaleString(locale)}
            </Text>
          </View>

          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.healthCardTheme.card,
                borderColor: theme.healthCardTheme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.summaryLabel,
                { color: theme.healthCardTheme.muted },
              ]}
            >
              {t.calories}
            </Text>
            <Text style={[styles.summaryValue, { color: theme.text }]}>
              {Math.round(weekTotalKcal).toLocaleString(locale)}
            </Text>
          </View>
        </View>

        <AnimatePresence>
          {selectedData && (
            <MotiView
              key="dropdown"
              from={{ opacity: 0, translateY: -10, scale: 0.995 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, translateY: -10 }}
              transition={{ type: "timing", duration: 300 }}
              style={[
                styles.dropdown,
                {
                  width: Math.min(width - 40, 640),
                  backgroundColor: theme.cardBackground,
                  shadowColor: theme.shadowColor,
                  borderColor: theme.healthCardTheme.border,
                },
              ]}
            >
              <View style={styles.dropdownHeader}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={[styles.dropdownTitle, { color: theme.text }]}>
                    {selectedData.full}
                  </Text>

                  <Text style={[styles.dropdownSub, { color: theme.accent }]}>
                    {selectedData.steps.toLocaleString(locale)} {t.stepsWord} •{" "}
                    {selectedData.time}
                  </Text>

                  <Text
                    style={[
                      styles.dropdownMuted,
                      { color: theme.healthCardTheme.muted },
                    ]}
                  >
                    {selectedData.isToday ? t.today : t.thisWeekDay}
                  </Text>
                </View>

                <View
                  style={[
                    styles.bigKmCircle,
                    { backgroundColor: theme.healthCardTheme.card },
                  ]}
                >
                  <Text style={[styles.bigKmText, { color: theme.accent }]}>
                    {selectedData.km.toFixed(1)}
                  </Text>
                  <Text style={[styles.bigKmUnit, { color: theme.accent }]}>
                    {t.kmUnit}
                  </Text>
                </View>
              </View>

              <View style={styles.metricsGrid}>
                <View
                  style={[
                    styles.metricCard,
                    {
                      backgroundColor: theme.healthCardTheme.card,
                      borderColor: theme.healthCardTheme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.metricLabel,
                      { color: theme.healthCardTheme.muted },
                    ]}
                  >
                    {t.distance}
                  </Text>
                  <Text style={[styles.metricValue, { color: theme.text }]}>
                    {selectedData.km.toFixed(2)} {t.kmUnit}
                  </Text>
                </View>

                <View
                  style={[
                    styles.metricCard,
                    {
                      backgroundColor: theme.healthCardTheme.card,
                      borderColor: theme.healthCardTheme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.metricLabel,
                      { color: theme.healthCardTheme.muted },
                    ]}
                  >
                    {t.calories}
                  </Text>
                  <Text style={[styles.metricValue, { color: theme.text }]}>
                    {Math.round(selectedData.kcal).toLocaleString(locale)}{" "}
                    {t.kcalUnit}
                  </Text>
                </View>

                <View
                  style={[
                    styles.metricCard,
                    {
                      backgroundColor: theme.healthCardTheme.card,
                      borderColor: theme.healthCardTheme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.metricLabel,
                      { color: theme.healthCardTheme.muted },
                    ]}
                  >
                    {t.goalProgress}
                  </Text>
                  <Text style={[styles.metricValue, { color: theme.text }]}>
                    {Math.round(selectedData.progress * 100)}%
                  </Text>
                </View>
              </View>

              <View style={styles.graphHeader}>
                <Text style={[styles.graphTitle, { color: theme.text }]}>
                  {t.weekGraph}
                </Text>
                {bestDay && (
                  <Text
                    style={[
                      styles.graphSub,
                      { color: theme.healthCardTheme.muted },
                    ]}
                  >
                    {t.bestDay}: {bestDay.short} • {bestDay.km.toFixed(1)}{" "}
                    {t.kmUnit}
                  </Text>
                )}
              </View>

              <View style={styles.miniGraphRow}>
                {days.map((day) => {
                  const localMax = Math.max(...days.map((d) => d.km), MAX_KM);
                  const heightPercent =
                    day.km === 0 ? 8 : (day.km / localMax) * 100;
                  const active = day.dateKey === selectedData.dateKey;

                  return (
                    <View key={day.dateKey} style={styles.miniBarWrap}>
                      <View
                        style={[
                          styles.miniBarTrack,
                          { backgroundColor: theme.healthCardTheme.border },
                        ]}
                      >
                        <View
                          style={[
                            styles.miniBar,
                            {
                              height: `${heightPercent}%`,
                              backgroundColor: theme.accent,
                              opacity: active ? 1 : 0.72,
                              width: active ? 20 : 16,
                            },
                          ]}
                        />
                      </View>

                      <Text
                        style={[
                          styles.miniDayLabel,
                          {
                            color: active
                              ? theme.accent
                              : theme.healthCardTheme.muted,
                          },
                        ]}
                      >
                        {day.short}
                      </Text>

                      <Text
                        style={[
                          styles.miniBarLabel,
                          { color: theme.healthCardTheme.muted },
                        ]}
                      >
                        {day.km.toFixed(1)}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.dropdownFooter}>
                <Text
                  style={[
                    styles.footerText,
                    { color: theme.healthCardTheme.muted },
                  ]}
                >
                  {t.weekStorageHint}
                </Text>
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 24,
    marginTop: 10,
    paddingVertical: 18,
    paddingHorizontal: 14,
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  headerTitle: {
    fontSize: fs(18),
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: fs(12),
    fontWeight: "500",
  },
  weekBadge: {
    minWidth: 82,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  weekBadgeText: {
    fontSize: fs(14),
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dayColumn: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: fs(13),
  },
  timeText: {
    marginTop: 6,
    fontSize: fs(10),
    fontWeight: "500",
  },
  kmBarWrap: {
    marginTop: 7,
    alignItems: "center",
    width: "100%",
  },
  kmBarTrack: {
    width: 36,
    height: 5,
    borderRadius: 4,
    overflow: "hidden",
  },
  kmBarFill: {
    height: "100%",
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  kmLabel: {
    marginTop: 4,
    fontSize: fs(9),
    fontWeight: "600",
  },
  summaryRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  summaryLabel: {
    fontSize: fs(12),
    marginBottom: 6,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: fs(18),
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  dropdown: {
    marginTop: 18,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 1,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownTitle: {
    fontSize: fs(20),
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  dropdownSub: {
    marginTop: 5,
    fontWeight: "700",
    fontSize: fs(14),
  },
  dropdownMuted: {
    marginTop: 4,
    fontSize: fs(12),
    fontWeight: "500",
  },
  bigKmCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 78,
    height: 78,
    borderRadius: 39,
  },
  bigKmText: {
    fontSize: fs(22),
    fontWeight: "800",
  },
  bigKmUnit: {
    fontSize: fs(12),
    fontWeight: "700",
  },
  metricsGrid: {
    marginTop: 16,
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
  },
  metricLabel: {
    fontSize: fs(11),
    marginBottom: 6,
    fontWeight: "500",
  },
  metricValue: {
    fontSize: fs(15),
    fontWeight: "800",
  },
  graphHeader: {
    marginTop: 18,
    marginBottom: 10,
  },
  graphTitle: {
    fontSize: fs(15),
    fontWeight: "800",
  },
  graphSub: {
    marginTop: 4,
    fontSize: fs(12),
    fontWeight: "500",
  },
  miniGraphRow: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 120,
    paddingHorizontal: 4,
  },
  miniBarWrap: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 3,
  },
  miniBarTrack: {
    width: "100%",
    maxWidth: 24,
    height: 78,
    borderRadius: 10,
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
    paddingBottom: 0,
  },
  miniBar: {
    borderRadius: 10,
  },
  miniDayLabel: {
    marginTop: 8,
    fontSize: fs(11),
    fontWeight: "700",
  },
  miniBarLabel: {
    marginTop: 4,
    fontSize: fs(10),
    fontWeight: "500",
  },
  dropdownFooter: {
    marginTop: 14,
  },
  footerText: {
    fontSize: fs(11),
    lineHeight: lh(16),
    fontWeight: "500",
  },
});
