import { Ionicons } from "@expo/vector-icons";
import { getAppCopy } from "@/data/appCopy";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import PrivacyPolicyTextLink from "./PrivacyPolicyTextLink";
import { fs, lh } from "@/constants/typography";

type Props = {
  checked: boolean;
  lang?: string;
  onToggle: () => void;
  onOpenPolicy: () => void;
};

export default function PrivacyPolicyConsentCard({
  checked,
  lang,
  onToggle,
  onOpenPolicy,
}: Props) {
  const copy = getAppCopy(lang).privacyPolicy;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked }}
          onPress={onToggle}
          style={styles.checkboxButton}
        >
        <Ionicons
          color={checked ? "#1E90FF" : "#9CA3AF"}
          name={checked ? "checkbox" : "square-outline"}
          size={24}
        />
        </Pressable>

        <View style={styles.textWrap}>
          <PrivacyPolicyTextLink
            lang={lang}
            onPress={onOpenPolicy}
            variant="registrationConsent"
          />
          {!checked ? (
            <Text style={styles.hint}>{copy.consentRequiredHint}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    backgroundColor: "#F8FBFF",
    padding: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxButton: {
    marginRight: 12,
    marginTop: 1,
  },
  textWrap: {
    flex: 1,
  },
  hint: {
    marginTop: 8,
    fontSize: fs(12),
    lineHeight: lh(17),
    color: "#6B7280",
  },
});
