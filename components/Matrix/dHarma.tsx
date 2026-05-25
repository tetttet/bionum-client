import { fs, lh } from "@/constants/typography";
import { DharmaResult, getDharma } from "@/data/name/dharma";
import { formatDateReverse } from "@/utils/_func";
import React from "react";
import {
  Alert,
  Platform,
  Share,
  StyleSheet,
  Text,
  View
} from "react-native";
import MarkdownRender from "../cards/ui/MarkdownRender";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";

type Lang = "kz" | "tr" | "ru" | "en";

/**
 * DharmaCard
 * Красивый компонент для React Native, который принимает дату рождения и язык,
 * вычисляет число Дхармы через getDharma и отображает результат в "чёрной" (dark) теме.
 *
 * Пропсы:
 *  - birthDate: string (например "1989-11-20", "20.11", "5/3/1990")
 *  - lang: 'kz' | 'tr' | 'ru' | 'en' (по умолчанию 'ru')
 *  - compact?: boolean — если true, вывод более компактный
 */
export default function DharmaCard({
  birthDate,
  lang = "ru",
  compact = false,
}: {
  birthDate: string;
  lang?: Lang;
  compact?: boolean;
}) {
  const copy = {
    ru: {
      numberTitle: "Число Дхармы",
      birthDate: "Дата рождения:",
      dateTitle: "Дата",
      share: "Поделиться",
      copy: "Копировать",
      copiedTitle: "Скопировано",
      copiedBody: "Результат скопирован в буфер обмена.",
      copiedWebBody: "Текст результата скопирован в буфер обмена.",
      errorTitle: "Ошибка",
      shareError: "Не удалось поделиться результатом.",
      copyError: "Не удалось скопировать результат.",
      resultTitle: "Результат Дхармы",
    },
    en: {
      numberTitle: "Dharma Number",
      birthDate: "Birth Date:",
      dateTitle: "Date",
      share: "Share",
      copy: "Copy",
      copiedTitle: "Copied",
      copiedBody: "The result has been copied to the clipboard.",
      copiedWebBody: "The result text has been copied to the clipboard.",
      errorTitle: "Error",
      shareError: "Could not share the result.",
      copyError: "Could not copy the result.",
      resultTitle: "Dharma result",
    },
    kz: {
      numberTitle: "Дхарма саны",
      birthDate: "Туған күні:",
      dateTitle: "Күні",
      share: "Бөлісу",
      copy: "Көшіру",
      copiedTitle: "Көшірілді",
      copiedBody: "Нәтиже алмасу буферіне көшірілді.",
      copiedWebBody: "Нәтиже мәтіні алмасу буферіне көшірілді.",
      errorTitle: "Қате",
      shareError: "Нәтижемен бөлісу мүмкін болмады.",
      copyError: "Нәтижені көшіру мүмкін болмады.",
      resultTitle: "Дхарма нәтижесі",
    },
    tr: {
      numberTitle: "Dharma Sayısı",
      birthDate: "Doğum Tarihi:",
      dateTitle: "Tarih",
      share: "Paylaş",
      copy: "Kopyala",
      copiedTitle: "Kopyalandı",
      copiedBody: "Sonuç panoya kopyalandı.",
      copiedWebBody: "Sonuç metni panoya kopyalandı.",
      errorTitle: "Hata",
      shareError: "Sonuç paylaşılamadı.",
      copyError: "Sonuç kopyalanamadı.",
      resultTitle: "Dharma sonucu",
    },
  } as const;
  const t = copy[lang] ?? copy.ru;

  const formattedBirthDate = formatDateReverse(birthDate);

  const result: DharmaResult = getDharma(formattedBirthDate, lang);

  const onShare = async () => {
    try {
      const message = formatShareText(result, birthDate, t);
      if (Platform.OS === "web") {
        // На web используем Clipboard + alert
        await navigator.clipboard.writeText(message);
        Alert.alert(t.copiedTitle, t.copiedWebBody);
      } else {
        await Share.share({ message });
      }
    } catch {
      Alert.alert(t.errorTitle, t.shareError);
    }
  };

  const onCopy = async () => {
    try {
      const text = formatShareText(result, birthDate, t);
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(text);
        Alert.alert(t.copiedTitle, t.copiedBody);
      } else {
        // react-native Clipboard moved between versions; try the modern API
        // Для простоты — используем Share в мобильных; если нужен Clipboard, подключите @react-native-clipboard/clipboard
        await Share.share({ message: text });
      }
    } catch {
      Alert.alert(t.errorTitle, t.copyError);
    }
  };

  const title = (result && result.text.split("\n\n")[0]) || t.numberTitle;
  const body =
    (result && result.text.replace(title + "\n\n", "")) || result.text;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {t.numberTitle}
          {result.dharmaNumber ? `: ${result.dharmaNumber}` : ""}
        </Text>
        <Text style={styles.subheader}>{title}</Text>
        <Text style={styles.headerSubtitle}>
          {t.birthDate} {formattedBirthDate}
        </Text>
      </View>

      <View style={styles.body}>
        <MarkdownRender markdown={body} textColor="#000000" textSize={14} />
        <NumerologyDisclaimer lang={lang} />
      </View>
    </View>
  );
}

function formatShareText(
  res: DharmaResult,
  birthDate: string,
  t: {
    resultTitle: string;
    dateTitle?: string;
    numberTitle: string;
  },
) {
  const dateTitle = t.dateTitle ?? "Date";

  return `${t.resultTitle}\n\n${dateTitle}: ${birthDate}\n${t.numberTitle}: ${
    res.dharmaNumber
  }\n\n${res.text}`;
}

const styles = StyleSheet.create({
  card: {
    paddingTop: 26,
    marginTop: 30,
    elevation: 6,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    borderRadius: 4,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    marginBottom: 20,
  },
  cardCompact: {},
  header: {
    marginBottom: 8,
    marginLeft: 4,
  },
  headerTitle: {
    color: "#000000",
    fontSize: fs(22),
    width: "85%",
    fontWeight: "700",
  },
  subheader: {
    color: "#666666",
    fontSize: fs(14),
    lineHeight: lh(18),
    fontWeight: "700",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  headerSubtitle: {
    color: "#666666",
    fontSize: fs(12),
    marginTop: 4,
  },
  body: {
    marginTop: 6,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
  },
  bodyText: {
    color: "#000000",
    fontSize: fs(14),
    lineHeight: lh(18),
  },
  footer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stats: {
    flex: 1,
  },
  statLabel: {
    color: "#666666",
    fontSize: fs(12),
  },
  statValue: {
    color: "#000000",
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  button: {
    backgroundColor: "#369cef",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonGhost: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: fs(13),
    fontWeight: "600",
  },
  buttonGhostText: {
    color: "#666666",
  },
});
