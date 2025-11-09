// HomeScreenDemo.tsx
import { useTheme } from "@/components/ThemeContext";
import React from "react";
import { ScrollView, StatusBar, StyleSheet } from "react-native";
import TopCard from "../cards/ui/TopCard";
import Header from "../layout/Header";
import Tabs from "../layout/Tabs";

const HomeScreenDemo: React.FC = () => {
  const { theme, useDark, toggleTheme } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={useDark ? "light-content" : "dark-content"}
        animated
        backgroundColor={theme.pageGradient[0]}
      />

      <Header theme={theme} useDark={useDark} onToggle={toggleTheme} />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TopCard theme={theme} />

        <Tabs theme={theme} useDark={useDark} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 24,
  },
});

export default HomeScreenDemo;
