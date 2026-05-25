import { Lang } from "@/data/name/nameNumber";
import { MEANINGS } from "@/data/prediction/future";
import React, { memo, useMemo } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import { fs, lh } from "@/constants/typography";

type LifeCodeProps = {
  dateOfBirth: Date;
  lang: Lang;
  title?: string;
  showSteps?: boolean;
};

type MeaningItem = {
  title: string;
  text: string;
};

type CalcResult = {
  formattedDate: string;
  digits: number[];
  sumAllDigits: number;
  reducedSum: number;
  firstDigitOfDay: number;
  correction: number;
  afterCorrection: number;
  futurePrimary: number;
  futureReduced: number;
  meaningPrimary?: MeaningItem;
  meaningReduced?: MeaningItem;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = String(d.getFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

function toDigitsForDob(d: Date): number[] {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = String(d.getFullYear());
  const str = `${dd}${mm}${yyyy}`;
  return str.split("").map((c) => Number(c));
}

function sumDigits(n: number): number {
  const s = Math.abs(n).toString();
  let total = 0;
  for (const ch of s) total += Number(ch);
  return total;
}

function reduceToSingleDigit(n: number): number {
  let x = Math.abs(n);
  while (x >= 10) x = sumDigits(x);
  return x;
}

function getFirstDigitOfDay(d: Date): number {
  const day = d.getDate();
  if (day >= 10) return Math.floor(day / 10);
  return day;
}

function calculateFutureNumber(dateOfBirth: Date, lang: Lang): CalcResult {
  const formattedDate = formatDate(dateOfBirth);
  const digits = toDigitsForDob(dateOfBirth);

  const sumAllDigits = digits.reduce((a, b) => a + b, 0);
  const reducedSum = sumDigits(sumAllDigits);

  const firstDigitOfDay = getFirstDigitOfDay(dateOfBirth);
  const correction = 2 * firstDigitOfDay;
  const afterCorrection = Math.abs(sumAllDigits - correction);

  const futurePrimaryRaw = sumDigits(afterCorrection) === 0 ? 1 : sumDigits(afterCorrection);

  const futurePrimary =
    futurePrimaryRaw > 12
      ? reduceToSingleDigit(futurePrimaryRaw)
      : futurePrimaryRaw;

  const futureReduced =
    futurePrimary >= 10 ? reduceToSingleDigit(futurePrimary) : futurePrimary;

  const meaningPrimary = MEANINGS[futurePrimary]?.[lang];
  const meaningReduced = MEANINGS[futureReduced]?.[lang];

  return {
    formattedDate,
    digits,
    sumAllDigits,
    reducedSum,
    firstDigitOfDay,
    correction,
    afterCorrection,
    futurePrimary,
    futureReduced,
    meaningPrimary,
    meaningReduced,
  };
}

const FutureNumber = memo(
  ({
    dateOfBirth,
    lang,
    title = "Число будущего",
    showSteps = false,
  }: LifeCodeProps) => {
    const r = useMemo(
      () => calculateFutureNumber(dateOfBirth, lang),
      [dateOfBirth, lang],
    );

    const digitsExpr = r.digits.join(" + ");
    const step1 = `${digitsExpr} = ${r.sumAllDigits}`;
    const step2 = `${Math.floor(r.sumAllDigits / 10)} + ${r.sumAllDigits % 10} = ${r.reducedSum}`;
    const step3 = `2 × первая цифра дня (${r.firstDigitOfDay}) = ${r.correction}`;
    const step4 = `${r.sumAllDigits} − ${r.correction} = ${r.afterCorrection}`;
    const afterDigits = `${r.afterCorrection}`.split("").join(" + ");
    const step5 = `${afterDigits} = ${sumDigits(r.afterCorrection)} → ${r.futurePrimary}${
      r.futurePrimary >= 10 ? ` (${r.futureReduced})` : ""
    }`;

    let titletext = "Число будущего";
    let periood = "Дата рождения";
    let desc = "Значение основного числа";
    let desc1 = "Значение сведённого числа";
    let calculation = "Расчёт";
    let reduction = "Сведение";
    let missingPrimary = `Для числа ${r.futurePrimary} пока нет описания в словаре.`;
    let missingReduced = `Для числа ${r.futureReduced} пока нет описания в словаре.`;
    if (lang === "en") {
      titletext = "Future Number";
      periood = "Date of Birth";
      desc = "Meaning of the primary number";
      desc1 = "Meaning of the reduced number";
      calculation = "Calculation";
      reduction = "Reduction";
      missingPrimary = `No dictionary description yet for number ${r.futurePrimary}.`;
      missingReduced = `No dictionary description yet for number ${r.futureReduced}.`;
    } else if (lang === "tr") {
      titletext = "Geleceğin Sayısı";
      periood = "Doğum Tarihi";
      desc = "Birincil sayının anlamı";
      desc1 = "Sadeleştirilmiş sayının anlamı";
      calculation = "Hesaplama";
      reduction = "İndirgeme";
      missingPrimary = `${r.futurePrimary} sayısı için henüz sözlük açıklaması yok.`;
      missingReduced = `${r.futureReduced} sayısı için henüz sözlük açıklaması yok.`;
    } else if (lang === "kz") {
      titletext = "Болашақ саны";
      periood = "Туған күні";
      desc = "Негізгі санның мағынасы";
      desc1 = "Қысқартылған санның мағынасы";
      calculation = "Есептеу";
      reduction = "Қысқарту";
      missingPrimary = `${r.futurePrimary} саны үшін сөздік сипаттама әлі жоқ.`;
      missingReduced = `${r.futureReduced} саны үшін сөздік сипаттама әлі жоқ.`;
    }

    return (
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {titletext}
            {": "}
            {`${r.futurePrimary}${r.futurePrimary >= 10 ? `(${r.futureReduced})` : ""}`}
          </Text>
          <Text style={styles.subtitle}>{periood}</Text>

          <View style={styles.row}>
            <Text style={styles.date}>{r.formattedDate}</Text>
            {/* <Chip
              label={`№ ${r.futurePrimary}${r.futurePrimary >= 10 ? ` (${r.futureReduced})` : ""}`}
            /> */}
          </View>

          {showSteps && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{calculation}</Text>

              <View style={styles.step}>
                <Text style={styles.stepLabel}>1</Text>
                <Text style={styles.stepText}>{step1}</Text>
              </View>

              <View style={styles.step}>
                <Text style={styles.stepLabel}>2</Text>
                <Text style={styles.stepText}>
                  {reduction}: {step2}
                </Text>
              </View>

              <View style={styles.step}>
                <Text style={styles.stepLabel}>3</Text>
                <Text style={styles.stepText}>{step3}</Text>
              </View>

              <View style={styles.step}>
                <Text style={styles.stepLabel}>4</Text>
                <Text style={styles.stepText}>{step4}</Text>
              </View>

              <View style={styles.step}>
                <Text style={styles.stepLabel}>5</Text>
                <Text style={styles.stepText}>{step5}</Text>
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{desc}</Text>
            {r.meaningPrimary ? (
              <>
                <Text style={styles.meaningTitle}>
                  {r.futurePrimary} — {r.meaningPrimary.title}
                </Text>
                <Text style={styles.meaningText}>{r.meaningPrimary.text}</Text>
              </>
            ) : (
              <Text style={styles.meaningText}>{missingPrimary}</Text>
            )}
          </View>

          {r.futurePrimary !== r.futureReduced && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{desc1}</Text>
              {r.meaningReduced ? (
                <>
                  <Text style={styles.meaningTitle}>
                    {r.futureReduced} — {r.meaningReduced.title}
                  </Text>
                  <Text style={styles.meaningText}>
                    {r.meaningReduced.text}
                  </Text>
                </>
              ) : (
                <Text style={styles.meaningText}>{missingReduced}</Text>
              )}
            </View>
          )}

          <NumerologyDisclaimer lang={lang} />
        </View>
      </View>
    );
  },
);

FutureNumber.displayName = "FutureNumber";

export default FutureNumber;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: Platform.select({ ios: 18, android: 16, default: 16 }),
  },
  card: {
    padding: 0,
    paddingBottom: 60,
  },
  title: {
    fontSize: fs(22),
    fontWeight: "700",
    color: "#111111",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: fs(12),
    color: "#666666",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  date: {
    fontSize: fs(18),
    fontWeight: "600",
    color: "#111111",
  },
  chip: {
    backgroundColor: "#3594de",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#3594de",
  },
  chipText: {
    color: "#ffffff",
    fontSize: fs(13),
    fontWeight: "700",
  },
  section: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  sectionTitle: {
    fontSize: fs(13),
    fontWeight: "700",
    color: "#111111",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  step: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  stepLabel: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#3594de",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: lh(22),
    fontSize: fs(12),
    fontWeight: "700",
    overflow: "hidden",
  },
  stepText: {
    flex: 1,
    fontSize: fs(14),
    color: "#222222",
    lineHeight: lh(20),
  },
  meaningTitle: {
    fontSize: fs(16),
    fontWeight: "800",
    color: "#3594de",
    marginBottom: 6,
  },
  meaningText: {
    fontSize: fs(14),
    color: "#333333",
    lineHeight: lh(20),
  },
});
