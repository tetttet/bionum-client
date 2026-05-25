import { Ionicons } from "@expo/vector-icons";
import { getAppCopy } from "@/data/appCopy";
import React from "react";
import { fs, lh } from "@/constants/typography";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  lang?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function NumerologyDisclaimer({
  lang,
  style,
  textStyle,
}: Props) {
  const copy = getAppCopy(lang).disclaimer;

  return (
    <View style={[styles.container, style]}>
      <Ionicons
        color="#94A3B8"
        name="information-circle-outline"
        size={15}
        style={styles.icon}
      />
      <Text style={[styles.text, textStyle]}>{copy}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  icon: {
    marginRight: 8,
    marginTop: 1,
  },
  text: {
    flex: 1,
    fontSize: fs(11.5),
    lineHeight: lh(16),
    color: "#64748B",
  },
});
