import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type UseFeatureModalStateOptions = {
  visible: boolean;
  isOverlayVisible: boolean;
  clearActive: () => void;
};

export function useFeatureModalState({
  visible,
  isOverlayVisible,
  clearActive,
}: UseFeatureModalStateOptions) {
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(18)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayTranslate = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!visible) {
      contentOpacity.stopAnimation();
      contentTranslate.stopAnimation();
      overlayOpacity.stopAnimation();
      overlayTranslate.stopAnimation();

      contentOpacity.setValue(0);
      contentTranslate.setValue(18);
      overlayOpacity.setValue(0);
      overlayTranslate.setValue(30);

      if (isOverlayVisible) {
        clearActive();
      }

      return;
    }

    contentOpacity.setValue(0);
    contentTranslate.setValue(18);

    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 440,
        delay: 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 440,
        delay: 70,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    clearActive,
    contentOpacity,
    contentTranslate,
    isOverlayVisible,
    overlayOpacity,
    overlayTranslate,
    visible,
  ]);

  useEffect(() => {
    if (!isOverlayVisible) return;

    overlayOpacity.setValue(0);
    overlayTranslate.setValue(30);

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayTranslate, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOverlayVisible, overlayOpacity, overlayTranslate]);

  const closeOverlay = useCallback(() => {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayTranslate, {
        toValue: 20,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      clearActive();
    });
  }, [clearActive, overlayOpacity, overlayTranslate]);

  return {
    contentAnimatedStyle: {
      opacity: contentOpacity,
      transform: [{ translateY: contentTranslate }],
    },
    overlayOpacity,
    overlayTranslate,
    closeOverlay,
  };
}
