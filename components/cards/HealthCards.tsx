import { Theme } from "@/constants/theme";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { HORIZONTAL_MARGIN } from "../steps/WeekDays";

import HealthCardItem from "@/components/steps/HealthCardItem";
import { PortraitLang } from "@/data/dummy/portrait";

export default function HealthCards({
  theme,
  useDark,
  lang,
}: {
  theme: Theme["healthCardTheme"];
  useDark: boolean;
  lang: PortraitLang;
}) {
  const { width } = Dimensions.get("window");
  const rowWidth = width - HORIZONTAL_MARGIN * 2;

  return (
    <View style={styles.container}>
      <View style={{ width: rowWidth }}>
        <HealthCardItem
          theme={theme}
          darkMode={useDark}
          type="activeEnergy"
          style={{ marginBottom: 14 }}
          lang={lang}
        />

        <HealthCardItem
          theme={theme}
          darkMode={useDark}
          type="steps"
          lang={lang}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 20,
    alignItems: "center",
  },
});
