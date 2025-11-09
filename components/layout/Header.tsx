// App.tsx
import { Theme } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const getCurrentDay = (): string => {
  try {
    return new Date().toLocaleDateString("ru-RU", { weekday: "short" });
  } catch {
    return new Date().toDateString();
  }
};

const Header: React.FC<{
  theme: Theme;
  useDark: boolean;
  onToggle: () => void;
}> = ({ theme, useDark, onToggle }) => {
  return (
    <View style={{ width: "100%", backgroundColor: theme.background }}>
      <LinearGradient
        colors={Math.random() < 0.5 ? theme.pageGradient : theme.pageGradient2}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.headerGradient, { backgroundColor: theme.background }]}
      >
        <View style={styles.headerInner}>
          <Text style={[styles.headerTitle, { color: theme.mainTitle }]}>
            BioNum
          </Text>

          <View style={styles.headerRight}>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              onPress={onToggle}
              style={[
                styles.themeToggle,
                { backgroundColor: theme.avatarBackground },
              ]}
            >
              {useDark ? (
                <Ionicons name="moon" size={18} color={theme.title} />
              ) : (
                <Ionicons name="sunny" size={18} color={theme.title} />
              )}
            </TouchableOpacity> */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onToggle}
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.avatarBackground,
                  borderColor: "rgba(255,255,255,0.08)",
                  marginRight: 8,
                },
              ]}
            >
              <Text style={{ color: theme.title, fontWeight: "600" }}>
                {getCurrentDay()}
              </Text>
            </TouchableOpacity>

            <View
              style={[
                styles.avatar,
                {
                  backgroundColor: theme.avatarBackground,
                  borderColor: "rgba(255,255,255,0.08)",
                },
              ]}
            >
              <Link href="/auth/wizard" asChild>
                <Text style={{ color: theme.title, fontWeight: "700" }}>
                  TG
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 24 : 78,
    paddingBottom: 28,
    borderRadius: 28,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  themeToggle: {
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
  },
});

export default Header;
