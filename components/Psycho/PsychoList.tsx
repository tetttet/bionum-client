// components/Psycho/PsychoList.tsx
import React, { useContext, useEffect, useMemo, useState } from "react";
import { View } from "react-native";

import { Theme } from "@/constants/theme";
import { AuthContext } from "@/context/AuthContext";
import { getPortraitByNumber, type PortraitItem } from "@/data/dummy/portrait";

import { Article } from "@/constants/data";
import { User } from "@/interface/User";
import { getPsychoArticle } from "@/lang/docs/psycho";
import { formatDate, getDateParts } from "@/utils/_func";
import PsychoModal from "./PsychoModal";

import { useAppLang } from "@/hooks/useAppLang";
import { PsychoDict } from "@/lang/text/psychoTexts";
import HomeCard from "../ui/HomeCard";

function getBirthDay(date?: string) {
  return getDateParts(date)?.day ?? null;
}

export default function PsychoList({ theme }: { theme: Theme }) {
  const { user } = useContext(AuthContext) as { user: User | null };
  const lang = useAppLang();

  const [modalVisible, setModalVisible] = useState(false);
  const [portrait, setPortrait] = useState<PortraitItem | null>(null);

  const t = PsychoDict[lang];

  useEffect(() => {
    if (!user?.date_of_birth) {
      setPortrait(null);
      return;
    }
    const day = getBirthDay(user.date_of_birth);
    if (!day) {
      setPortrait(null);
      return;
    }

    if (day >= 1 && day <= 31)
      setPortrait(getPortraitByNumber(lang, day) || null);
    else setPortrait(null);
  }, [user?.date_of_birth, lang]);

  const article: Article = useMemo(() => {
    if (!portrait || !user?.date_of_birth) return getPsychoArticle(lang);

    const day = getBirthDay(user.date_of_birth);
    if (!day) return getPsychoArticle(lang);

    const fullName = [user.first_name, user.middle_name, user.last_name]
      .filter(Boolean)
      .join(" ");

    const markdown = `
## ${t.youNumber}: ${day}

**${t.name}:** ${fullName || "User"}  
**${t.dob}:** ${formatDate(user.date_of_birth)}

## ${t.sections.data}
${portrait.data}

## ${t.sections.abilities}
${portrait.abilities}

## ${t.sections.weaknesses}
${portrait.weaknesses}
`;

    return { ...getPsychoArticle(lang), markdown };
  }, [portrait, user, lang, t]);

  return (
    <View style={{ flex: 1 }}>
      <HomeCard
        theme={theme}
        title={article.title}
        subtitle={article.subtitle}
        onPress={() => setModalVisible(true)}
      />

      <PsychoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        article={article}
        theme={theme}
        lang={lang}
        user={user}
      />
    </View>
  );
}
