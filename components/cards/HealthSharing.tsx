import { Feather, MaterialIcons } from "@expo/vector-icons";

import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../ThemeContext";
import GradientIcon from "../ui/gradient-icon";

export default function HealthSharing() {
  const { theme } = useTheme();
  const isDark = String(theme) === "dark";

  const colors = {
    background: isDark ? "#000" : "#fff",
    text: isDark ? "#fff" : "#000",
    secondaryText: isDark ? "#888" : "#555",
    button: "#007aff",
    buttonText: "#fff",
    cardBackground: isDark ? "#1c1c1e" : "#f2f2f7",
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>Sharing</Text>
      <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
        <View style={styles.headerIcon}>
          <GradientIcon />
          <Text
            style={[
              {
                fontSize: 20,
                marginBottom: 20,
                fontWeight: "600",
                color: colors.text,
              },
            ]}
          >
            Share Your Health Data
          </Text>
        </View>

        <View style={styles.section}>
          <Feather name="bell" size={24} color="#007aff" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Dashboard and Notifications
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Data you share will appear in their Health app. They can also get
              notifications if there’s an update.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Feather name="bell" size={24} color="#007aff" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Dashboard and Notifications
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Data you share will appear in their Health app. They can also get
              notifications if there’s an update.
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <MaterialIcons name="lock-outline" size={24} color="#007aff" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Private and Secure
            </Text>
            <Text style={[styles.sectionText, { color: colors.secondaryText }]}>
              Only a summary of each topic is shared, not the details. The
              information is encrypted and you can stop sharing at any time.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button }]}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Share with Someone
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.buttonOutline]}>
          <Text
            style={[styles.buttonOutlineText, { color: colors.secondaryText }]}
          >
            Ask Someone to Share
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    paddingTop: 80,
    flexGrow: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    borderRadius: 18,
    padding: 20,
  },
  headerIcon: {
    alignItems: "center",
    marginBottom: 20,
  },
  section: {
    flexDirection: "row",
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  buttonOutline: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "rgba(0,0,0,0.05)",
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
