import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { I18nManager, View } from "react-native";

import { Article } from "@/constants/data";
import { BLUE, PsychoCopy, TabKey } from "@/constants/extra/psychoCopy";
import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { User } from "@/interface/User";
import { formatDate, getLocale } from "@/utils/_func";

import MarkdownRender from "../cards/ui/MarkdownRender";
import NumerologyDisclaimer from "../legal/NumerologyDisclaimer";
import NameNumber from "../Matrix/NameNumber";
import FeatureModalSheet, { FeatureModalItem } from "../ui/feature-modal-sheet";
import DestinyNumber from "./DestinyNumber";
import { Psychomatrix } from "./Psychomatrix";
import { PsychomatrixFriend } from "./PsychomatrixFriend";

type PsychoModalProps = {
  visible: boolean;
  onClose: () => void;
  article: Article;
  theme: Theme;
  lang: PortraitLang;
  user: User | null;
};

export default function PsychoModal({
  visible,
  onClose,
  article,
  theme,
  lang,
  user,
}: PsychoModalProps) {
  const locale = getLocale(lang);
  const t = PsychoCopy[locale];
  const isRTL = locale === "ar" || I18nManager.isRTL;
  const textAlign = isRTL ? "right" : "left";

  const [openedTab, setOpenedTab] = useState<TabKey | null>(null);
  const { hasPremium, isCheckingPremium } = usePremiumStatus(user?.id, visible);

  console.log("user?.date_of_birth", user?.date_of_birth);

  const formattedBirthDate = useMemo(
    () => formatDate(user?.date_of_birth || ""),
    [user?.date_of_birth],
  );

  const tabs = useMemo<FeatureModalItem<TabKey>[]>(
    () => [
      {
        key: "birthNumber",
        label: t.tabs.birthNumber.label,
        title: t.tabs.birthNumber.title,
        subtitle: t.tabs.birthNumber.subtitle,
        premium: false,
      },
      {
        key: "nameNumber",
        label: t.tabs.nameNumber.label,
        title: t.tabs.nameNumber.title,
        subtitle: t.tabs.nameNumber.subtitle,
        premium: true,
      },
      {
        key: "psychomatrix",
        label: t.tabs.psychomatrix.label,
        title: t.tabs.psychomatrix.title,
        subtitle: t.tabs.psychomatrix.subtitle,
        premium: true,
      },
      {
        key: "psychomatrixFriend",
        label: t.tabs.psychomatrixFriend.label,
        title: t.tabs.psychomatrixFriend.title,
        subtitle: t.tabs.psychomatrixFriend.subtitle,
        premium: true,
      },
      {
        key: "destinyNumber",
        label: t.tabs.destinyNumber.label,
        title: t.tabs.destinyNumber.title,
        subtitle: t.tabs.destinyNumber.subtitle,
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
        case "birthNumber":
          return (
            <View>
              <MarkdownRender
                markdown={article.markdown || ""}
                textColor={theme.text}
              />
              <NumerologyDisclaimer lang={lang} />
            </View>
          );

        case "nameNumber":
          return <NameNumber user={user} lang={lang} theme={theme} />;

        case "psychomatrix":
          return <Psychomatrix lang={lang} birthDate={formattedBirthDate} />;

        case "psychomatrixFriend":
          return <PsychomatrixFriend lang={lang} />;

        case "destinyNumber":
          return <DestinyNumber user={user} lang={lang} />;

        default:
          return null;
      }
    },
    [article.markdown, formattedBirthDate, lang, theme, user],
  );

  return (
    <FeatureModalSheet
      visible={visible}
      onClose={onClose}
      theme={theme}
      title={article.title}
      subtitle={
        article.subtitle ||
        "Мягкий, живой и воздушный интерфейс в стиле iPhone."
      }
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
