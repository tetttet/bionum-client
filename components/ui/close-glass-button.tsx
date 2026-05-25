import React, { useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { fs } from "@/constants/typography";

const CloseGlassButton = ({ closeSheet }: { closeSheet: () => void }) => {
  const pressAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 160,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 140,
    }).start();
  };

  const scaleX = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.06],
  });

  const scaleY = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });

  // Чуть-чуть приглушаем содержимое при зажатии
  const contentOpacity = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.75],
  });

  return (
    <TouchableOpacity
      onPress={closeSheet}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.closeButton}
      accessibilityRole="button"
      accessibilityLabel="Close"
      activeOpacity={1}
    >
      <Animated.View
        style={[
          styles.closeInner,
          {
            transform: [{ scaleX }, { scaleY }],
            opacity: contentOpacity,
          },
        ]}
      >
        <Text style={styles.closeText}>x</Text>
      </Animated.View>
    </TouchableOpacity>
  );
  // return <></>;
};

// ---------- Styles ----------
const styles = StyleSheet.create({
  modalRoot: {
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },
  modalImage: { width: "100%", height: 220 },
  closeButton: {
    position: "absolute",
    top: -10,
    right: 12,
    left: 12,
    zIndex: 10,
    alignItems: "center",
    bottom: 0,
    backgroundColor: "transparent",
  },
  closeInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: fs(18),
    fontWeight: "700",
    color: "rgba(255,255,255,0.75)",
  },
});

export default CloseGlassButton;
