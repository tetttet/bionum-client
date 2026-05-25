// ProfileChangeCard.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { LANGUAGE_KEY, languages } from "@/constants/params";
import { syncDailyReminderNotifications } from "@/services/dailyReminders";
import { fs } from "@/constants/typography";

const i18n = new I18n({
  en: {
    changeLang: "Language",
    appliedTitle: "Language updated",
    appliedMsg: "The interface language has been changed.",
    ok: "OK",
  },
  ru: {
    changeLang: "Язык",
    appliedTitle: "Язык обновлён",
    appliedMsg: "Язык интерфейса изменён.",
    ok: "Ок",
  },
  kz: {
    changeLang: "Тіл",
    appliedTitle: "Тіл жаңартылды",
    appliedMsg: "Интерфейс тілі өзгертілді.",
    ok: "Жарайды",
  },
  tr: {
    changeLang: "Dil",
    appliedTitle: "Dil güncellendi",
    appliedMsg: "Arayüz dili değiştirildi.",
    ok: "Tamam",
  },
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";

type LangCode = string;

const ProfileLangChangeCard: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<LangCode>("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLang = async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        const initial = saved || "en";
        setSelectedLang(initial);
        i18n.locale = initial;
      } catch {
        // если что-то пошло не так — остаёмся на дефолте
        setSelectedLang("en");
        i18n.locale = "en";
      } finally {
        setLoading(false);
      }
    };

    loadLang();
  }, []);

  const currentLabel = useMemo(() => {
    return (
      languages.find((l) => l.code === selectedLang)?.label ?? selectedLang
    );
  }, [selectedLang]);

  const handleChangeLang = async (lang: LangCode) => {
    if (lang === selectedLang) return;

    // 1) применяем сразу (логичнее)
    setSelectedLang(lang);
    i18n.locale = lang;

    // 2) сохраняем
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      await syncDailyReminderNotifications(lang);
    } catch {
      // если сохранение не удалось — откатываем
      // (можно заменить на toast/ошибку, если у тебя есть)
      setSelectedLang(selectedLang);
      i18n.locale = selectedLang;
      Alert.alert("Error", "Failed to save language.");
      return;
    }

    // 3) уведомляем (коротко и по делу)
    Alert.alert(i18n.t("appliedTitle"), i18n.t("appliedMsg"), [
      { text: i18n.t("ok") },
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{i18n.t("changeLang")}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{currentLabel}</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>
        {Platform.select({
          ios: "Choose your preferred language",
          android: "Choose your preferred language",
          default: "Choose your preferred language",
        })}
      </Text>

      <View style={styles.grid} pointerEvents={loading ? "none" : "auto"}>
        {languages.map((lang) => {
          const selected = selectedLang === lang.code;

          return (
            <Pressable
              key={lang.code}
              onPress={() => handleChangeLang(lang.code)}
              style={({ pressed }) => [
                styles.chip,
                selected && styles.chipSelected,
                pressed && !selected && styles.chipPressed,
                pressed && selected && styles.chipSelectedPressed,
                loading && styles.chipDisabled,
              ]}
              android_ripple={{ color: "rgba(0,0,0,0.06)", borderless: false }}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {lang.label}
              </Text>

              {selected ? (
                <View style={styles.dot} />
              ) : (
                <View style={styles.dotGhost} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default ProfileLangChangeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 20,

    // Android shadow
    elevation: 3,

    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  title: {
    fontSize: fs(18),
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  badgeText: {
    fontSize: fs(12),
    fontWeight: "700",
    color: "#374151",
  },

  subtitle: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: fs(13),
    color: "#6B7280",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    minWidth: 110,
    flexGrow: 1,
    flexBasis: "45%",

    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,

    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  chipPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: "#F3F4F6",
  },

  chipSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#3ba0ee",
  },

  chipSelectedPressed: {
    transform: [{ scale: 0.99 }],
    backgroundColor: "#E0E7FF",
  },

  chipDisabled: {
    opacity: 0.6,
  },

  chipText: {
    fontSize: fs(14),
    fontWeight: "700",
    color: "#111827",
  },

  chipTextSelected: {
    color: "#3ba0ee",
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#3ba0ee",
  },

  dotGhost: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
});
