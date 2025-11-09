import React from "react";
import { StyleSheet, Text, View } from "react-native";

type ProfileCardProps = {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  firstName,
  lastName,
  middleName,
  email,
  dateOfBirth,
}) => {
  const initials = `${firstName[0]?.toUpperCase() || ""}${
    lastName[0]?.toUpperCase() || ""
  }`;

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {firstName} {middleName ? `${middleName} ` : ""}
          {lastName}
        </Text>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.dob}>DOB: {dateOfBirth}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1c1c1e", // Темный фон карточки
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    margin: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0a84ff",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  info: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff", // Основной текст — белый
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#d0d0d0", // Светло-серый для вторичного текста
    marginBottom: 2,
  },
  dob: {
    fontSize: 12,
    color: "#a0a0a0", // Более приглушенный для мелких деталей
  },
});

export default ProfileCard;
