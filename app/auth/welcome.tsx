import { LANGUAGE_KEY } from "@/constants/params";
import { i18n } from "@/data/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let alive = true;

      const run = async () => {
        try {
          const savedLang = await AsyncStorage.getItem(LANGUAGE_KEY);

          // Если языка нет — выбираем язык в wiza
          if (!savedLang) {
            router.replace("/auth/wiza");
            return;
          }

          // Язык есть — ставим locale
          i18n.locale = savedLang;

          // Вариант А: всегда показывать вступительный wiza
          router.replace("/auth/wiza");

          // Вариант Б: если хочешь пропускать wiza и сразу на register — раскомментируй:
          // router.replace("/auth/register");
        } catch (e) {
          console.log("Language load error", e);
          i18n.locale = "en";
          router.replace("/auth/wiza");
        } finally {
          if (alive) setLoading(false);
        }
      };

      run();

      return () => {
        alive = false;
      };
    }, [router]),
  );

  if (!loading) return null;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator />
      <Text style={{ marginTop: 10 }}>Loading...</Text>
    </View>
  );
}
