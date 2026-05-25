import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import React, { useMemo } from "react";
import { View } from "react-native";

import HealthCards from "../cards/HealthCards";
import CompaList from "../Compa/CompaList";
import MatrixList from "../Matrix/MatrixList";
import PredictionList from "../Prediction/PredictionList";
import PsychoList from "../Psycho/PsychoList";
import StepCircle from "../steps/StepCircle";
import WeekDays from "../steps/WeekDays";
import TabsContent, { TabItem } from "../ui/tab-content";

type HomeCardKey = "psycho" | "matrix" | "prediction" | "compa";

export default function Tabs({
  theme,
  useDark,
  lang,
}: {
  theme: Theme;
  useDark: boolean;
  lang: PortraitLang;
}) {
  let title = "Главная";
  let stepsTitle = "Шагомер";

  if (lang === "en") {
    title = "Home";
    stepsTitle = "Step Counter";
  } else if (lang === "kz") {
    title = "Басты бет";
    stepsTitle = "Қадам санауыш";
  } else if (lang === "tr") {
    title = "Ana Sayfa";
    stepsTitle = "Adım Sayacı";
  }

  const homeItems = useMemo(
    () =>
      [
        { key: "psycho" as const },
        { key: "matrix" as const },
        { key: "prediction" as const },
        { key: "compa" as const },
      ] satisfies { key: HomeCardKey }[],
    [],
  );

  const renderHomeItem = (item: { key: HomeCardKey }) => {
    switch (item.key) {
      case "psycho":
        return <PsychoList theme={theme} />;
      case "matrix":
        return <MatrixList theme={theme} />;
      case "prediction":
        return <PredictionList theme={theme} />;
      case "compa":
        return <CompaList theme={theme} />;
      default:
        return null;
    }
  };

  const tabs: TabItem[] = [
    {
      key: "home",
      title,
      content: (
        <View
          style={{ paddingHorizontal: 24, paddingTop: 4, paddingBottom: 16 }}
        >
          <View style={{ flexDirection: "column", gap: 4, marginBottom: 4 }}>
            <View style={{ flex: 1 }}>{renderHomeItem(homeItems[0])}</View>
            <View style={{ flex: 1 }}>{renderHomeItem(homeItems[1])}</View>
            <View style={{ flex: 1 }}>{renderHomeItem(homeItems[2])}</View>
            <View style={{ flex: 1 }}>{renderHomeItem(homeItems[3])}</View>
          </View>
        </View>
      ),
    },
    {
      key: "steps",
      title: stepsTitle,
      content: (
        <>
          <StepCircle maxValue={10000} lang={lang} />
          <WeekDays theme={theme} lang={lang} />
          <View style={{ marginTop: -10 }}>
            <HealthCards
              theme={theme.healthCardTheme}
              useDark={useDark}
              lang={lang}
            />
          </View>
        </>
      ),
    },
  ];

  return <TabsContent tabs={tabs} theme={theme} useDark={useDark} />;
}
