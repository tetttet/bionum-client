import MarkdownRender from "@/components/cards/ui/MarkdownRender";
import { getAppCopy } from "@/data/appCopy";
import { useAppLang } from "@/hooks/useAppLang";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fs, lh } from "@/constants/typography";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const lang = useAppLang();
  const copy = useMemo(() => getAppCopy(lang).privacyPolicy, [lang]);

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons color="#111827" name="chevron-back" size={22} />
          </Pressable>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {copy.title}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          <View style={styles.updatedBadge}>
            <Text style={styles.updatedText}>
              {copy.lastUpdatedLabel}: {copy.lastUpdatedValue}
            </Text>
          </View>

          <View style={styles.card}>
            <MarkdownRender
              markdown={copy.markdown}
              textColor="#0e0f11"
              textSize={15}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: fs(16),
    fontWeight: "700",
    color: "#111827",
    marginHorizontal: 12,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: fs(28),
    lineHeight: lh(34),
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 10,
    fontSize: fs(15),
    lineHeight: lh(22),
    color: "#475569",
  },
  updatedBadge: {
    alignSelf: "flex-start",
    marginTop: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#EFF6FF",
  },
  updatedText: {
    fontSize: fs(12),
    fontWeight: "700",
    color: "#2563EB",
  },
  card: {
    marginTop: 18,
    paddingBottom: 8,
    paddingTop: 2,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
});
