import React, { useEffect, useMemo, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  ImageBackground,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Theme } from "@/constants/theme";
import { useFeatureModalState } from "@/hooks/useFeatureModalState";

import { fs, lh } from "@/constants/typography";
import BottomSheet from "../cards/BottomSheet";
import AnimatedBack, { MenuButton } from "./animated-back";
import CloseGlassButton from "./close-glass-button";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export type FeatureModalItem<TKey extends string> = {
  key: TKey;
  label: string;
  title: string;
  subtitle: string;
  premium?: boolean;
};

type FeatureModalSheetProps<TKey extends string> = {
  visible: boolean;
  onClose: () => void;
  theme: Theme;
  title: string;
  subtitle?: string;
  blue: string;
  minHeight?: number;
  items: readonly FeatureModalItem<TKey>[];
  activeKey: TKey | null;
  setActiveKey: React.Dispatch<React.SetStateAction<TKey | null>>;
  clearActive: () => void;
  renderContent: (key: TKey) => React.ReactNode;
  hasPremium: boolean;
  isCheckingPremium: boolean;
  onRequirePremium: () => void;
  isRTL: boolean;
  textAlign: TextStyle["textAlign"];
  checkLabel?: string;
  unlockLabel?: string;
  premiumLabel?: string;
  continueLabel?: string;
};

export default function FeatureModalSheet<TKey extends string>({
  visible,
  onClose,
  theme,
  title,
  subtitle,
  blue,
  minHeight = 196,
  items,
  activeKey,
  setActiveKey,
  clearActive,
  renderContent,
  hasPremium,
  isCheckingPremium,
  onRequirePremium,
  isRTL,
  textAlign,
  checkLabel = "Checking",
  unlockLabel = "Unlock",
  premiumLabel = "Premium",
  continueLabel = "Tap to continue",
}: FeatureModalSheetProps<TKey>) {
  const insets = useSafeAreaInsets();
  const activeMeta = useMemo(
    () => items.find((item) => item.key === activeKey) ?? null,
    [activeKey, items],
  );

  const {
    contentAnimatedStyle,
    overlayOpacity,
    overlayTranslate,
    closeOverlay,
  } = useFeatureModalState({
    visible,
    isOverlayVisible: Boolean(activeKey),
    clearActive,
  });
  const overlayDrag = useRef(new Animated.Value(0)).current;
  const closeOverlayRef = useRef(closeOverlay);

  useEffect(() => {
    closeOverlayRef.current = closeOverlay;
  }, [closeOverlay]);

  useEffect(() => {
    if (!activeKey) {
      overlayDrag.setValue(0);
    }
  }, [activeKey, overlayDrag]);

  const overlayPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 6 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderGrant: () => {
        overlayDrag.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        overlayDrag.setValue(Math.max(0, gestureState.dy));
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose =
          gestureState.dy > SCREEN_HEIGHT * 0.12 || gestureState.vy > 1;

        if (shouldClose) {
          Animated.timing(overlayDrag, {
            toValue: SCREEN_HEIGHT * 0.42,
            duration: 180,
            useNativeDriver: true,
          }).start(({ finished }) => {
            if (finished) {
              closeOverlayRef.current();
            }
          });
          return;
        }

        Animated.spring(overlayDrag, {
          toValue: 0,
          friction: 8,
          tension: 90,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderTerminate: () => {
        Animated.spring(overlayDrag, {
          toValue: 0,
          friction: 8,
          tension: 90,
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoint={SCREEN_HEIGHT}
      scrollEnabled={false}
      handleMode="hidden"
    >
      <View
        style={[styles.modalRoot, { backgroundColor: theme.ModalBackground }]}
      >
        <AnimatedBack
          visible={visible}
          title={title}
          subtitle={subtitle}
          blue={blue}
          onRenderTop={<CloseGlassButton closeSheet={onClose} />}
          minHeight={minHeight}
        />

        <Animated.View style={[styles.contentWrap, contentAnimatedStyle]}>
          <ImageBackground
            source={require("../../assets/images/bg/bg-card.jpeg")}
            fadeDuration={0}
            resizeMode="cover"
            style={styles.contentBackground}
            imageStyle={styles.contentBackgroundImage}
          >
            <View style={styles.contentOverlay} />

            <ScrollView
              style={styles.mainScrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: Math.max(insets.bottom + 28, 36) },
              ]}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              <View style={styles.menuList}>
                {items.map((item, index) => {
                  const locked = Boolean(item.premium && !hasPremium);

                  return (
                    <View key={item.key} style={styles.menuItemWrap}>
                      <MenuButton
                        index={index + 1}
                        title={item.label}
                        subtitle={item.subtitle}
                        isRTL={isRTL}
                        onPress={() => {
                          if (locked) {
                            onRequirePremium();
                            return;
                          }

                          setActiveKey(item.key);
                        }}
                      />

                      {locked ? (
                        <Pressable
                          onPress={onRequirePremium}
                          style={styles.lockOverlay}
                        >
                          <View style={styles.blurLayer} />

                          <View style={styles.lockBadge}>
                            {isCheckingPremium ? (
                              <>
                                <ActivityIndicator size="small" color={blue} />
                                <Text style={styles.lockTitle}>
                                  {checkLabel}...
                                </Text>
                              </>
                            ) : (
                              <>
                                <Text style={styles.lockTitle}>
                                  {unlockLabel}{" "}
                                  <Text
                                    style={[
                                      styles.lockPremium,
                                      { color: blue },
                                    ]}
                                  >
                                    {premiumLabel}
                                  </Text>
                                </Text>
                                <Text style={styles.lockSubtitle}>
                                  {continueLabel}
                                </Text>
                              </>
                            )}
                          </View>
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </ImageBackground>
        </Animated.View>

        {activeKey && activeMeta ? (
          <View style={styles.overlayRoot} pointerEvents="box-none">
            <Pressable style={styles.overlayBackdrop} onPress={closeOverlay}>
              <Animated.View style={{ opacity: overlayOpacity, flex: 1 }} />
            </Pressable>

            <Animated.View
              style={[
                styles.overlayCardWrap,
                {
                  paddingBottom: Math.max(insets.bottom, 12),
                  opacity: overlayOpacity,
                  transform: [
                    { translateY: Animated.add(overlayTranslate, overlayDrag) },
                  ],
                },
              ]}
            >
              <View style={styles.overlayCard}>
                <View
                  style={styles.overlayDragArea}
                  {...overlayPanResponder.panHandlers}
                >
                  <View style={styles.overlayGripArea}>
                    <View style={styles.overlayGrip} />
                  </View>

                  <View style={styles.overlayHeader}>
                    <View style={styles.overlayHeaderContent}>
                      <Text style={[styles.overlayTitle, { textAlign }]}>
                        {activeMeta.title}
                      </Text>
                      <Text style={[styles.overlaySubtitle, { textAlign }]}>
                        {activeMeta.subtitle}
                      </Text>
                    </View>

                    <Pressable
                      onPress={closeOverlay}
                      style={styles.overlayCloseButton}
                    >
                      <Text style={[styles.overlayCloseText, { color: blue }]}>
                        ✕
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <ScrollView
                  style={styles.overlayScrollView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.overlayScrollContent,
                    { paddingBottom: Math.max(insets.bottom + 24, 28) },
                  ]}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  <View style={styles.mainCard}>
                    {renderContent(activeKey)}
                  </View>
                </ScrollView>
              </View>
            </Animated.View>
          </View>
        ) : null}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  contentWrap: {
    flex: 1,
    backgroundColor: "#F7FAFE",
    marginTop: -36,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 0,
    overflow: "hidden",
  },
  contentBackground: {
    flex: 1,
  },
  contentBackgroundImage: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  contentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.50)",
  },
  mainScrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    position: "relative",
    zIndex: 2,
  },
  menuList: {
    gap: 12,
  },
  menuItemWrap: {
    position: "relative",
    borderRadius: 22,
    overflow: "hidden",
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  blurLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.88)",
  },
  lockBadge: {
    minWidth: 170,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14,
    elevation: 4,
  },
  lockTitle: {
    color: "#16324d",
    fontSize: fs(15),
    fontWeight: "800",
    marginTop: 6,
    marginBottom: 3,
  },
  lockPremium: {
    fontSize: fs(15),
    fontWeight: "800",
  },
  lockSubtitle: {
    color: "#6f8498",
    fontSize: fs(12),
    fontWeight: "600",
  },
  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 8,
    justifyContent: "flex-end",
  },
  overlayBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7,22,39,0.28)",
  },
  overlayCardWrap: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
  overlayCard: {
    height: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(41,130,218,0.08)",
    shadowColor: "#0e3a66",
    shadowOpacity: 0.14,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  overlayDragArea: {
    zIndex: 2,
  },
  overlayGripArea: {
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayGrip: {
    width: 42,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(22,50,77,0.16)",
  },
  overlayHeader: {
    paddingHorizontal: 18,
    paddingTop: 4,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(41,130,218,0.08)",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  overlayHeaderContent: {
    flex: 1,
  },
  overlayTitle: {
    color: "#16324d",
    fontSize: fs(20),
    fontWeight: "800",
    marginBottom: 6,
  },
  overlaySubtitle: {
    color: "#6f8498",
    fontSize: fs(13),
    lineHeight: lh(19),
    fontWeight: "500",
    paddingRight: 10,
  },
  overlayCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    backgroundColor: "rgba(41,130,218,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  overlayCloseText: {
    fontSize: fs(16),
    fontWeight: "800",
  },
  overlayScrollView: {
    flex: 1,
  },
  overlayScrollContent: {
    flexGrow: 1,
    padding: 14,
  },
  mainCard: {
    backgroundColor: "#FBFDFF",
    borderRadius: 18,
    padding: 14,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(41,130,218,0.08)",
  },
});
