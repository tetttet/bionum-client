// HomeScreenDemo.tsx
import { useTheme } from "@/components/ThemeContext";
import { AuthContext } from "@/context/AuthContext";
import { PortraitLang } from "@/data/dummy/portrait";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import TopCard from "../cards/ui/TopCard";
import TopCardAff from "../cards/ui/TopCardAff";
import Header from "../layout/Header";
import Tabs from "../layout/Tabs";

const HomeScreenDemo: React.FC = () => {
  const { theme, useDark, toggleTheme } = useTheme();
  const { user, loading } = useContext(AuthContext);
  const [lang, setLang] = useState<PortraitLang>("ru" as PortraitLang);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const storedLang = await AsyncStorage.getItem("user_language");
        if (storedLang && mounted) {
          setLang(storedLang as PortraitLang);
        }
      } catch (e) {
        console.warn("Failed to load user_language from AsyncStorage", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading || !user) {
    return null; // Или можно вернуть спиннер загрузки
  }

  return (
    <>
      <StatusBar
        barStyle={useDark ? "light-content" : "dark-content"}
        animated
        backgroundColor={theme.pageGradient[0]}
      />

      <Header
        theme={theme}
        useDark={useDark}
        onToggle={toggleTheme}
        user={user!}
      />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TopCard theme={theme} user={user} />
        <TopCardAff theme={theme} user={user} />

        <Tabs theme={theme} useDark={useDark} lang={lang} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 0,
    paddingTop: 16,
    paddingBottom: 84,
  },
});

export default HomeScreenDemo;
