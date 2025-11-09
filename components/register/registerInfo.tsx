import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface RegisterInfoProps {
  dateOfBirth: Date | null;
  setDateOfBirth: (date: Date | null) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  handleDateChange: (event: any, date?: Date | undefined) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  i18n: { t: (key: string) => string };
}

const RegisterInfo: React.FC<RegisterInfoProps> = ({
  dateOfBirth,
  showDatePicker,
  setShowDatePicker,
  handleDateChange,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  i18n,
}) => {
  return (
    <View>
      <View style={styles.inputContainer}>
        <Ionicons
          name="calendar-outline"
          size={20}
          color="#4A90E2"
          style={styles.icon}
        />
        <TouchableOpacity
          style={{ flex: 1, height: 50, justifyContent: "center" }}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={{
              color: dateOfBirth ? "#121212" : "#8e8e93",
              fontSize: 16,
            }}
          >
            {dateOfBirth ? dateOfBirth.toLocaleDateString() : i18n.t("dob")}
          </Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth || new Date(2000, 0, 1)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={handleDateChange}
        />
      )}

      {/* Email */}
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

      {/* Пароль */}
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
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#4A90E2"
            style={styles.iconRight}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default RegisterInfo;
