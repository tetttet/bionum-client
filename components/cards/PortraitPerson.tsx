import { Article } from "@/constants/data";
import { User } from "@/interface/User";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const PortraitPerson = ({
  user,
  theme,
  styles,
  setSheetVisible,
  setSelected,
  sampleArticles,
}: {
  user: User;
  theme: any;
  styles: any;
  setSelected: (article: Article) => void;
  setSheetVisible: (visible: boolean) => void;
  sampleArticles: any[];
}) => {
  function openArticle(a: Article) {
    console.log("Opening article from PortraitPerson:", a);
    setSelected(a);
    setSheetVisible(true);
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.summaryCardBackground,
        },
      ]}
      onPress={() => openArticle(sampleArticles[0])}
      accessibilityRole="button"
      accessibilityLabel={`${sampleArticles[0].title}. ${sampleArticles[0].subtitle}`}
    >
      <Image
        source={sampleArticles[0].image}
        style={styles.image}
        resizeMode="cover"
      />

      <View
        style={[
          styles.textWrap,
          { backgroundColor: theme.summaryCardBackground },
        ]}
      >
        <Text numberOfLines={2} style={[styles.title, { color: theme.title }]}>
          {sampleArticles[0].title}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.subtitle, { color: theme.subtitle }]}
        >
          {sampleArticles[0].subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PortraitPerson;
