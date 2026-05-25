import { compatEn } from "@/data/compa/lang/en";
import { compatKz } from "@/data/compa/lang/kz";
import { compatRu } from "@/data/compa/lang/ru";
import { compatTr } from "@/data/compa/lang/tr";
import type { Lang } from "@/data/name/nameNumber";
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

type SupportedLang = "ru" | "en" | "tr" | "kz";

type Props = {
  dateOfBirth: Date;
  lang: Lang;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatDate(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function formatDateString(value: string) {
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

function digitsSumFromDate(d: Date) {
  const dd = pad2(d.getDate());
  const mm = pad2(d.getMonth() + 1);
  const yyyy = String(d.getFullYear());
  const all = `${dd}${mm}${yyyy}`;

  let sum = 0;
  for (const ch of all) sum += Number(ch);
  return sum;
}

function reduceToCore(sum: number) {
  let n = sum;

  while (n > 22) {
    n = String(n)
      .split("")
      .reduce((acc, x) => acc + Number(x), 0);
  }

  if (n === 11 || n === 22) return n;

  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((acc, x) => acc + Number(x), 0);

    if (n === 11 || n === 22) return n;
  }

  return n;
}

function destinyNumber(d: Date) {
  return reduceToCore(digitsSumFromDate(d));
}

function coupleNumber(n1: number, n2: number) {
  return reduceToCore(n1 + n2);
}

function normalizeLang(lang: Lang): SupportedLang {
  if (lang === "en" || lang === "tr" || lang === "kz" || lang === "ru") {
    return lang;
  }
  return "ru";
}

const uiText = {
  ru: {
    title: "Совместимость по числу судьбы",
    partner1: "Партнёр 1 (из профиля)",
    partner2: "Партнёр 2 (выбери дату)",
    dateNotSelected: "Дата не выбрана",
    choose: "Выбрать",
    change: "Изменить",
    partner2Destiny: "Ваше число совместимости",
    result: "Результат",
    pairNumber: "Число пары",
    short: "Кратко",
    hint: "Выбери дату партнёра 2, чтобы увидеть описание.",
    pickerTitle: "Выбери дату рождения партнёра 2",
    cancel: "Отмена",
    done: "Готово",
    empty: "—",
    noText: "Текст пока не добавлен.",
  },
  en: {
    title: "Compatibility by destiny number",
    partner1: "Partner 1 (from profile)",
    partner2: "Partner 2 (choose date)",
    dateNotSelected: "Date not selected",
    choose: "Choose",
    change: "Change",
    partner2Destiny: "Partner 2 destiny number",
    result: "Result",
    pairNumber: "Couple number",
    short: "Briefly",
    hint: "Choose partner 2's date to see the description.",
    pickerTitle: "Choose partner 2 date of birth",
    cancel: "Cancel",
    done: "Done",
    empty: "—",
    noText: "Text has not been added yet.",
  },
  tr: {
    title: "Kader sayısına göre uyumluluk",
    partner1: "1. Partner (profilden)",
    partner2: "2. Partner (tarih seçin)",
    dateNotSelected: "Tarih seçilmedi",
    choose: "Seç",
    change: "Değiştir",
    partner2Destiny: "2. partnerin kader sayısı",
    result: "Sonuç",
    pairNumber: "Çift sayısı",
    short: "Kısaca",
    hint: "Açıklamayı görmek için 2. partnerin tarihini seçin.",
    pickerTitle: "2. partnerin doğum tarihini seçin",
    cancel: "İptal",
    done: "Tamam",
    empty: "—",
    noText: "Metin henüz eklenmedi.",
  },
  kz: {
    title: "Тағдыр саны бойынша үйлесімділік",
    partner1: "1-серіктес (профильден)",
    partner2: "2-серіктес (күнді таңдаңыз)",
    dateNotSelected: "Күн таңдалмаған",
    choose: "Таңдау",
    change: "Өзгерту",
    partner2Destiny: "2-серіктестің тағдыр саны",
    result: "Нәтиже",
    pairNumber: "Жұп саны",
    short: "Қысқаша",
    hint: "Сипаттаманы көру үшін 2-серіктестің күнін таңдаңыз.",
    pickerTitle: "2-серіктестің туған күнін таңдаңыз",
    cancel: "Бас тарту",
    done: "Дайын",
    empty: "—",
    noText: "Мәтін әлі қосылмаған.",
  },
} as const;

function getCompatText({
  lang,
  n1,
  n2,
}: {
  lang: SupportedLang;
  n1: number;
  n2: number;
}) {
  const mapByLang = {
    ru: compatRu,
    en: compatEn,
    tr: compatTr,
    kz: compatKz,
  } as const;

  const map = mapByLang[lang];
  const row = map[n1 as keyof typeof map];

  if (!row) return uiText[lang].noText;
  return row[n2 as keyof typeof row] ?? uiText[lang].noText;
}

export default function CompaNumber({ dateOfBirth, lang }: Props) {
  const currentLang = normalizeLang(lang);
  const t = uiText[currentLang];

  const [partner2, setPartner2] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(
    new Date(1995, 0, 1, 12, 0, 0, 0),
  );

  const n1 = useMemo(() => destinyNumber(dateOfBirth), [dateOfBirth]);

  const n2 = useMemo(() => {
    if (!partner2) return null;
    return destinyNumber(parseLocalDateString(partner2));
  }, [partner2]);

  const pair = useMemo(() => {
    if (!n2) return null;
    return coupleNumber(n1, n2);
  }, [n1, n2]);

  const compatText = useMemo(() => {
    if (!n2) return "";
    return getCompatText({ lang: currentLang, n1, n2 });
  }, [currentLang, n1, n2]);

  const onChangePicker = (event: DateTimePickerEvent, selected?: Date) => {
    if (event.type === "dismissed") {
      if (Platform.OS === "android") setPickerOpen(false);
      return;
    }

    if (!selected) return;

    if (Platform.OS === "ios") {
      setTempDate(selected);
      return;
    }

    setTempDate(selected);
    setPartner2(toLocalDateString(selected));
    setPickerOpen(false);
  };

  const openPicker = () => {
    if (partner2) {
      setTempDate(parseLocalDateString(partner2));
    } else {
      setTempDate(new Date(1995, 0, 1, 12, 0, 0, 0));
    }
    setPickerOpen(true);
  };

  const confirmIOS = () => {
    setPartner2(toLocalDateString(tempDate));
    setPickerOpen(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>{t.title}</Text>

        <View style={styles.block}>
          <Text style={styles.label}>{t.partner1}</Text>
          <View style={styles.row}>
            <Text style={styles.value}>{formatDate(dateOfBirth)}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{n1}</Text>
            </View>
          </View>
        </View>

        <View style={styles.block}>
          <Text style={styles.label}>{t.partner2}</Text>

          <View style={styles.row}>
            <Text style={styles.value}>
              {partner2 ? formatDateString(partner2) : t.dateNotSelected}
            </Text>

            {!!n2 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{n2}</Text>
              </View>
            )}
          </View>

          <View style={[styles.row, { marginTop: 10 }]}>
            <Text style={styles.subValue}></Text>

            <Pressable onPress={openPicker} style={styles.btn}>
              <Text style={styles.btnText}>
                {partner2 ? t.change : t.choose}
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.block}>
          <Text style={styles.label}>{t.result}</Text>

          <View style={styles.row}>
            <Text style={styles.subValue}>{t.pairNumber}</Text>
            <View style={styles.badgeBig}>
              <Text style={styles.badgeBigText}>{pair ?? t.empty}</Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={styles.hintTitle}>{t.short}</Text>
            <Text style={styles.hintText}>
              {partner2 ? compatText : t.hint}
            </Text>
          </View>

          <NumerologyDisclaimer lang={lang} />
        </View>
      </View>

      {Platform.OS === "ios" ? (
        <Modal transparent visible={pickerOpen} animationType="fade">
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setPickerOpen(false)}
          />

          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{t.pickerTitle}</Text>

            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={onChangePicker}
              maximumDate={new Date()}
              themeVariant="light"
              locale={lang}
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setPickerOpen(false)}
                style={[styles.btn, styles.btnGhost]}
              >
                <Text style={[styles.btnText, styles.btnTextGhost]}>
                  {t.cancel}
                </Text>
              </Pressable>

              <Pressable
                onPress={confirmIOS}
                style={[styles.btn, styles.btnPrimary]}
              >
                <Text style={styles.btnText}>{t.done}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      ) : (
        pickerOpen && (
          <DateTimePicker
            value={tempDate}
            mode="date"
            display="calendar"
            onChange={onChangePicker}
            maximumDate={new Date()}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  card: {
    padding: 0,
    paddingBottom: 60,
  },
  title: {
    fontSize: fs(18),
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
  },
  block: {
    marginTop: 12,
  },
  label: {
    fontSize: fs(12),
    color: "#666666",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  value: {
    fontSize: fs(16),
    color: "#111111",
    fontWeight: "600",
    flex: 1,
  },
  subValue: {
    fontSize: fs(14),
    color: "#111111",
    fontWeight: "600",
    flex: 1,
  },
  badge: {
    minWidth: 36,
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E6E6E7",
  },
  badgeText: {
    fontSize: fs(14),
    fontWeight: "800",
    color: "#111111",
  },
  badgeBig: {
    minWidth: 64,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3594de",
  },
  badgeBigText: {
    fontSize: fs(18),
    fontWeight: "900",
    color: "#FFFFFF",
  },
  btn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3594de",
  },
  btnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: fs(13),
  },
  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginTop: 16,
  },
  hintTitle: {
    fontSize: fs(12),
    color: "#666666",
    marginBottom: 6,
  },
  hintText: {
    fontSize: fs(14),
    color: "#111111",
    lineHeight: lh(20),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  modalTitle: {
    fontSize: fs(14),
    fontWeight: "800",
    color: "#111111",
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  btnGhost: {
    backgroundColor: "#F4F4F5",
    borderWidth: 1,
    borderColor: "#E6E6E7",
    flex: 1,
  },
  btnTextGhost: {
    color: "#111111",
  },
  btnPrimary: {
    backgroundColor: "#3594de",
    flex: 1,
  },
});
