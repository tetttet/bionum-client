// WeekBars.tsx
import { healthCardTheme, ThemeType } from "@/constants/theme";
import { fs } from "@/constants/typography";
import React from "react";
import { Text, View } from "react-native";

interface WeekBarsProps {
  t: ThemeType;
  compact?: boolean;
}

const WeekBars = ({ t, compact = false }: WeekBarsProps) => {
  const theme = healthCardTheme[t];

  // Высоты баров: более плавная шкала для реалистичного вида
  const heights = compact
    ? [32, 48, 64, 82, 60, 70, 78] // компактная версия
    : [60, 90, 120, 170, 110, 130, 145]; // старая версия (если compact = false)

  const labels = ["W", "T", "F", "S", "S", "M", "T"];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: compact ? 6 : 8,
      }}
    >
      {heights.map((h, i) => (
        <View
          key={i}
          style={{
            alignItems: "center",
            width: compact ? 10 : 18,
          }}
        >
          <View
            style={{
              width: compact ? 6 : 12,
              height: h,
              borderRadius: compact ? 3 : 4,
              backgroundColor: theme.bar,
              marginBottom: compact ? 4 : 8,
              opacity: 0.95,
            }}
          />
          <Text
            style={{
              color: theme.subText,
              fontSize: compact ? fs(9) : fs(10),
              fontWeight: compact ? "500" : "400",
            }}
          >
            {labels[i]}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default WeekBars;
