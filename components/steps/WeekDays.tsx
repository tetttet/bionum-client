import { Theme } from "@/constants/theme";
import { AnimatePresence, MotiView } from "moti";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type DayItem = {
  short: string;
  full: string;
  time: string;
  km: number;
  history: number[];
};

const days: DayItem[] = [
  {
    short: "Пн",
    full: "Понедельник",
    time: "6:12",
    km: 5.2,
    history: [4.0, 5.2, 3.8, 5.0, 4.6],
  },
  {
    short: "Вт",
    full: "Вторник",
    time: "7:05",
    km: 8.1,
    history: [6.0, 7.2, 8.1, 5.0, 7.8],
  },
  {
    short: "Ср",
    full: "Среда",
    time: "6:30",
    km: 3.5,
    history: [3.5, 4.0, 2.7, 3.2, 3.5],
  },
  {
    short: "Чт",
    full: "Четверг",
    time: "18:12",
    km: 10.2,
    history: [8.0, 9.2, 10.2, 7.8, 9.0],
  },
  {
    short: "Пт",
    full: "Пятница",
    time: "19:00",
    km: 4.7,
    history: [5.0, 4.7, 6.0, 3.8, 4.2],
  },
  {
    short: "Сб",
    full: "Суббота",
    time: "09:20",
    km: 12.0,
    history: [10.0, 11.5, 12.0, 9.2, 11.0],
  },
  {
    short: "Вс",
    full: "Воскресенье",
    time: "10:00",
    km: 2.3,
    history: [2.3, 3.0, 1.8, 2.5, 2.0],
  },
];

const MAX_KM = 12;
const circleSize = 40;
export const HORIZONTAL_MARGIN = 18;

export default function WeekDays({ theme }: { theme: Theme }) {
  const [selected, setSelected] = useState<number | null>(null);
  const rowWidth = width - HORIZONTAL_MARGIN * 2;

  const onPressDay = (index: number) => (e: GestureResponderEvent) => {
    setSelected(selected === index ? null : index);
  };

  const selectedData = useMemo(
    () => (selected !== null ? days[selected] : null),
    [selected]
  );

  return (
    <View
      style={{
        paddingVertical: 14,
        paddingTop: 25,
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
        <View style={[styles.row, { width: rowWidth }]}>
          {days.map((day, index) => {
            const isSelected = selected === index;
            const normalized = Math.min(1, day.km / MAX_KM);
            return (
              <View key={index} style={styles.dayColumn}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onPressDay(index)}
                >
                  <MotiView
                    from={{ scale: 0.88, opacity: 0.6 }}
                    animate={{ scale: isSelected ? 1.06 : 1, opacity: 1 }}
                    transition={{ type: "timing", duration: 280 }}
                    style={[
                      styles.circle,
                      {
                        backgroundColor: isSelected
                          ? theme.accent
                          : theme.healthCardTheme.card,
                        shadowColor: isSelected
                          ? theme.accent
                          : theme.shadowColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          color: isSelected ? theme.pillText : theme.text,
                          fontWeight: isSelected ? "700" : "500",
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
                          width: `${Math.round(normalized * 100)}%`,
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
                    {day.km.toFixed(1)} km
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <AnimatePresence>
          {selectedData && (
            <MotiView
              key="dropdown"
              from={{ opacity: 0, translateY: -12, scale: 0.995 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              exit={{ opacity: 0, translateY: -12 }}
              transition={{ type: "timing", duration: 320 }}
              style={[
                styles.dropdown,
                {
                  width: Math.min(width - 40, 640),

                  shadowColor: theme.shadowColor,
                },
              ]}
            >
              <View style={styles.dropdownHeader}>
                <View>
                  <Text style={[styles.dropdownTitle, { color: theme.text }]}>
                    {selectedData.full}
                  </Text>
                  <Text style={[styles.dropdownSub, { color: theme.accent }]}>
                    {selectedData.km.toFixed(1)} km • {selectedData.time}
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
                    km
                  </Text>
                </View>
              </View>

              <View style={styles.miniGraphRow}>
                {selectedData.history.map((v, i) => {
                  const localMax = Math.max(...selectedData.history, MAX_KM);
                  const heightPercent = (v / localMax) * 100;
                  return (
                    <View key={i} style={styles.miniBarWrap}>
                      <View
                        style={[
                          styles.miniBar,
                          {
                            height: `${heightPercent}%`,
                            backgroundColor: theme.accent,
                          },
                        ]}
                      />
                      <Text
                        style={[
                          styles.miniBarLabel,
                          { color: theme.healthCardTheme.muted },
                        ]}
                      >
                        {v.toFixed(1)}
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
                  Примечание: график показывает последние тренировки.
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    console.log("Open details for", selectedData.full)
                  }
                  style={[
                    styles.detailsButton,
                    { backgroundColor: theme.accent },
                  ]}
                >
                  <Text
                    style={[
                      styles.detailsButtonText,
                      { color: theme.pillText },
                    ]}
                  >
                    Подробнее
                  </Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  dayColumn: {
    alignItems: "center",
    flex: 0,
    marginHorizontal: 5,
  },
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  text: { fontSize: 13 },
  timeText: { marginTop: 5, fontSize: 10 },
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
  },
  kmLabel: { marginTop: 3, fontSize: 9 },
  kmBarWrap: { marginTop: 6, alignItems: "center", width: "100%" },
  dropdown: {
    marginTop: 18,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownTitle: { fontSize: 18, fontWeight: "700" },
  dropdownSub: { marginTop: 4, fontWeight: "600" },
  bigKmCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  bigKmText: { fontSize: 20, fontWeight: "700" },
  bigKmUnit: { fontSize: 12 },
  miniGraphRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 64,
    paddingHorizontal: 6,
  },
  miniBarWrap: { alignItems: "center", flex: 1, marginHorizontal: 4 },
  miniBar: { width: "100%", maxWidth: 18, borderRadius: 6, opacity: 0.9 },
  miniBarLabel: { marginTop: 6, fontSize: 10 },
  dropdownFooter: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 11, width: "69%" },
  detailsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  detailsButtonText: { fontWeight: "700" },
});
