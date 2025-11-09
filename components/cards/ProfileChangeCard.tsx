import { LANGUAGE_KEY } from "@/constants/params";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { I18n } from "i18n-js";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const i18n = new I18n({
  en: {
    editProfile: "Edit Profile",
    subtitle: "Quickly, neatly, and safely",
    name: "Name",
    middleName: "Middle Name",
    surname: "Surname",
    email: "Email",
    password: "Password",
    dateOfBirth: "Date of Birth",
    selectDate: "Select a date",
    saveChanges: "Save Changes",
    reset: "Reset",
    error: "Error",
    saved: "Profile saved",
    enterName: "Enter name",
    enterSurname: "Enter surname",
    invalidEmail: "Invalid email",
    passwordShort: "Password must be at least 4 characters",
  },
  ru: {
    editProfile: "Редактировать профиль",
    subtitle: "Быстро, аккуратно и безопасно",
    name: "Имя",
    middleName: "Отчество",
    surname: "Фамилия",
    email: "Email",
    password: "Пароль",
    dateOfBirth: "Дата рождения",
    selectDate: "Выберите дату",
    saveChanges: "Сохранить изменения",
    reset: "Сбросить",
    error: "Ошибка",
    saved: "Профиль сохранён",
    enterName: "Введите имя",
    enterSurname: "Введите фамилию",
    invalidEmail: "Неверный email",
    passwordShort: "Пароль должен быть не короче 4 символов",
  },
  kz: {
    editProfile: "Профильді өзгерту",
    subtitle: "Жылдам, жинақы және қауіпсіз",
    name: "Аты",
    middleName: "Әкесінің аты",
    surname: "Тегі",
    email: "Email",
    password: "Құпия сөз",
    dateOfBirth: "Туған күні",
    selectDate: "Күнді таңдаңыз",
    saveChanges: "Өзгерістерді сақтау",
    reset: "Қалпына келтіру",
    error: "Қате",
    saved: "Профиль сақталды",
    enterName: "Атыңызды енгізіңіз",
    enterSurname: "Тегіңізді енгізіңіз",
    invalidEmail: "Email дұрыс емес",
    passwordShort: "Құпия сөз кемінде 4 таңбадан тұруы керек",
  },
  tr: {
    editProfile: "Profili Düzenle",
    subtitle: "Hızlı, düzgün ve güvenli",
    name: "Ad",
    middleName: "İkinci Ad",
    surname: "Soyad",
    email: "Email",
    password: "Şifre",
    dateOfBirth: "Doğum Tarihi",
    selectDate: "Bir tarih seçin",
    saveChanges: "Değişiklikleri Kaydet",
    reset: "Sıfırla",
    error: "Hata",
    saved: "Profil kaydedildi",
    enterName: "Adınızı girin",
    enterSurname: "Soyadınızı girin",
    invalidEmail: "Geçersiz email",
    passwordShort: "Şifre en az 4 karakter olmalı",
  },
});
i18n.enableFallback = true;
i18n.defaultLocale = "en";

export default function ProfileChangeCard() {
  const insets = useSafeAreaInsets();
  const [selectedLang, setSelectedLang] = useState<string>("en");

  const [profile, setProfile] = useState({
    name: "",
    middleName: "",
    surname: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const inputsCount = Object.keys(profile).length;
  const animatedValues = useRef(
    Array.from({ length: inputsCount }, () => new Animated.Value(0))
  ).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadLang = async () => {
      const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);
      const lang = savedLang || "en";
      setSelectedLang(lang);
      i18n.locale = lang;
    };
    loadLang();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.stagger(
        80,
        animatedValues.map((av) =>
          Animated.timing(av, {
            toValue: 1,
            duration: 360,
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, [headerAnim, animatedValues]);

  const handleChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("dateOfBirth", selectedDate.toISOString().split("T")[0]);
    }
  };

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSave = () => {
    if (!profile.name.trim())
      return Alert.alert(i18n.t("error"), i18n.t("enterName"));
    if (!profile.surname.trim())
      return Alert.alert(i18n.t("error"), i18n.t("enterSurname"));
    if (!validateEmail(profile.email))
      return Alert.alert(i18n.t("error"), i18n.t("invalidEmail"));
    if (profile.password.length < 4)
      return Alert.alert(i18n.t("error"), i18n.t("passwordShort"));

    Alert.alert(i18n.t("saved"), "", [{ text: "OK" }]);
  };

  const containerPadding = {
    paddingTop: insets.top + 18,
    paddingBottom: Math.max(insets.bottom + 20, 28),
    paddingHorizontal: 20,
  } as const;

  const animStyle = (index: number) => ({
    opacity: animatedValues[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        translateY: animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [10, 0],
        }),
      },
    ],
  });

  const headerStyle = {
    opacity: headerAnim,
    transform: [
      {
        translateY: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 0],
        }),
      },
    ],
  } as const;

  return (
    <View style={[styles.safeArea, { backgroundColor: "#121212" }]}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[styles.container, containerPadding]}>
            <Animated.View style={[styles.headerWrap, headerStyle]}>
              <Text style={styles.title}>{i18n.t("editProfile")}</Text>
              <Text style={styles.subtitle}>{i18n.t("subtitle")}</Text>
            </Animated.View>

            <ScrollView
              contentContainerStyle={{ paddingTop: 18, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View style={[styles.row, animStyle(0)]}>
                {[
                  {
                    key: "name",
                    label: i18n.t("name"),
                    placeholder: i18n.t("name"),
                  },
                  {
                    key: "surname",
                    label: i18n.t("surname"),
                    placeholder: i18n.t("surname"),
                  },
                ].map((f, i) => (
                  <View
                    key={f.key}
                    style={{ flex: 1, marginRight: i === 0 ? 10 : 0 }}
                  >
                    <Text style={styles.label}>{f.label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={f.placeholder}
                      placeholderTextColor="#6b7280"
                      keyboardType="default"
                      autoCapitalize="sentences"
                      value={(profile as any)[f.key]}
                      onChangeText={(text) => handleChange(f.key, text)}
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                  </View>
                ))}
              </Animated.View>

              <Animated.View style={[styles.inputGroup, animStyle(1)]}>
                <Text style={styles.label}>{i18n.t("middleName")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t("middleName")}
                  placeholderTextColor="#6b7280"
                  keyboardType="default"
                  autoCapitalize="sentences"
                  value={profile.middleName}
                  onChangeText={(text) => handleChange("middleName", text)}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </Animated.View>

              <Animated.View style={[styles.inputGroup, animStyle(2)]}>
                <Text style={styles.label}>{i18n.t("email")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@mail.com"
                  placeholderTextColor="#6b7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={profile.email}
                  onChangeText={(text) => handleChange("email", text)}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </Animated.View>

              <Animated.View style={[styles.inputGroup, animStyle(3)]}>
                <Text style={styles.label}>{i18n.t("password")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t("password")}
                  placeholderTextColor="#6b7280"
                  secureTextEntry
                  value={profile.password}
                  onChangeText={(text) => handleChange("password", text)}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
              </Animated.View>

              <Animated.View style={[styles.inputGroup, animStyle(4)]}>
                <Text style={styles.label}>{i18n.t("dateOfBirth")}</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.input, { justifyContent: "center" }]}
                >
                  <Text
                    style={{
                      color: profile.dateOfBirth ? "#f5f5f5" : "#6b7280",
                    }}
                  >
                    {profile.dateOfBirth || i18n.t("selectDate")}
                  </Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={
                      profile.dateOfBirth
                        ? new Date(profile.dateOfBirth)
                        : new Date()
                    }
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )}
              </Animated.View>

              <TouchableOpacity
                activeOpacity={0.86}
                style={styles.button}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>{i18n.t("saveChanges")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.ghostButton}
                onPress={() =>
                  setProfile({
                    name: "",
                    middleName: "",
                    surname: "",
                    email: "",
                    password: "",
                    dateOfBirth: "",
                  })
                }
              >
                <Text style={styles.ghostText}>{i18n.t("reset")}</Text>
              </TouchableOpacity>

              <View style={{ height: Math.max(insets.bottom, 20) }} />
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#2c2c2e",
    margin: 8,
    overflow: "hidden",
  },
  container: { flex: 1 },
  headerWrap: { alignItems: "center", marginBottom: 6, marginTop: -40 },
  title: { fontSize: 24, fontWeight: "700", color: "#ffffff" },
  subtitle: { marginTop: 6, color: "#a1a1aa", fontSize: 13 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, color: "#a1a1aa", marginBottom: 6 },
  input: {
    backgroundColor: "#1c1c1e",
    borderWidth: 1,
    borderColor: "#2c2c2e",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#f5f5f5",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#0a84ff",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#0a84ff",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  ghostButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#2c2c2e",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#1c1c1e",
  },
  ghostText: { color: "#f5f5f5", fontWeight: "600" },
});
