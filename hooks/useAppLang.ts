// hooks/useAppLang.ts
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { type PortraitLang } from "@/data/dummy/portrait";
import { detectLang } from "@/lang/text/psychoTexts";

export function useAppLang() {
  const [lang, setLang] = useState<PortraitLang>(detectLang());

  useEffect(() => {
    AsyncStorage.getItem("user_language")
      .then((stored) => stored && setLang(stored as PortraitLang))
      .catch((e) =>
        console.warn("Failed to load user_language from AsyncStorage", e),
      );
  }, []);

  return lang;
}