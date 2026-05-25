import React from "react";
import { StyleSheet, Text, View } from "react-native";

import PrivacyPolicyConsentCard from "../legal/PrivacyPolicyConsentCard";
import { fs } from "@/constants/typography";
import { formatDateOnlyForDisplay } from "@/utils/_func";

const SignupConfirmBlock = ({
  name,
  middleName,
  surname,
  dateOfBirth,
  email,
  password,
  i18n,
  lang,
  privacyPolicyAccepted,
  onTogglePrivacyPolicy,
  onOpenPrivacyPolicy,
}: {
  name: string;
  middleName?: string;
  surname: string;
  dateOfBirth?: string | null;
  email: string;
  password: string;
  i18n: any;
  lang: string;
  privacyPolicyAccepted: boolean;
  onTogglePrivacyPolicy: () => void;
  onOpenPrivacyPolicy: () => void;
}) => {
  const fullName = [name, middleName, surname].filter(Boolean).join(" ") || "-";

  const birthDate = dateOfBirth ? formatDateOnlyForDisplay(dateOfBirth) : "-";

  const maskedPassword = password
    ? "•".repeat(Math.max(password.length, 8))
    : "-";

  return (
    <View style={styles.confirmSection}>
      <Text style={styles.confirmTitle}>{i18n.t("confirm")}</Text>

      <View style={styles.confirmBox}>
        <Text style={styles.confirmHint}>{i18n.t("check")}</Text>

        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>{i18n.t("fullName")}</Text>
          <Text style={styles.confirmValue} numberOfLines={2}>
            {fullName}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>{i18n.t("dob")}</Text>
          <Text style={styles.confirmValue}>{birthDate}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>{i18n.t("email")}</Text>
          <Text style={styles.confirmValue} numberOfLines={1}>
            {email || "-"}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.confirmRow}>
          <Text style={styles.confirmLabel}>{i18n.t("password")}</Text>
          <Text style={styles.confirmValue}>{maskedPassword}</Text>
        </View>
      </View>

      <PrivacyPolicyConsentCard
        checked={privacyPolicyAccepted}
        lang={lang}
        onOpenPolicy={onOpenPrivacyPolicy}
        onToggle={onTogglePrivacyPolicy}
      />
    </View>
  );
};

export default SignupConfirmBlock;

const styles = StyleSheet.create({
  confirmSection: {
    marginTop: 24,
  },
  confirmTitle: {
    fontSize: fs(18),
    fontWeight: "700",
    marginBottom: 8,
    color: "#111827", // если тёмная тема — поменяй на #ffffff
  },
  confirmBox: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#F3F4F6", // для тёмной темы можно "rgba(255,255,255,0.04)"
    borderWidth: 1,
    borderColor: "#E5E7EB", // в тёмной теме "rgba(255,255,255,0.08)"
  },
  confirmHint: {
    fontSize: fs(13),
    color: "#6B7280",
    marginBottom: 12,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  confirmLabel: {
    fontSize: fs(14),
    color: "#6B7280",
    flexShrink: 0,
    minWidth: 110,
  },
  confirmValue: {
    fontSize: fs(15),
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "right",
  },
  separator: {
    height: 1,
    backgroundColor: "#E5E7EB",
    opacity: 0.6,
    marginVertical: 8,
  },
});
