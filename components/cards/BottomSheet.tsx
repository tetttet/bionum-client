import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_H } = Dimensions.get("window");
const HANDLE_AREA_HEIGHT = 44;
const MAX_TOP_GAP = 12;
const BACKDROP_OPACITY = 0.36;

const BottomSheet = ({
  visible,
  onClose,
  children,
  snapPoint = SCREEN_H * 0.95,
  scrollEnabled = true,
  handleBackgroundColor = "#FFFFFF",
  handleMode = "inline",
  handleColor = "rgba(16,24,40,0.18)",
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoint?: number;
  scrollEnabled?: boolean;
  handleBackgroundColor?: string;
  handleMode?: "inline" | "overlay" | "hidden";
  handleColor?: string;
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_H)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(visible);
  const onCloseRef = useRef(onClose);
  const sheetHeight = useMemo(
    () =>
      Math.max(
        320,
        Math.min(snapPoint, SCREEN_H - Math.max(insets.top, MAX_TOP_GAP)),
      ),
    [insets.top, snapPoint],
  );
  const sheetHeightRef = useRef(sheetHeight);
  const restingTranslateY = SCREEN_H - sheetHeight;
  const restingTranslateYRef = useRef(restingTranslateY);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    sheetHeightRef.current = sheetHeight;
  }, [sheetHeight]);

  useEffect(() => {
    restingTranslateYRef.current = restingTranslateY;
  }, [restingTranslateY]);

  const animateTo = useCallback(
    (toValue: number, backdropValue: number, onDone?: () => void) => {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: backdropValue,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue,
          duration: 280,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) {
          onDone?.();
        }
      });
    },
    [backdropOpacity, translateY],
  );

  const closeWithAnimation = useCallback(() => {
    animateTo(SCREEN_H, 0, () => {
      setIsMounted(false);
      onCloseRef.current();
    });
  }, [animateTo]);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      return;
    }

    if (!isMounted) {
      return;
    }

    animateTo(SCREEN_H, 0, () => {
      setIsMounted(false);
    });
  }, [animateTo, isMounted, visible]);

  useEffect(() => {
    if (!isMounted || !visible) {
      return;
    }

    translateY.setValue(SCREEN_H);
    backdropOpacity.setValue(0);

    const frame = requestAnimationFrame(() => {
      animateTo(restingTranslateY, BACKDROP_OPACITY);
    });

    return () => cancelAnimationFrame(frame);
  }, [
    animateTo,
    backdropOpacity,
    isMounted,
    restingTranslateY,
    translateY,
    visible,
  ]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 6 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        backdropOpacity.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const dy = Math.max(0, gestureState.dy);
        const nextTranslate = restingTranslateYRef.current + dy;

        translateY.setValue(nextTranslate);
        backdropOpacity.setValue(
          Math.max(0, BACKDROP_OPACITY * (1 - dy / sheetHeightRef.current)),
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose =
          gestureState.dy > sheetHeightRef.current * 0.2 ||
          gestureState.vy > 1.1;

        if (shouldClose) {
          closeWithAnimation();
        } else {
          animateTo(restingTranslateYRef.current, BACKDROP_OPACITY);
        }
      },
      onPanResponderTerminate: () => {
        animateTo(restingTranslateYRef.current, BACKDROP_OPACITY);
      },
    }),
  ).current;

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      visible={isMounted}
      animationType="none"
      transparent
      onRequestClose={onCloseRef.current}
    >
      <TouchableWithoutFeedback onPress={onCloseRef.current}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[
          styles.sheet,
          {
            height: sheetHeight,
            transform: [{ translateY }],
          },
        ]}
      >
        {handleMode !== "hidden" ? (
          <View
            {...panResponder.panHandlers}
            style={[
              styles.handleArea,
              handleMode === "overlay" && styles.handleAreaOverlay,
              {
                backgroundColor:
                  handleMode === "overlay"
                    ? "transparent"
                    : handleBackgroundColor,
              },
            ]}
          >
            <View style={[styles.handle, { backgroundColor: handleColor }]} />
          </View>
        ) : null}

        {scrollEnabled ? (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.sheetContent,
              { paddingBottom: 24 + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={styles.staticContent}>{children}</View>
        )}
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  handleArea: {
    height: HANDLE_AREA_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  handleAreaOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(16,24,40,0.18)",
  },
  scrollView: {
    flex: 1,
  },
  sheetContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  staticContent: {
    flex: 1,
    minHeight: 0,
  },
});
