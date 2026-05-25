import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { fs } from "@/constants/typography";
import {
  calculatePsychomatrix,
  Digit,
  PsychomatrixResult,
} from "@/data/psycho/psychomatrixCore";
import PsychoDisplay from "../ui/psycho";

type Language = "ru" | "en" | "kz" | "tr";

interface PsychomatrixFriendProps {
  style?: ViewStyle;
  lang: string;
}

const translations: Record<
  Language,
  {
    instruction: string;
    pickDate: string;
    pickerTitle: string;
    done: string;
    loading: string;
    calcError: string;
    dateError: string;
  }
> = {
  ru: {
    instruction:
      "Выберите дату рождения друга, чтобы проверить его психоматрицу",
    pickDate: "Выбрать дату",
    pickerTitle: "Дата рождения друга",
    done: "Готово",
    loading: "Загрузка психоматрицы...",
    calcError: "Ошибка расчёта психоматрицы",
    dateError: "Ошибка обработки даты",
  },
  en: {
    instruction: "Choose your friend's birth date to check their psychomatrix",
    pickDate: "Select date",
    pickerTitle: "Friend's date of birth",
    done: "Done",
    loading: "Loading psychomatrix...",
    calcError: "Psychomatrix calculation error",
    dateError: "Date processing error",
  },
  kz: {
    instruction: "Досыңыздың психоматрицасын тексеру үшін туған күнін таңдаңыз",
    pickDate: "Күнді таңдау",
    pickerTitle: "Досыңыздың туған күні",
    done: "Дайын",
    loading: "Психоматрица жүктелуде...",
    calcError: "Психоматрицаны есептеу қатесі",
    dateError: "Күнді өңдеу қатесі",
  },
  tr: {
    instruction:
      "Arkadaşının psikomatriksini kontrol etmek için doğum tarihini seç",
    pickDate: "Tarih seç",
    pickerTitle: "Arkadaşının doğum tarihi",
    done: "Tamam",
    loading: "Psikomatriks yükleniyor...",
    calcError: "Psikomatriks hesaplama hatası",
    dateError: "Tarih işleme hatası",
  },
};

const isLanguage = (value?: string): value is Language => {
  return value === "ru" || value === "en" || value === "kz" || value === "tr";
};

const getSafeLanguage = (value?: string): Language => {
  return isLanguage(value) ? value : "ru";
};

const pickerLocales: Record<Language, string> = {
  ru: "ru-RU",
  en: "en-US",
  kz: "kk-KZ",
  tr: "tr-TR",
};

const defaultPickerDate = () => new Date();

const formatDateForLanguage = (date: Date, language: Language) => {
  try {
    return new Intl.DateTimeFormat(pickerLocales[language], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    return `${d}.${m}.${y}`;
  }
};

export const PsychomatrixFriend: React.FC<PsychomatrixFriendProps> = ({
  style,
  lang,
}) => {
  const safeLang = useMemo(() => getSafeLanguage(lang), [lang]);
  const t = useMemo(() => translations[safeLang], [safeLang]);
  const pickerLocale = pickerLocales[safeLang];

  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [pickerDate, setPickerDate] = useState<Date>(defaultPickerDate);
  const [showPicker, setShowPicker] = useState(false);
  const [shiftedBirthDate, setShiftedBirthDate] = useState<string | null>(null);
  const [data, setData] = useState<PsychomatrixResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false);
      return;
    }

    if (selectedDate) {
      setPickerDate(selectedDate);

      if (Platform.OS === "android") {
        setBirthDate(selectedDate);
        setShowPicker(false);
      }
    }
  };

  const openPicker = () => {
    setPickerDate(birthDate ?? defaultPickerDate());
    setShowPicker(true);
  };

  const confirmPickerDate = () => {
    setBirthDate(pickerDate);
    setShowPicker(false);
  };

  useEffect(() => {
    if (!birthDate) return;

    setLoading(true);
    setError(null);

    try {
      const y = birthDate.getFullYear();
      const m = String(birthDate.getMonth() + 1).padStart(2, "0");
      const d = String(birthDate.getDate()).padStart(2, "0");

      const formatted = `${d}.${m}.${y}`;
      setShiftedBirthDate(formatted);

      const timer = setTimeout(() => {
        try {
          const result = calculatePsychomatrix(formatted);
          setData(result);
        } catch (e: any) {
          setError(e?.message ?? t.calcError);
          setData(null);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    } catch (err) {
      console.warn("Date processing error:", err);
      setError(t.dateError);
      setLoading(false);
    }
  }, [birthDate, t.calcError, t.dateError]);

  const { counts, sum1, sum2, sum3, sum4, is21Century } = data || {};

  const toggleBlock = (digit: Digit) => {
    setOpenBlocks((prev) => ({ ...prev, [digit]: !prev[digit] }));
  };

  const activeDigits =
    data &&
    Object.keys(data.counts)
      .map((k) => parseInt(k, 10))
      .filter((n): n is Digit => n >= 1 && n <= 9);

  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.datePickerContainer}>
        <Text style={styles.instruction}>{t.instruction}</Text>

        <TouchableOpacity
          onPress={openPicker}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {birthDate
              ? formatDateForLanguage(birthDate, safeLang)
              : t.pickDate}
          </Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === "android" ? (
        showPicker && (
          <DateTimePicker
            value={pickerDate}
            mode="date"
            display="calendar"
            onChange={onChangeDate}
            maximumDate={new Date()}
            positiveButton={{ label: t.done }}
          />
        )
      ) : (
        <Modal
          animationType="slide"
          onRequestClose={() => setShowPicker(false)}
          transparent
          visible={showPicker}
        >
          <Pressable
            style={styles.pickerBackdrop}
            onPress={() => setShowPicker(false)}
          >
            <Pressable style={styles.pickerSheet} onPress={() => {}}>
              <Text style={styles.pickerTitle}>{t.pickerTitle}</Text>

              <DateTimePicker
                value={pickerDate}
                mode="date"
                display="spinner"
                onChange={onChangeDate}
                maximumDate={new Date()}
                themeVariant="light"
                locale={pickerLocale}
              />

              <TouchableOpacity
                onPress={confirmPickerDate}
                style={styles.doneButton}
              >
                <Text style={styles.doneButtonText}>{t.done}</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {loading && (
        <View style={styles.skeleton}>
          <ActivityIndicator size="large" color="#000000" />
          <Text style={{ color: "#000000", marginTop: 8 }}>{t.loading}</Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {data && !loading && (
        <PsychoDisplay
          birthDate={
            birthDate ? formatDateForLanguage(birthDate, safeLang) : ""
          }
          style={style}
          shiftedBirthDate={shiftedBirthDate ?? ""}
          is21Century={is21Century ?? false}
          sum1={sum1 ?? 0}
          sum2={sum2 ?? 0}
          sum3={sum3 ?? 0}
          sum4={sum4 ?? 0}
          grid={[
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9],
          ]}
          counts={
            counts ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 }
          }
          activeDigits={activeDigits ?? []}
          openBlocks={openBlocks}
          toggleBlock={toggleBlock}
          language={safeLang}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 24, paddingTop: 24 },
  scrollContent: { gap: 12 },
  cellDigit: { fontSize: fs(12), color: "#000000", marginBottom: 2 },
  cellValue: { fontSize: fs(16), fontWeight: "600", color: "#000000" },
  errorText: { color: "#ff6b6b", fontSize: fs(14) },
  datePickerContainer: {
    alignItems: "center",
  },
  instruction: {
    fontSize: fs(14),
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  datePickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#369cef",
  },
  datePickerText: { color: "#ffffff", fontSize: fs(14) },
  pickerBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 12,
  },
  pickerSheet: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pickerTitle: {
    color: "#000000",
    fontSize: fs(14),
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  doneButton: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#369cef",
  },
  doneButtonText: {
    color: "#ffffff",
    fontSize: fs(14),
    fontWeight: "700",
  },
  skeleton: { marginTop: 20, alignItems: "center" },
});

export default PsychomatrixFriend;
