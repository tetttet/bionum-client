// components/Prediction/PredictionList.tsx
import React, { useContext, useState } from "react";
import { View } from "react-native";

import { Theme } from "@/constants/theme";
import { AuthContext } from "@/context/AuthContext";
import { getAppCopy } from "@/data/appCopy";
import { User } from "@/interface/User";

import { useAppLang } from "@/hooks/useAppLang";
import HomeCard from "../ui/HomeCard";
import PredictionModal from "./PredictionModal";

export default function PredictionList({ theme }: { theme: Theme }) {
  const { user } = useContext(AuthContext) as { user: User | null };
  const lang = useAppLang();
  const cardCopy = getAppCopy(lang).homeCards.prediction;

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <HomeCard
        theme={theme}
        title={cardCopy.title}
        subtitle={cardCopy.subtitle}
        onPress={() => setModalVisible(true)}
      />

      <PredictionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        article={cardCopy.subtitle}
        theme={theme}
        lang={lang}
        user={user}
      />
    </View>
  );
}
