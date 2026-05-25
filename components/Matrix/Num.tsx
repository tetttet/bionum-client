import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";

// Импорт из вашего проекта
import { formatDateReverse } from "@/utils/_func";
import { fs, lh } from "@/constants/typography";

// Импорт типов и функции из файла с логикой (предполагаем, что он уже создан)
import {
  LangCode,
  ProblemResult,
  getNumerologyProblemResult,
} from "@/data/nym/numerology";

// --- Dark Theme Constants ---
const COLORS = {
  background: "#121212", // Очень темный фон
  textPrimary: "#E0E0E0", // Светлый текст
  textSecondary: "#BDBDBD", // Вторичный текст/подпись
  accent: "#1083ff", // Фиолетовый акцент для числа (Material Dark Theme)
  error: "#CF6679", // Красный для ошибок
  border: "#333333", // Разделители
};

// --- Компонент Props Type ---
interface NumProps {
  birthDate: string; // Ожидаемый формат: YYYY-MM-DD
  lang?: LangCode;
  compact?: boolean; // Режим отображения: полная информация или сводка
}

export default function Num({
  birthDate,
  lang = "ru", // Язык по умолчанию
  compact = false,
}: NumProps) {
  const copy = {
    ru: {
      invalidDate: "Некорректный формат даты (требуется YYYY-MM-DD).",
      errorTitle: "Ошибка расчета",
      fallbackError: "Произошла ошибка при расчете.",
      inputPrompt: "Введите дату рождения для расчета.",
      dateLabel: "Дата рождения",
    },
    en: {
      invalidDate: "Invalid date format (YYYY-MM-DD is required).",
      errorTitle: "Calculation error",
      fallbackError: "An error occurred during calculation.",
      inputPrompt: "Enter a date of birth to calculate the result.",
      dateLabel: "Date of birth",
    },
    kz: {
      invalidDate: "Күн форматы қате (YYYY-MM-DD қажет).",
      errorTitle: "Есептеу қатесі",
      fallbackError: "Есептеу кезінде қате орын алды.",
      inputPrompt: "Нәтижені есептеу үшін туған күнді енгізіңіз.",
      dateLabel: "Туған күні",
    },
    tr: {
      invalidDate: "Geçersiz tarih formatı (YYYY-MM-DD gerekli).",
      errorTitle: "Hesaplama hatası",
      fallbackError: "Hesaplama sırasında bir hata oluştu.",
      inputPrompt: "Sonucu hesaplamak için doğum tarihi girin.",
      dateLabel: "Doğum tarihi",
    },
  } as const;
  const t = copy[lang] ?? copy.ru;
  const [result, setResult] = useState<ProblemResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const FORMATTED_BIRTH_DATE = useMemo(
    () => formatDateReverse(birthDate),
    [birthDate]
  );
  // 1. Расчет результата при изменении даты или языка
  useEffect(() => {
    // Базовая валидация даты (хотя основная в getNumerologyProblemResult)
    if (
      !FORMATTED_BIRTH_DATE ||
      FORMATTED_BIRTH_DATE.length !== 10 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(FORMATTED_BIRTH_DATE)
    ) {
      setError(t.invalidDate);
      setLoading(false);
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Вызов функции расчета
      const calculatedResult = getNumerologyProblemResult(
        FORMATTED_BIRTH_DATE,
        lang as LangCode
      );
      setResult(calculatedResult);
    } catch (e) {
      console.error("Numerology Calculation Error:", e);
      // Отображение понятной ошибки
      setError(
        e instanceof Error ? e.message : t.fallbackError
      );
      // Опционально: показать Alert для разработчика
      // Alert.alert("Ошибка расчета", (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [FORMATTED_BIRTH_DATE, lang, t.fallbackError, t.invalidDate]);

  // Форматирование даты для отображения
  const formattedBirthDate = useMemo(
    () => formatDateReverse(birthDate),
    [birthDate]
  );

  // --- Rendering States ---

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorBox, styles.center]}>
        <Text style={styles.errorTitle}>{t.errorTitle}</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{t.inputPrompt}</Text>
      </View>
    );
  }

  // --- Compact View (Сводка) ---
  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactNumber}>{result.problemNumber}</Text>
        <View style={styles.compactTitleBox}>
          <Text style={styles.compactTitleText}>{result.description}</Text>
          <Text style={styles.dateTextCompact}>({formattedBirthDate})</Text>
        </View>
      </View>
    );
  }

  // --- Full View (Подробное описание) ---
  return (
    <ScrollView
      style={styles.fullScreenContainer}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Заголовок и Число Проблемы */}
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {t.dateLabel}: {formattedBirthDate}
        </Text>
        <Text style={styles.problemNumber}>{result.problemNumber}</Text>
      </View>

      {/* Название Проблемы */}
      <View style={styles.section}>
        <Text style={styles.titleText}>{result.description}</Text>
        <View style={styles.divider} />
      </View>

      <NumerologyDisclaimer lang={lang} />
    </ScrollView>
  );
}

// --- Stylesheet для Черной Темы ---
const styles = StyleSheet.create({
  // Global & Layout
  container: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    marginTop: 24,
    borderRadius: 12,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  text: {
    color: "#000000",
  },
  divider: {
    height: 1,
    marginTop: 40,
    marginBottom: -30,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
  },

  // Header/Number Styles (Full View)
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  dateText: {
    color: "#666666",
    fontSize: fs(14),
    marginBottom: 20,
  },
  problemNumber: {
    fontSize: fs(90),
    fontWeight: "900",
    color: COLORS.accent,
    borderWidth: 4,
    borderColor: COLORS.accent,
    borderRadius: 20,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },

  // Content Styles
  section: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: fs(14),
    fontWeight: "700",
    color: "#000000",
  },
  sectionTitle: {
    fontSize: fs(18),
    fontWeight: "600",
    color: "#000000",
    marginBottom: 10,
  },
  karmaTaskText: {
    fontSize: fs(16),
    lineHeight: lh(25),
    color: "#000000",
    textAlign: "justify",
  },

  // Error Styles
  errorBox: {
    backgroundColor: "#330000",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  errorTitle: {
    color: COLORS.error,
    fontSize: fs(18),
    fontWeight: "bold",
    marginBottom: 5,
  },
  errorText: {
    color: COLORS.error,
    textAlign: "center",
  },

  // Compact Styles
  compactContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    width: "100%",
  },
  compactNumber: {
    fontSize: fs(28),
    fontWeight: "bold",
    color: "#FF6F61",
    marginRight: 15,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
  },
  compactTitleBox: {
    flexShrink: 1,
  },
  compactTitleText: {
    fontSize: fs(16),
    fontWeight: "500",
    color: "#000000",
  },
  dateTextCompact: {
    color: "#666666",
    fontSize: fs(12),
    marginTop: 2,
  },
});
