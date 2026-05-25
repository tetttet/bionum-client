import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { I18nManager } from "react-native";

import { CompaCopy, ItemKey } from "@/constants/extra/compaCopy";
import { BLUE } from "@/constants/extra/psychoCopy";
import { Theme } from "@/constants/theme";
import { PortraitLang } from "@/data/dummy/portrait";
import { usePremiumStatus } from "@/hooks/usePremiumStatus";
import { User } from "@/interface/User";
import { getLocale, parseDateOnlyToLocalDate } from "@/utils/_func";

import FeatureModalSheet, {
  FeatureModalItem,
} from "../ui/feature-modal-sheet";
import CompaName from "./CompaName";
import CompaNumber from "./CompaNumber";
import KarmicConnection from "./KarmicConnection";

type CompaModalProps = {
  visible: boolean;
  onClose: () => void;
  article: string;
  theme: Theme;
  lang: PortraitLang;
  user: User | null;
  title: string;
  subtitle: string;
};

export default function CompaModal({
  visible,
  onClose,
  article,
  theme,
  lang,
  user,
  title,
  subtitle,
}: CompaModalProps) {
  const locale = getLocale(lang);
  const t = CompaCopy[locale];
  const isRTL = locale === "ar" || I18nManager.isRTL;
  const textAlign = isRTL ? "right" : "left";

  const [openedItem, setOpenedItem] = useState<ItemKey | null>(null);
  const { hasPremium, isCheckingPremium } = usePremiumStatus(user?.id, visible);

  const birthDate = useMemo(
    () => parseDateOnlyToLocalDate(user?.date_of_birth) ?? new Date(1981, 10, 20),
    [user?.date_of_birth],
  );

  const items = useMemo<FeatureModalItem<ItemKey>[]>(
    () => [
      {
        key: "compatibilityDestiny",
        label: t.items.compatibilityDestiny.label,
        title: t.items.compatibilityDestiny.title,
        subtitle: t.items.compatibilityDestiny.subtitle,
        premium: true,
      },
      {
        key: "compatibilityName",
        label: t.items.compatibilityName.label,
        title: t.items.compatibilityName.title,
        subtitle: t.items.compatibilityName.subtitle,
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
        case "compatibilityDestiny":
          return <CompaNumber dateOfBirth={birthDate} lang={lang} />;

        case "compatibilityName":
          return (
            <CompaName
              partner1Label={t.partnerYou}
              partner2Label={t.partnerOther}
              partner1Initial={{
                firstName: user?.first_name || "",
                lastName: user?.last_name || "",
                middleName: user?.middle_name || "",
              }}
              locale={lang}
            />
          );

        case "karmicConnection":
          return <KarmicConnection />;

        default:
          return null;
      }
    },
    [birthDate, lang, t.partnerOther, t.partnerYou, user],
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
