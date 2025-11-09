// HealthCards.tsx
import { CARD_HEIGHT } from "@/constants/params";
import { Theme } from "@/constants/theme";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { HORIZONTAL_MARGIN } from "../steps/WeekDays";
import { useAlpha } from "./SectionCard";
import LineChartSmall from "./ui/LineChartSmall";
import WeekBars from "./ui/WeekBars";

const nf = (v: number) => Intl.NumberFormat("ru-RU").format(Math.round(v));

export default function HealthCards({
  theme,
  useDark,
}: {
  theme: Theme["healthCardTheme"];
  useDark: boolean;
}) {
  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Card theme={theme} darkMode={useDark} style={{ marginBottom: 14 }} />
    </ScrollView>
  );
}

function Card({
  theme,
  darkMode,
  style,
}: {
  theme: Theme["healthCardTheme"];
  darkMode: boolean;
  style?: ViewStyle;
}) {
  const { width } = Dimensions.get("window");
  const rowWidth = width - HORIZONTAL_MARGIN * 2;

  return (
    <View style={{ ...style, width: rowWidth }}>
      <CardShell theme={theme}>
        <HeaderOfCard
          title="Active Energy"
          accent={theme.accent}
          dark={darkMode}
        />
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              Last 7 days — average burn
            </Text>
            <View style={styles.metricRow}>
              <View>
                <Text style={[styles.metricLabel, { color: theme.subText }]}>
                  Average kcal
                </Text>
                <Text style={[styles.metricBig, { color: theme.text }]}>
                  {nf(243)}
                </Text>
                <Text style={[styles.unit, { color: theme.subText }]}>
                  kcal
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.barsColumn}>
            <View
              style={[
                styles.avgLine,
                { backgroundColor: "#4facfe", left: 8, right: 8, zIndex: 1 },
              ]}
            />
            <View style={styles.weekBarsWrap}>
              <WeekBars t={darkMode ? "dark" : "light"} compact />
            </View>
          </View>
        </View>
      </CardShell>

      <CardShell theme={theme}>
        <HeaderOfCard title="Steps" accent={theme.accent} dark={darkMode} />
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.subtitle, { color: theme.text }]}>
              You’re walking about as much as usual.
            </Text>
            <View style={[styles.metricRow, { marginTop: 8 }]}>
              <Text style={[styles.stepsValue, { color: "#3a78c3ff" }]}>
                {nf(2210)}
              </Text>
              <Text style={[styles.unit, { color: theme.subText }]}>steps</Text>
            </View>
          </View>
          <View style={styles.rightCompact}>
            <View style={{ alignItems: "center" }}>
              <Text style={[styles.avgSmallLabel, { color: theme.subText }]}>
                Average
              </Text>
              <Text
                style={[
                  styles.avgSmallValue,
                  { color: darkMode ? "#bdbdbd" : "#7a7a7a" },
                ]}
              >
                {nf(2316)}
              </Text>
            </View>
            <View style={{ width: 110, marginTop: 6 }}>
              <LineChartSmall t={darkMode ? "dark" : "light"} compact />
              <View style={{ height: 8 }} />
            </View>
          </View>
        </View>
      </CardShell>
    </View>
  );
}

/* Reusable card shell + header for compact, clean layout */
function CardShell({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: Theme["healthCardTheme"];
}) {
  return (
    <View
      style={[
        styles.card,
        {
          height: CARD_HEIGHT,
          backgroundColor: theme.background,
          borderColor: useAlpha(theme.border, 0.12),
          justifyContent: "space-between",
        },
      ]}
    >
      {children}
    </View>
  );
}

export function HeaderOfCard({
  title,
  accent,
  dark,
}: {
  title: string;
  accent: string;
  dark: boolean;
}) {
  return (
    <View style={styles.headerRow}>
      <View style={[styles.accDot, { backgroundColor: "#4c9eff" }]} />
      <Text style={[styles.title, { color: dark ? "#fff" : "#000" }]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    alignItems: "center",
  },

  card: {
    elevation: 4,
    borderRadius: 18,
    padding: 14,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },

  headerRow: {
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
    fontSize: 14,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },

  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    opacity: 0.85,
  },

  metricBig: {
    fontSize: 36,
    fontWeight: "800",
    marginTop: 6,
  },

  unit: {
    fontSize: 11,
    marginTop: 6,
  },

  metricRow: {
    marginTop: 6,
  },

  barsColumn: {
    width: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  weekBarsWrap: {
    height: 80,
    justifyContent: "flex-end",
    width: "100%",
    paddingHorizontal: 8,
  },

  avgLine: {
    position: "absolute",
    top: 44,
    height: 2,
    borderRadius: 4,
    opacity: 0.95,
  },

  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stepsValue: {
    fontSize: 30,
    fontWeight: "800",
  },

  rightCompact: {
    alignItems: "center",
    justifyContent: "center",
  },

  avgSmallLabel: {
    fontSize: 11,
    fontWeight: "600",
  },

  avgSmallValue: {
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },

  nowDotWrap: {
    position: "relative",
    height: 24,
  },

  nowDot: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
