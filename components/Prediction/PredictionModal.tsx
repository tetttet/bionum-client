import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { I18nManager } from "react-native";

import { PredictionCopy, TabKey } from "@/constants/extra/predictionCopy";
import { BLUE } from "@/constants/extra/psychoCopy";
import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { User } from "@/interface/User";
import { getLocale, parseDateOnlyToLocalDate } from "@/utils/_func";

import FeatureModalSheet, {
  FeatureModalItem,
} from "../ui/feature-modal-sheet";
import FutureNumber from "./FutureNumber";
import { LifeCodeByAge } from "./LifeCodeByAge";
import PredictsCouple from "./PredictsCouple";

type PredictionModalProps = {
  visible: boolean;
  onClose: () => void;
  article: string;
  theme: Theme;
  lang: PortraitLang;
  user: User | null;
};

export default function PredictionModal({
  visible,
  onClose,
  article,
  theme,
  lang,
  user,
}: PredictionModalProps) {
  const locale = getLocale(lang);
  const t = PredictionCopy[locale];
  const isRTL = locale === "ar" || I18nManager.isRTL;
  const textAlign = isRTL ? "right" : "left";

  const [openedTab, setOpenedTab] = useState<TabKey | null>(null);
  const { hasPremium, isCheckingPremium } = usePremiumStatus(user?.id, visible);

  const birthDate = useMemo(
    () => parseDateOnlyToLocalDate(user?.date_of_birth) ?? new Date(1981, 10, 20),
    [user?.date_of_birth],
  );

  const tabs = useMemo<FeatureModalItem<TabKey>[]>(
    () => [
      {
        key: "lifeCode",
        label: t.tabs.lifeCode.label,
        title: t.tabs.lifeCode.title,
        subtitle: t.tabs.lifeCode.subtitle,
        premium: true,
      },
      {
        key: "futureNumber",
        label: t.tabs.futureNumber.label,
        title: t.tabs.futureNumber.title,
        subtitle: t.tabs.futureNumber.subtitle,
        premium: true,
      },
      {
        key: "compatibilityForecast",
        label: t.tabs.compatibilityForecast.label,
        title: t.tabs.compatibilityForecast.title,
        subtitle: t.tabs.compatibilityForecast.subtitle,
        premium: true,
      },
    ],
    [t],
  );

  const clearActive = useCallback(() => {
    setOpenedTab(null);
  }, []);

  const goPremium = useCallback(() => {
    onClose();
    setOpenedTab(null);
    router.push("/premium");
  }, [onClose]);

  const renderTabContent = useCallback(
    (key: TabKey) => {
      switch (key) {
        case "lifeCode":
          return <LifeCodeByAge dateOfBirth={birthDate} lang={lang} />;

        case "futureNumber":
          return <FutureNumber dateOfBirth={birthDate} lang={lang} />;

        case "compatibilityForecast":
          return (
            <PredictsCouple
              dateOfBirth={birthDate}
              lang={lang}
              title={t.tabs.compatibilityForecast.label}
            />
          );

        default:
          return null;
      }
    },
    [birthDate, lang, t.tabs.compatibilityForecast.label],
  );

  return (
    <FeatureModalSheet
      visible={visible}
      onClose={onClose}
      theme={theme}
      title={t.heroTitle}
      subtitle={article || t.heroSubtitle}
      blue={BLUE}
      items={tabs}
      activeKey={openedTab}
      setActiveKey={setOpenedTab}
      clearActive={clearActive}
      renderContent={renderTabContent}
      hasPremium={hasPremium}
      isCheckingPremium={isCheckingPremium}
      onRequirePremium={goPremium}
      isRTL={isRTL}
      textAlign={textAlign}
      checkLabel={t.check}
      unlockLabel={t.unlock}
      premiumLabel={t.premium}
      continueLabel={t.but}
    />
  );
}
