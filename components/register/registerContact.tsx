import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type RegisterContactProps = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  middleName: string;
  setMiddleName: React.Dispatch<React.SetStateAction<string>>;
  surname: string;
  setSurname: React.Dispatch<React.SetStateAction<string>>;
  i18n: { t: (key: string) => string };
};

const RegisterContact: React.FC<RegisterContactProps> = ({
  name,
  setName,
  middleName,
  setMiddleName,
  surname,
  setSurname,
  i18n,
}) => {
  return (
    <View>
      {/* Имя */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#4A90E2"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("name")}
          placeholderTextColor="#8e8e93"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Отчество */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#4A90E2"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("middleName")}
          placeholderTextColor="#8e8e93"
          value={middleName}
          onChangeText={setMiddleName}
        />
      </View>

      {/* Фамилия */}
      <View style={styles.inputContainer}>
        <Ionicons
          name="person-outline"
          size={20}
          color="#4A90E2"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={i18n.t("surname")}
          placeholderTextColor="#8e8e93"
          value={surname}
          onChangeText={setSurname}
        />
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

export default RegisterContact;
