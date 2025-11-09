import { LANGUAGE_KEY } from "@/constants/params";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { I18n } from "i18n-js";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// --- Настройка языков
const i18n = new I18n({
  en: {
    forgotPassword: "Forgot Password",
    forgotSubtitle: "Enter your email to receive a reset link",
    email: "Email",
    sendLink: "Send Link",
    backToLogin: "← Back to Login",
  },
  ru: {
    forgotPassword: "Восстановление пароля",
    forgotSubtitle:
      "Введите ваш email, чтобы получить ссылку для сброса пароля",
    email: "Email",
    sendLink: "Отправить ссылку",
    backToLogin: "← Вернуться к входу",
  },
  kz: {
    forgotPassword: "Құпия сөзді қалпына келтіру",
    forgotSubtitle:
      "Құпия сөзді қалпына келтіру сілтемесін алу үшін email енгізіңіз",
    email: "Email",
    sendLink: "Сілтемені жіберу",
    backToLogin: "← Кіру бетіне оралу",
  },
  tr: {
    forgotPassword: "Şifreyi Unuttum",
    forgotSubtitle: "Sıfırlama bağlantısı almak için e-postanızı girin",
    email: "Email",
    sendLink: "Bağlantıyı Gönder",
    backToLogin: "← Girişe Dön",
  },
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLang) {
          i18n.locale = savedLang;
          setLocale(savedLang);
        } else {
          i18n.locale = i18n.defaultLocale;
          setLocale(i18n.defaultLocale);
        }
      } catch (err) {
        console.log("Error loading language:", err);
        i18n.locale = i18n.defaultLocale;
        setLocale(i18n.defaultLocale);
      }
    };
    loadLanguage();
  }, []);

  if (!locale) return null;

  const handleSendReset = () => {
    console.log("Reset link sent to:", email);
    // Здесь API вызов для отправки ссылки
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo/logo.jpeg")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>{i18n.t("forgotPassword")}</Text>
        <Text style={styles.subtitle}>{i18n.t("forgotSubtitle")}</Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={20}
            color="#4A90E2"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder={i18n.t("email")}
            placeholderTextColor="#8e8e93"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            { backgroundColor: email ? "#1E90FF" : "#ccc" },
          ]}
          onPress={handleSendReset}
          disabled={!email}
        >
          <Text style={styles.buttonText}>{i18n.t("sendLink")}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={styles.backText}>{i18n.t("backToLogin")}</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginVertical: 10,
    paddingHorizontal: 15,
    elevation: 1,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#121212",
  },
  loginButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  backText: {
    color: "#1E90FF",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
