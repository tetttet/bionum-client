import { Lang } from "@/data/name/nameNumber";
import { getPredictionText } from "@/data/prediction/predict";
import { getLifeCodeByAgeDate } from "@/utils/life";
import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import MarkdownRender from "../cards/ui/MarkdownRender";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import { fs } from "@/constants/typography";

type LifeCodeProps = {
  dateOfBirth: Date; // пример: new Date(1981, 10, 20)
  lang: Lang;
};

const START_AGE = 13;

function getAge(today: Date, birth: Date): number {
  let age = today.getFullYear() - birth.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}

function getPeriod(today: Date, birth: Date) {
  const start = new Date(
    today.getFullYear(),
    birth.getMonth(),
    birth.getDate(),
  );

  if (today < start) {
    start.setFullYear(start.getFullYear() - 1);
  }

  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);

  return { start, end };
}

export const LifeCodeByAge: React.FC<LifeCodeProps> = ({
  dateOfBirth,
  lang,
}) => {
  const today = useMemo(() => new Date(), []);

  const { age, period, result } = useMemo(() => {
    const age = getAge(today, dateOfBirth);
    const result = getLifeCodeByAgeDate(age, dateOfBirth);
    const period = getPeriod(today, dateOfBirth);

    return { age, period, result };
  }, [dateOfBirth, today]);

  const markdown = getPredictionText(
    result?.code ? result?.code.toString() : "0",
    lang,
  );

  let title = "Жизненный код года";
  let agee = "Возраст";
  let periood = "Период";
  let warning = `Расчёт начинается с ${START_AGE} лет`;
  if (lang === "en") {
    title = "Life Code of the Year";
    agee = "Age";
    periood = "Period";
    warning = `Calculation starts from ${START_AGE} years old`;
  } else if (lang === "tr") {
    title = "Yılın Hayat Kodu";
    agee = "Yaş";
    periood = "Dönem";
    warning = `Hesaplama ${START_AGE} yaşından itibaren başlar`;
  } else if (lang === "kz") {
    title = "Жылдың өмір коды";
    agee = "Жас";
    periood = "Период";
    warning = `Есептеу ${START_AGE} жастан басталады`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.text}>
        {agee}: {age}
      </Text>

      <Text style={styles.text}>
        {periood}: {period.start.toLocaleDateString()} —{" "}
        {period.end.toLocaleDateString()}
      </Text>

      {result?.code !== undefined && result?.code !== null ? (
        <View style={styles.codeBox}>
          <Text style={styles.code}>{result.code}</Text>
        </View>
      ) : (
        <Text style={styles.warning}>{warning}</Text>
      )}
      <MarkdownRender markdown={markdown} textColor="#000" />
      <NumerologyDisclaimer lang={lang} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    borderRadius: 18,
    marginBottom: 200,
  },
  title: {
    fontSize: fs(20),
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  text: {
    fontSize: fs(16),
    color: "#000",
    marginBottom: 6,
  },
  codeBox: {
    marginTop: 16,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3594de",
    alignItems: "center",
    justifyContent: "center",
  },
  code: {
    fontSize: fs(36),
    fontWeight: "700",
    color: "#fff",
  },
  warning: {
    marginTop: 12,
    color: "#f39c12",
  },
});
