// ProfileChangeCard.tsx
import { LANGUAGE_KEY, languages } from "@/constants/params";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18n } from "i18n-js";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const i18n = new I18n({
  en: { changeLang: "Change Language" },
  ru: { changeLang: "Сменить язык" },
  kz: { changeLang: "Тілді өзгерту" },
  tr: { changeLang: "Dili değiştir" },
});
i18n.enableFallback = true;
i18n.defaultLocale = "en";

const ProfileLangChangeCard = () => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
      setSelectedLang(savedLang || "en");
      i18n.locale = savedLang || "en";
    };
    loadLang();
  }, []);

  const handleChangeLang = async (lang: string) => {
    if (lang === selectedLang) return;

    // Сохраняем новый язык
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);

    // Уведомление
    Alert.alert(
      i18n.t("changeLang"),
      i18n.locale === "ru"
        ? `Чтобы применить новый язык, перезапустите приложение.`
        : i18n.locale === "kz"
        ? `Жаңа тілді қолдану үшін, қолданбаны қайта іске қосыңыз.`
        : i18n.locale === "tr"
        ? `Yeni dili uygulamak için uygulamayı yeniden başlatın.`
        : `To apply the new language, please restart the app.`,
      [{ text: "Ок", style: "default" }]
    );
  };

  return (
    <View style={[styles.card, { marginTop: 8, marginBottom: 20 }]}>
      <Text style={styles.title}>{i18n.t("changeLang")}</Text>
      <View style={styles.langContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.langButton,
              {
                backgroundColor:
                  selectedLang === lang.code ? "#1E90FF" : "#F0F0F0",
              },
            ]}
            onPress={() => handleChangeLang(lang.code)}
          >
            <Text
              style={{
                color: selectedLang === lang.code ? "#fff" : "#121212",
                fontWeight: "600",
              }}
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ProfileLangChangeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#121212",
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#2c2c2e",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#fff",
    paddingBottom: 4,
    textAlign: "center",
  },
  langContainer: { flexDirection: "row", flexWrap: "wrap" },
  langButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    margin: 5,
    backgroundColor: "#1c1c1e",
    borderColor: "#2c2c2e",
    borderWidth: 1,
  },
});
