// Psychomatrix.tsx
// Компонент отображения: матрица + аккордеон-расшифровки

import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import { fs } from "@/constants/typography";
import {
  calculatePsychomatrix,
  Digit,
  PsychomatrixResult,
} from "@/data/psycho/psychomatrixCore";
import PsychoDisplay from "../ui/psycho";

interface PsychomatrixProps {
  birthDate: string;
  lang: string;
  style?: ViewStyle;
}

export const renderCell = (digit: Digit, counts: Record<Digit, number>) => {
  const count = counts[digit];
  const content = count > 0 ? new Array(count).fill(digit).join("") : "-";

  return (
    <View key={digit} style={styles.cell}>
      <Text style={styles.cellDigit}>{digit}</Text>
      <Text style={styles.cellValue}>{content}</Text>
    </View>
  );
};

export const Psychomatrix: React.FC<PsychomatrixProps> = ({
  birthDate,
  lang,
  style,
}) => {
  const [openBlocks, setOpenBlocks] = useState<Record<Digit, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
  });

  let data: PsychomatrixResult | null = null;
  let error: string | null = null;

  try {
    data = calculatePsychomatrix(birthDate);
  } catch (e: any) {
    error = e?.message ?? "Ошибка расчёта психоматрицы";
  }

  if (error || !data) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const { counts, sum1, sum2, sum3, sum4, is21Century } = data;

  // Порядок матрицы 3×3
  const grid: Digit[][] = [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ];

  const activeDigits: Digit[] = Object.keys(counts)
    .map((k) => parseInt(k, 10))
    .filter((n): n is Digit => n >= 1 && n <= 9);

  const toggleBlock = (digit: Digit) => {
    setOpenBlocks((prev) => ({ ...prev, [digit]: !prev[digit] }));
  };

  console.log("birthDate", birthDate);

  return (
    <>
      <PsychoDisplay
        birthDate={birthDate}
        style={style}
        shiftedBirthDate={birthDate}
        is21Century={is21Century}
        sum1={sum1}
        sum2={sum2}
        sum3={sum3}
        sum4={sum4}
        grid={grid}
        counts={counts}
        activeDigits={activeDigits}
        openBlocks={openBlocks}
        toggleBlock={toggleBlock}
        language={
          ["ru", "en", "kz", "tr"].includes(lang)
            ? (lang as "ru" | "en" | "kz" | "tr")
            : undefined
        }
      />
    </>
  );
};

// ======= СТИЛИ =======

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  cell: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  cellDigit: {
    fontSize: fs(12),
    color: "#000000",
    marginBottom: 2,
  },
  cellValue: {
    fontSize: fs(16),
    fontWeight: "600",
    color: "#000000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: fs(14),
  },
});

export default Psychomatrix;
