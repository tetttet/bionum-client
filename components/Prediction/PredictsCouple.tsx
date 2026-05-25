import type { Lang } from "@/data/name/nameNumber";
import { coupleMeaning } from "@/data/prediction/couple";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import { fs, lh } from "@/constants/typography";

type Props = {
  dateOfBirth: Date; // 1-й партнер
  lang: Lang;
  title?: string;
};

type FutureCalc = {
  sumDigitsAll: number;
  firstDigitOfDay: number;
  doubledFirstDigit: number;
  afterSubtract: number;
  reduced: number;
  futureNumber: number; // 1..12
};

const RANGE_12 = (n: number) => ((n - 1) % 12) + 1;

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDob(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function formatDobString(value: string) {
  const [yyyy, mm, dd] = value.split("-");
  return `${dd}.${mm}.${yyyy}`;
}

function toLocalDateString(date: Date) {
  const yyyy = date.getFullYear();
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  return `${yyyy}-${mm}-${dd}`;
}

function parseLocalDateString(value: string) {
  const [yyyy, mm, dd] = value.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd, 12, 0, 0, 0);
}

/** Сумма цифр числа */
function digitSum(n: number) {
  return `${Math.abs(n)}`
    .split("")
    .reduce((acc, ch) => acc + (ch.charCodeAt(0) - 48), 0);
}

/** Сумма всех цифр даты: DDMMYYYY */
function sumDigitsOfDate(d: Date) {
  const s = `${pad2(d.getDate())}${pad2(d.getMonth() + 1)}${d.getFullYear()}`;
  return s.split("").reduce((acc, ch) => acc + (ch.charCodeAt(0) - 48), 0);
}

/** Первая цифра дня рождения */
function firstDigitDay(d: Date) {
  const day = d.getDate();
  if (day < 10) return day;
  return Math.floor(day / 10);
}

function calcFutureNumber(d: Date): FutureCalc {
  const S = sumDigitsOfDate(d);
  const first = firstDigitDay(d);
  const k = first * 2;
  const R = S - k;

  let reduced = Math.abs(R);
  reduced = reduceToSingleDigit(reduced);
  if (reduced === 0) {
    reduced = 1;
  }

  return {
    sumDigitsAll: S,
    firstDigitOfDay: first,
    doubledFirstDigit: k,
    afterSubtract: R,
    reduced,
    futureNumber: reduced,
  };
}

function calcCoupleFutureNumber(a: number, b: number) {
  const normalizedA = reduceToSingleDigit(a);
  const normalizedB = reduceToSingleDigit(b);

  let result = reduceToSingleDigit(normalizedA + normalizedB);
  if (result === 0) {
    result = 1;
  }
  return result;
}

function reduceToSingleDigit(n: number) {
  let reduced = Math.abs(n);

  while (reduced >= 10) {
    reduced = digitSum(reduced);
  }

  return reduced;
}

const translations = {
  ru: {
    title: "Совместимость пары",
    badge: "56+",
    subtitle:
      "Данный прогноз наступает после 56 лет. Число будущего активнее проявляется, когда опыт и внутренняя трансформация пары становятся заметнее.",
    partner1: "Партнёр 1",
    partner2: "Партнёр 2",
    dateOfBirth: "Дата рождения",
    futureNumber: "Число будущего",
    chooseDate: "Выбрать дату",
    changeDate: "Изменить дату",
    coupleFutureNumber: "Число будущего пары",
    chooseSecondPartner: "Выбери дату 2-го партнёра",
    forecastPlaceholder: "После выбора даты появится прогноз совместимости.",
    showDetails: "Показать детали расчёта",
    hideDetails: "Скрыть детали расчёта",
    details: "Детали",
    selectPartner2Dob: "Выберите дату рождения партнёра 2",
    done: "Готово",
    empty: "—",
  },
  en: {
    title: "Couple Compatibility",
    badge: "56+",
    subtitle:
      "This forecast comes after 56 years. The future number becomes more active as the couple's experience and inner transformation become more noticeable.",
    partner1: "Partner 1",
    partner2: "Partner 2",
    dateOfBirth: "Date of birth",
    futureNumber: "Future number",
    chooseDate: "Select date",
    changeDate: "Change date",
    coupleFutureNumber: "Couple future number",
    chooseSecondPartner: "Select partner 2's date",
    forecastPlaceholder:
      "A compatibility forecast will appear after selecting the date.",
    showDetails: "Show calculation details",
    hideDetails: "Hide calculation details",
    details: "Details",
    selectPartner2Dob: "Select partner 2's date of birth",
    done: "Done",
    empty: "—",
  },
  tr: {
    title: "Çift Uyumluluğu",
    badge: "56+",
    subtitle:
      "Bu tahmin 56 yaşından sonra gerçekleşir. Gelecek sayısı, çiftin deneyimi ve içsel dönüşümü daha belirgin hale geldikçe daha aktif hale gelir.",
    partner1: "1. Partner",
    partner2: "2. Partner",
    dateOfBirth: "Doğum tarihi",
    futureNumber: "Gelecek sayısı",
    chooseDate: "Tarih seç",
    changeDate: "Tarihi değiştir",
    coupleFutureNumber: "Çiftin gelecek sayısı",
    chooseSecondPartner: "2. partnerin tarihini seç",
    forecastPlaceholder: "Tarih seçildikten sonra uyumluluk yorumu görünecek.",
    showDetails: "Hesaplama detaylarını göster",
    hideDetails: "Hesaplama detaylarını gizle",
    details: "Detaylar",
    selectPartner2Dob: "2. partnerin doğum tarihini seçin",
    done: "Tamam",
    empty: "—",
  },
  kz: {
    title: "Жұп үйлесімділігі",
    badge: "56+",
    subtitle:
      "Бұл болжам 56 жастан кейін басталады. Болашақ саны жұптың тәжірибесі мен ішкі трансформациясы айқындала түскен сайын белсенді болады.",
    partner1: "1-серіктес",
    partner2: "2-серіктес",
    dateOfBirth: "Туған күні",
    futureNumber: "Болашақ саны",
    chooseDate: "Күнді таңдау",
    changeDate: "Күнді өзгерту",
    coupleFutureNumber: "Жұптың болашақ саны",
    chooseSecondPartner: "2-серіктестің күнін таңдаңыз",
    forecastPlaceholder: "Күн таңдалғаннан кейін үйлесімділік болжамы шығады.",
    showDetails: "Есептеу егжей-тегжейін көрсету",
    hideDetails: "Есептеу егжей-тегжейін жасыру",
    details: "Егжей-тегжей",
    selectPartner2Dob: "2-серіктестің туған күнін таңдаңыз",
    done: "Дайын",
    empty: "—",
  },
} satisfies Record<
  "ru" | "en" | "tr" | "kz",
  {
    title: string;
    badge: string;
    subtitle: string;
    partner1: string;
    partner2: string;
    dateOfBirth: string;
    futureNumber: string;
    chooseDate: string;
    changeDate: string;
    coupleFutureNumber: string;
    chooseSecondPartner: string;
    forecastPlaceholder: string;
    showDetails: string;
    hideDetails: string;
    details: string;
    selectPartner2Dob: string;
    done: string;
    empty: string;
  }
>;

const PredictsCouple: React.FC<Props> = ({ dateOfBirth, lang, title }) => {
  const [partner2Dob, setPartner2Dob] = useState<string | null>(null);
  const [pickerDate, setPickerDate] = useState<Date>(
    new Date(1990, 0, 1, 12, 0, 0, 0),
  );
  const [showPicker, setShowPicker] = useState(false);

  const t =
    translations[(lang as "ru" | "en" | "tr" | "kz") ?? "ru"] ??
    translations.ru;

  const p1 = useMemo(() => calcFutureNumber(dateOfBirth), [dateOfBirth]);

  const p2 = useMemo(
    () =>
      partner2Dob ? calcFutureNumber(parseLocalDateString(partner2Dob)) : null,
    [partner2Dob],
  );

  const couple = useMemo(() => {
    if (!p2) return null;
    const n = calcCoupleFutureNumber(p1.futureNumber, p2.futureNumber);
    return { n, ...coupleMeaning(n, lang) };
  }, [p1.futureNumber, p2, lang]);

  const openPicker = () => {
    if (partner2Dob) {
      setPickerDate(parseLocalDateString(partner2Dob));
    } else {
      setPickerDate(new Date(1990, 0, 1, 12, 0, 0, 0));
    }
    setShowPicker(true);
  };

  const closePicker = () => {
    if (Platform.OS === "ios") {
      setPartner2Dob(toLocalDateString(pickerDate));
    }
    setShowPicker(false);
  };

  const onChangePicker = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === "dismissed") {
      if (Platform.OS === "android") setShowPicker(false);
      return;
    }

    if (!selected) return;

    if (Platform.OS === "ios") {
      setPickerDate(selected);
      return;
    }

    setPickerDate(selected);
    setPartner2Dob(toLocalDateString(selected));
    setShowPicker(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{title ?? t.title}</Text>
        </View>

        <Text style={styles.subtitle}>{t.subtitle}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.partner1}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>{t.dateOfBirth}</Text>
            <Text style={styles.value}>{formatDob(dateOfBirth)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>{t.futureNumber}</Text>
            <Text style={styles.number}>{p1.futureNumber}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t.partner2}</Text>
            <Pressable style={styles.btnGhost} onPress={openPicker}>
              <Text style={styles.btnGhostText}>
                {partner2Dob ? t.changeDate : t.chooseDate}
              </Text>
            </Pressable>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t.dateOfBirth}</Text>
            <Text style={styles.value}>
              {partner2Dob ? formatDobString(partner2Dob) : t.empty}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>{t.futureNumber}</Text>
            <Text style={styles.number}>{p2 ? p2.futureNumber : t.empty}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.resultSection]}>
          <Text style={styles.sectionTitle}>{t.coupleFutureNumber}</Text>
          <View style={styles.resultRow}>
            <View style={styles.resultCircle}>
              <Text style={styles.resultNumber}>
                {couple ? couple.n : t.empty}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.resultTitle}>
                {couple ? couple.title : t.chooseSecondPartner}
              </Text>
              <Text style={styles.resultDesc}>
                {couple ? couple.desc : t.forecastPlaceholder}
              </Text>
            </View>
          </View>

          <NumerologyDisclaimer lang={lang} />

          {/* {!!partner2Dob && (
            <Pressable
              style={styles.btnDetails}
              onPress={() => setShowDetails((v) => !v)}
            >
              <Text style={styles.btnDetailsText}>
                {showDetails ? t.hideDetails : t.showDetails}
              </Text>
            </Pressable>
          )} */}

          {/* {!!partner2Dob && showDetails && (
            <View style={styles.detailsBox}>
              <Text style={styles.detailsTitle}>{t.details}</Text>

              <Text style={styles.detailsLine}>
                P1: S={p1.sumDigitsAll}, 2×{p1.firstDigitOfDay}=
                {p1.doubledFirstDigit}, R={p1.afterSubtract} → {p1.futureNumber}
              </Text>

              {p2 && (
                <Text style={styles.detailsLine}>
                  P2: S={p2.sumDigitsAll}, 2×{p2.firstDigitOfDay}=
                  {p2.doubledFirstDigit}, R={p2.afterSubtract} →{" "}
                  {p2.futureNumber}
                </Text>
              )}

              {couple && (
                <Text style={styles.detailsLine}>
                  {t.title}: {p1.futureNumber} + {p2?.futureNumber} ={" "}
                  {p1.futureNumber + (p2?.futureNumber ?? 0)} → {couple.n}
                </Text>
              )}
            </View>
          )} */}
        </View>
      </View>

      {Platform.OS === "ios" ? (
        <Modal visible={showPicker} transparent animationType="fade">
          <Pressable style={styles.backdrop} onPress={closePicker}>
            <Pressable style={styles.sheet} onPress={() => {}}>
              <Text style={styles.sheetTitle}>{t.selectPartner2Dob}</Text>

              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="spinner"
                onChange={onChangePicker}
                maximumDate={new Date()}
                themeVariant="light"
                locale={lang}
              />

              <Pressable style={styles.btnPrimary} onPress={closePicker}>
                <Text style={styles.btnPrimaryText}>{t.done}</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="calendar"
            onChange={onChangePicker}
            maximumDate={new Date()}
          />
        )
      )}
    </View>
  );
};

export default PredictsCouple;

const styles = StyleSheet.create({
  root: {
    width: "100%",
  },
  card: {
    padding: 0,
    paddingBottom: 60,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    color: "black",
    fontSize: fs(18),
    fontWeight: "800",
    letterSpacing: 0.2,
    flex: 1,
  },
  badge: {
    color: "white",
    fontSize: fs(12),
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#3594de",
    borderWidth: 1,
    borderColor: "#3594de",
  },
  subtitle: {
    marginTop: 8,
    color: "#444444",
    fontSize: fs(13),
    lineHeight: lh(18),
  },

  section: {
    marginTop: 14,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.06)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.10)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 6,
  },
  sectionTitle: {
    color: "black",
    fontSize: fs(14),
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  label: {
    color: "rgba(0,0,0,0.65)",
    fontSize: fs(12),
  },
  value: {
    color: "black",
    fontSize: fs(12),
    fontWeight: "600",
  },
  number: {
    color: "black",
    fontSize: fs(16),
    fontWeight: "900",
  },

  btnGhost: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#3594de",
    borderWidth: 1,
    borderColor: "#3594de",
  },
  btnGhostText: {
    color: "white",
    fontSize: fs(12),
    fontWeight: "700",
  },

  resultSection: {
    marginTop: 14,
  },
  resultRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  resultCircle: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3594de",
    borderWidth: 1,
    borderColor: "#3594de",
  },
  resultNumber: {
    color: "white",
    fontSize: fs(22),
    fontWeight: "900",
  },
  resultTitle: {
    color: "black",
    fontSize: fs(14),
    fontWeight: "800",
  },
  resultDesc: {
    marginTop: 4,
    color: "rgba(0,0,0,0.75)",
    fontSize: fs(12),
    lineHeight: lh(16),
  },

  btnDetails: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.08)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
  },
  btnDetailsText: {
    color: "black",
    fontSize: fs(12),
    fontWeight: "800",
  },

  detailsBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.1)",
  },
  detailsTitle: {
    color: "black",
    fontSize: fs(12),
    fontWeight: "900",
    marginBottom: 8,
  },
  detailsLine: {
    color: "rgba(0,0,0,0.80)",
    fontSize: fs(12),
    lineHeight: lh(18),
    marginTop: 4,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
    padding: 12,
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  sheetTitle: {
    color: "black",
    fontSize: fs(14),
    fontWeight: "900",
    marginBottom: 10,
  },
  btnPrimary: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#3594de",
    borderWidth: 1,
    borderColor: "#3594de",
  },
  btnPrimaryText: {
    color: "white",
    fontSize: fs(13),
    fontWeight: "900",
  },
});
