// components/Compa/CompaList.tsx
import React, { useContext, useState } from "react";
import { View } from "react-native";

import { Theme } from "@/constants/theme";
import { AuthContext } from "@/context/AuthContext";
import { getAppCopy } from "@/data/appCopy";
import { User } from "@/interface/User";

import { useAppLang } from "@/hooks/useAppLang";
import HomeCard from "../ui/HomeCard";
import CompaModal from "./CompaModal";

export default function CompaList({ theme }: { theme: Theme }) {
  const { user } = useContext(AuthContext) as { user: User | null };
  const lang = useAppLang();
  const cardCopy = getAppCopy(lang).homeCards.compatibility;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <HomeCard
        theme={theme}
        title={cardCopy.title}
        subtitle={cardCopy.subtitle}
        onPress={() => setModalVisible(true)}
      />

      <CompaModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        article={"ghbdtn"}
        theme={theme}
        lang={lang}
        user={user}
        title={cardCopy.title}
        subtitle={cardCopy.subtitle}
      />
    </View>
  );
}
