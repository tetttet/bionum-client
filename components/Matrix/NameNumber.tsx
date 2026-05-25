import { Theme } from "@/constants/theme";
import {
  calculateNameNumber,
  detectNameLanguage,
  type Lang,
} from "@/data/name/nameNumber";
import {
  NUMBER_MEANINGS_EN,
  NUMBER_MEANINGS_KZ,
  NUMBER_MEANINGS_RU,
  NUMBER_MEANINGS_TR,
} from "@/data/name/dbNUMBER_MEANINGS";
import { User } from "@/interface/User";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import { fs } from "@/constants/typography";

const buildGivenName = (user: User): string =>
  user.first_name.trim().replace(/\s+/g, " ");

const getSelectedNameLang = (lang: string): Lang | null => {
  const value = String(lang || "").toLowerCase();

  if (value.includes("ru")) return "ru";
  if (value.includes("en")) return "en";
  if (value.includes("kz") || value.includes("kk")) return "kz";
  if (value.includes("tr")) return "tr";

  return null;
};

const getCalculationLang = (name: string, selectedLang: string): Lang => {
  const detectedLang = detectNameLanguage(name);
  const appLang = getSelectedNameLang(selectedLang);

  if (appLang === "kz" && detectedLang === "ru") return "kz";
  if (appLang === "tr" && detectedLang === "en") return "tr";

  return detectedLang;
};

const NUMBER_MEANINGS_BY_LANG: Record<Lang, Record<number, string>> = {
  ru: NUMBER_MEANINGS_RU,
  en: NUMBER_MEANINGS_EN,
  kz: NUMBER_MEANINGS_KZ,
  tr: NUMBER_MEANINGS_TR,
};

const getMeaningByInterfaceLang = (number: number, lang: string) => {
  const displayLang = getSelectedNameLang(lang) ?? "ru";

  return (
    NUMBER_MEANINGS_BY_LANG[displayLang]?.[number] ??
    NUMBER_MEANINGS_RU[number] ??
    NUMBER_MEANINGS_EN[number]
  );
};

const NameNumber = ({
  user,
  lang,
  theme,
}: {
  user: User | null;
  lang: string;
  theme: Theme;
}) => {
  const copy = {
    ru: {
      title: "Число имени",
      fullName: "Имя",
      masterNumber: "Мастер-число",
      meaning: "Значение",
      noData: "Нет данных пользователя.",
    },
    en: {
      title: "Name Number",
      fullName: "First name",
      masterNumber: "Master Number",
      meaning: "Meaning",
      noData: "No user data.",
    },
    kz: {
      title: "Есім саны",
      fullName: "Аты",
      masterNumber: "Шебер саны",
      meaning: "Мағынасы",
      noData: "Пайдаланушы деректері жоқ.",
    },
    tr: {
      title: "İsim Sayısı",
      fullName: "Ad",
      masterNumber: "Usta Sayı",
      meaning: "Anlamı",
      noData: "Kullanıcı verisi yok.",
    },
  } as const;
  const displayLang = getSelectedNameLang(lang) ?? "ru";
  const t = copy[displayLang] ?? copy.ru;

  const result = useMemo(() => {
    if (!user) return null;

    const givenName = buildGivenName(user);
    if (!givenName) return null;

    const nameLang = getCalculationLang(givenName, lang);

    return calculateNameNumber(givenName, nameLang);
  }, [lang, user]);

  const meaning = useMemo(() => {
    if (!result) return undefined;

    return getMeaningByInterfaceLang(result.reduced, displayLang);
  }, [displayLang, result]);

  if (!user || !result)
    return (
      <View style={styles.center}>
        <Text style={[styles.text, { color: theme.text }]}>{t.noData}</Text>
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, { color: theme.title }]}>{t.title}</Text>

      {/* Given name */}
      <View style={styles.block}>
        <Text style={[styles.label, { color: theme.sectionLabel }]}>
          {t.fullName}
        </Text>
        <Text style={[styles.text, { color: theme.text }]}>
          {result.inputName}
        </Text>
      </View>

      <View style={styles.finalBlock}>
        <Text style={[styles.finalNumber]}>{result.reduced}</Text>
        {result.isMasterNumber && (
          <Text style={[styles.masterNumber, { color: theme.title }]}>
            {t.masterNumber}
          </Text>
        )}
      </View>

      {/* Meaning */}
      {meaning && (
        <View style={styles.block}>
          <Text style={[styles.label, { color: theme.sectionLabel }]}>
            {t.meaning}
          </Text>
          <Text style={[styles.text, { color: theme.text }]}>
            {result.reduced} - {meaning}
          </Text>
        </View>
      )}

      <NumerologyDisclaimer
        lang={lang}
        style={styles.pageDisclaimer}
        textStyle={styles.pageDisclaimerText}
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default NameNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  block: {
    marginBottom: 20,
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  finalBlock: {
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  title: {
    fontSize: fs(24),
    fontWeight: "800",
    marginBottom: 14,
    width: "85%",
  },
  label: {
    fontSize: fs(13),
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  text: {
    fontSize: fs(16),
  },
  letter: {
    fontSize: fs(16),
    marginBottom: 4,
  },
  letterBold: {
    fontSize: fs(18),
    fontWeight: "700",
  },
  bigNumber: {
    fontSize: fs(32),
    fontWeight: "800",
  },
  finalNumber: {
    color: "#2982da",
    fontSize: fs(40),
    fontWeight: "900",
  },
  masterNumber: {
    marginTop: 6,
    fontSize: fs(18),
    fontWeight: "600",
  },
  pageDisclaimer: {
    width: "100%",
    marginTop: 4,
  },
  pageDisclaimerText: {
    textAlign: "left",
  },
});
