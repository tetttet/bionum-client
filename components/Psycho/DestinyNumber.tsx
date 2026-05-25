import { PortraitLang } from "@/data/dummy/portrait";
import {
    DestinyNumberValue,
    calculateDestinyNumber,
    getDestinyNumberMarkdown,
} from "@/data/numerology/destinyNumberContent";
import { User } from "@/interface/User";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import MarkdownRender from "../cards/ui/MarkdownRender";
import { fs, lh } from "@/constants/typography";

const DestinyNumber = ({
  user,
  lang,
}: {
  user: User | null;
  lang: PortraitLang;
}) => {
  const birthDate = user?.date_of_birth ?? null;

  const uiText = {
    ru: {
      title: "Число судьбы",
      noBirthDate: "Не указана дата рождения",
      failed: "Не удалось рассчитать число судьбы",
    },
    en: {
      title: "Destiny Number",
      noBirthDate: "No birth date provided",
      failed: "Unable to calculate destiny number",
    },
    kz: {
      title: "Тағдыр саны",
      noBirthDate: "Туған күні көрсетілмеген",
      failed: "Тағдыр санын есептеу мүмкін болмады",
    },
    tr: {
      title: "Kader Sayısı",
      noBirthDate: "Doğum tarihi belirtilmedi",
      failed: "Kader sayısı hesaplanamadı",
    },
  } as const;

  const t = uiText[(lang as keyof typeof uiText) ?? "en"] ?? uiText.en;

  const destinyNumber = useMemo<DestinyNumberValue | null>(() => {
    if (!birthDate) return null;
    return calculateDestinyNumber(birthDate);
  }, [birthDate]);

  const markdown = useMemo(() => {
    if (!destinyNumber) return "";
    return getDestinyNumberMarkdown(lang, destinyNumber);
  }, [lang, destinyNumber]);

  if (!birthDate) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>{t.noBirthDate}</Text>
      </View>
    );
  }

  if (!destinyNumber) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholder}>{t.failed}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t.title}: {destinyNumber}
      </Text>

      <MarkdownRender markdown={markdown} textColor="#000000" />
      <NumerologyDisclaimer lang={lang} />
    </View>
  );
};

export default DestinyNumber;

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  title: {
    fontSize: fs(20),
    fontWeight: "700",
    marginBottom: 8,
  },
  number: {
    fontSize: fs(28),
    fontWeight: "800",
    marginBottom: 12,
  },
  markdown: {
    fontSize: fs(15),
    lineHeight: lh(22),
  },
  placeholder: {
    fontSize: fs(15),
    opacity: 0.7,
  },
});
