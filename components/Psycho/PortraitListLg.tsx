import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from "react-native";

import { Theme } from "@/constants/theme";
import { fs, lh } from "@/constants/typography";
import {
  getPortraits,
  PortraitItem,
  PortraitLang,
} from "@/data/dummy/portrait";

// включаем LayoutAnimation на Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PortraitListLg = ({
  theme,
  systemLang,
}: {
  theme: Theme;
  systemLang: PortraitLang;
}) => {
  const [allPortraits, setAllPortraits] = useState<PortraitItem[]>([]);
  const [opened, setOpened] = useState<number | null>(null);

  useEffect(() => {
    setAllPortraits(getPortraits(systemLang));
  }, [systemLang]);

  const t = useMemo(() => {
    switch (systemLang) {
      case "ru":
        return {
          data: "Данные",
          abilities: "Способности",
          weaknesses: "Слабости",
          title: "Портреты по числам",
          subtitle:
            "Нажми на число, чтобы раскрыть подробный психологический портрет.",
          less: "Скрыть",
          more: "Подробнее",
        };
      case "kz":
        return {
          data: "Деректер",
          abilities: "Қабілеттер",
          weaknesses: "Әлсіз жақтары",
          title: "Сандар бойынша портреттер",
          subtitle:
            "Егжей-тегжейлі психологиялық портретті ашу үшін санды таңдаңыз.",
          less: "Жасыру",
          more: "Толығырақ",
        };
      case "tr":
        return {
          data: "Veri",
          abilities: "Yetenekler",
          weaknesses: "Zayıflıklar",
          title: "Sayılara göre portreler",
          subtitle: "Detaylı psikolojik portreyi görmek için bir sayıya dokun.",
          less: "Gizle",
          more: "Daha fazla",
        };
      default:
        return {
          data: "Data",
          abilities: "Abilities",
          weaknesses: "Weaknesses",
          title: "Portraits by numbers",
          subtitle:
            "Tap on a number to reveal a detailed psychological portrait.",
          less: "Less",
          more: "More",
        };
    }
  }, [systemLang]);

  const toggle = (number: number) => {
    LayoutAnimation.easeInEaseOut();
    setOpened((prev) => (prev === number ? null : number));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {/* HEADER */}
      <View style={styles.headerBlock}>
        <Text style={[styles.mainTitle, { color: theme.title }]}>
          {t.title}
        </Text>
        <Text style={[styles.mainSubtitle, { color: theme.subtitle }]}>
          {t.subtitle}
        </Text>
      </View>

      {/* LIST */}
      {allPortraits.map((item) => {
        const isOpen = opened === item.number;

        const preview =
          item.data.length > 90
            ? item.data.slice(0, 90).trim() + "…"
            : item.data;

        return (
          <View
            key={item.number}
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBackground,
                borderColor: theme.summaryCardBackground,
              },
            ]}
          >
            {/* HEADER КАРТОЧКИ */}
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.cardHeader}
              onPress={() => toggle(item.number)}
            >
              <View style={styles.cardHeaderLeft}>
                <View
                  style={[
                    styles.numberCircle,
                    { backgroundColor: theme.summaryCardBackground },
                  ]}
                >
                  <Text style={[styles.numberText, { color: theme.title }]}>
                    {item.number}
                  </Text>
                </View>

                <View style={styles.headerTextColumn}>
                  <Text style={[styles.headerTitle, { color: theme.title }]}>
                    {t.data}
                  </Text>
                  {!isOpen && (
                    <Text
                      numberOfLines={2}
                      style={[styles.headerPreview, { color: theme.subtitle }]}
                    >
                      {preview}
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.chevronBlock}>
                <Text style={[styles.chevronLabel, { color: theme.subtitle }]}>
                  {isOpen ? t.less : t.more}
                </Text>
                <Text style={[styles.chevronIcon, { color: theme.subtitle }]}>
                  {isOpen ? "▲" : "▼"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* FULL CONTENT */}
            {isOpen && (
              <View style={styles.content}>
                {/* Data */}
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionDot} />
                    <Text style={[styles.sectionTitle, { color: theme.title }]}>
                      {t.data}
                    </Text>
                  </View>
                  <Text style={[styles.sectionText, { color: theme.subtitle }]}>
                    {item.data}
                  </Text>
                </View>

                {/* Abilities */}
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionDot} />
                    <Text style={[styles.sectionTitle, { color: theme.title }]}>
                      {t.abilities}
                    </Text>
                  </View>
                  <Text style={[styles.sectionText, { color: theme.subtitle }]}>
                    {item.abilities}
                  </Text>
                </View>

                {/* Weaknesses */}
                <View style={styles.sectionBlock}>
                  <View style={styles.sectionHeaderRow}>
                    <View style={styles.sectionDot} />
                    <Text style={[styles.sectionTitle, { color: theme.title }]}>
                      {t.weaknesses}
                    </Text>
                  </View>
                  <Text style={[styles.sectionText, { color: theme.subtitle }]}>
                    {item.weaknesses}
                  </Text>
                </View>
              </View>
            )}
          </View>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default PortraitListLg;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },

  headerBlock: {
    marginBottom: 12,
  },

  mainTitle: {
    fontSize: fs(24),
    fontWeight: "800",
    marginBottom: 6,
  },

  mainSubtitle: {
    fontSize: fs(13),
    opacity: 0.8,
  },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 14,
    overflow: "hidden",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
    }),
  },

  cardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  numberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  numberText: {
    fontSize: fs(18),
    fontWeight: "800",
  },

  headerTextColumn: {
    flex: 1,
  },

  headerTitle: {
    fontSize: fs(14),
    fontWeight: "700",
    marginBottom: 2,
  },

  headerPreview: {
    fontSize: fs(12),
    opacity: 0.85,
  },

  chevronBlock: {
    marginLeft: 10,
    alignItems: "flex-end",
  },

  chevronLabel: {
    fontSize: fs(11),
    marginBottom: 2,
  },

  chevronIcon: {
    fontSize: fs(16),
    fontWeight: "600",
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ffffff20",
  },

  sectionBlock: {
    marginTop: 10,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },

  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    opacity: 0.5,
    backgroundColor: "#ffffff20",
  },

  sectionTitle: {
    fontSize: fs(13),
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },

  sectionText: {
    fontSize: fs(13),
    lineHeight: lh(19),
  },
});
