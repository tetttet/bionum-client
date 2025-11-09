import RegisterContact from "@/components/register/registerContact";
import RegisterInfo from "@/components/register/registerInfo";
import { LANGUAGE_KEY } from "@/constants/params";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { useRouter } from "expo-router";
import { I18n } from "i18n-js";
import React, { useEffect, useState } from "react";
import {
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

// --- Настройка языков
const i18n = new I18n({
  en: {
    welcome: "Welcome!",
    registerSubtitle: "Create your account",
    name: "First Name",
    middleName: "Middle Name (optional)",
    surname: "Last Name",
    dob: "Date of Birth",
    email: "Email",
    password: "Password",
    register: "Register",
    haveAccount: "Already have an account?",
    login: "Login",
    next: "Next",
    back: "Back",
    confirm: "Confirm Info",
    finish: "Finish",
  },
  ru: {
    welcome: "Добро пожаловать!",
    registerSubtitle: "Создайте свой аккаунт",
    name: "Имя",
    middleName: "Отчество (необязательное)",
    surname: "Фамилия",
    dob: "Дата рождения",
    email: "Email",
    password: "Пароль",
    register: "Зарегистрироваться",
    haveAccount: "Уже есть аккаунт?",
    login: "Войти",
    next: "Далее",
    back: "Назад",
    confirm: "Подтверждение данных",
    finish: "Завершить",
  },
  kz: {
    welcome: "Қош келдіңіз!",
    registerSubtitle: "Есептік жазба жасаңыз",
    name: "Аты",
    middleName: "Әкесінің аты (міндетті емес)",
    surname: "Тегі",
    dob: "Туған күні",
    email: "Email",
    password: "Құпия сөз",
    register: "Тіркелу",
    haveAccount: "Есептік жазбаңыз бар ма?",
    login: "Кіру",
    next: "Келесі",
    back: "Артқа",
    confirm: "Деректерді растау",
    finish: "Аяқтау",
  },
  tr: {
    welcome: "Hoş geldiniz!",
    registerSubtitle: "Hesap oluşturun",
    name: "Ad",
    middleName: "İkinci ad (isteğe bağlı)",
    surname: "Soyad",
    dob: "Doğum Tarihi",
    email: "Email",
    password: "Şifre",
    register: "Kayıt Ol",
    haveAccount: "Zaten hesabınız var mı?",
    login: "Giriş Yap",
    next: "İleri",
    back: "Geri",
    confirm: "Bilgileri Onayla",
    finish: "Bitir",
  },
});

i18n.enableFallback = true;
i18n.defaultLocale = "en";

const RegisterScreen = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [surname, setSurname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [locale, setLocale] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleRegister = () => {
    console.log({
      name,
      middleName,
      surname,
      dateOfBirth,
      email,
      password,
    });
    router.push("/(tabs)");
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDateOfBirth(selectedDate);
  };

  if (loading) return <Text>Loading...</Text>;

  const progress = step / totalSteps;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        {/* Прогресс */}
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

          {/* --- Шаги --- */}
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

          {step === 2 && (
            <RegisterInfo
              dateOfBirth={dateOfBirth || null}
              setDateOfBirth={(date) => setDateOfBirth(date || undefined)}
              showDatePicker={showDatePicker}
              setShowDatePicker={setShowDatePicker}
              handleDateChange={handleDateChange}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              i18n={i18n}
            />
          )}

          {step === 3 && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.confirmTitle}>{i18n.t("confirm")}</Text>
              <View style={styles.confirmBox}>
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  {name} {middleName} {surname}
                </Text>
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  {dateOfBirth?.toLocaleDateString() || "-"}
                </Text>
                <Text style={{ fontWeight: "600", fontSize: 16 }}>{email}</Text>
                <Text style={{ fontWeight: "600", fontSize: 16 }}>
                  {password}
                </Text>
              </View>
            </View>
          )}

          {/* --- Кнопки управления --- */}
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
                      (step === 2 && email && password)
                        ? "#1E90FF"
                        : "#ccc",
                  },
                ]}
                onPress={handleNext}
                disabled={
                  (step === 1 && (!name || !surname)) ||
                  (step === 2 && (!email || !password))
                }
              >
                <Text style={styles.buttonText}>{i18n.t("next")}</Text>
              </TouchableOpacity>
            )}
            {step === totalSteps && (
              <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: "#1E90FF" }]}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>{i18n.t("finish")}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* --- Ссылка на логин --- */}
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
  image: {
    width: "80%",
    height: 220,
    marginTop: -70,
    borderRadius: 16,
    marginBottom: 20,
    alignSelf: "center",
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  backText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  registerText: {
    color: "#1E90FF",
    fontWeight: "600",
  },
});

export default RegisterScreen;
