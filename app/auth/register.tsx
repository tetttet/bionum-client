import RegisterContact from "@/components/register/registerContact";
import RegisterInfo from "@/components/register/registerInfo";
import SignupConfirmBlock from "@/components/register/signupConfirmBlock";
import { LANGUAGE_KEY } from "@/constants/params";
import { AuthContext } from "@/context/AuthContext";
import {
  getAppCopy,
  normalizeAppLanguage,
  PRIVACY_POLICY_VERSION,
} from "@/data/appCopy";
import { i18n } from "@/data/register";
import { PrivacyPolicyConsent } from "@/interface/AuthData";
import {
  parseDateOnlyToLocalDate,
  shiftDateOnlyString,
  toDateOnlyString,
} from "@/utils/_func";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { getLocales } from "expo-localization";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Progress from "react-native-progress";
import { fs } from "@/constants/typography";

const DEFAULT_DATE_OF_BIRTH = "2000-01-01";
const DATE_PICKER_DAY_CORRECTION = -1;

const RegisterScreen = () => {
  const router = useRouter();
  const { register } = useContext(AuthContext);

  // --- form fields
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [pickerDate, setPickerDate] = useState<Date>(
    () =>
      parseDateOnlyToLocalDate(
        shiftDateOnlyString(DEFAULT_DATE_OF_BIRTH, -DATE_PICKER_DAY_CORRECTION),
      ) || new Date(2000, 0, 2),
  );
  const [selectedDateForDebug, setSelectedDateForDebug] =
    useState<Date | null>(null);
  const [selectedDateOnlyForDebug, setSelectedDateOnlyForDebug] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [privacyPolicyConsent, setPrivacyPolicyConsent] =
    useState<PrivacyPolicyConsent>({
      accepted: false,
      accepted_at: null,
      version: PRIVACY_POLICY_VERSION,
    });

  // --- state
  const [locale, setLocale] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- load language
  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLang) {
          const normalized = normalizeAppLanguage(savedLang);
          i18n.locale = normalized;
          setLocale(normalized);
        } else {
          const systemLocale = normalizeAppLanguage(
            getLocales()[0]?.languageCode || "en",
          );
          i18n.locale = systemLocale;
          setLocale(systemLocale);
        }
      } catch (err) {
        console.log("Error loading language:", err);
        i18n.locale = "en";
        setLocale("en");
      } finally {
        setLoading(false);
      }
    };
    loadLanguage();
  }, []);

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      const rawDateOnly = toDateOnlyString(selectedDate);
      const nextDateOfBirth = shiftDateOnlyString(
        rawDateOnly,
        DATE_PICKER_DAY_CORRECTION,
      );

      setPickerDate(selectedDate);
      setDateOfBirth(nextDateOfBirth);
      setSelectedDateForDebug(selectedDate);
      setSelectedDateOnlyForDebug(rawDateOnly);
    }
  };

  const handleShowDatePicker = (show: boolean) => {
    if (show) {
      const rawPickerDate = shiftDateOnlyString(
        dateOfBirth || DEFAULT_DATE_OF_BIRTH,
        -DATE_PICKER_DAY_CORRECTION,
      );

      setPickerDate(
        parseDateOnlyToLocalDate(rawPickerDate) || new Date(2000, 0, 2),
      );
    }
    setShowDatePicker(show);
  };

  const handleTogglePrivacyPolicyConsent = () => {
    setPrivacyPolicyConsent((current) => ({
      ...current,
      accepted: !current.accepted,
      accepted_at: !current.accepted ? new Date().toISOString() : null,
    }));
  };

  const openPrivacyPolicy = () => {
    router.push("/privacy-policy");
  };

  // --- register user
  const handleRegister = async () => {
    if (!name || !surname || !dateOfBirth || !email || !password) {
      Alert.alert(i18n.t("error"), i18n.t("fillAllFields"));
      return;
    }

    if (!privacyPolicyConsent.accepted) {
      Alert.alert(
        i18n.t("error"),
        getAppCopy(locale || "en").privacyPolicy.consentRequiredAlert,
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    const formattedDateOfBirth = dateOfBirth;

    const data = {
      first_name: name,
      middle_name: middleName || undefined,
      last_name: surname,
      date_of_birth: formattedDateOfBirth || undefined,
      email,
      password,
      privacy_policy_consent: {
        ...privacyPolicyConsent,
        accepted_at:
          privacyPolicyConsent.accepted_at || new Date().toISOString(),
      },
    };

    if (__DEV__) {
      console.log("[REGISTER DOB DEBUG]", {
        selectedDateRaw: selectedDateForDebug,
        selectedDateOnlyRaw: selectedDateOnlyForDebug,
        selectedLocalDate: formattedDateOfBirth,
        payloadDateOfBirth: data.date_of_birth,
        timezoneOffset: selectedDateForDebug?.getTimezoneOffset(),
      });
    }

    const res = await register(data);
    setSubmitting(false);

    if (res.success) {
      Alert.alert(i18n.t("success"), i18n.t("accountCreated"));
      router.push("/(tabs)");
    } else {
      setError(res.error || i18n.t("registrationFailed"));
    }
  };

  if (loading) return <Text>{i18n.t("loading")}</Text>;
  const progress = step / totalSteps;
  const isNextDisabled =
    (step === 1 && (!name || !surname)) ||
    (step === 2 && (!dateOfBirth || !email || !password));
  const isSubmitDisabled = !privacyPolicyConsent.accepted || submitting;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* progress bar */}
        <Progress.Bar
          progress={progress}
          width={null}
          height={8}
          borderRadius={10}
          color="#1E90FF"
          unfilledColor="#eee"
          borderWidth={0}
          style={{ marginBottom: 25, marginTop: 50 }}
        />

        <ScrollView
          contentContainerStyle={{
            padding: 10,
            flexGrow: 1,
            justifyContent: "center",
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={require("../../assets/images/auth/lang.gif")}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.title}>{i18n.t("welcome")}</Text>
          <Text style={styles.subtitle}>{i18n.t("registerSubtitle")}</Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Step 1 */}
          {step === 1 && (
            <RegisterContact
              name={name}
              setName={setName}
              middleName={middleName}
              setMiddleName={setMiddleName}
              surname={surname}
              setSurname={setSurname}
              i18n={i18n}
            />
          )}

          {/* Step 2 */}
          {step === 2 && (
            <RegisterInfo
              dateOfBirth={dateOfBirth}
              pickerDate={pickerDate}
              showDatePicker={showDatePicker}
              setShowDatePicker={handleShowDatePicker}
              handleDateChange={handleDateChange}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              i18n={i18n}
              lang={locale || "en"}
            />
          )}

          {/* Step 3 — confirmation */}
          {step === 3 && (
            <SignupConfirmBlock
              name={name}
              middleName={middleName}
              surname={surname}
              dateOfBirth={dateOfBirth}
              email={email}
              password={password}
              i18n={i18n}
              lang={locale || "en"}
              privacyPolicyAccepted={privacyPolicyConsent.accepted}
              onOpenPrivacyPolicy={openPrivacyPolicy}
              onTogglePrivacyPolicy={handleTogglePrivacyPolicyConsent}
            />
          )}

          {/* Navigation buttons */}
          <View style={styles.navButtons}>
            {step > 1 && (
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backText}>{i18n.t("back")}</Text>
              </TouchableOpacity>
            )}

            {step < totalSteps && (
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  {
                    backgroundColor:
                      (step === 1 && name && surname) ||
                      (step === 2 && dateOfBirth && email && password)
                        ? "#1E90FF"
                        : "#ccc",
                  },
                ]}
                onPress={handleNext}
                disabled={isNextDisabled}
              >
                <Text style={styles.buttonText}>{i18n.t("next")}</Text>
              </TouchableOpacity>
            )}

            {step === totalSteps && (
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  {
                    backgroundColor: isSubmitDisabled ? "#ccc" : "#1E90FF",
                  },
                ]}
                onPress={handleRegister}
                disabled={isSubmitDisabled}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>{i18n.t("finish")}</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* login link */}
          <View style={styles.registerContainer}>
            <Text style={{ color: "#666" }}>{i18n.t("haveAccount")}</Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={styles.registerText}> {i18n.t("login")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  image: {
    width: "80%",
    height: 220,
    marginTop: -70,
    borderRadius: 16,
    marginBottom: 20,
    alignSelf: "center",
  },
  confirmTitle: { fontSize: fs(18), fontWeight: "700", marginBottom: 10 },
  confirmBox: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 12,
    gap: 6,
  },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  nextButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  backButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#eee",
    marginRight: 10,
  },
  buttonText: { color: "#fff", fontSize: fs(18), fontWeight: "700" },
  backText: { color: "#333", fontSize: fs(18), fontWeight: "600" },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  registerText: { color: "#1E90FF", fontWeight: "600" },
  errorText: { color: "red", textAlign: "center", marginBottom: 10 },
});

export default RegisterScreen;
