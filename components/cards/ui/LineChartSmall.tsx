// LineChartSmall.tsx
import { healthCardTheme, ThemeType } from "@/constants/theme";
import React from "react";
import { Dimensions } from "react-native";
import Svg, { Defs, Line, LinearGradient, Path, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(360, width - 32);

interface LineChartSmallProps {
  t: ThemeType;
  compact?: boolean;
}

const LineChartSmall = ({ t, compact = false }: LineChartSmallProps) => {
  const theme = healthCardTheme[t];

  const path = compact
    ? "M0 50 C30 45 60 40 90 38 C120 36 150 32 180 22 C210 12 240 10 300 6"
    : "M0 80 C30 70 60 60 90 58 C120 56 150 50 180 32 C210 12 240 10 300 6";

  const height = compact ? 60 : 90;

  return (
    <Svg
      width={CARD_WIDTH - 48}
      height={height}
      viewBox="0 0 300 90"
      style={{
        marginLeft: -150,
        marginTop: compact ? 20 : 30,
      }}
    >
      <Defs>
        {/* Градиент линии */}
        <LinearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#4facfe" />
          <Stop offset="100%" stopColor="#00f2fe" />
        </LinearGradient>
        {/* Градиент для заливки под линией */}
        <LinearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#4facfe" stopOpacity={0.3} />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </LinearGradient>
      </Defs>

      {/* baseline */}
      <Line
        x1="0"
        y1={compact ? 50 : 80}
        x2="300"
        y2={compact ? 50 : 80}
        stroke={theme.bar}
        strokeWidth={0.5}
        strokeDasharray="2,4"
        opacity={0.6}
      />

      {/* заливка под линией */}
      <Path d={`${path} L300 ${height} L0 ${height} Z`} fill="url(#fillGrad)" />

      {/* main line */}
      <Path
        d={path}
        fill="none"
        stroke="url(#lineGrad)"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default LineChartSmall;
