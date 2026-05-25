import { LANGUAGE_KEY } from "@/constants/params";
import { AuthContext } from "@/context/AuthContext";
import { i18n } from "@/data/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Alert,
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
import { fs } from "@/constants/typography";

type ProfileState = {
  name: string;
  middleName: string;
  surname: string;
  email: string;
  password: string;
  dateOfBirth: string; // YYYY-MM-DD
};

export default function ProfileChangeCard() {
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useContext(AuthContext);

  const [, setSelectedLang] = useState("en");

  const [profile, setProfile] = useState<ProfileState>({
    name: "",
    middleName: "",
    surname: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      const savedLang = (await AsyncStorage.getItem(LANGUAGE_KEY)) || "en";
      setSelectedLang(savedLang);
      i18n.locale = savedLang;

      if (user) {
        setProfile({
          name: user.first_name || "",
          middleName: user.middle_name || "",
          surname: user.last_name || "",
          email: user.email || "",
          password: "",
          dateOfBirth: user.date_of_birth || "", // ожидаем YYYY-MM-DD
        });
      }
    };
    loadInitialData();
  }, [user]);

  const validateEmail = useCallback(
    (email: string) => /\S+@\S+\.\S+/.test(email),
    [],
  );

  const handleChange = useCallback((key: keyof ProfileState, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    if (!profile.name.trim())
      return Alert.alert(i18n.t("error"), i18n.t("enterName"));
    if (!profile.surname.trim())
      return Alert.alert(i18n.t("error"), i18n.t("enterSurname"));
    if (!validateEmail(profile.email))
      return Alert.alert(i18n.t("error"), i18n.t("invalidEmail"));

    const updateData = {
      first_name: profile.name,
      middle_name: profile.middleName,
      last_name: profile.surname,
      email: profile.email,
      ...(profile.password ? { password: profile.password } : {}),
    };

    const result = await updateUser(updateData);
    if (result.success) {
      Alert.alert(i18n.t("profileEdited"), i18n.t("profileUpdated"));
    } else {
      Alert.alert(i18n.t("error"), result.error || "Update failed");
    }
  }, [profile, updateUser, validateEmail]);

  const handleReset = useCallback(() => {
    setProfile({
      name: user?.first_name || "",
      middleName: user?.middle_name || "",
      surname: user?.last_name || "",
      email: user?.email || "",
      password: "",
      dateOfBirth: user?.date_of_birth || "",
    });
  }, [user]);

  const fieldsRow = [
    {
      key: "name" as const,
      label: i18n.t("name"),
      placeholder: i18n.t("name"),
    },
    {
      key: "surname" as const,
      label: i18n.t("surname"),
      placeholder: i18n.t("surname"),
    },
  ];

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={[styles.container, styles.containerPadding]}>
            <View style={styles.headerWrap}>
              <Text style={styles.title}>{i18n.t("editProfile")}</Text>
              <Text style={styles.subtitle}>{i18n.t("subtitle")}</Text>
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Имя и фамилия */}
              <View style={styles.row}>
                {fieldsRow.map((f, i) => (
                  <View
                    key={f.key}
                    style={[styles.col, i === 0 ? styles.mr10 : null]}
                  >
                    <Text style={styles.label}>{f.label}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder={f.placeholder}
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="sentences"
                      value={profile[f.key]}
                      onChangeText={(text) => handleChange(f.key, text)}
                    />
                  </View>
                ))}
              </View>

              {/* Отчество */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{i18n.t("middleName")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={i18n.t("middleName")}
                  placeholderTextColor="#9CA3AF"
                  value={profile.middleName}
                  onChangeText={(text) => handleChange("middleName", text)}
                />
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{i18n.t("email")}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="example@mail.com"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={profile.email}
                  onChangeText={(text) => handleChange("email", text)}
                />
              </View>
              {/* Сохранение */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.button}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>{i18n.t("saveChanges")}</Text>
              </TouchableOpacity>

              {/* Сброс */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.ghostButton}
                onPress={handleReset}
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
    borderColor: "#E5E7EB",
    margin: 8,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  container: { flex: 1 },
  containerPadding: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerWrap: { alignItems: "center", marginBottom: 8 },
  title: { fontSize: fs(24), fontWeight: "800", color: "#111827" },
  subtitle: { marginTop: 6, color: "#6B7280", fontSize: fs(13) },

  scrollContent: { paddingTop: 18, paddingBottom: 40 },

  inputGroup: { marginBottom: 14 },
  label: { fontSize: fs(13), color: "#6B7280", marginBottom: 6 },

  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: fs(16),
    color: "#111827",
  },

  row: { flexDirection: "row", marginBottom: 14 },
  col: { flex: 1 },
  mr10: { marginRight: 10 },

  dateButton: { justifyContent: "center" },
  dateText: { color: "#111827" },
  datePlaceholder: { color: "#9CA3AF" },

  button: {
    backgroundColor: "#3594de",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "800", fontSize: fs(16) },

  ghostButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  ghostText: { color: "#111827", fontWeight: "700" },
});
