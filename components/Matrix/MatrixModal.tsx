import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { I18nManager } from "react-native";

import { ItemKey, MatrixCopy } from "@/constants/extra/matrixCopy";
import { BLUE } from "@/constants/extra/psychoCopy";
import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { User } from "@/interface/User";
import { formatDate, getLocale } from "@/utils/_func";

import FeatureModalSheet, {
  FeatureModalItem,
} from "../ui/feature-modal-sheet";
import Dharma from "./dHarma";
import KarmicCode from "./KarmicCode";
import LifePathCode from "./LifePathCode";
import Num from "./Num";

type MatrixModalProps = {
  visible: boolean;
  onClose: () => void;
  article: string;
  theme: Theme;
  lang: PortraitLang;
  user: User | null;
  title: string;
  subtitle: string;
};

export default function MatrixModal({
  visible,
  onClose,
  article,
  theme,
  lang,
  user,
  title,
  subtitle,
}: MatrixModalProps) {
  const locale = getLocale(lang);
  const t = MatrixCopy[locale];
  const isRTL = locale === "ar" || I18nManager.isRTL;
  const textAlign = isRTL ? "right" : "left";

  const [openedItem, setOpenedItem] = useState<ItemKey | null>(null);
  const { hasPremium, isCheckingPremium } = usePremiumStatus(user?.id, visible);

  const formattedBirthDate = useMemo(
    () => formatDate(user?.date_of_birth || ""),
    [user?.date_of_birth],
  );

  const items = useMemo<FeatureModalItem<ItemKey>[]>(
    () => [
      {
        key: "lifePathCode",
        label: t.items.lifePathCode.label,
        title: t.items.lifePathCode.title,
        subtitle: t.items.lifePathCode.subtitle,
        premium: true,
      },
      {
        key: "karmicCode",
        label: t.items.karmicCode.label,
        title: t.items.karmicCode.title,
        subtitle: t.items.karmicCode.subtitle,
        premium: true,
      },
      {
        key: "dharma",
        label: t.items.dharma.label,
        title: t.items.dharma.title,
        subtitle: t.items.dharma.subtitle,
        premium: true,
      },
      {
        key: "destinyProblems",
        label: t.items.destinyProblems.label,
        title: t.items.destinyProblems.title,
        subtitle: t.items.destinyProblems.subtitle,
        premium: true,
      },
    ],
    [t],
  );

  const clearActive = useCallback(() => {
    setOpenedItem(null);
  }, []);

  const goPremium = useCallback(() => {
    onClose();
    setOpenedItem(null);
    router.push("/premium");
  }, [onClose]);

  const renderContent = useCallback(
    (key: ItemKey) => {
      switch (key) {
        case "lifePathCode":
          return <LifePathCode user={user} lang={lang} theme={theme} />;

        case "karmicCode":
          return (
            <KarmicCode
              birthDate={formattedBirthDate}
              lang={lang}
              theme={theme}
            />
          );

        case "destinyProblems":
          return <Num birthDate={user?.date_of_birth || ""} lang={lang} />;

        case "dharma":
          return <Dharma birthDate={user?.date_of_birth || ""} lang={lang} />;

        default:
          return null;
      }
    },
    [formattedBirthDate, lang, theme, user],
  );

  return (
    <FeatureModalSheet
      visible={visible}
      onClose={onClose}
      theme={theme}
      title={title}
      subtitle={subtitle || article || t.defaultSubtitle}
      blue={BLUE}
      items={items}
      activeKey={openedItem}
      setActiveKey={setOpenedItem}
      clearActive={clearActive}
      renderContent={renderContent}
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
