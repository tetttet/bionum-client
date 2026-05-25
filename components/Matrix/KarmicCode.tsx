import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import { buildKarmicItems } from "@/data/karmic/karmic";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import { fs, lh } from "@/constants/typography";

type Props = {
  birthDate: string;
  lang: PortraitLang;
  theme: Theme;
};

const DOUBLE_CODES = [
  "00",
  "11",
  "22",
  "33",
  "44",
  "55",
  "66",
  "77",
  "88",
  "99",
];

const KarmicCode = ({ birthDate, lang }: Props) => {
  // ---------- utils ----------
  // const calculateKarmicNumber = (date: string): string => {
  //   const [day, month, year] = date.split(".");
  //   const first = `${day}${month}`;
  //   return String(Number(first) * Number(year));
  // };
  const calculateKarmicNumber = (date: string): string => {
    const [day, month, year] = date.split(".");
    const first = `${day}${month}`;

    return String(Number(first) * Number(year));
  };

  const splitToCodes = (value: string): string[] => {
    const result: string[] = [];
    let i = 0;

    while (i < value.length) {
      const pair = value.slice(i, i + 2);
      if (DOUBLE_CODES.includes(pair)) {
        result.push(pair);
        i += 2;
      } else {
        result.push(value[i]);
        i += 1;
      }
    }
    return result;
  };

  // ---------- memo ----------
  const karmicNumber = useMemo(() => {
    if (!birthDate) return null;
    return calculateKarmicNumber(birthDate);
  }, [birthDate]);

  const karmicItems = useMemo(() => {
    if (!karmicNumber) return [];
    const codes = splitToCodes(karmicNumber);
    return buildKarmicItems(codes, lang);
  }, [karmicNumber, lang]);

  // ---------- empty ----------
  if (!birthDate) {
    const emptyText =
      lang === "en"
        ? "No user data"
        : lang === "kz"
          ? "Пайдаланушы деректері жоқ"
          : lang === "tr"
            ? "Kullanıcı verisi yok"
            : "Нет данных пользователя";
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  }

  let title = "Кармический код";
  let pointTaskLabel = "Суть задачи";
  let howShowLabel = "Как проявляется";
  let whatToDoLabel = "Что делать";

  if (lang === "en") {
    title = "Karmic Code";
    pointTaskLabel = "Essence of the Task";
    howShowLabel = "How It Manifests";
    whatToDoLabel = "What to Do";
  } else if (lang === "kz") {
    title = "Кармикалық код";
    pointTaskLabel = "Міндеттің мәні";
    howShowLabel = "Қалай көрінеді";
    whatToDoLabel = "Не істеу керек";
  } else if (lang === "tr") {
    title = "Karmik Kod";
    pointTaskLabel = "Görevin Özeti";
    howShowLabel = "Nasıl Kendini Gösterir";
    whatToDoLabel = "Ne Yapmalı";
  }

  const capitalizeFirst = (text?: string) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // ---------- render ----------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{title}</Text>
        <Text style={styles.mainCode}>{karmicNumber}</Text>
      </View>

      {karmicItems.map((item, index) => (
        <View key={`${item.code}-${index}`} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>{pointTaskLabel}</Text>
            <Text style={styles.blockText}>
              {capitalizeFirst(item.pointTask)}
            </Text>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>{howShowLabel}</Text>
            <Text style={styles.blockText}>
              {capitalizeFirst(item.howShow)}
            </Text>
          </View>

          <View style={styles.block}>
            <Text style={styles.blockTitle}>{whatToDoLabel}</Text>
            <Text style={styles.blockText}>
              {capitalizeFirst(item.whatToDo)}
            </Text>
          </View>

          <NumerologyDisclaimer lang={lang} />
        </View>
      ))}
    </ScrollView>
  );
};

export default KarmicCode;

// ---------- styles ----------
const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },

  header: {
    marginBottom: 24,
    alignItems: "center",
  },

  label: {
    fontSize: fs(14),
    color: "#8E8E93",
    marginBottom: 4,
  },

  mainCode: {
    fontSize: fs(32),
    fontWeight: "700",
    color: "#111111",
  },

  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  title: {
    fontSize: fs(18),
    fontWeight: "600",
    color: "#111111",
    marginBottom: 12,
  },

  block: {
    marginBottom: 12,
  },

  blockTitle: {
    fontSize: fs(15),
    fontWeight: "700",
    color: "#1e1e1e",
    marginBottom: 4,
  },

  blockText: {
    fontSize: fs(15),
    color: "#1C1C1E",
    lineHeight: lh(20),
  },

  empty: {
    padding: 24,
    alignItems: "center",
  },

  emptyText: {
    color: "#8E8E93",
    fontSize: fs(14),
  },
});
