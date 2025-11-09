import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

// ---------- ArticleCard + Screen ----------
import { Article, sampleArticles } from "@/constants/data";
import { Theme } from "@/constants/theme";
import BottomSheet from "../cards/BottomSheet";
import { TopHeaderWithOutDel } from "../cards/SectionCard";
import MarkdownRender from "../cards/ui/MarkdownRender";
import CloseGlassButton from "../ui/close-glass-button";
import FastImageDemo from "../ui/fast-image-demo";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20;
const CARD_WIDTH = SCREEN_W - HORIZONTAL_PADDING * 2;
const CARD_ASPECT = 16 / 9;
const IMAGE_HEIGHT = CARD_WIDTH / CARD_ASPECT;

export default function SummaryScreen({ theme }: { theme: Theme }) {
  const colorScheme = useColorScheme();
  const [selected, setSelected] = useState<Article | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  function openArticle(a: Article) {
    setSelected(a);
    setSheetVisible(true);
  }

  function closeSheet() {
    setSheetVisible(false);
    setTimeout(() => setSelected(null), 300);
  }

  return (
    <View style={[{ backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        style={{ marginTop: -40 }}
      >
        <TopHeaderWithOutDel theme={theme} sectionLabel={"ПОЛЕЗНЫЕ СТАТЬИ"} />

        <View style={[styles.list, { marginTop: 1 }]}>
          {sampleArticles.map((a) => (
            <TouchableOpacity
              key={a.id}
              activeOpacity={0.85}
              style={[
                styles.card,
                {
                  backgroundColor: theme.cardBackground,
                  borderColor: theme.summaryCardBackground,
                },
              ]}
              onPress={() => openArticle(a)}
              accessibilityRole="button"
              accessibilityLabel={`${a.title}. ${a.subtitle}`}
            >
              <Image source={a.image} style={styles.image} resizeMode="cover" />

              <View
                style={[
                  styles.textWrap,
                  { backgroundColor: theme.summaryCardBackground },
                ]}
              >
                <Text
                  numberOfLines={2}
                  style={[styles.title, { color: theme.title }]}
                >
                  {a.title}
                </Text>
                <Text
                  numberOfLines={2}
                  style={[styles.subtitle, { color: theme.subtitle }]}
                >
                  {a.subtitle}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Bottom sheet */}
      <BottomSheet
        visible={sheetVisible}
        onClose={closeSheet}
        snapPoint={SCREEN_H * 0.95}
      >
        {selected ? (
          <View
            style={[
              styles.modalRoot,
              { backgroundColor: theme.ModalBackground },
            ]}
          >
            <View>
              <View
                style={{
                  paddingTop: 20,
                  paddingHorizontal: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.modalTitle, { color: theme.title }]}>
                  {selected.title}
                </Text>
              </View>
              <CloseGlassButton closeSheet={closeSheet} />
            </View>

            <FastImageDemo source={selected.image} />

            {/* Content */}
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitleBigger, { color: theme.title }]}>
                {selected.title}
              </Text>
              <Text style={[styles.modalSubtitle, { color: theme.subtitle }]}>
                {selected.subtitle}
              </Text>

              <MarkdownRender
                markdown={selected.markdown || ""}
                textColor={theme.text}
              />

              <View style={{ height: 32 }} />
            </View>
          </View>
        ) : null}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 14,
    paddingHorizontal: HORIZONTAL_PADDING,
  },
  sectionTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  list: { gap: 16 as any },
  card: {
    width: CARD_WIDTH,
    alignSelf: "center",
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 4 },
    }),
  },
  image: { width: "100%", height: IMAGE_HEIGHT },
  textWrap: { paddingHorizontal: 16, paddingVertical: 14 },
  title: { fontSize: 20, fontWeight: "800", marginBottom: 6 },
  subtitle: { fontSize: 14, lineHeight: 18 },

  modalRoot: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
  },

  modalContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 6 },
  modalTitleBigger: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 6,
    width: "80%",
  },
  modalSubtitle: { fontSize: 15, lineHeight: 20, marginBottom: 6 },
});
