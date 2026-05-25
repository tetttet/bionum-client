import { BORDER_RADIUS } from "@/constants/params";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { fs } from "@/constants/typography";
import {
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type TabItem = {
  key: string;
  title: string;
  content: ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  theme?: any; // можно расширить тип, если нужно
  useDark?: boolean;
  mh?: number;
  activeButtonColor?: string;
  activeTextColor?: string;
  passiveTextColor?: string;
  passiveButtonColor?: string;
  bgcolor?: string;
};

const TabsContent = ({
  tabs,
  theme,
  useDark,
  mh,
  activeButtonColor,
  activeTextColor,
  passiveTextColor,
  passiveButtonColor,
  bgcolor,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);

  const tabProgress = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const [singleTabWidth, setSingleTabWidth] = useState(0);

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.key === activeTab);
    Animated.parallel([
      Animated.spring(tabProgress, {
        toValue: activeIndex,
        useNativeDriver: true,
        friction: 9,
        tension: 70,
      }),
      Animated.sequence([
        Animated.timing(contentOpacity, {
          toValue: 0.4,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [activeTab, tabProgress, contentOpacity, tabs]);

  const handleHeaderLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout;
    const innerWidth = width - 2;
    setSingleTabWidth(innerWidth / tabs.length);
  };

  const indicatorTranslateX =
    singleTabWidth === 0
      ? 0
      : tabProgress.interpolate({
          inputRange: tabs.map((_, i) => i),
          outputRange: tabs.map((_, i) => i * singleTabWidth),
        });

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.tabHeader,
          {
            marginHorizontal: mh || 22,
          },
        ]}
        onLayout={handleHeaderLayout}
      >
        {singleTabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.tabIndicator,
              {
                width: singleTabWidth,
                transform: [{ translateX: indicatorTranslateX }],
              },
            ]}
          />
        )}

        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Animated.View style={{ opacity: contentOpacity, flex: 1 }}>
        {tabs.map(
          (tab) =>
            activeTab === tab.key && <View key={tab.key}>{tab.content}</View>,
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: BORDER_RADIUS,
    marginBottom: 10,
    padding: 1,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  tabIndicator: {
    position: "absolute",
    top: 1,
    bottom: 1,
    left: 1,
    borderRadius: BORDER_RADIUS - 1,
    backgroundColor: "#2982da",
    color: "#fff",
    elevation: 2,
    shadowColor: "#2982da",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: BORDER_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: fs(18),
    color: "#757575",
  },
  activeTabText: {
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default TabsContent;
