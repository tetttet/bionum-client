import PrivacyPolicyTextLink from "@/components/legal/PrivacyPolicyTextLink";
import { LANGUAGE_KEY } from "@/constants/params";
import { AuthContext } from "@/context/AuthContext";
import { normalizeAppLanguage } from "@/data/appCopy";
import { i18n } from "@/data/login";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useState } from "react";
import { fs, lh } from "@/constants/typography";
import {
  ActivityIndicator,
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

const LoginScreen = () => {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [locale, setLocale] = useState("en");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLanguage = useCallback(async () => {
    try {
      setLoading(true);

      const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);

      if (savedLang) {
        const normalized = normalizeAppLanguage(savedLang);
        i18n.locale = normalized;
        setLocale(normalized);
      } else {
        i18n.locale = "en";
        setLocale("en");
        router.replace("/auth/wizard");
        return;
      }
    } catch (e) {
      console.log("Ошибка загрузки языка", e);
      i18n.locale = "en";
      setLocale("en");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      loadLanguage();
    }, [loadLanguage]),
  );

  const normalizeError = (err: unknown): string => {
    if (!err) return i18n.t("loginFailed");

    if (typeof err === "string") return err;

    if (typeof err === "object" && err !== null) {
      if (
        "message" in err &&
        typeof (err as { message?: unknown }).message === "string"
      ) {
        return (err as { message: string }).message;
      }

      if (
        "code" in err &&
        typeof (err as { code?: unknown }).code === "string"
      ) {
        return (err as { code: string }).code;
      }
    }

    return i18n.t("loginFailed");
  };

  const handleLogin = async () => {
    try {
      setError(null);
      setSubmitting(true);

      const res = await login({ email, password });

      if (res.success) {
        router.push("/(tabs)");
      } else {
        setError(normalizeError(res.error));
      }
    } catch (e) {
      console.log("Login error:", e);
      setError(normalizeError(e));
    } finally {
      setSubmitting(false);
    }
  };

  const openPrivacyPolicy = () => {
    router.push("/privacy-policy");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <View key={locale}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/ios-icon.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>{i18n.t("welcomeBack")}</Text>
            <Text style={styles.subtitle}>{i18n.t("loginSubtitle")}</Text>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
                placeholderTextColor="#8e8e93"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
              >
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
              onPress={() => router.push("/auth/forgotPassword")}
            >
              <Text style={styles.forgotText}>{i18n.t("forgotPassword")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: email && password ? "#1E90FF" : "#ccc" },
              ]}
              onPress={handleLogin}
              disabled={!email || !password || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>{i18n.t("login")}</Text>
              )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={{ color: "#666" }}>{i18n.t("noAccount")}</Text>
              <TouchableOpacity onPress={() => router.push("/auth/register")}>
                <Text style={styles.registerText}> {i18n.t("register")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.footerWrap}>
          <PrivacyPolicyTextLink
            lang={locale}
            linkStyle={styles.footerLink}
            onPress={openPrivacyPolicy}
            textStyle={styles.footerText}
            variant="loginFooter"
          />
        </View>
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: fs(26),
    fontWeight: "bold",
    color: "#121212",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: fs(16),
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
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: fs(16),
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
    fontSize: fs(18),
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
  footerWrap: {
    marginBottom: 40,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  footerText: {
    fontSize: fs(12),
    color: "#999",
    textAlign: "center",
    lineHeight: lh(18),
  },
  footerLink: {
    fontSize: fs(12),
    lineHeight: lh(18),
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default LoginScreen;
