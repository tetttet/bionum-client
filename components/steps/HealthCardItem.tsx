import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import { useAlpha } from "@/components/cards/SectionCard";
import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import { loadWeeklyHistory, WeekDayStats } from "@/services/stepStats";

import { fs, lh } from "@/constants/typography";

type SupportedLang = "en" | "ru" | "tr" | "kz";

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

const translations: Record<
  SupportedLang,
  {
    loading: string;
    activeEnergy: string;
    steps: string;
    today: string;
    todayBadgeFallback: string;
    kcalPerDay: string;
    last7DaysAvgEnergy: string;
    total: string;
    bestDay: string;
    movingNormal: string;
    stepsToday: string;
    average: string;
    peakWeek: string;
    weekAverage: string;
    days7: string;
    distance: string;
    kcal: string;
    perDay: string;
    stepsWord: string;
    kmUnit: string;
    kcalUnit: string;
  }
> = {
  ru: {
    loading: "Загружаем данные…",
    activeEnergy: "Активная энергия",
    steps: "Шаги",
    today: "сегодня",
    todayBadgeFallback: "Сегодня",
    kcalPerDay: "ккал / день",
    last7DaysAvgEnergy: "Последние 7 дней — средний расход энергии",
    total: "Всего",
    bestDay: "Лучший день",
    movingNormal: "Двигаешься примерно в своём обычном ритме.",
    stepsToday: "шагов сегодня",
    average: "Среднее",
    peakWeek: "Пик недели",
    weekAverage: "Среднее за неделю",
    days7: "7 дней",
    distance: "Дистанция",
    kcal: "ккал",
    perDay: "в день",
    stepsWord: "шаги",
    kmUnit: "км",
    kcalUnit: "ккал",
  },
  en: {
    loading: "Loading data…",
    activeEnergy: "Active Energy",
    steps: "Steps",
    today: "today",
    todayBadgeFallback: "Today",
    kcalPerDay: "kcal / day",
    last7DaysAvgEnergy: "Last 7 days — average energy burned",
    total: "Total",
    bestDay: "Best day",
    movingNormal: "You are moving at about your usual pace.",
    stepsToday: "steps today",
    average: "Average",
    peakWeek: "Peak of week",
    weekAverage: "Weekly average",
    days7: "7 days",
    distance: "Distance",
    kcal: "kcal",
    perDay: "per day",
    stepsWord: "steps",
    kmUnit: "km",
    kcalUnit: "kcal",
  },
  tr: {
    loading: "Veriler yükleniyor…",
    activeEnergy: "Aktif Enerji",
    steps: "Adımlar",
    today: "bugün",
    todayBadgeFallback: "Bugün",
    kcalPerDay: "kcal / gün",
    last7DaysAvgEnergy: "Son 7 gün — ortalama enerji tüketimi",
    total: "Toplam",
    bestDay: "En iyi gün",
    movingNormal: "Yaklaşık olarak normal ritminde hareket ediyorsun.",
    stepsToday: "bugünkü adımlar",
    average: "Ortalama",
    peakWeek: "Haftanın zirvesi",
    weekAverage: "Haftalık ortalama",
    days7: "7 gün",
    distance: "Mesafe",
    kcal: "kcal",
    perDay: "günde",
    stepsWord: "adım",
    kmUnit: "km",
    kcalUnit: "kcal",
  },
  kz: {
    loading: "Деректер жүктелуде…",
    activeEnergy: "Белсенді энергия",
    steps: "Қадамдар",
    today: "бүгін",
    todayBadgeFallback: "Бүгін",
    kcalPerDay: "ккал / күн",
    last7DaysAvgEnergy: "Соңғы 7 күн — орташа энергия шығыны",
    total: "Барлығы",
    bestDay: "Ең жақсы күн",
    movingNormal: "Сен шамамен өзіңнің қалыпты ырғағыңмен қозғалып жүрсің.",
    stepsToday: "бүгінгі қадам",
    average: "Орташа",
    peakWeek: "Апта шыңы",
    weekAverage: "Апталық орташа",
    days7: "7 күн",
    distance: "Қашықтық",
    kcal: "ккал",
    perDay: "күніне",
    stepsWord: "қадам",
    kmUnit: "км",
    kcalUnit: "ккал",
  },
};

const formatNumber = (v: number, locale: string) =>
  Intl.NumberFormat(locale).format(Math.round(v));

export default function HealthCardItem({
  theme,
  darkMode,
  type,
  style,
  lang,
}: {
  theme: Theme["healthCardTheme"];
  darkMode: boolean;
  type: "activeEnergy" | "steps";
  style?: ViewStyle;
  lang: PortraitLang;
}) {
  const currentLang = normalizeLang(lang);
  const t = translations[currentLang];
  const locale = getLocale(currentLang);

  const [days, setDays] = useState<WeekDayStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const weekly = await loadWeeklyHistory(10000, currentLang);
        if (!mounted) return;
        setDays(weekly);
      } catch {
        if (mounted) setDays([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [currentLang]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.background,
          borderColor: useAlpha(theme.border, 0.14),
        },
        style,
      ]}
    >
      {loading ? (
        <CardLoader theme={theme} text={t.loading} />
      ) : (
        <>
          {type === "activeEnergy" && (
            <ActiveEnergyCard
              theme={theme}
              dark={darkMode}
              days={days}
              lang={currentLang}
              locale={locale}
            />
          )}
          {type === "steps" && (
            <StepsCard
              theme={theme}
              dark={darkMode}
              days={days}
              lang={currentLang}
              locale={locale}
            />
          )}
        </>
      )}
    </View>
  );
}

/* ----------------------------- ACTIVE ENERGY ------------------------------ */

function ActiveEnergyCard({
  theme,
  dark,
  days,
  lang,
  locale,
}: {
  theme: Theme["healthCardTheme"];
  dark: boolean;
  days: WeekDayStats[];
  lang: SupportedLang;
  locale: string;
}) {
  const t = translations[lang];

  const totalKcal = useMemo(
    () => days.reduce((sum, day) => sum + day.kcal, 0),
    [days],
  );

  const averageKcal = useMemo(
    () => (days.length ? totalKcal / days.length : 0),
    [days, totalKcal],
  );

  const bestDay = useMemo(() => {
    if (!days.length) return null;
    return days.reduce((best, current) =>
      current.kcal > best.kcal ? current : best,
    );
  }, [days]);

  const bars = useMemo(() => {
    const values = days.map((d) => d.kcal);
    const max = Math.max(...values, 1);
    return days.map((d) => ({
      ...d,
      normalized: d.kcal / max,
    }));
  }, [days]);

  const barTrackColor = useAlpha(theme.border, 0.22);
  const glassBg = useAlpha(theme.card, dark ? 0.24 : 0.7);
  const glassBorder = useAlpha(theme.border, 0.18);

  return (
    <>
      <HeaderOfCard
        title={t.activeEnergy}
        accent="#4facfe"
        dark={dark}
        badge={`${formatNumber(averageKcal, locale)} ${t.kcal}`}
      />

      <View style={styles.topBlock}>
        <View style={{ flex: 1, paddingRight: 14 }}>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t.last7DaysAvgEnergy}
          </Text>

          <View style={styles.primaryMetricWrap}>
            <Text style={[styles.metricBig, { color: theme.text }]}>
              {formatNumber(averageKcal, locale)}
            </Text>
            <Text style={[styles.unitInline, { color: theme.subText }]}>
              {t.kcalPerDay}
            </Text>
          </View>

          <View style={styles.infoGrid}>
            <MiniInfoCard
              label={t.total}
              value={`${formatNumber(totalKcal, locale)}`}
              suffix={t.kcal}
              theme={theme}
            />
            <MiniInfoCard
              label={t.bestDay}
              value={bestDay ? bestDay.short : "—"}
              suffix={
                bestDay ? `${formatNumber(bestDay.kcal, locale)} ${t.kcal}` : ""
              }
              theme={theme}
            />
          </View>
        </View>

        <View style={styles.chartCardWrap}>
          <View
            style={[
              styles.chartGlass,
              {
                backgroundColor: glassBg,
                borderColor: glassBorder,
              },
            ]}
          >
            <View
              style={[
                styles.avgLine,
                {
                  backgroundColor: "#4facfe",
                  left: 10,
                  right: 10,
                },
              ]}
            />

            <View style={styles.barsInner}>
              {bars.map((item) => {
                const height = Math.max(10, item.normalized * 64);

                return (
                  <View key={item.dateKey} style={styles.barItem}>
                    <View
                      style={[
                        styles.barTrack,
                        {
                          backgroundColor: barTrackColor,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.barFill,
                          {
                            height,
                            backgroundColor: "#4facfe",
                            opacity: item.isToday ? 1 : 0.82,
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={[
                        styles.barDayLabel,
                        {
                          color: item.isToday ? "#4facfe" : theme.subText,
                        },
                      ]}
                    >
                      {item.short}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </>
  );
}

/* --------------------------------- STEPS --------------------------------- */

function StepsCard({
  theme,
  dark,
  days,
  lang,
  locale,
}: {
  theme: Theme["healthCardTheme"];
  dark: boolean;
  days: WeekDayStats[];
  lang: SupportedLang;
  locale: string;
}) {
  const t = translations[lang];

  const totalSteps = useMemo(
    () => days.reduce((sum, day) => sum + day.steps, 0),
    [days],
  );

  const averageSteps = useMemo(
    () => (days.length ? totalSteps / days.length : 0),
    [days, totalSteps],
  );

  const today = useMemo(() => days.find((d) => d.isToday) ?? null, [days]);

  const bestDay = useMemo(() => {
    if (!days.length) return null;
    return days.reduce((best, current) =>
      current.steps > best.steps ? current : best,
    );
  }, [days]);

  const linePoints = useMemo(() => {
    const values = days.map((d) => d.steps);
    const max = Math.max(...values, 1);

    return days.map((d, index) => ({
      x: index,
      y: d.steps / max,
      label: d.short,
      value: d.steps,
      isToday: d.isToday,
      dateKey: d.dateKey,
    }));
  }, [days]);

  return (
    <>
      <HeaderOfCard
        title={t.steps}
        accent="#4facfe"
        dark={dark}
        badge={
          today
            ? `${formatNumber(today.steps, locale)} ${t.today}`
            : t.todayBadgeFallback
        }
      />

      <View style={styles.topBlock}>
        <View style={{ flex: 1, paddingRight: 14 }}>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t.movingNormal}
          </Text>

          <View style={[styles.primaryMetricWrap, { marginTop: 10 }]}>
            <Text style={[styles.stepsValue, { color: "#3a78c3ff" }]}>
              {formatNumber(today?.steps ?? 0, locale)}
            </Text>
            <Text style={[styles.unitInline, { color: theme.subText }]}>
              {t.stepsToday}
            </Text>
          </View>

          <View style={styles.infoGrid}>
            <MiniInfoCard
              label={t.average}
              value={formatNumber(averageSteps, locale)}
              suffix={t.perDay}
              theme={theme}
            />
            <MiniInfoCard
              label={t.peakWeek}
              value={bestDay ? bestDay.short : "—"}
              suffix={bestDay ? formatNumber(bestDay.steps, locale) : ""}
              theme={theme}
            />
          </View>
        </View>

        <View style={styles.chartCardWrap}>
          <View
            style={[
              styles.chartGlass,
              {
                backgroundColor: useAlpha(theme.card, dark ? 0.24 : 0.7),
                borderColor: useAlpha(theme.border, 0.18),
              },
            ]}
          >
            <Text style={[styles.avgSmallLabel, { color: theme.subText }]}>
              {t.weekAverage}
            </Text>

            <Text style={[styles.avgSmallValue, { color: "#6a6a6a" }]}>
              {formatNumber(averageSteps, locale)}
            </Text>

            <MiniLineChart
              data={linePoints}
              accent="#4facfe"
              muted={theme.subText}
              border={theme.border}
            />
          </View>
        </View>
      </View>

      <View style={styles.footerRow}>
        <SoftStatPill
          label={t.days7}
          value={`${formatNumber(totalSteps, locale)} ${t.stepsWord}`}
          theme={theme}
        />
        <SoftStatPill
          label={t.distance}
          value={`${days.reduce((sum, d) => sum + d.km, 0).toFixed(1)} ${t.kmUnit}`}
          theme={theme}
        />
      </View>
    </>
  );
}

/* -------------------------------- HELPERS -------------------------------- */

function HeaderOfCard({
  title,
  accent,
  dark,
  badge,
}: {
  title: string;
  accent: string;
  dark: boolean;
  badge?: string;
}) {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <View style={[styles.accDot, { backgroundColor: "#4c9eff" }]} />
        <Text style={[styles.title, { color: dark ? "#fff" : "#fff" }]}>
          {title}
        </Text>
      </View>

      {badge ? (
        <View style={styles.headerBadge}>
          <Text style={[styles.headerBadgeText, { color: accent }]}>
            {badge}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

function MiniInfoCard({
  label,
  value,
  suffix,
  theme,
}: {
  label: string;
  value: string;
  suffix?: string;
  theme: Theme["healthCardTheme"];
}) {
  return (
    <View
      style={[
        styles.infoCard,
        {
          backgroundColor: useAlpha(theme.card, 0.72),
          borderColor: useAlpha(theme.border, 0.14),
        },
      ]}
    >
      <Text style={[styles.infoLabel, { color: theme.subText }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
      {!!suffix && (
        <Text style={[styles.infoSuffix, { color: theme.subText }]}>
          {suffix}
        </Text>
      )}
    </View>
  );
}

function SoftStatPill({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: Theme["healthCardTheme"];
}) {
  return (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: useAlpha(theme.card, 0.72),
          borderColor: useAlpha(theme.border, 0.14),
        },
      ]}
    >
      <Text style={[styles.pillLabel, { color: theme.subText }]}>{label}</Text>
      <Text style={[styles.pillValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function CardLoader({
  theme,
  text,
}: {
  theme: Theme["healthCardTheme"];
  text: string;
}) {
  return (
    <View style={styles.loaderWrap}>
      <ActivityIndicator color={theme.accent} />
      <Text style={[styles.loaderText, { color: theme.subText }]}>{text}</Text>
    </View>
  );
}

/* ------------------------------ MINI CHART ------------------------------- */

function MiniLineChart({
  data,
  accent,
  muted,
  border,
}: {
  data: {
    x: number;
    y: number;
    label: string;
    value: number;
    isToday: boolean;
    dateKey: string;
  }[];
  accent: string;
  muted: string;
  border: string;
}) {
  const chartHeight = 58;
  const pointGap = 16;
  const startX = 8;

  const points = data.map((point, index) => {
    const x = startX + index * pointGap;
    const y = chartHeight - point.y * 42 + 6;
    return { ...point, cx: x, cy: y };
  });

  return (
    <View style={{ marginTop: 8, width: 118 }}>
      <View style={styles.lineChartArea}>
        <View
          style={[
            styles.lineGuide,
            { backgroundColor: useAlphaStatic(border, 0.22), top: 18 },
          ]}
        />
        <View
          style={[
            styles.lineGuide,
            { backgroundColor: useAlphaStatic(border, 0.16), top: 38 },
          ]}
        />

        {points.slice(0, -1).map((point, index) => {
          const next = points[index + 1];
          const dx = next.cx - point.cx;
          const dy = next.cy - point.cy;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

          return (
            <View
              key={`${point.dateKey}-line`}
              style={[
                styles.segment,
                {
                  left: point.cx,
                  top: point.cy,
                  width: length,
                  transform: [{ rotate: `${angle}deg` }],
                  backgroundColor: accent,
                  opacity: 0.9,
                },
              ]}
            />
          );
        })}

        {points.map((point) => (
          <View
            key={point.dateKey}
            style={[
              styles.dot,
              {
                left: point.cx - 4,
                top: point.cy - 4,
                backgroundColor: point.isToday ? accent : "#FFFFFF",
                borderColor: accent,
                width: point.isToday ? 10 : 8,
                height: point.isToday ? 10 : 8,
                borderRadius: point.isToday ? 5 : 4,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.lineLabelsRow}>
        {data.map((point) => (
          <Text
            key={point.dateKey}
            style={[
              styles.lineLabel,
              {
                color: point.isToday ? accent : muted,
                fontWeight: point.isToday ? "700" : "600",
              },
            ]}
          >
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

function useAlphaStatic(hexOrRgba: string, alpha: number) {
  if (hexOrRgba.startsWith("rgba")) return hexOrRgba;
  if (hexOrRgba.startsWith("#")) {
    const hex = hexOrRgba.replace("#", "");
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((x) => x + x)
            .join("")
        : hex;

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hexOrRgba;
}

/* --------------------------------- STYLES -------------------------------- */

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    elevation: 5,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },

  loaderWrap: {
    minHeight: 150,
    alignItems: "center",
    justifyContent: "center",
  },

  loaderText: {
    marginTop: 10,
    fontSize: fs(13),
    fontWeight: "500",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  accDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },

  title: {
    fontSize: fs(15),
    fontWeight: "800",
    letterSpacing: -0.2,
  },

  headerBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  headerBadgeText: {
    fontSize: fs(11),
    fontWeight: "700",
  },

  topBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginTop: 4,
  },

  subtitle: {
    fontSize: fs(13),
    fontWeight: "600",
    marginTop: 6,
    lineHeight: lh(18),
  },

  primaryMetricWrap: {
    marginTop: 12,
  },

  metricBig: {
    fontSize: fs(36),
    fontWeight: "800",
    letterSpacing: -1,
  },

  stepsValue: {
    fontSize: fs(32),
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  unitInline: {
    fontSize: fs(12),
    marginTop: 4,
    fontWeight: "600",
  },

  infoGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  infoCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },

  infoLabel: {
    fontSize: fs(11),
    fontWeight: "600",
  },

  infoValue: {
    fontSize: fs(16),
    fontWeight: "800",
    marginTop: 6,
    letterSpacing: -0.3,
  },

  infoSuffix: {
    fontSize: fs(11),
    fontWeight: "500",
    marginTop: 3,
  },

  chartCardWrap: {
    width: 130,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  chartGlass: {
    width: 126,
    minHeight: 136,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: "center",
  },

  avgLine: {
    position: "absolute",
    top: 42,
    height: 2,
    borderRadius: 4,
    opacity: 0.95,
  },

  barsInner: {
    height: 86,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 4,
  },

  barItem: {
    alignItems: "center",
    flex: 1,
  },

  barTrack: {
    width: 10,
    height: 64,
    borderRadius: 10,
    justifyContent: "flex-end",
    overflow: "hidden",
  },

  barFill: {
    width: "100%",
    borderRadius: 10,
    minHeight: 10,
  },

  barDayLabel: {
    fontSize: fs(9),
    fontWeight: "700",
    marginTop: 6,
  },

  avgSmallLabel: {
    fontSize: fs(11),
    fontWeight: "600",
  },

  avgSmallValue: {
    fontSize: fs(23),
    fontWeight: "800",
    marginTop: 4,
    letterSpacing: -0.4,
  },

  lineChartArea: {
    height: 62,
    position: "relative",
    marginTop: 8,
  },

  lineGuide: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    borderRadius: 2,
  },

  segment: {
    position: "absolute",
    height: 2.5,
    borderRadius: 2,
    transformOrigin: "left center",
  },

  dot: {
    position: "absolute",
    borderWidth: 2,
  },

  lineLabelsRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  lineLabel: {
    fontSize: fs(8),
  },

  footerRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },

  pill: {
    flex: 1,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  pillLabel: {
    fontSize: fs(10),
    fontWeight: "600",
  },

  pillValue: {
    fontSize: fs(12),
    fontWeight: "800",
    marginTop: 3,
  },
});
