import { LANGUAGE_KEY } from "@/constants/params";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { useFocusEffect, useRouter } from "expo-router";
import { I18n } from "i18n-js";
import React, { useState } from "react";
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
    welcomeBack: "Welcome back!",
    loginSubtitle: "Sign in to your account",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot password?",
    login: "Login",
    noAccount: "Don't have an account?",
    register: "Register",
    privacyPolicy:
      "By continuing, you agree to our Terms of Service and Privacy Policy.",
  },
  ru: {
    welcomeBack: "Добро пожаловать обратно!",
    loginSubtitle: "Войдите в свой аккаунт",
    email: "Email",
    password: "Пароль",
    forgotPassword: "Забыли пароль?",
    login: "Войти",
    noAccount: "Нет аккаунта?",
    register: "Зарегистрироваться",
    privacyPolicy:
      "Продолжая, вы соглашаетесь с нашими Условиями обслуживания и Политикой конфиденциальности.",
  },
  kz: {
    welcomeBack: "Қайта қош келдіңіз!",
    loginSubtitle: "Есептік жазбаға кіріңіз",
    email: "Email",
    password: "Құпия сөз",
    forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
    login: "Кіру",
    noAccount: "Аккаунт жоқ па?",
    register: "Тіркелу",
    privacyPolicy:
      "Жалғастыру арқылы сіз біздің Қызмет көрсету шарттарымызбен және Құпиялылық саясатымызбен келісесіз.",
  },
  tr: {
    welcomeBack: "Tekrar hoş geldiniz!",
    loginSubtitle: "Hesabınıza giriş yapın",
    email: "Email",
    password: "Şifre",
    forgotPassword: "Şifrenizi mi unuttunuz?",
    login: "Giriş yap",
    noAccount: "Hesabınız yok mu?",
    register: "Kayıt ol",
    privacyPolicy:
      "Devam ederek Hizmet Şartlarımızı ve Gizlilik Politikamızı kabul etmiş olursunuz.",
  },
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [locale, setLocale] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const loadLanguage = async () => {
        try {
          const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
          if (savedLang) {
            i18n.locale = savedLang;
            setLocale(savedLang);
          } else {
            const systemLocale = getLocales()[0]?.languageCode || "en";
            i18n.locale = systemLocale;
            setLocale(systemLocale);
          }
        } catch (e) {
          console.log("Ошибка загрузки языка", e);
          i18n.locale = "en";
          setLocale("en");
        } finally {
          setLoading(false);
        }
      };

      loadLanguage();
    }, [])
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleLogin = () => {
    console.log({ email, password });
    router.push("/(tabs)");
  };

  const forgotButton = () => {
    router.push("/auth/forgotPassword");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {/* Основная часть, двигается с клавиатурой */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <View>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/logo/logo.jpeg")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>{i18n.t("welcomeBack")}</Text>
            <Text style={styles.subtitle}>{i18n.t("loginSubtitle")}</Text>

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
                placeholderTextColor={"#8e8e93"}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#4A90E2"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                placeholder={i18n.t("password")}
                placeholderTextColor={"#8e8e93"}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#4A90E2"
                  style={styles.iconRight}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={forgotButton}
            >
              <Text style={styles.forgotText}>{i18n.t("forgotPassword")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: email && password ? "#1E90FF" : "#ccc" },
              ]}
              onPress={handleLogin}
              disabled={!email || !password}
            >
              <Text style={styles.buttonText}>{i18n.t("login")}</Text>
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={{ color: "#666" }}>{i18n.t("noAccount")}</Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text style={styles.registerText}> {i18n.t("register")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* --- Футер внизу: НЕ поднимается при клавиатуре --- */}
        <Text style={styles.footerText}>{i18n.t("privacyPolicy")}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
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
  iconRight: { marginLeft: 10 },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#121212",
  },
  forgotButton: {
    alignSelf: "flex-end",
    marginVertical: 10,
  },
  forgotText: {
    color: "#1E90FF",
    fontWeight: "500",
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#1E90FF",
    fontWeight: "600",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 40,
  },
});

export default LoginScreen;
