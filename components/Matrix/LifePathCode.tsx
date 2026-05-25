// components/LifePathCode.js
import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import { lifePathMeanings } from "@/data/matrix/lifePathMeanings";
import { User } from "@/interface/User";
import {
  formatDateMatrix,
  parseDateString,
  reduceToDigit,
} from "@/utils/_func";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import { fs, lh } from "@/constants/typography";

const uiText = {
  ru: {
    noUser: "Нет данных пользователя.",
    screenTitle: "Код жизненного пути",
    invalidDate: "Невозможно распознать дату:",
    supportedFormats:
      "Поддерживаемые форматы: YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY",
    birthDate: "Дата рождения",
    code: "Код",
    symbol: "Символ",
    keywords: "Ключевые слова",
    motto: "Девиз",
    trap: "Но есть ловушка",
    day: "День",
    month: "Месяц",
    year: "Год",
    sumBeforeReduction: "Сумма (перед редукцией)",
    showDetails: "Показать детали",
    details: "Детали",
    detailsDate: "Дата",
    detailsCode: "Код",
  },
  en: {
    noUser: "No user data.",
    screenTitle: "Life Path Code",
    invalidDate: "Unable to parse date:",
    supportedFormats: "Supported formats: YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY",
    birthDate: "Date of birth",
    code: "Code",
    symbol: "Symbol",
    keywords: "Keywords",
    motto: "Motto",
    trap: "But there is a trap",
    day: "Day",
    month: "Month",
    year: "Year",
    sumBeforeReduction: "Sum (before reduction)",
    showDetails: "Show details",
    details: "Details",
    detailsDate: "Date",
    detailsCode: "Code",
  },
  tr: {
    noUser: "Kullanıcı verisi yok.",
    screenTitle: "Yaşam Yolu Kodu",
    invalidDate: "Tarih çözümlenemedi:",
    supportedFormats:
      "Desteklenen formatlar: YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY",
    birthDate: "Doğum tarihi",
    code: "Kod",
    symbol: "Sembol",
    keywords: "Anahtar kelimeler",
    motto: "Motto",
    trap: "Ama bir tuzak var",
    day: "Gün",
    month: "Ay",
    year: "Yıl",
    sumBeforeReduction: "Toplam (indirgeme öncesi)",
    showDetails: "Detayları göster",
    details: "Detaylar",
    detailsDate: "Tarih",
    detailsCode: "Kod",
  },
  kz: {
    noUser: "Пайдаланушы деректері жоқ.",
    screenTitle: "Өмір жолы коды",
    invalidDate: "Күнді тану мүмкін емес:",
    supportedFormats:
      "Қолдау көрсетілетін форматтар: YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY",
    birthDate: "Туған күні",
    code: "Код",
    symbol: "Символ",
    keywords: "Тірек сөздер",
    motto: "Ұран",
    trap: "Бірақ бір тұзақ бар",
    day: "Күн",
    month: "Ай",
    year: "Жыл",
    sumBeforeReduction: "Қосынды (редукцияға дейін)",
    showDetails: "Толығырақ көрсету",
    details: "Толығырақ",
    detailsDate: "Күні",
    detailsCode: "Код",
  },
} as const;

/**
 * Пропсы:
 *  - user: { date_of_birth: string, first_name?, last_name?, email?, ... } | null
 *
 * Ожидаемые форматы date_of_birth:
 *  - ISO: "1985-12-10"
 *  - "10.12.1985" или "10/12/1985"
 *  - "12/10/1985" (если ambiguous, функция старается угадать по длине)
 *
 * Алгоритм:
 * 1) Извлекаем день, месяц, год.
 * 2) Сводим отдельно день, месяц, год до однозначных чисел (например 10 -> 1, 12 -> 3, 1985 -> 5).
 * 3) Складываем три числа. Если итог равен 11 или 22 — оставляем как есть, иначе сводим до однозначного.
 */

const LifePathCode = ({
  user,
  lang,
  theme,
}: {
  user: User | null;
  lang: PortraitLang;
  theme: Theme;
}) => {
  const t = uiText[lang as keyof typeof uiText] ?? uiText.ru;

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.muted}>{t.noUser}</Text>
      </View>
    );
  }

  const dobRaw = user.date_of_birth ?? "";
  const parsed = parseDateString(dobRaw ? { s: dobRaw } : { s: "" });

  if (!parsed) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t.screenTitle}</Text>
        <Text style={styles.muted}>
          {t.invalidDate} {String(dobRaw)}
        </Text>
        <Text style={styles.hint}>{t.supportedFormats}</Text>
      </View>
    );
  }

  const { day, month, year } = parsed;
  const dayReduced = reduceToDigit({ n: day });
  const monthReduced = reduceToDigit({ n: month });
  const yearReduced = reduceToDigit({ n: year });
  const total = dayReduced + monthReduced + yearReduced;

  const final = (
    total === 11 || total === 22 ? total : reduceToDigit({ n: total })
  ) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22;

  const meanings = lifePathMeanings({ lang, final });

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={[styles.header, { color: theme.title, marginLeft: 4 }]}>
          {t.screenTitle}
        </Text>

        <Text style={[styles.name, { color: theme.text, marginLeft: 4 }]}>
          {user.first_name || ""} {user.middle_name || ""}{" "}
          {user.last_name || ""}
        </Text>

        <View style={styles.row}>
          <View style={styles.smallCard}>
            <Text style={[styles.smallLabel, { color: theme.subtitle }]}>
              {t.birthDate}
            </Text>
            <Text style={[styles.smallValue, { color: theme.text }]}>
              {formatDateMatrix({ d: day, m: month, y: year })}
            </Text>
          </View>

          <View style={styles.bigCard}>
            <Text style={[styles.bigLabel, { color: theme.subtitle }]}>
              {t.code}
            </Text>
            <Text style={[styles.bigValue, { color: "#369cef" }]}>{final}</Text>
          </View>
        </View>

        <View style={styles.descriptionBox}>
          {meanings.title ? (
            <Text style={[styles.descriptionTitle, { color: theme.text }]}>
              {meanings.title}
            </Text>
          ) : null}

          {meanings.text ? (
            <Text style={[styles.descriptionText, { color: theme.text }]}>
              {meanings.text}
            </Text>
          ) : null}

          <View style={{ marginVertical: 10, marginTop: 14 }}>
            {meanings.symbol ? (
              <Text style={[styles.descriptionTitle, { color: theme.text }]}>
                {t.symbol} — {meanings.symbol}
              </Text>
            ) : null}

            {meanings.keyword ? (
              <Text style={[styles.descriptionTitle, { color: theme.text }]}>
                {t.keywords} — {meanings.keyword}
              </Text>
            ) : null}

            {meanings.motto ? (
              <Text style={[styles.descriptionTitle, { color: theme.text }]}>
                {t.motto} — {meanings.motto}
              </Text>
            ) : null}
          </View>

          {meanings.text2 ? (
            <Text style={[styles.descriptionText, { color: theme.text }]}>
              {meanings.text2}
            </Text>
          ) : null}

          {meanings.trap ? (
            <Text style={[styles.descriptionText, { color: theme.text }]}>
              {t.trap} — {meanings.trap}
            </Text>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {t.day} → {dayReduced} · {t.month} → {monthReduced} · {t.year} →{" "}
            {yearReduced}
          </Text>
          <Text style={styles.meta}>
            {t.sumBeforeReduction} → {total}
          </Text>
        </View>

        <NumerologyDisclaimer lang={lang} style={styles.disclaimer} />

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() =>
            Alert.alert(
              t.details,
              `${t.detailsDate}: ${formatDateMatrix({
                d: day,
                m: month,
                y: year,
              })}\n${t.detailsCode}: ${final}\n(${t.day}:${dayReduced} + ${t.month}:${monthReduced} + ${t.year}:${yearReduced} = ${total})`,
            )
          }
        >
          <Text style={styles.buttonText}>{t.showDetails}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

/* ------------------ Стили ------------------ */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 760,
    borderRadius: 14,
    elevation: 6,
  },
  header: {
    fontSize: fs(24),
    fontWeight: "800",
    marginBottom: 4,
    width: "85%",
  },
  name: {
    fontSize: fs(16),
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "flex-start",
  },
  bigCard: {
    width: 120,
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  smallLabel: {
    fontSize: fs(12),
  },
  smallValue: {
    fontSize: fs(14),
    marginTop: 4,
  },
  bigLabel: {
    fontSize: fs(12),
  },
  bigValue: {
    color: "#fff",
    fontSize: fs(36),
    fontWeight: "800",
    marginTop: 6,
  },
  descriptionBox: {
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  descriptionTitle: {
    fontSize: fs(15),
    fontWeight: "700",
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: fs(13),
    lineHeight: lh(18),
  },
  metaRow: {
    marginTop: 10,
  },
  disclaimer: {
    marginTop: 16,
  },
  meta: {
    color: "#fff",
    marginLeft: 4,
    fontSize: fs(12),
  },
  button: {
    marginTop: 12,
    backgroundColor: "#369cef",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  title: {
    fontSize: fs(18),
    fontWeight: "700",
    marginBottom: 8,
  },
  muted: {
    color: "#6b7f93",
  },
  hint: {
    color: "#516a82",
    fontSize: fs(12),
    marginTop: 6,
  },
});

export default LifePathCode;
