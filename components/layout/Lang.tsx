import { LANGUAGE_KEY, languages } from "@/constants/params";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { fs } from "@/constants/typography";
import {
  Alert,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ✅ если Expo — поставь: expo install expo-updates
let Updates: any = null;
try {
   
  Updates = require("expo-updates");
} catch (e) {
  Updates = null;
}

type LangCode = string;
const AVATAR_SIZE = 48;

function useLang() {
  const [selectedLang, setSelectedLang] = useState<LangCode>("ru");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved) setSelectedLang(saved);
    })();
  }, []);

  const setLang = async (code: LangCode) => {
    setSelectedLang(code);
    await AsyncStorage.setItem(LANGUAGE_KEY, code);
  };

  return { selectedLang, setLang };
}

const LangButton: React.FC<{
  open: boolean;
  setOpen: (v: boolean) => void;
}> = ({ open, setOpen }) => {
  const { selectedLang } = useLang();

  return (
    <Pressable style={styles.avatar} onPress={() => setOpen(!open)}>
      <Text style={styles.avatarText}>{selectedLang.toUpperCase()}</Text>
    </Pressable>
  );
};

const LangDropdown: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const { selectedLang, setLang } = useLang();

  if (!open) return null;

  const confirmChange = (nextCode: LangCode) => {
    if (nextCode === selectedLang) {
      onClose();
      return;
    }

    Alert.alert(
      "Сменить язык?",
      "Чтобы язык применился полностью, нужно перезагрузить приложение.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Перезагрузить",
          style: "default",
          onPress: async () => {
            await setLang(nextCode);
            onClose();

            // ✅ если Expo — перезагружаем автоматически
            if (Updates?.reloadAsync) {
              await Updates.reloadAsync();
              return;
            }

            // ✅ не Expo — просто сообщаем (сохранение уже сделали)
            Alert.alert(
              "Готово",
              "Язык сохранён. Закройте приложение полностью и откройте снова.",
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.dropdownWrap} pointerEvents="box-none">
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.dropdown}>
        {languages.map((lang) => {
          const active = lang.code === selectedLang;
          return (
            <Pressable
              key={lang.code}
              onPress={() => confirmChange(lang.code)}
              style={({ pressed }) => [
                styles.option,
                active && styles.optionActive,
                pressed && styles.optionPressed,
              ]}
            >
              <Text
                style={[styles.optionText, active && styles.optionTextActive]}
              >
                {lang.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const Lang = {
  Button: LangButton,
  Dropdown: LangDropdown,
};

export default Lang;

const styles = StyleSheet.create({
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: "#EEEEEE",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontWeight: "900",
    fontSize: fs(14),
    color: "#111827",
  },

  dropdownWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: -500,
    zIndex: 99999,
    elevation: 50,
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  dropdown: {
    position: "absolute",
    right: 24,
    top:
      AVATAR_SIZE +
      8 +
      (Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 78),
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 6,
    elevation: 20,
  },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  optionActive: {
    backgroundColor: "#EEF2FF",
  },
  optionPressed: {
    opacity: 0.7,
  },
  optionText: {
    fontSize: fs(14),
    fontWeight: "600",
    color: "#111827",
  },
  optionTextActive: {
    color: "#3ba0ee",
    fontWeight: "800",
  },
});
