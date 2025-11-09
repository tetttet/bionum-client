import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { height: SCREEN_H } = Dimensions.get("window");

const BottomSheet = ({
  visible,
  onClose,
  children,
  snapPoint = SCREEN_H * 0.85,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoint?: number;
}) => {
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 240,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_H - snapPoint,
          duration: 320,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_H,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        // nothing else
      });
    }
  }, [visible, translateY, backdropOpacity, snapPoint]);

  // Dismiss
  const pan = useRef({ y: 0 }).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        // only move downwards
        const dy = Math.max(0, gestureState.dy);
        pan.y = dy;
        translateY.setValue(SCREEN_H - snapPoint + dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose = gestureState.dy > 120 || gestureState.vy > 1.2;
        if (shouldClose) {
          // animate out
          Animated.parallel([
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 180,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: SCREEN_H,
              duration: 220,
              useNativeDriver: true,
            }),
          ]).start(() => onClose());
        } else {
          // snap back
          Animated.timing(translateY, {
            toValue: SCREEN_H - snapPoint,
            duration: 180,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            height: snapPoint,
            transform: [{ translateY }],
          },
        ]}
      >
        <View {...panResponder.panHandlers} style={styles.handleArea}>
          <View style={styles.handle} />
        </View>

        <ScrollView
          contentContainerStyle={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    backgroundColor: "transparent",
  },
  handleArea: { height: 36, alignItems: "center", justifyContent: "center" },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.12)",
  },
  sheetContent: { paddingBottom: 40 },
});
