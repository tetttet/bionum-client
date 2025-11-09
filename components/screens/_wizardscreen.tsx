import { LANGUAGE_KEY, languages } from "@/constants/params";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ---- i18n ----
const i18n = new I18n({
  en: {
    welcome: "Welcome to",
    appName: "Bionum",
    tagline: "Pick your language to continue",
    selectLang: "Select Language",
    getStarted: "Get started",
    alreadyAccount: "I already have an account",
    loading: "Loading...",
  },
  ru: {
    welcome: "Добро пожаловать в",
    appName: "Bionum",
    tagline: "Выберите язык, чтобы продолжить",
    selectLang: "Выберите язык",
    getStarted: "Начать",
    alreadyAccount: "У меня уже есть аккаунт",
    loading: "Загрузка...",
  },
  kz: {
    welcome: "Қош келдіңіз",
    appName: "Bionum",
    tagline: "Жалғастыру үшін тілді таңдаңыз",
    selectLang: "Тілді таңдаңыз",
    getStarted: "Бастау",
    alreadyAccount: "Менің аккаунтым бар",
    loading: "Жүктелуде...",
  },
  tr: {
    welcome: "Hoş geldiniz",
    appName: "Bionum",
    tagline: "Devam etmek için dil seçin",
    selectLang: "Dil seçin",
    getStarted: "Başlayın",
    alreadyAccount: "Zaten bir hesabım var",
    loading: "Yükleniyor...",
  },
});
i18n.enableFallback = true;
i18n.defaultLocale = "en";

const WizardScreen: React.FC = () => {
  const navigation = useNavigation();
  const systemLang = useMemo(() => getLocales()[0]?.languageCode || "en", []);
  const isDark = "light";

  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const actionsOpacity = useRef(new Animated.Value(0)).current;
  const actionsTranslate = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    const checkLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLang) {
          i18n.locale = savedLang;
          navigation.navigate("auth/login" as never);
        } else {
          const supported = languages.map((l) => l.code);
          const initial = supported.includes(systemLang) ? systemLang : "en";
          setSelectedLang(initial);
          i18n.locale = initial;
        }
      } catch (e) {
        console.log("Ошибка проверки языка", e);
        setSelectedLang("en");
        i18n.locale = "en";
      } finally {
        setLoading(false);
      }
    };
    checkLanguage();
  }, [navigation, systemLang]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(actionsOpacity, {
        toValue: selectedLang ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(actionsTranslate, {
        toValue: selectedLang ? 0 : 10,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedLang, actionsOpacity, actionsTranslate]);

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? "#0B0B0B" : "#FFFFFF" },
        ]}
      >
        <View style={styles.center}>
          <Text style={{ color: isDark ? "#EDEDED" : "#111" }}>
            {i18n.t("loading")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const onSelectLang = (code: string) => {
    setSelectedLang(code);
    i18n.locale = code;
  };

  const persistLangAndGo = async (route: string) => {
    if (!selectedLang) return;
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, selectedLang);
      i18n.locale = selectedLang;
      navigation.navigate(route as never);
    } catch (e) {
      console.log("Ошибка сохранения языка", e);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#FFFFFF" : "#FFFFFF" },
      ]}
    >
      {/* Основной контент */}
      <View style={styles.mainContent}>
        <Image
          source={require("../../assets/images/auth/lang.gif")}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.brandWrap}>
          <Text
            style={[
              styles.brandTopLine,
              { color: isDark ? "#3A57E8" : "#3A57E8" },
            ]}
          >
            {i18n.t("welcome")}
          </Text>
          <Text
            style={[
              styles.brandName,
              {
                color: isDark ? "#0F172A" : "#0F172A",
              },
            ]}
          >
            {i18n.t("appName")}
            <Text style={{ color: isDark ? "#14B8A6" : "#14B8A6" }}>.</Text>
          </Text>
          <Text
            style={[
              styles.brandTagline,
              { color: isDark ? "#6B7280" : "#6B7280" },
            ]}
          >
            {i18n.t("tagline")}
          </Text>
        </View>

        <View style={styles.languageContainer}>
          {languages.map((lang) => {
            const active = selectedLang === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => onSelectLang(lang.code)}
                style={[
                  styles.langChip,
                  {
                    backgroundColor: active
                      ? isDark
                        ? "#E6EEFF"
                        : "#E6EEFF"
                      : isDark
                      ? "#F2F2F2"
                      : "#F2F2F2",
                    borderColor: active
                      ? isDark
                        ? "#3A57E8"
                        : "#3A57E8"
                      : isDark
                      ? "#E5E7EB"
                      : "#E5E7EB",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    {
                      color: active
                        ? isDark
                          ? "#1F2A5C"
                          : "#1F2A5C"
                        : isDark
                        ? "#111827"
                        : "#111827",
                    },
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Кнопки снизу */}
      <Animated.View
        style={[
          styles.actionsBar,
          {
            opacity: actionsOpacity,
            transform: [{ translateY: actionsTranslate }],
            backgroundColor: isDark ? "#FFFFFF" : "#FFFFFF",
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.primaryBtn,
            { backgroundColor: selectedLang ? "#2a3dc9ff" : "#A7B0F9" },
          ]}
          onPress={() => persistLangAndGo("auth/register")}
          disabled={!selectedLang}
        >
          <Text
            style={[
              styles.primaryBtnText,
              {
                textTransform: "uppercase",
              },
            ]}
          >
            {i18n.t("getStarted")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => persistLangAndGo("auth/login")}
          disabled={!selectedLang}
        >
          <Text
            style={[
              styles.secondaryBtnText,
              {
                textTransform: "uppercase",
              },
            ]}
          >
            {i18n.t("alreadyAccount")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default WizardScreen;

// --- Стили
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  image: {
    width: "80%",
    height: 230,
    borderRadius: 16,
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandWrap: {
    alignItems: "center",
    marginBottom: 10,
  },
  brandTopLine: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 10,
  },
  languageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  langChip: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
  },
  langText: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionsBar: {
    paddingHorizontal: 24,
    paddingBottom: 26,
    paddingTop: 10,
  },
  primaryBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    fontSize: 15,
    color: "#2a3d9fff",
    fontWeight: "700",
  },
});
