import { getAppCopy } from "@/data/appCopy";
import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";
import { fs, lh } from "@/constants/typography";

type Variant = "loginFooter" | "registrationConsent";

type Props = {
  lang?: string;
  variant: Variant;
  onPress: () => void;
  textStyle?: StyleProp<TextStyle>;
  linkStyle?: StyleProp<TextStyle>;
};

export default function PrivacyPolicyTextLink({
  lang,
  variant,
  onPress,
  textStyle,
  linkStyle,
}: Props) {
  const copy = getAppCopy(lang).privacyPolicy;
  const prefix =
    variant === "registrationConsent"
      ? copy.registrationConsentPrefix
      : copy.loginConsentPrefix;
  const linkLabel =
    variant === "registrationConsent"
      ? copy.registrationConsentLinkLabel
      : copy.loginConsentLinkLabel;
  const suffix =
    variant === "registrationConsent"
      ? copy.registrationConsentSuffix
      : copy.loginConsentSuffix;

  return (
    <Text style={[styles.text, textStyle]}>
      {prefix}{" "}
      <Text
        accessibilityRole="link"
        onPress={onPress}
        style={[styles.link, linkStyle]}
      >
        {linkLabel}
      </Text>
      {suffix ? ` ${suffix}` : ""}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#4B5563",
    fontSize: fs(14),
    lineHeight: lh(20),
  },
  link: {
    color: "#1E90FF",
    fontWeight: "700",
  },
});
