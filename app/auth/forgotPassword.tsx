import { COPY } from "@/constants/extra/forgotCopy";
import { LANGUAGE_KEY } from "@/constants/params";
import { API_BASE_URL, AuthContext } from "@/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { fs, lh } from "@/constants/typography";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Alert,
  I18nManager,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Locale = "tr" | "en" | "ru" | "kz";
type Step = "email" | "code" | "password";

const API_URL = `${API_BASE_URL}/api/auth`;

const COLORS = {
  primary: "#2982da",
  primaryDark: "#1f6fbe",
  bg: "#f4f8fc",
  card: "rgba(255,255,255,0.92)",
  text: "#0F172A",
  muted: "#64748B",
  border: "rgba(15,23,42,0.08)",
  success: "#16A34A",
  danger: "#DC2626",
  white: "#FFFFFF",
  shadow: "rgba(15, 23, 42, 0.08)",
};

const SUPPORTED: Locale[] = ["tr", "en", "ru", "kz"];

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatCode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const [locale, setLocale] = useState<Locale>("en");
  const t = COPY[locale];

  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState("");

  const emailInputRef = useRef<TextInput>(null);
  const hiddenCodeInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const prepare = async () => {
        try {
          const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
          if (savedLang && SUPPORTED.includes(savedLang as Locale) && active) {
            setLocale(savedLang as Locale);
          }
        } catch {
          // ignore
        }

        setError("");

        setTimeout(() => {
          if (!active) return;

          if (step === "email") {
            emailInputRef.current?.focus();
          } else if (step === "code") {
            hiddenCodeInputRef.current?.focus();
          } else {
            passwordInputRef.current?.focus();
          }
        }, 200);
      };

      prepare();

      return () => {
        active = false;
      };
    }, [step]),
  );

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const stepIndex = useMemo(() => {
    if (step === "email") return 0;
    if (step === "code") return 1;
    return 2;
  }, [step]);

  const sendCode = async () => {
    Keyboard.dismiss();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError(t.emailRequired);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError(t.invalidEmail);
      return;
    }

    try {
      setLoadingSend(true);

      console.log(
        "Requesting code for email:",
        trimmedEmail,
        "with locale:",
        locale,
      );
      await axios.post(`${API_URL}/forgot-password/send-code`, {
        email: trimmedEmail,
        locale,
      });

      setEmail(trimmedEmail);
      setStep("code");
      setCooldown(60);
      setCode("");
      Alert.alert(t.codeSent);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Request failed");
    } finally {
      setLoadingSend(false);
    }
  };

  const resendCode = async () => {
    if (cooldown > 0 || loadingSend) return;
    await sendCode();
  };

  const verifyCode = async () => {
    Keyboard.dismiss();
    setError("");

    const normalizedCode = formatCode(code);

    if (!normalizedCode) {
      setError(t.codeRequired);
      return;
    }

    if (normalizedCode.length !== 6) {
      setError(t.codeInvalid);
      return;
    }

    try {
      setLoadingVerify(true);

      await axios.post(`${API_URL}/forgot-password/verify-code`, {
        email: email.trim().toLowerCase(),
        code: normalizedCode,
      });

      setStep("password");
      setTimeout(() => passwordInputRef.current?.focus(), 250);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Verify failed");
    } finally {
      setLoadingVerify(false);
    }
  };

  const resetPassword = async () => {
    Keyboard.dismiss();
    setError("");

    const normalizedCode = formatCode(code);

    if (normalizedCode.length !== 6) {
      setError(t.codeInvalid);
      return;
    }

    if (!password) {
      setError(t.passwordRequired);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordShort);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.passwordsMismatch);
      return;
    }

    try {
      setLoadingReset(true);
      await axios.post(`${API_URL}/forgot-password/reset-password`, {
        email: email.trim().toLowerCase(),
        code: normalizedCode,
        password,
      });

      const loginResult = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (!loginResult.success) {
        Alert.alert(t.successReset, t.autoLoginFailed);
        router.replace("/auth/login");
        return;
      }

      Alert.alert(t.successReset);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Reset failed");
    } finally {
      setLoadingReset(false);
    }
  };

  const goBackStep = () => {
    setError("");

    if (step === "password") {
      setStep("code");
      return;
    }

    if (step === "code") {
      setStep("email");
      return;
    }

    router.back();
  };

  const renderStepHeader = () => {
    const labels = [t.stepEmail, t.stepCode, t.stepPassword];

    return (
      <View style={styles.stepperWrap}>
        {labels.map((label, index) => {
          const active = index === stepIndex;
          const completed = index < stepIndex;

          return (
            <React.Fragment key={label}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    active && styles.stepCircleActive,
                    completed && styles.stepCircleDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.stepCircleText,
                      (active || completed) && styles.stepCircleTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  style={[styles.stepLabel, active && styles.stepLabelActive]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </View>

              {index < labels.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    index < stepIndex && styles.stepLineDone,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    );
  };

  const renderCodeBoxes = () => {
    const digits = new Array(6).fill("").map((_, i) => code[i] || "");

    return (
      <Pressable
        onPress={() => hiddenCodeInputRef.current?.focus()}
        style={styles.codeBoxesWrap}
      >
        {digits.map((digit, index) => {
          const isActive =
            code.length === index || (index === 5 && code.length === 6);

          return (
            <View
              key={index}
              style={[styles.codeBox, isActive && styles.codeBoxActive]}
            >
              <Text style={styles.codeBoxText}>{digit || ""}</Text>
            </View>
          );
        })}
      </Pressable>
    );
  };

  const mainLoading = loadingSend || loadingVerify || loadingReset;

  return (
    <View style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.bgGlowTop} />
          <View style={styles.bgGlowBottom} />

          <View style={styles.headerRow}>
            <Pressable onPress={goBackStep} style={styles.backBtn}>
              <Text style={styles.backBtnText}>{t.back}</Text>
            </Pressable>
          </View>

          <View style={styles.hero}>
            <Text
              style={[
                styles.title,
                { textAlign: I18nManager.isRTL ? "right" : "left" },
              ]}
            >
              {t.title}
            </Text>
            <Text
              style={[
                styles.subtitle,
                { textAlign: I18nManager.isRTL ? "right" : "left" },
              ]}
            >
              {t.subtitle}
            </Text>
          </View>

          {renderStepHeader()}

          <View style={styles.card}>
            {step === "email" && (
              <>
                <Text style={styles.label}>{t.emailLabel}</Text>
                <TextInput
                  ref={emailInputRef}
                  value={email}
                  onChangeText={(text) => setEmail(text)}
                  placeholder={t.emailPlaceholder}
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  returnKeyType="done"
                  onSubmitEditing={sendCode}
                />

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <Pressable
                  onPress={sendCode}
                  disabled={loadingSend}
                  style={[
                    styles.primaryBtn,
                    loadingSend && styles.primaryBtnDisabled,
                  ]}
                >
                  {loadingSend ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.primaryBtnText}>{t.sendCode}</Text>
                  )}
                </Pressable>
              </>
            )}

            {step === "code" && (
              <>
                <Text style={styles.label}>{t.codeLabel}</Text>
                <Text style={styles.hint}>{t.codeHint}</Text>

                <TextInput
                  ref={hiddenCodeInputRef}
                  value={code}
                  onChangeText={(text) => setCode(formatCode(text))}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={styles.hiddenCodeInput}
                  autoFocus
                />

                {renderCodeBoxes()}

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <Pressable
                  onPress={verifyCode}
                  disabled={loadingVerify}
                  style={[
                    styles.primaryBtn,
                    loadingVerify && styles.primaryBtnDisabled,
                  ]}
                >
                  {loadingVerify ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.primaryBtnText}>{t.verifyCode}</Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={resendCode}
                  disabled={cooldown > 0 || loadingSend}
                  style={styles.secondaryBtn}
                >
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      cooldown > 0 && styles.secondaryBtnTextDisabled,
                    ]}
                  >
                    {cooldown > 0 ? `${t.resendIn} ${cooldown}s` : t.resendCode}
                  </Text>
                </Pressable>
              </>
            )}

            {step === "password" && (
              <>
                <Text style={styles.label}>{t.passwordLabel}</Text>
                <TextInput
                  ref={passwordInputRef}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t.passwordPlaceholder}
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />

                <Text style={[styles.label, { marginTop: 14 }]}>
                  {t.passwordConfirmLabel}
                </Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t.passwordConfirmPlaceholder}
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                  returnKeyType="done"
                  onSubmitEditing={resetPassword}
                />

                {!!error && <Text style={styles.errorText}>{error}</Text>}

                <Pressable
                  onPress={resetPassword}
                  disabled={loadingReset}
                  style={[
                    styles.primaryBtn,
                    loadingReset && styles.primaryBtnDisabled,
                  ]}
                >
                  {loadingReset ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.primaryBtnText}>
                      {t.changePassword}
                    </Text>
                  )}
                </Pressable>
              </>
            )}

            {mainLoading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.primary} />
                <Text style={styles.loadingText}>{t.loading}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 30,
  },

  bgGlowTop: {
    position: "absolute",
    top: -80,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 220,
    backgroundColor: "rgba(41,130,218,0.18)",
  },
  bgGlowBottom: {
    position: "absolute",
    bottom: -60,
    left: -60,
    width: 200,
    height: 200,
    borderRadius: 200,
    backgroundColor: "rgba(41,130,218,0.12)",
  },

  headerRow: {
    marginBottom: 18,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.82)",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backBtnText: {
    color: COLORS.text,
    fontSize: fs(14),
    fontWeight: "700",
  },

  hero: {
    marginTop: 8,
    marginBottom: 24,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(41,130,218,0.10)",
    borderWidth: 1,
    borderColor: "rgba(41,130,218,0.18)",
    marginBottom: 14,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: fs(13),
    fontWeight: "800",
  },
  title: {
    fontSize: fs(30),
    lineHeight: lh(36),
    fontWeight: "900",
    color: COLORS.text,
    letterSpacing: -0.7,
  },
  subtitle: {
    marginTop: 10,
    fontSize: fs(15),
    lineHeight: lh(23),
    color: COLORS.muted,
    maxWidth: 540,
  },

  stepperWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepItem: {
    alignItems: "center",
    width: 76,
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  stepCircleActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  stepCircleDone: {
    backgroundColor: "rgba(22,163,74,0.14)",
    borderColor: COLORS.success,
  },
  stepCircleText: {
    color: "#475569",
    fontSize: fs(14),
    fontWeight: "800",
  },
  stepCircleTextActive: {
    color: COLORS.white,
  },
  stepLabel: {
    marginTop: 8,
    fontSize: fs(12),
    color: COLORS.muted,
    fontWeight: "700",
    textAlign: "center",
  },
  stepLabelActive: {
    color: COLORS.text,
  },
  stepLine: {
    flex: 1,
    height: 2,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 4,
    marginBottom: 22,
  },
  stepLineDone: {
    backgroundColor: COLORS.success,
  },

  card: {
    borderRadius: 26,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },

  label: {
    color: COLORS.text,
    fontSize: fs(14),
    fontWeight: "800",
    marginBottom: 8,
  },
  hint: {
    color: COLORS.muted,
    fontSize: fs(13),
    lineHeight: lh(20),
    marginBottom: 14,
  },

  input: {
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    color: COLORS.text,
    fontSize: fs(16),
    fontWeight: "600",
  },

  hiddenCodeInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  codeBoxesWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 18,
  },
  codeBox: {
    flex: 1,
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  codeBoxActive: {
    borderColor: COLORS.primary,
    shadowColor: "rgba(41,130,218,0.18)",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  codeBoxText: {
    color: COLORS.text,
    fontSize: fs(24),
    fontWeight: "800",
    letterSpacing: 1,
  },

  errorText: {
    marginTop: 12,
    marginBottom: 2,
    color: COLORS.danger,
    fontSize: fs(13),
    lineHeight: lh(18),
    fontWeight: "600",
  },

  primaryBtn: {
    marginTop: 18,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(41,130,218,0.28)",
    shadowOpacity: 1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  primaryBtnDisabled: {
    opacity: 0.72,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: fs(16),
    fontWeight: "800",
  },

  secondaryBtn: {
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: fs(14),
    fontWeight: "800",
  },
  secondaryBtnTextDisabled: {
    color: "#94A3B8",
  },

  loadingRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: COLORS.muted,
    fontSize: fs(13),
    fontWeight: "600",
  },
});
