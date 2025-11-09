import { Theme } from "@/constants/theme";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import HealthCards from "../cards/HealthCards";
import SummaryScreen from "../screens/SummaryScreen";
import StepCounter from "../steps/StepCounter";

const Tabs = ({ theme, useDark }: { theme: Theme; useDark: boolean }) => {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");

  return (
    <View style={styles.container}>
      <View style={styles.tabHeader}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "tab1" && styles.activeTab]}
          onPress={() => setActiveTab("tab1")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "tab1" && styles.activeTabText,
            ]}
          >
            Главная
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === "tab2" && styles.activeTab]}
          onPress={() => setActiveTab("tab2")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "tab2" && styles.activeTabText,
            ]}
          >
            Шагомер
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        {activeTab === "tab1" ? (
          <>
            {/* <SectionCard
              theme={theme}
              sectionLabel="MENTAL WELLBEING"
              icon={<MaterialCommunityIcons name="brain" size={28} />}
              title="Mental Health Questionnaire"
              description="Along with regular reflection, assessing your current risk for common conditions can be an important part of caring for your mental health."
              pillText="Take Questionnaire"
            /> */}

            <View style={{ height: 48 }} />

            <SummaryScreen theme={theme} />
          </>
        ) : (
          <>
            <StepCounter theme={theme} />
            <HealthCards theme={theme.healthCardTheme} useDark={useDark} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: "row",
    backgroundColor: "#0d0d0d",

    borderWidth: 1,
    borderColor: "#181818",
    borderRadius: 16,

    marginHorizontal: 22,
    marginBottom: 10,

    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    color: "#fff",
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Tabs;
